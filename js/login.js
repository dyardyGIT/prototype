// login.js
(function (login, $) {

    login.vm = {
        username: ko.observable(''),
        password: ko.observable(''),
        logOutVisible: ko.observable(false)
    };
    
    
    login.vm.logout = function () {
        app.logout(function () {
            login.vm.username('');
            login.vm.password('');
            login.vm.logOutVisible(false);
        });        
    };

    login.vm.exitApp = function () {        
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    }

    login.vm.dologin = function () {                
        var u = login.vm.username();
        var p = login.vm.password();        
        if (u !== null && p !== null) {
            ajax(app.server + "/Login/Auth?method=login&returnformat=json", u, p, 'POST', {
                context: this,
                async:false,
                success: function () {                    
                    app.savelogin(u, p, function () {
                        login.vm.logOutVisible(true);                        
                        //location.href = '#/';
                    });                    
                },
                error: function () {
                    app.showAlert('Username/Password incorrect. Server ' + app.server, 'Login');                    
                    login.vm.logOutVisible(false);
                }
            });
        }
    };

    

    login.init = function () {        
        login.vm.username(app.username);
        login.vm.password(app.password);
        //login.vm.logOutVisible(false);
    };

})(window.login = window.login || {}, $);