
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

function pingHost() {
    return axios.get(api + '/ping').then(response => {
        let tbody = getElem("mydiv");
        tbody.innerHTML = response.data.message;
    });
}

function onPageLoad() {
    pingHost();
}

