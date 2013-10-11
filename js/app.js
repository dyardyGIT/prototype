var app = {
    server: '',
    loggedIn: false,
    username: '',
    password: '',
    offline: false,    

    getAccount: function(){
        var user, pass;
        this.store.get('username', function (data) { user = data });
        this.store.get('password', function (data) { pass = data });
        if ((user !== "null" && user !== undefined) && (pass !== "null" && pass !== undefined)) {
            this.username = user;
            this.password = pass;
            autoLogin(user, pass);
        }        
    },

    getToken: function (callback) {
        var token = null;
        if (this.loggedIn) {
            if(this.username!==null && this.password!==null && this.username.length>0 && this.password.length>0)
            token = window.btoa(this.username + ':' + this.password);            
        }
        callback(token);        
    },

    savelogin: function (u, p, callback) {        
        this.store.save('username', u, function () { });
        this.store.save('password', p, function () { });
        this.loggedIn = true;
        this.username = u;
        this.password = p;
        callback('saved login');
    },

    logout: function (callback) {
        var self = this;
        self.store.remove('username', function () {
            self.store.remove('password', function () {
                self.loggedIn = false;
                callback();
            });
        });
    },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    getJson: function (key, callback) {
        var j;
        this.store.get(key, function (data) { j = data; });
        callback(j);
    },
    
    saveJson: function(key, j, callback){
        this.store.save(key, j, function () { });
        callback('saved');
    },

    initialize: function () {
        var self = this;

        app.server = 'http://localhost/PrototypeBasic';        
        //app.server = 'http://10.0.2.2/PrototypeBasic'
        if (window.cordova) {            
            app.server = 'https://webappsdev.ch2m.com/Prototype';
            //app.server = 'https://webappsdev.ch2m.com/Directory';
        }

        this.store = new LocalStorageStore(function () {
            //self.showAlert('Store Initialized', 'Info');
        });

        this.getAccount();

    },

    notify: function (message) {
        var title = "Prototype";
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    }

};




(function (app, $) {

    // Initialization
    function init() {

        app.initialize();

        if (window.login) login.init();
        if (window.index) index.init();
        if (window.settings) settings.init();
        if (window.office) inspections.init();
        if (window.support) support.init();
        if (window.emergency) emergency.init();
        if (window.about) about.init();
        if (window.router) router.init();

        $(".back-button").on("click", function () {
            window.history.go(-1);
            return false;
        });


        //window.onerror = function (err, fn, ln) { alert("ERROR:" + err + ", " + fn + ":" + ln); };
    }

    // Startup 
    if (window.cordova) { 
        //document.addEventListener("deviceready", init, false);
        document.addEventListener('deviceready', function () {            
            init();
        }, false);

    } else {
        $(document).ready(init);
    }

})(window.app = window.app || {}, $);