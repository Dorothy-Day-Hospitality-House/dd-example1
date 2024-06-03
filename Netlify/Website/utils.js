//-------------------------------------------------
// Common utilities for Dorothy Day

function getElem(id) {
    return document.getElementById(id);
}

function queryElem(q) {
    return Array.from(document.querySelectorAll(q));
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

