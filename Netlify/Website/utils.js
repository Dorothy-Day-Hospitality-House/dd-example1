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


// Returns a shortened version of the string, for instance
// shorten('abcdefghij',5) will return 'ab...'
function shorten(data, maxlen) {
    let x = String(data);
    if (data && x.length > maxlen && maxlen > 3)
        return x.substring(0,maxlen-3) + '...';
    return data;
}

