
let api = '//db.fingerson.com';
let config = { withCredentials: true, headers: { Authorization: 'Bearer ???'}};
let cred = { email: 'api2@fingerson.com', password: '????'};

 

function getElem(id) {
    return document.getElementById(id);
}

function queryElem(q) {
    return Array.from(document.querySelectorAll(q));
}


// Convert a database row into a table row, 
// returns a string like "<tr>...."
function render_row(row,col_names) {
    let result = '<tr>';
    result += col_names.map(c => `<td>${row[c]}</td>`).join('');
    return result + '</tr>';
}

// Convert a set of database row into a table 
// returns a string like "<table>...."
function render_table(id,rows,col_names) {
    let result = `<table id="${id}">\n`;
    result += '<tr>';
    result += col_names.map(c => `<th>${c}</th>`).join('');
    result + '</tr>\n';
    result += rows.map(r => render_row(r,col_names)).join('\n');
    return result + '</table>\n';
}


async function onButton() {
    let tbody = getElem("mydiv");
    tbody.innerHTML = 'testing';
    
    res = await axios.get(api + '/items/shifts', config);
    
    let rows = res.data.data;
    let col_names = Object.keys(rows[0]);
    tbody.innerHTML = render_table('students',rows,col_names);

    
}

function onPageLoad() {

    // TODO -- save this in the localStorage for convenience?
    cred.password = prompt('Password for ' + cred.email);

    axios.post(api+'/auth/login', cred).then(res => {
        console.log (res.data.data);
        config.headers.Authorization = 'Bearer ' + res.data.data.access_token;
    });
}

