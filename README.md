# example1
Example of a fullstack app that uses Netlify and CockroachDB

# To setup netlify

1. login to app.netlify.com
2. click Add New Site / Import existing project
3. deploy with GitHub
4. fill in 
   
    - Site name = whatever you want
    - Base Directory = location of package.json
    - Build command = (leave empty)
    - Publish dir = location of index.html
    - Function dir = location of all your functions (one per .js file)

It will auto deploy from main.  You can disable the auto-deploy and then
deploy manually after you inspect the preview build.

You can also install Netlify CLI and build/test locally, but I've never tried that.


--with-cc-opt='-g
 -O2
 -ffile-prefix-map=/build/nginx-zctdR4/nginx-1.18.0=.
 -flto=auto
 -ffat-lto-objects
 -flto=auto
 -ffat-lto-objects
 -fstack-protector-strong
 -Wformat
 -Werror=format-security
 -fPIC
 -Wdate-time
 -D_FORTIFY_SOURCE=2'

 --with-ld-opt='-Wl,-Bsymbolic-functions
  -flto=auto
  -ffat-lto-objects
  -flto=auto
  -Wl,-z,relro
  -Wl,-z,now
  -fPIC'

 --prefix=/usr/share/nginx

 --conf-path=/etc/nginx/nginx.conf

 --http-log-path=/var/log/nginx/access.log

 --error-log-path=/var/log/nginx/error.log

 --lock-path=/var/lock/nginx.lock

 --pid-path=/run/nginx.pid

 --modules-path=/usr/lib/nginx/modules

 --http-client-body-temp-path=/var/lib/nginx/body

 --http-fastcgi-temp-path=/var/lib/nginx/fastcgi

 --http-proxy-temp-path=/var/lib/nginx/proxy

 --http-scgi-temp-path=/var/lib/nginx/scgi

 --http-uwsgi-temp-path=/var/lib/nginx/uwsgi

 --with-compat

 --with-debug

 --with-pcre-jit

 --with-http_ssl_module

 --with-http_stub_status_module

 --with-http_realip_module

 --with-http_auth_request_module

 --with-http_v2_module

 --with-http_dav_module

 --with-http_slice_module

 --with-threads

 --add-dynamic-module=/build/nginx-zctdR4/nginx-1.18.0/debian/modules/http-geoip2

 --with-http_addition_module

 --with-http_gunzip_module

 --with-http_gzip_static_module

 --with-http_sub_module