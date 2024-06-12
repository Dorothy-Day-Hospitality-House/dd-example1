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
        content.innerHTML = `Loading...`;
        let guests = await this.getTable('guest_data', { limit: 10000 });    
        
        // sort by last name
        guests.sort((a,b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0))

        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        const gridOptions = {
            rowData: guests,
            columnDefs: [
              //  {field:"guest_id"},
                // {field: "button", cellRenderer: CustomButtonComponent },
                { headerName:  'Last Name', field: 'lastname', filter: true },
                { headerName:  'First Name', field: 'firstname', filter:true },
                {
                    name:"Thumbnail",
                    field:"photo", sortable: false,
                    cellRenderer: params => {
                        return `<img src="${this.api.base}/assets/${params.value}?key=system-small-cover">`
                    }
                },
                { headerName:  'Banned', field: 'banned', filter: true },
                { headerName:  'Return Date', field: 'return_date' },
                { headerName:  'Identification', field: 'identification', filter: true },
                { headerName:  'Date of Birth', field: 'date_of_birth', filter: true },
                { headerName:  'Notes', field: 'notes', filter: true },
                { headerName:  'State', field: 'state' },
                //  {field:"veteran"},
                { headerName:  'Contact Phone', field: 'contact_phone_no' },
                { headerName:  'Gender', field: 'gender' },
                { headerName:  'Contact', field: 'contact_name' },
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
        content.innerHTML = `Loading...`;
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
    async onVolunteers() {
        console.log('begin onVolunteers');
        let content = getElem('content');
        content.innerHTML = `Loading...`;
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
    }
    
    // Visitors
    async onDailyNotes() {
        console.log('begin onDailyNotes');
        let content = getElem('content');
        content.innerHTML = `Loading...`;
        let visit = await this.getTable('visitors', { limit: 10000 });  
        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        
        let guests = await this.getTable('guest_data', { limit: 10000 }); 
        let visit_time = await this.getTable('visiting_times');   
        
        for (let vi of visit) {
            //console.log('current_guest guest_id: ',cg.guest_id);
            let guest = guests.find(g => g.guest_id == vi.guest_id);
            let vt = visit_time.find(v => v.visit_time_id == vi.visit_time_id)
            
            //console.log('guest lastname = ',guest.lastname);
            //console.log('guest firstname = ',guest.firstname);
            //console.log('guest matched to guest_id')
            vi.lastname = guest.lastname;
            vi.firstname = guest.firstname;
            vi.visit_time_description = vt.visit_time_description;
        }

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

        const gridOptions = {
            rowData: visit,
            columnDefs: [
              //  {field:"guest_id"},
                // {field:"visit_id"},
                { headerName: 'Last Name', field: 'lastname', sortable: false },
                { headerName: 'First Name', field: 'firstname', sortable: false },
                { headerName: 'Date of Visit', field: 'date_of_visit', sortable: false },
                { headerName: 'Visit Time', field: 'visit_time_description', sortable: false },
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
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

    async onAdmin() {
        console.log('begin Admin');
        this.messageBar.show('This function doesn\'t work yet', 5, 2);
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

