
class API {
    constructor() {
        this.base = '//db.fingerson.com/';
        this.auth = '';
    }

    // Login and keep the token in the auth.
    // cred must be { email: 'api2@fingerson.com', password: '????'}
    async login(cred) {
        let res = await fetch(this.base + 'auth/login', { 
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(cred),
        });
        let body = await res.json();
        console.log(body);
        this.auth = 'Bearer ' + body.data.access_token;
        return true;
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