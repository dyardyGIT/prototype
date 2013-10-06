//var app = {

//    findByName: function() {
//        console.log('findByName');
//        this.store.findByName($('.search-key').val(), function(employees) {
//            var l = employees.length;
//            var e;
//            $('.employee-list').empty();
//            for (var i=0; i<l; i++) {
//                e = employees[i];
//                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
//            }
//        });
//    },

//    showAlert: function (message, title) {
//        if (navigator.notification) {
//            navigator.notification.alert(message, null, title, 'OK');
//        } else {
//            alert(title ? (title + ": " + message) : message);
//        }
//    },

//    initialize: function() {
//        var self = this;

//        //if (window.cordova) { //we're in phonegap
//        //    //navigator.notification.alert("window.cordova", null, "Info", 'OK');
//        //    navigator.notification.alert("PhoneGap is working");
//        //} else {
//        //    alert("not cordova");
//        //}

//        //this.store = new MemoryStore(function() {
//        //    self.showAlert('Store Initialized', 'Info');
//        //});

//        this.store = new LocalStorageStore(function() {
//            //self.showAlert('Store Initialized', 'Info');
//        });

//        $('.search-key').on('keyup', $.proxy(this.findByName, this));
//    }



//};

////Start Up
////app.initialize();


//if (window.cordova) {
//    $('#msg').html('cordova');
//    document.addEventListener("deviceready", onDeviceReady, false);
//} else {
//    //alert('hi');
//    $(document).ready(function () {
//        $('#msg').html('no cordova');
//        app.initialize();
//    });

//}
//function onDeviceReady() {
//    if (window.cordova) {
//        app.initialize();
//    }
//}


//var app = {

//    findByName: function () {        
//        console.log('findByName');
//        this.store.findByName($('.search-key').val(), function (employees) {
//            var l = employees.length;
//            var e;
//            $('.employee-list').empty();
//            for (var i = 0; i < l; i++) {
//                e = employees[i];
//                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
//            }
//        });
//    },

//    showAlert: function (message, title) {
//        if (navigator.notification) {
//            message += ' navigator.notification';
//            navigator.notification.alert(message, null, title, 'OK');

//            if (window.cordova) {
//                navigator.notification.alert("cordova", null, title, 'OK');
//            }


//        } else {
//            if (window.cordova){
//                message += " with cordova";
//            }else {
//                message += " no cordova";
//            }
            
//            alert(title ? (title + "A: " + message) : message);
//        }
//    },

//    initialize: function () {
//        var self = this;
//        //this.store = new MemoryStore();
//        this.store = new LocalStorageStore(
//            function () {
//                self.showAlert('Store Initialized', 'Info');
//            }
//        );
//        $('.search-key').on('keyup', $.proxy(this.findByName, this));
//    }

//};

////app.initialize();

//$(document).ready(function () {

//    if (window.cordova) {
//        $('#msg').html('cordova');
//        document.addEventListener("deviceready", onDeviceReady, false);
//    } else {

//        $('#msg').html('no cordova');
//        app.initialize();

//    };

//});


//function onDeviceReady() {
//    if (window.cordova) {
//        alert('hi1');
//        app.initialize();
//    }
//}


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

            //app.savelogin(user, pass, function () {                
            //    login.vm.logOutVisible(true);
            //});
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
        //if (window.Cordova) {  
        if (window.cordova) {            
            app.server = 'https://webappsdev.ch2m.com/Prototype';
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