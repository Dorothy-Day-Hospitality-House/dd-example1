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
                {field: 'lastname', filter: true},
                {field: 'firstname', filter:true},
                {
                    name:"Thumbnail",
                    field:"photo", 
                    cellRenderer: params => {
                        return `<img src="${this.api.base}/assets/${params.value}?key=system-small-cover">`
                    }
                },
                {field: 'identification', filter: true},
                {field: 'date_of_birth', filter: true},
                {field:"notes"},
                {field:"state"},
              //  {field:"veteran"},
                {field:"return_date"},
                {field:"contact_phone_no"},
                {field:"gender"},
                {field:"contact_name"},
                {field:"banned_detail"},
                {field:"banned_until"},
                {field:"banned"},
            ],
            rowSelection: "single",
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
           
    }
    
    async onBeds() {
        console.log('begin onBeds');
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
                {field:"lastname"},
                {field:"firstname"},
                {field:"checkin_date"},
                {field:"type_of_stay"},
                {field:"bed_name"},
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
    }
    
    async onVolunteers() {
        console.log('begin onVolunteers');
        let content = getElem('content');
        content.innerHTML = `Loading...`;
        let vol = await this.getTable('volunteer_log');  
        content.innerHTML = `<div id="guest-grid" class="ag-theme-quartz" style="height: 80vh"></div>`;
        
        const gridOptions = {
            rowData: vol,
            columnDefs: [
              //  {field:"guest_id"},
                {field:"log_id"},
                {field:"shift_id"},
                {field:"checkin_date"},
                {field:"volunteer_names"},
                {field:"date_of_shift"},
            ]
        };        
        const grid = getElem('guest-grid');
        agGrid.createGrid(grid, gridOptions);
    }
    
    async onDailyNotes() {
        console.log('begin onDailyNotes');
        let content = getElem('content');
        content.innerHTML = `Loading...`;
        let visit = await this.getTable('visitors');  
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
        visit.sort((a,b) => (a.date_of_visit < b.date_of_visit) ? 1 : ((b.date_of_visit < a.date_of_visit) ? -1 : 0));

        const gridOptions = {
            rowData: visit,
            columnDefs: [
              //  {field:"guest_id"},
                // {field:"visit_id"},
                {field:"lastname"},
                {field:"firstname"},
                {field:"date_of_visit"},
                {field:"visit_time_description"},
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

