
class API {
    constructor() {
        this.base = 'https://db.fingerson.com/';
        this.auth = '';
    }

    // Login and keep the token in the auth.
    // cred must be { email: 'api2@fingerson.com', password: '????'}
    // returns a promise, expires on success, else error message
    login(cred) {

        return fetch(this.base + 'auth/login', { 
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(cred),
        }).then(res => {
            if (res.status > 399) 
                throw res;
            return res.json();
        }).then(body => {
            console.log(body);
            this.auth = 'Bearer ' + body.data.access_token;
            return body.data.expires;
        });
    }

    logout() {
        this.auth = '';
    }

    get(url, params=null) {
        if (params) {
            url += '?' +new URLSearchParams(params);
        }
        return fetch(this.base + url, { 
            method: "GET",
            headers: { 'Authorization': this.auth }
        });
    }

    post(url, data) {
        return fetch(this.base + url, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': this.auth
            },
            body: JSON.stringify(data),
        });
    }
}