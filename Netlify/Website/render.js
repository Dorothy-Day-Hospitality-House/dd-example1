

function renderStay(stay, bed, guest) {
    return `
    <div class="stay">
    <img src=${api.base}/assets/${guest.photo}>
    bed = <span class="bedname">${bed.short_name}</span>,
    checkin = ${stay.checkin_date},
    name = ${guest.firstname} ${guest.lastname},
    return = ${guest.return_date}
    </div>
    `
}


function renderBedBoard(stays, beds, guests) {
    `stay_id
    user_created
    date_created
    user_updated
    date_updated
    guest_id
    bed_id
    checkin_date`
    let result = '<div class="stays">'

    for (let stay of stays) {
        b = beds.find(b => b.bed_id == stay.bed_id);
        g = guests.find(g => g.guest_id == stay.guest_id);
        result += renderStay(stay,b,g);
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
