// init.js
(function (index, $) {

    index.vm = {                
        items: ko.observableArray([]),
        msg: ko.observable(""),                
        server: ko.observable(""),
        selectedlocationId: ko.observable(''),
        inspectionItems: ko.observableArray([])
    }; 
       
    index.vm.selectLocation = function (loc) {
        index.vm.selectedlocationId(loc.LocationId);        
        location.href = '#/inspections';
    };

    index.vm.offline = function (loc) {
        index.vm.selectedlocationId(loc.LocationId);
        
        ////get all inspections for location (without images)
        var search = { locationId: loc.LocationId, withImages: false };
        ajaxLogin(app.server + "/Inspection/GetInspectionsByLocationId", "GET", {
            context: this,
            data: search,
            success: function (data) {                
                if (data.length > 0) {
                    var key = 'inspections_' + loc.LocationId;
                    app.saveJson('inspectionLocationId', JSON.stringify(loc.LocationId), function (data) { });
                    app.saveJson(key, JSON.stringify(data), function (data) {
                        app.notify('Inspections for location ' + loc.LocationName + ' saved offline.', 'Offline');
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                app.showAlert('Error ' + textStatus, 'Prototype');
            }
        });
    };

    //http://jsfiddle.net/jearles/RN9Dw/

    index.vm.getLocationsJson = function () {            
            $('#loadingWindowLocations').show();                        
            
            if (app.isConnected && app.isHighSpeed) {
                ajaxLogin(app.server + "/Location/GetAll", "GET", {
                    context: this,
                    data: {},
                    success: function (data) {
                        index.vm.items([]);
                        if (data.length > 0) {
                            var obj = $.parseJSON(JSON.stringify(data));

                            app.saveJson('locations', JSON.stringify(data), function (data) { });

                            //var obj = $.parseJSON(data);
                            $.each(obj, function (i, item) {
                                index.vm.items.push(item)
                            });
                            $("#noresults").hide();
                        } else {
                            $("#employees").hide();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        app.showAlert('Error ' + textStatus, 'Prototype');
                    }
                });
            } else {

                var data = app.getJson('locations', function (data) {
                    var obj = $.parseJSON(data);
                    $.each(obj, function (i, item) {
                        index.vm.items.push(item)
                    });
                });

            }
            $('#loadingWindowLocations').hide();
    };



    index.init = function () {
        index.vm.server = app.server;
        //index.vm.getLocationsJson();
        //ko.applyBindings(index.vm, $('index-page')[0]);                
    };

})(window.index = window.index || {}, $);
    

