
class DDayHouseApp {

    constructor() {
        this.api = new DirectusAPI();
        this.cache = {};
    }

    // This gets all the rows of a table, with optional filter parameters.
    // If filter is empty, this will keep a cache of the data
    async getTable(table, params=null) {
        if (params == null && table in this.cache) {
            return this.cache[table];                  // Get the data from the cache
        }
        console.log('get table ', table);
        let res = await this.api.get('/items/' + table, params);
        let result = await res.json();
        if (!'data' in result) {            // ERROR, the api failed
            console.error(result);
            throw Error(result.errors[0].message);
        }
        if (params == null) 
            this.cache[table] = result.data;    // Save results to the cache
        return result.data;
    }

    // Returns HTML for a single tile on the bed board
    renderStay(stay) {
        return `
        <div class="stay">
        <img src="${this.api.base}/assets/${stay.guest.photo}">
        <span class="bedname">${stay.bed.short_name}</span>,
        checkin = ${stay.checkin_date},
        name = ${stay.guest.firstname} ${stay.guest.lastname},
        return = ${stay.guest.return_date}
        </div>
        `
    }
    
    // Returns HTML for the bed board
    renderBedBoard(stays, beds, guests) {
        let result = '<div class="stays">'
        for (let stay of stays) {
            stay.bed = beds.find(b => b.bed_id == stay.bed_id);
            stay.guest = guests.find(g => g.guest_id == stay.guest_id);
        }
        stays.sort((a,b) => a.bed.short_name < b.bed.short_name ? -1 : 1)
        for (let stay of stays) {
            result += renderStay(stay);
        }
        return result + '</div>';
    }   
        
        

    async onBedBoard() {
        console.log('begin onBedBoard');
        let beds = await this.getTable('beds');
        let stays = await this.getTable('current_bed_to_guest');
        //res = await api.search('/items/guest_data', simpleQuery('guest_id','_in',guestIDs));
        //res = await api.get('/items/guest_data', {[`filter[guest_id][_in]`]:guestIDs});
        let guests = await this.getTable('guest_data');

        let content = getElem('content');
        content.innerHTML = this.renderBedBoard(stays, beds, guests);
    }



    async onGuests() {
        console.log('begin onGuests');
    }
    
    async onBeds() {
        console.log('begin onBeds');
    }
    
    async onVolunteers() {
        console.log('begin onVolunteers');
    }
    
    async onDailyNotes() {
        console.log('begin onDailyNotes');
    }


    showMessage(msg) {
        getElem('content').innerHTML = `
            <div class="large-message">
            ${msg}
            </div>`;
    }

    showLogin() {
        getElem('login-ok').disabled = false;
        getElem('password').value = '';
        getElem('login').showModal();
        setTimeout(() => getElem('password').focus(), 100);
    }

    async onLogin(ok) {
        let dialog = getElem('login');
        if (!ok) {
            dialog.close();
            return;
        }
        getElem('login-ok').disabled = true;
        let email = getElem('email').value;
        let password = getElem('password').value;
        this.api.login({ email, password }).then(() => {
            this.showMessage('Login successful.');
        }).catch(err => {
            this.showMessage('Login failed, '+err);
        }).finally(() => {
            dialog.close();
        });
    }



    async onLogInOut(init=false) {
        console.log('begin onLogInOut');
        this.showLogin();

        // let auth = sessionStorage.getItem('ddh-auth');
        // if (auth && !init) {
        //     sessionStorage.setItem('ddh-auth','');
        //     api.logout();
        //     showMessage('You are not logged in.');
        //     return;
        // }
        // showMessage('Login...');
        // let cred = { email: 'api2@fingerson.com', password: auth};
        // if (!auth)  {
        //     if (!init)
        //         auth = prompt('Password for ' + cred.email);
        //     if (!auth) {
        //         showMessage('You are not logged in.');
        //         return;
        //     }
        //     cred.password = auth;
        // }
        // api.login(cred).then(ok => {
        //     showMessage('Login successful, '+ok);
        //     sessionStorage.setItem('ddh-auth',cred.password);
        // }, err => {
        //     showMessage('Login failed, '+err);
        // });

    }

    
}




function onPageLoad() {

    window.app = new DDayHouseApp();

    // onLogInOut(true);
    // TODO -- save this in the localStorage for convenience?
    //cred.password = prompt('Password for ' + cred.email);

    // axios.post(api+'/auth/login', cred).then(res => {
    //     console.log (res.data.data);
    //     config.headers.Authorization = 'Bearer ' + res.data.data.access_token;
    // });
}

