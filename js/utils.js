var ajax = function (url, user, pass, methodType, options) {
    //$.mobile.loading('show', {
    //    text: 'AJAX-ing...',
    //    textVisible: true
    //});

    var optionsIncludingAuthentication = {
        type: methodType,
        dataType: 'json',
        beforeSend: function (xhr) {
            var token = window.btoa(user + ':' + pass);
            xhr.setRequestHeader('Authorization', 'Basic ' + token);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            app.showAlert('Unable to communicate with server...' + url + textStatus + errorThrown, 'Contacts');
        },
        complete: function () {
            //$.mobile.loading('hide');
        }
    };

    $.extend(optionsIncludingAuthentication, options);

    $.ajax(url, optionsIncludingAuthentication);
};

var ajaxLogin = function (url, methodType, options) {
    app.getToken(function (token) { 
                if (token !== null) {
                    var optionsIncludingAuthentication = {
                        type: methodType,
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Basic ' + token);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            app.showAlert('Unable to communicate with server...' + url + textStatus + errorThrown, 'Prototype');
                        },
                        complete: function () {
                            //$.mobile.loading('hide');
                        }
                    };
                    $.extend(optionsIncludingAuthentication, options);
                    $.ajax(url, optionsIncludingAuthentication);
                } else {
                    app.showAlert("You must log in.", "Login");
                    location.href = '#/login';
                }
        });
};

var autoLogin = function (user, pass) {
    if (user !== null && pass !== null) {
        ajax(app.server + "/Login/Auth?method=login&returnformat=json", user, pass, 'POST', {
            context: this,
            async: false,
            success: function () {
                app.savelogin(user, pass, function () {
                    login.vm.logOutVisible(true);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                app.showAlert('Unable to communicate with server...' + app.Server + textStatus + errorThrown, 'Login');
            }
        });
    };
};

//var updateViewModel = function (targetObservableViewModel, sourceViewModel) {
//    ko.mapping.fromJS(sourceViewModel, targetObservableViewModel);
//};