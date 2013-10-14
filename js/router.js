// router.js
(function (router, $) {
    router.app = Sammy("body", function () {

        var that = this;
        var $index = $("#index-page");
        var $settings = $("#settings-page");
        var $inspections = $("#inspections-page");
        var $support = $("#support-page");
        var $emergency = $("#emergency-page");
        var $login = $("#login-page");

        // Hack to force Android Browser to not use push state
        var ua = navigator.userAgent;
        var downgradeAndroid = false;
        if (ua.indexOf("Android") >= 0) {
            this.disable_push_state = true;
        };

        function swapPages(oldPage, newPage) {
            oldPage.hide("fast", function () {
                newPage.show("fast");
            });
        }

        var routes = [{
            path: "#/",
            callback: function (i) {
                //swapPages($settings, $index);
                $(".body").hide();                
                ko.applyBindings(index.vm, $('#index-page')[0]);
                index.vm.getLocationsJson();
                $index.show();
            }
        },
        {
            path: "#/settings",
            callback: function (i) {                
                $(".body").hide();
                //ko.applyBindings(settings.vm, $("#settings-page")[0]);//document.getElementById('settings-page')

                //ko.applyBindings(settings.vm, document.getElementById('settings-page'));//
                //alert(settings.vm);
                //var vm = new settings.ViewModel();
                
                //ko.applyBindings(vm, $("#settings-page")[0]);
                ko.applyBindings(settings.vm, $("#settings-page")[0]);

                $settings.show();
            }
        }, {
            path: "#/inspections",
            callback: function (i) {
                $(".body").hide();

                if (index.vm.selectedlocationId() === undefined || index.vm.selectedlocationId() === '') {
                    location.href = '#/';
                } else {
                    if (inspections.vm.initialized === false) {
                        ko.applyBindings(inspections.vm, $("#inspections-page")[0]);
                        inspections.vm.initialized = true;                        
                    }
                    inspections.vm.loadPage(index.vm.selectedlocationId());
                    $inspections.show();
                }

            }
        }, {
            path: "#/support",
            callback: function (i) {
                $(".body").hide();
                support.vm.load();
                ko.applyBindings(support.vm, document.getElementById('support-page'));
                $support.show();
                //swapPages($index, $support);
            }
        }, {
            path: "#/emergency",
            callback: function (i) {
                $(".body").hide();
                emergency.vm.load();
                ko.applyBindings(emergency.vm, document.getElementById('emergency-page'));
                $emergency.show();
                //swapPages($index, $emergency);
            }
        }, {
            path: "#/login",
            callback: function (i) {                
                $(".body").hide();                
                ko.applyBindings(login.vm, document.getElementById('login-page'));                
                $login.show();                
            }
        }];

        $.each(routes, function (i, r) {
            that.get(r.path, r.callback);
        });
    });

    router.init = function () {
        router.app.run("#/");
    };

})(window.router = window.router || {}, jQuery);