
let api = "/.netlify/functions";

// For local testing... just open the index file, oh and you need to disable CORS in chrome also
if (!location.hostname) 
    api = 'https://ddhost.netlify.app' + api;

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

function pingHost() {
    return axios.get(api + '/ping').then(response => {
        let tbody = getElem("mydiv");
        tbody.innerHTML = response.data.message;
    });
}

async function onButton() {
    let tbody = getElem("mydiv");
    tbody.innerHTML = 'testing';
    // //let config = {withCredentials: true};
    // //axios.defaults.withCredentials = true;
    // let cred = { email: 'user@test.com', password: '12345'};//, mode: 'cookie' };
    // let res = await axios.post('http://216.225.199.20:8055/auth/login', cred);
    // console.log (res);
    // let tok = res.data.data.access_token;
    // let cook = res.headers;

    // // let config = {withCredentials: true,
    // //     headers: { Cookie: 123}};
    // // console.log(config);   
    // res = await axios.get('http://216.225.199.20:8055/items/Students?access_token='+tok);
    let res = await axios.get('http://216.225.199.20:8055/items/Students');
    
    //tbody.innerHTML = JSON.stringify(res.data.data);
    let rows = res.data.data;
    let col_names = Object.keys(rows[0]);
    tbody.innerHTML = render_table('students',rows,col_names);

    res = await axios.get('http://216.225.199.20:8055/items/Teachers');

    rows = res.data.data;
    col_names = Object.keys(rows[0]);
    let table2 = new DataTable('#teachers', { 
        data: rows.map(r => col_names.forEach(c => r[c])),
        columns: col_names
    });
    
}

function onPageLoad() {
    pingHost();
}

