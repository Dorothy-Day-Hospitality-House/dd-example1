

function renderStay(stay) {
    return `
    <div class="stay">
    <img src=${api.base}/assets/${stay.guest.photo}>
    <span class="bedname">${stay.bed.short_name}</span>,
    checkin = ${stay.checkin_date},
    name = ${stay.guest.firstname} ${stay.guest.lastname},
    return = ${stay.guest.return_date}
    </div>
    `
}


function renderBedBoard(stays, beds, guests) {
    let result = '<div class="stays">'
    for (let stay of stays.data) {
        stay.bed = beds.data.find(b => b.bed_id == stay.bed_id);
        stay.guest = guests.data.find(g => g.guest_id == stay.guest_id);
    }
    stays.data.sort((a,b) => a.bed.short_name < b.bed.short_name ? -1 : 1)
    for (let stay of stays.data) {
        result += renderStay(stay);
    }
    return result + '</div>';
}



// Convert a database row into a table row, 
// returns a string like "<tr>...."
function renderRow(row,colNames) {
    let result = '<tr>';
    result += colNames.map(c => `<td>${row[c]}</td>`).join('');
    return result + '</tr>';
}

// Convert a set of database rows into a table 
// returns a string like "<table>...."
function renderTable(id,rows,colNames) {
    let result = `<table id="${id}">\n`;
    result += '<thead><tr>';
    result += colNames.map(c => `<th>${c}</th>`).join('');
    result += '</tr></thead>\n';
    result += '<tbody>\n';
    result += rows.map(r => renderRow(r,colNames)).join('\n');
    result += '</tbody>\n';
    return result + '</table>\n';
}
