// emergency.js
(function (emergency, $) {

    emergency.vm = {
        server: ko.observable(""),
        items: ko.observableArray([]),
        templateToUse: function (item) {
            return item.Type;
        }
    };

    emergency.vm.get = function () {
        $('#loadingWindowEmergency').show();

        var search = { emergencyInformation: true };
        ajaxLogin(app.server + "/Support/Get", "GET", {
            context: this,
            data: search,
            success: function (data) {
                emergency.vm.items([]);
                if (data.length > 0) {
                    var obj = $.parseJSON(JSON.stringify(data));
                    $.each(obj, function (i, item) {
                        emergency.vm.items.push(item)
                    });
                    app.saveJson('emergency', JSON.stringify(data), function (data) { });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                app.showAlert('Error ' + textStatus, 'Prototype');
            }
        });
        $('#loadingWindowEmergency').hide();
    };

    emergency.vm.load = function () {
        app.getJson('emergency', function (data) {
            if (data !== null) {
                var obj = $.parseJSON(data);
                $.each(obj, function (i, item) {
                    emergency.vm.items.push(item)
                });
            } else {
                emergency.vm.get();
            }
        });
    };

    emergency.init = function () {
        emergency.vm.server = app.server;

        //ko.applyBindings(settings.vm, $("#settings-page")[0]);
    };

    emergency.init = function () {
        //ko.applyBindings(settings.vm, $("#settings-page")[0]);
        //alert('settings init');
    };

})(window.emergency = window.emergency || {}, $);