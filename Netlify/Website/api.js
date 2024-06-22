
class DirectusAPI {
    constructor() {
        this.base = 'https://db.fingerson.com';
        this.auth = null;
        this.storageKey = 'ddhh-cred';
        // Below is for local testing ONLY. it reads data from test/items/*
        if (location.href.indexOf('192.168')==7 || location.href.indexOf('localhost')==7)
            this.base = location.href + 'test'
    }


    // Try to login automatically using stored credentials. 
    // If successful, return the email of the user.  Else null
    async autoLogin() {
        let value = sessionStorage.getItem(this.storageKey);
        if (!value) 
            value = localStorage.getItem(this.storageKey);
        if (value) {
            let cred = JSON.parse(value);
            let res = await this.post('/auth/login', cred);
            if (await this.parseAuthResult(res)) {
                return cred.email;
            }
        }
        return null;
    }


    // Login and keep the token in the auth.
    // cred must be { email: 'api2@fingerson.com', password: '????'}
    // Returns true or false.
    async login(cred, keep=true) {
        let res = await this.post('/auth/login', cred);
        if (await this.parseAuthResult(res)) {
            let value = JSON.stringify(cred);
            sessionStorage.setItem(this.storageKey, value);
            if (keep) 
                localStorage.setItem(this.storageKey, value);
            return true;
        }
    }

    // Private method, return true on success.
    async parseAuthResult(res) {
        if (res.status == 200) {
            let body = await res.json();
            console.log(body);
            if ('data' in body) {
                this.auth = body.data;
                this.auth['expire_time'] = this.auth.expires + Date.now();
                return true;
            }
        }
    }

    // Logout, invalidate the token, and clear all the local storage
    async logout() {
        if (this.auth && 'refresh_token' in this.auth) {
            this.post('/auth/logout', {refresh_token: this.auth.refresh_token});
        }
        this.auth = null;
        sessionStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey);
    }

    // Returns a object { Authorization: 'Bearer xxxxxxxxxxx'} using the current token
    // If missing token, return {}. If expired token, try to renew it.
    // NOTE: Directus does not say how long the "refresh" is good for, so I'm gonna
    // assume it is only good for 6 hours
    async bearerToken() {
        if (this.auth && 'access_token' in this.auth) {
            let timeLeft = (this.auth.expire_time - Date.now()) / 1000;
            if (timeLeft < 5 && timeLeft > -6 * 3600) {
                this.auth = {};
                // if less than 5 seconds remain to expire, then refresh the authentication
                console.log('attempting to refresh the authentication');
                let res = await this.post('/auth/refresh', {
                    refresh_token: this.auth.refresh_token,
                    mode: 'json'
                });
                await this.parseAuthResult(res);
            }
            return {
                'Authorization': 'Bearer ' + this.auth.access_token
            };
        }
        return {};
    }

    // GET from api, example code
    //   let res = await api.get('/hello', {name:'john'});
    //   let body = await res.json();
    //   console.log(res.status, body);
    async get(url, params=null) {
        if (params) {
            url += '?' + new URLSearchParams(params);
        }
        let headers = await this.bearerToken();
        return fetch(this.base + url, { method: 'GET', headers });
    }

    // POST to api, example code
    //   let res = await api.post('/hello', {name:'john'});
    //   let body = await res.json();
    //   console.log(res.status, body);
    async post(url, data) {
        let headers = {
            'Content-Type': 'application/json',
            ...await this.bearerToken()
        };
        let body = JSON.stringify(data);
        return fetch(this.base + url, { method: 'POST', headers, body });
    }

 
    // UPDATE api, example code
    //   let res = await api.patch('/hello', {name:'john'});
    //   let body = await res.json();
    //   console.log(res.status, body);
    async patch(url, data) {
        let headers = {
            'Content-Type': 'application/json',
            ...await this.bearerToken()
        };
        let body = JSON.stringify(data);
        return fetch(this.base + url, { method: 'PATCH', headers, body });
    }

 
}