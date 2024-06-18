class CustomButtonComponent {
    eGui;
    eButton;
    eventListener;
   
    init(params) {
      this.eGui = document.createElement("div");
      let button = document.createElement("button");
      button.className = "btn-simple";
      button.textContent = "Edit";
      this.eventListener = () => alert("clicked");
      button.addEventListener("click", this.eventListener);
      this.eGui.appendChild(button);
    }
   
    getGui() {
      return this.eGui;
    }
   
    refresh(params) {
      return true;
    }
   
    destroy() {
      if (button) {
        button.removeEventListener("click", this.eventListener);
      }
    }
 }
  


class DDayHouseApp {

    constructor() {
        this.api = new DirectusAPI();
        this.cache = {};
        this.messageBar = new MessageBar(getElem('message-bar'));
        this.api.autoLogin().then(user => this.afterLogin(user));
    }

    // This gets all the rows of a table, with optional filter parameters.
    // If filter is empty, this will keep a cache of the data
    async getTable(table, params=null) {
        let key = table + (params ? JSON.stringify(params) : '');
        if (key in this.cache) {
            this.messageBar.clear();
            return this.cache[key];                  // Get the data from the cache
        }
        console.log('get table ', key);
        this.messageBar.show('Loading ' + table + ' ...');
        let res = await this.api.get('/items/' + table, params);
        let result = await res.json();
        if (!('data' in result)) {            // ERROR, the api failed
            console.error(result);
            this.messageBar.error(result.errors[0].message);
            throw Error(result.errors[0].message);
        }
        this.messageBar.clear();
        console.log('rows found = '+result.data.length);
        this.cache[key] = result.data;    // Save results to the cache
        return result.data;
    }

    // renders HTML for a single volunteer log
    renderVollog(vol, shifts) {
        console.log('begin renderVollog');
        if (vol) {
            return `
                <div class="vollog_table">
                <table onclick="vollogTable()">
                <tr>
                <td><span class="note">Volunteers:</span>  ${vol.volunteer_names}</td>
                <td><span class="note">Date:</span>  ${vol.date_of_shift}</td>
                <td><span class="note">Shift:</span>  ${vol.shift_desc}</td>
                </tr>
                <tr>
                <td colspan="3"><span class="note">Note:</span>  ${vol.note}</td>
                </tr>
                <tr>
                <td colspan="3"><span class="note">Important Info:</span>  ${vol.important_info}</td>
                </tr>
                <tr>
                <td colspan="3"><span class="note">Men Turned Away:</span>  ${vol.men_turned_away}</td>
                </tr>
                <tr>
                <td colspan="3"><span class="note">Women Turned Away:</span>  ${vol.women_turned_away}</td>
                </tr>
                </table>
                </div> `;
        }
    }

    // Returns HTML for the volunteer log
    renderVollogpage(vol, shifts) {
        console.log('begin renderVollogpage');
        let result = '<div class="vollog_outside">';
                
        // Apply array.sort with comparison function
        vol.sort(function (a, b) {
            let af = a.date_of_shift;
            let bf = b.date_of_shift;
            let as = a.shift_sort;
            let bs = b.shift_sort;
 
            // If first value is same
            if (af == bf) {
                return (as > bs) ? -1 : (as < bs) ? 1 : 0;
            } else {
                return (af > bf) ? -1 : 1;
            }
        });

        console.log('begin assigning values in vol');
        for (let vo of vol) {
            //console.log('current_guest guest_id: ',cg.guest_id);
            let sh = shifts.find(s => s.shift_id == vo.shift_id);
            
            vo.shift_desc = sh.shift_description;
            vo.shift_sort = sh.shift_sort;
            result += this.renderVollog(vo, shifts);
            
        }

        return result + '</div>';
    }   

    async onVollog() {
        console.log('begin onVollog');
        let vol = await this.getTable('volunteer_log', { limit: 10000 });  
        let shifts = await this.getTable('shifts');

        // clear the bottom bar
        let btmcontentcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';

        let content = getElem('content');
        content.innerHTML = this.renderVollogpage(vol, shifts);
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

        // clear the bottom bar
        let btmcontentcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';
    }


    // Returns HTML for guest add form
    renderGuestAdd() {
        console.log('begin renderGuestAdd');
        let result = '<div class="content">';


        return `
        <div class="formdiv">
        <form name=guestaddform" action="/test.php" onsubmit="return validateGuestAddForm()" method="post" id="guestaddform" >
          <label for="guest_lastname">Last Name:</label>
          <input type="text" id="guest_lastname" name="guest_lastname" placeholder="(required) Last name..">
        
          <label for="guest_firstname">First Name:</label>
          <input type="text" id="guest_firstname" name="guest_firstname" placeholder="(required) First name..">
        
          <label for="guest_prefname">Preferred Name:</label>
          <input type="text" id="guest_prefname" name="guest_prefname" placeholder="Preferred name..">
        
          <label for="guest_image">Image:</label>
          <input type="text" id="guest_image" name="guest_image" placeholder="(required) Upload image here..">
        
          <label for="guest_note">Note:</label>
          <input type="text" id="guest_note" name="guest_note" placeholder="Any additional notes..">
        
          <label for="guest_gender">Gender:</label>
          <select id="guest_gender" name="guest_gender" placeholder="Select gender from list..">
            <option value="nonbinary">Non Binary</option>  
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select> 
        
          <label for="guest_id">Identification:</label>
          <input type="text" id="guest_id" name="guest_id" placeholder="Drivers License or ID.. (blank if doesn't have one)">
        
          <label for="guest_dob">Date of Birth:</label>
          <input type="text" id="guest_dob" name="guest_dob" placeholder="(required) Date of Birth YYYY-MM-DD ..">
        
          <label for="guest_state">State:</label>
          <input type="text" id="guest_state" name="guest_state" placeholder="State of ID..">
        
          <label for="guest_contact">Contact:</label>
          <input type="text" id="guest_contact" name="guest_contact" placeholder="Contact for emergency..">
        
          <label for="guest_contact_phone">Contact Phone:</label>
          <input type="text" id="guest_contact_phone" name="guest_contact_phone" placeholder="Contact phone number XXX-XXX-XXXX ..">
        
          <input type="submit" value="Submit">
        </form>
        </div>
        `;



        return result + '</div>';
    }   

    async onGuestNew() {
        console.log('starting onGuestNew');

        // middle content - call function to render
        let content = getElem('content');
        content.innerHTML = this.renderGuestAdd();

        // clear the bottom bar
        let btmcontentcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';


    }


    async onGuests() {
        let content = getElem('content');
        content.innerHTML = '';

        let btmcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';
        btmcontent.innerHTML = '<img src ="plus.jpg" alt="Plus" width="40" height="40" onclick="app.onGuestNew()"></img>';
       
        let guests = await this.getTable('guest_data', { limit: 10000 });    
        
        // sort by last name
        guests.sort((a,b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0))

        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        
        const gridOptions = {
            autoSizeStrategy: {
                type: 'fitGridWidth',
                columnLimits: [
                    {
                        colId: 'lastname',
                        minWidth: 200
                    },
                    {
                        colId: 'firstname',
                        minWidth: 200
                    },
                    {
                        colId: 'preferred_name',
                        minWidth: 200
                    },
                    {
                        colId: 'photo',
                        minWidth: 30
                    },
                    {
                        colId: 'identification',
                        minWidth: 200
                    }
                ]
            },
            rowData: guests,
            pagination: true,
            columnDefs: [
              //  {field:"guest_id"},
                // {field: "button", cellRenderer: CustomButtonComponent },
                { headerName:  'Last Name', field: 'lastname', filter: true },
                { headerName:  'First Name', field: 'firstname', filter:true },
                { headerName:  'Preferred Name', field: 'preferred_name', filter:false, sortable:false },
                {
                    headerName:"Thumbnail",
                    field:"photo", sortable: false,
                    cellRenderer: params => {
                        return `<img src="${this.api.base}/assets/${params.value}?key=system-small-cover">`
                    }
                },
                { headerName:  'Banned', field: 'banned', filter: true },
                { headerName:  'Return Date', field: 'return_date', sortable:false },
                { headerName:  'Identification', field: 'identification', filter:true },
                { headerName:  'Date of Birth', field: 'date_of_birth', filter:true, sortable:false },
                { headerName:  'Notes', field: 'notes', filter:true, sortable:false },
                { headerName:  'State', field: 'state', sortable:false },
                //  {field:"veteran"},
                { headerName:  'Contact Phone', field: 'contact_phone_no', sortable:false },
                { headerName:  'Gender', field: 'gender', sortable:false },
                { headerName:  'Contact', field: 'contact_name', sortable:false },
                { headerName:  'Banned Detail', field: 'banned_detail' },
                { headerName:  'Banned Until', field: 'banned_until' },
            ],
            rowSelection: "single",
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
           
    }
    
    async onBeds() {
        console.log('begin onBeds');

        // clear the bottom bar
        let btmcontentcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';

        // get todays date ini YYYY-MM-DD
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        // const formattedToday1 = yyyy + '-' + mm + '-' + dd;
        const formattedToday2 = mm + '/' + dd + '/' + yyyy;
        // console.log('Today date:  ',formattedToday1)
        console.log('Today date:  ',formattedToday2)
        // end of date

        let content = getElem('content');
        content.innerHTML = '';
        let current_guest = await this.getTable('current_bed_to_guest');  
        let guests = await this.getTable('guest_data', { limit: 10000 }); 
        let beds = await this.getTable('beds');
        
        for (let cg of current_guest) {
            //console.log('current_guest guest_id: ',cg.guest_id);
            let guest = guests.find(g => g.guest_id == cg.guest_id);
            let bed = beds.find(b => b.bed_id == cg.bed_id);
            //console.log('guest lastname = ',guest.lastname);
            //console.log('guest firstname = ',guest.firstname);
            //console.log('guest matched to guest_id')
            cg.lastname = guest.lastname;
            cg.firstname = guest.firstname;
            cg.bed_name = bed.bed_name;
            cg.bed_short_name = bed.short_name;

            let checkin = cg.checkin_date;
            console.log('Checkin Date',checkin);
            let checkin_form = new Date(checkin);
            console.log('Checkin Date Form: ',checkin_form);

            // calculate date difference
            let date2 = new Date(formattedToday2);
            let date1 = new Date(checkin);
            //calculate time difference  
            var time_difference = date2.getTime() - date1.getTime();  
            //calculate days difference by dividing total milliseconds in a day  
            var days_difference = time_difference / (1000 * 60 * 60 * 24);  

            cg.days_left = 21 - parseInt(days_difference);
        }

        // sort by bed name
        current_guest.sort((a,b) => (a.bed_name > b.bed_name) ? 1 : ((b.bed_name > a.bed_name) ? -1 : 0))

        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;

        // for (let cg of current_guest) {
        //     let guest = current_guest && guests.find(gid => gid.guest_id == cg.guest_id)
        // }

        const gridOptions = {
            autoSizeStrategy: {
                type: 'fitGridWidth',
            },
            rowData: current_guest,
            columnDefs: [
                { field:"lastname"},
                { field:"firstname"},
                { headerName: 'Checkin Date', field:"checkin_date"},
                { headerName:  'Type of Stay', field:"type_of_stay"},
                { headerName:  'Bed Name', field:"bed_name"},
                { headerName:  'Short Name', field: 'bed_short_name'},
                { headerName:  'Days Left', field:"days_left"},
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
    }
    
    // Volunteer Logs
    /* 
    async onVolunteers() {
        console.log('begin onVolunteers');
        let content = getElem('content');
        content.innerHTML = '';
        let vol = await this.getTable('volunteer_log', { limit: 10000 });  
        let shifts = await this.getTable('shifts');

        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        
        for (let vo of vol) {
            //console.log('current_guest guest_id: ',cg.guest_id);
            let sh = shifts.find(s => s.shift_id == vo.shift_id);
            
            vo.shift_desc = sh.shift_description;
            vo.shift_sort = sh.shift_sort;
            
        }

        // sort by date_of_shift, and then shift_sort
        // sort in descending order by date of visit
        // vol.sort((a,b) => (a.date_of_shift < b.date_of_shift) ? 1 : ((b.date_of_shift < a.date_of_shift) ? -1 : 0));

        // Apply array.sort with comparison function
        vol.sort(function (a, b) {
            let af = a.date_of_shift;
            let bf = b.date_of_shift;
            let as = a.shift_sort;
            let bs = b.shift_sort;
 
            // If first value is same
            if (af == bf) {
                return (as > bs) ? -1 : (as < bs) ? 1 : 0;
            } else {
                return (af > bf) ? -1 : 1;
            }
        });


        //

        const gridOptions = {
            rowData: vol,
            columnDefs: [
              //  {field:"guest_id"},
                // {field:"log_id"},
                // {field:"shift_id"},
                // {field:"checkin_date"},
                { headerName:  'Volunteers', field: 'volunteer_names', filter: false, sortable: false },
                { headerName:  'Date', field: 'date_of_shift', filter: true, sortable:  false },
                { headerName: 'Shift Time', field: 'shift_desc', sortable: false },
                { headerName: 'Shift Sort', field: 'shift_sort', sortable: false },
                { headerName:  'Note', field: 'note', filter: true, sortable: false},
                { headerName:  'Important Info', field: 'important_info', filter: true, sortable: false },
                { headerName: 'Men Turned Away', field: 'men_turned_away', sortable: false },
                { headerName: 'Women Turned Away', field: 'women_turned_away', sortable: false },
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
    } */

    
    // Visitors
    async onDailyNotes() {
        console.log('begin onDailyNotes');

        // clear the bottom bar
        let btmcontentcontent = getElem('btmcontent');
        btmcontent.innerHTML = '';

        let content = getElem('content');
        content.innerHTML = '';
        let visit = await this.getTable('visitors', { limit: 10000 });  
        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        
        let guests = await this.getTable('guest_data', { limit: 10000 }); 
        let visit_time = await this.getTable('visiting_times');   
        
        let vt_max = '';

        for (let vi of visit) {
            //console.log('current_guest guest_id: ',cg.guest_id);
            let guest = guests.find(g => g.guest_id == vi.guest_id);
            let vt = visit_time.find(v => v.visit_time_id == vi.visit_time_id)

            if (vi.date_of_visit > vt_max) {
              vt_max = vi.date_of_visit; // find latest date
            }
            
            //console.log('guest lastname = ',guest.lastname);
            //console.log('guest firstname = ',guest.firstname);
            //console.log('guest matched to guest_id')
            vi.lastname = guest.lastname;
            vi.firstname = guest.firstname;
            vi.visit_time_description = vt.visit_time_description;
        }

        console.log('date max = ', vt_max);

        // sort in descending order by date of visit
        // then sort by visiting time

        visit.sort(function (a, b) {
            let af = a.date_of_visit;
            let bf = b.date_of_visit;
            let as = a.visit_time_description;
            let bs = b.visit_time_description;
 
            // If first value is same
            if (af == bf) {
                return (as > bs) ? -1 : (as < bs) ? 1 : 0;
            } else {
                return (af > bf) ? -1 : 1;
            }
        });

        // create new array out of the visit table, only with dates equal to the max date, or today in the future
        // array of objects
        var newTable = new Array();
        for (let vi of visit) {
            if (vi.date_of_visit == vt_max) {
              newTable.push(vi);            
            }
        }

        // const today = new Date();
        // const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        // console.log('tomorrow = ', tomorrow);

        const gridOptions = {
            autoSizeStrategy: {
                type: 'fitGridWidth',
            },
            rowData: newTable,
            // rowData: visit,
            columnDefs: [
              //  {field:"guest_id"},
                // {field:"visit_id"},
                { headerName: 'Last Name', field: 'lastname', sortable: false },
                { headerName: 'First Name', field: 'firstname', sortable: false },
                // { headerName: 'Date of Visit', field: 'date_of_visit', sortable: false, filter: 'agDateColumnFilter', filterParams: filterParams },
                { headerName: 'Date of Visit', field: 'date_of_visit', sortable: false },
                { headerName: 'Visit Time', field: 'visit_time_description', sortable: false },
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
    }


    showLogin() {
        getElem('login-ok').disabled = false;
        getElem('password').value = '';
        getElem('login').showModal();
        setTimeout(() => getElem('password').focus(), 100);
    }

    async onAdmin() {
        console.log('begin Admin');
        this.messageBar.error('This function doesn\'t work yet');
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
        if (password && await this.api.login({ email, password })) {
            this.afterLogin(email);
            this.messageBar.show('Login successful.',3);
        }
        else this.messageBar.error('Login failed.');
        dialog.close();
    }


    afterLogin(user) {
        if (user) {
            if (user.endsWith('@fingerson.com'))
                user = user.substring(0, user.length-14);
            getElem('username').innerHTML = user;
            getElem('login-button').innerHTML = 'Logout';
        }
    }


    async onLogInOut(init=false) {
        console.log('begin onLogInOut');
        if (this.api.auth) {
            // Already logged in, so now log us out.
            await this.api.logout();
            getElem('username').innerHTML = '';
            getElem('login-button').innerHTML = 'Login Required';
            getElem('content').innerHTML = '';
            this.cache = {};
            this.messageBar.show('You are now logged out.',3);
        }
        else this.showLogin();
    }
}

function onPageLoad() {
    window.app = new DDayHouseApp();
}

function vollogTable() {
    console.log('edit volunteer log table')
    let content = getElem('content');
    content.innerHTML = "Volunteer Form";
}

function validateGuestAddForm() {
    let ln = document.forms["guestaddform"]["guest_lastname"].value;
    let fn = document.forms["guestaddform"]["guest_firstname"].value;
    let dob = document.forms["guestaddform"]["guest_dob"].value;
    let c_ph = document.forms["guestaddform"]["guest_contact_phone"].value;

    var reWhiteSpace = new RegExp("\\s+");
    var reDOB = new RegExp("\\d{4}-\\d{2}-\\d{2}");
    var rePhone = new RegExp("\\d{3}-\\d{3}-\\d{4}");

    if (ln == "") {
        alert("Last Name must be filled out");
        return false;
    }

    if (fn == "") {
        alert("First Name must be filled out");
        return false;
    }

    if (reWhiteSpace.test(ln)) {
        alert("Last Name has white space, not allowed");
        return false;
    }

    if (reWhiteSpace.test(fn)) {
        alert("First Name has white space, not allowed");
        return false;
    }

    if (!reDOB.test(dob)) {
        alert("DOB isn't formatted YYYY-MM-DD, try again");
        return false;
    }

    // test contact phone format if no empty
    if (c_ph != "") {
        if (!rePhone.test(c_ph)) {
            alert("Contact phone isn't formatted XXX-XXX-XXXX, try again");
            return false;
        }
    }



}
    
