
// let api = '//db.fingerson.com';
// let config = { withCredentials: true, headers: { Authorization: 'Bearer ???'}};
// let cred = { email: 'api2@fingerson.com', password: '????'};

let api = new API();
 
// async function onButton() {
//     let tbody = getElem("mydiv");
//     tbody.innerHTML = 'testing';
    
//     res = await axios.get(api + '/items/shifts', config);
    
//     let rows = res.data.data;
//     let col_names = Object.keys(rows[0]);
//     tbody.innerHTML = render_table('students',rows,col_names);    
// }


async function onBedBoard() {
    console.log('begin onBedBoard');
    let res = await api.get('/items/current_bed_to_guest');
    let stays = await res.json();
    let guestIDs = stays.map(b => b.guest_id);
    res = await api.get('/items/beds');
    let beds = await res.json();
    res = await api.search('/items/guest_data', simpleQuery('guest_id','_in',guestIDs));
    let guests = await res.json();

    let content = getElem('content');
    content.innerHTML = renderBedBoard(stays, beds, guests);
}

function onGuests() {
    console.log('begin onGuests');
}

function onBeds() {
    console.log('begin onBeds');
}

function onVolunteers() {
    console.log('begin onVolunteers');
}

function onDailyNotes() {
    console.log('begin onDailyNotes');
}


function showMessage(msg) {
    getElem('content').innerHTML = `
        <div class="large-message">
        ${msg}
        </div>`;
}


function onLogInOut(init=false) {
    console.log('begin onLogInOut');
    let auth = sessionStorage.getItem('ddh-auth');
    if (auth && !init) {
        sessionStorage.setItem('ddh-auth','');
        api.logout();
        showMessage('You are not logged in.');
        return;
    }
    showMessage('Login...');
    let cred = { email: 'api2@fingerson.com', password: auth};
    if (!auth)  {
        if (!init)
            auth = prompt('Password for ' + cred.email);
        if (!auth) {
            showMessage('You are not logged in.');
            return;
        }
    }
    api.login(cred).then(ok => {
        showMessage('Login successful, '+ok);
        sessionStorage.setItem('ddh-auth',cred.password);
    }, err => {
        showMessage('Login failed, '+err);
    });

}



function onPageLoad() {

    onLogInOut(true);
    // TODO -- save this in the localStorage for convenience?
    //cred.password = prompt('Password for ' + cred.email);

    // axios.post(api+'/auth/login', cred).then(res => {
    //     console.log (res.data.data);
    //     config.headers.Authorization = 'Bearer ' + res.data.data.access_token;
    // });
}

