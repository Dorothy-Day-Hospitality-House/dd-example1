
class DDayHouseApp {

    constructor() {
        this.api = new DirectusAPI();
        this.cache = {};
    }

    // This gets all the rows of a table, with optional filter parameters.
    // If filter is empty, this will keep a cache of the data
    async getTable(table, params=null) {
        let key = table + (params ? JSON.stringify(params) : '');
        if (key in this.cache) {
            return this.cache[key];                  // Get the data from the cache
        }
        console.log('get table ', key);
        let res = await this.api.get('/items/' + table, params);
        let result = await res.json();
        if (!'data' in result) {            // ERROR, the api failed
            console.error(result);
            throw Error(result.errors[0].message);
        }
        console.log('rows found = '+result.data.length);
        this.cache[key] = result.data;    // Save results to the cache
        return result.data;
    }

    // Returns HTML for a single tile on the bed board
    renderBed(bed, guest) {
        if (guest) {
            return `
                <div class="stay">
                <img src="${this.api.base}/assets/${guest.photo}">
                <div class="bedname">${bed.short_name}</div>
                ${guest.firstname}
                <br>${guest.lastname}
                <br>${shorten(guest.notes, 110)}
                </div> `;
        }
        // Empty bed
        return `
            <div class="stay">
            <img src="emptybed.png">
            <div class="bedname">${bed.short_name}</div>
            EMPTY
            </div> `;
    }
    // Returns HTML for the bed board
    renderBedBoard(stays, beds, guests) {
        let result = '<div class="stays">';
        beds.sort((a,b) => a.short_name < b.short_name ? -1 : 1)

        for (let bed of beds) {
            let stay = stays.find(s => s.bed_id == bed.bed_id);
            let guest = stay && guests.find(g => g.guest_id == stay.guest_id);
            result += this.renderBed(bed, guest);
        }
        // for (let stay of stays) {
        //     stay.bed = beds.find(b => b.bed_id == stay.bed_id);
        //     stay.guest = guests.find(g => g.guest_id == stay.guest_id);
        // }
        // stays.sort((a,b) => a.bed.short_name < b.bed.short_name ? -1 : 1)
        // for (let stay of stays) {
        //     result += renderStay(stay);
        // }
        return result + '</div>';
    }   
        
        

    async onBedBoard() {
        console.log('begin onBedBoard');
        let beds = await this.getTable('beds');
        let stays = await this.getTable('current_bed_to_guest');
        let guests = await this.getTable('guest_data', { limit: 10000 });

        let content = getElem('content');
        content.innerHTML = this.renderBedBoard(stays, beds, guests);
    }



    async onGuests() {
        let content = getElem('content');
        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        let guests = await this.getTable('guest_data', { limit: 10000 });        
        const gridOptions = {
            rowData: guests,
            columnDefs: [
                {field:"guest_id"},
                {field:"lastname"},
                {field:"firstname"},
                {field:"photo"},
                {field:"identification"},
                {field:"date_of_birth"},
                {field:"notes"},
                {field:"state"},
                {field:"veteran"},
                {field:"return_date"},
                {field:"contact_phone_no"},
                {field:"gender"},
                {field:"contact_name"},
                {field:"banned_detail"},
                {field:"banned_until"},
                {field:"banned"},
            ]
        };        
        const grid = document.getElementById('guest-grid');
        agGrid.createGrid(grid, gridOptions);
           
    }
    
    async onBeds() {
        console.log('begin onBeds');
    }
    
    async onVolunteers() {
        console.log('begin onVolunteers');

        //----------------------------------
        // Some sample code to make a grid...

        let content = getElem('content');
        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;

        // Grid Options: Contains all of the data grid configurations
        const gridOptions = {
            // Row Data: The data to be displayed.
            rowData: [
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
            ],
            // Column Definitions: Defines the columns to be displayed.
            columnDefs: [
            { field: "make" },
            { field: "model" },
            { field: "price" },
            { field: "electric" }
            ]
        };
        
        // Your Javascript code to create the data grid
        const grid = document.getElementById('guest-grid');
        agGrid.createGrid(grid, gridOptions);
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
        if (email.indexOf('@') < 0) email += '@fingerson.com';
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


    }

    
}




function onPageLoad() {

    window.app = new DDayHouseApp();

}

