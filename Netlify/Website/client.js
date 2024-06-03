
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

function onBedBoard() {
    console.log('begin onBedBoard');
    let content = getElem('content');
    content.innerHTML = `
    
    <div class="grid" id="beds"><div class="item">
    <img src="//db.fingerson.com/assets/72f720be-5fda-461f-9149-0148eeb76c2a">
    <br> date_created = 2024-05-28, date_of_birth = 1988-07-25    , date_updated = null, name = Nicholas King, gender = Male, id = MI K-520-630-603-584   , return_date = 
    , notes = He was referred here by a social worker at Mayo.  He only remembers his name as Michael.
    </div><div class="item">
    <img src="//db.fingerson.com/assets/19ed2122-a300-4a4a-b4b6-fe7cbb075095">
    <br> date_created = 2024-05-28, date_of_birth = 1995-07-25    , date_updated = null, name = Codie Perry, gender = Female, id = MN no ID   , return_date = 2023-03-28
    , notes = goes by Cece
    </div><div class="item">
    <img src="//db.fingerson.com/assets/f576b133-8fce-41b6-a71e-7d28b3369521">
    <br> date_created = 2024-05-28, date_of_birth = 1997-12-30    , date_updated = null, name = Garcia Johnson, gender = Female, id = MN A6022376 (Passport from Jamaica)   , return_date = 
    , notes = Work 7am-7pm
Sometimes works night shift.
    </div><div class="item">
    <img src="//db.fingerson.com/assets/a70f7448-d74a-4001-8ee9-6ede80dd55f7">
    <br> date_created = 2024-05-28, date_of_birth = 1999-03-16    , date_updated = null, name = Mylethia Staudahar, gender = Female, id = MN Z026-268-222-608   , return_date = 
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/48d5966f-e40e-468a-980b-d52ff042e095">
    <br> date_created = 2024-05-28, date_of_birth = 1966-05-01    , date_updated = null, name = John James, gender = Male, id = MN Q037183818410   , return_date = 2024-05-21
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/2db524ba-4448-47ff-b2ea-4e9863cf07c9">
    <br> date_created = 2024-05-28, date_of_birth = 1960-02-10    , date_updated = null, name = Jeffrey Solberg, gender = Male, id = MN z596-259-114-020   , return_date = 2024-07-21
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/6cc9e718-4b8f-4a29-b7bf-03083cb587fa">
    <br> date_created = 2024-05-28, date_of_birth = 2019-03-05    , date_updated = null, name = Stacy George, gender = Male, id = MN R498-188-862-021   , return_date = 
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/b26368cf-3183-4d5a-9536-313e75a95497">
    <br> date_created = 2024-05-28, date_of_birth = 1965-01-20    , date_updated = null, name = Randy Eastling, gender = Male, id = MN A511-017-528-507   , return_date = 
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/4e2c63f0-f1ae-4cca-9c04-f9d92574fb04">
    <br> date_created = 2024-05-28, date_of_birth = 1994-10-01    , date_updated = null, name = Ray Osborne, gender = Male, id = TX 37831853   , return_date = 2024-05-14
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/cb725708-bcf0-40c3-94f1-e92cc11c5ebe">
    <br> date_created = 2024-05-28, date_of_birth = 1962-10-30    , date_updated = null, name = Derrick Bembry, gender = Male, id = MI 160F124004   , return_date = 
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/0c88e4af-0d64-49a8-9e44-90aee0452507">
    <br> date_created = 2024-05-28, date_of_birth = 1983-11-12    , date_updated = null, name = Joel Garrett, gender = Male, id = MN J620-166-081-608   , return_date = 2023-09-08
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/4e79adb5-a441-408b-b653-e31f5949e46c">
    <br> date_created = 2024-05-28, date_of_birth = 1978-10-20    , date_updated = null, name = Billy Pollay, gender = Male, id = MN F000-146-566-400   , return_date = 
    , notes = 
    </div><div class="item">
    <img src="//db.fingerson.com/assets/68867626-d0db-41aa-a28a-f6b15faadae6">
    <br> date_created = 2024-05-28, date_of_birth = 1964-09-11    , date_updated = null, name = Sue-ann Yocum, gender = Female, id = FL y250-790-64-831-0   , return_date = 
    , notes = 
    </div></div>    
    
    
    `
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

