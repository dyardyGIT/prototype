// support.js
(function (support, $) {

    support.vm = {
        server: ko.observable(""),
        items: ko.observableArray([]),
        templateToUse : function (item) {
            return item.Type;
        }
    };

    support.vm.get = function () {

        $('#loadingWindowSupport').show();

        var search = { emergencyInformation: false };
        ajaxLogin(app.server + "/Support/Get", "GET", {
            context: this,
            data: search,
            success: function (data) {
                support.vm.items([]);
                if (data.length > 0) {
                    var obj = $.parseJSON(JSON.stringify(data));
                    $.each(obj, function (i, item) {
                        support.vm.items.push(item)
                    });
                    app.saveJson('support', JSON.stringify(data), function (data) { });
                } else {
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Err ' + textStatus);
            }
        });
        $('#loadingWindowSupport').hide();
    };

    support.vm.load = function () {
        app.getJson('support', function (data) {            
            if (data !== null) {                
                var obj = $.parseJSON(data);                
                $.each(obj, function (i, item) {
                    support.vm.items.push(item)
                });                
            } else {
                support.vm.get();
            }
        });        
        
    };

    support.init = function () {
        support.vm.server = app.server;

        //ko.applyBindings(settings.vm, $("#settings-page")[0]);
    };

})(window.support = window.support || {}, $);