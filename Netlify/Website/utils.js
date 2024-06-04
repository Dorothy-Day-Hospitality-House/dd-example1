//-------------------------------------------------
// Common utilities for Dorothy Day

function getElem(id) {
    return document.getElementById(id);
}

function queryElem(q) {
    return Array.from(document.querySelectorAll(q));
}



function simpleQuery(field,oper,data) {
    let query = {"filter": { [field]: { [oper]: data }}};
    return { query };
}


