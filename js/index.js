// init.js
(function (index, $) {

    index.vm = {                
        items: ko.observableArray([]),
        msg: ko.observable(""),                
        server: ko.observable(""),
        selectedlocationId: ko.observable('')
    }; 
       
    index.vm.selectLocation = function (loc) {
        index.vm.selectedlocationId(loc.LocationId);        
        location.href = '#/inspections';
    };

    //http://jsfiddle.net/jearles/RN9Dw/

    index.vm.getLocationsJson = function () {
            
            $('#loadingWindowLocations').show();
                        
            //var search = { lastName: index.vm.searchstring() };            
            ajaxLogin(app.server + "/Location/GetAll", "GET", {
                context: this,
                data: {},
                success: function (data) {
                    index.vm.items([]);
                    if (data.length > 0) {
                        var obj = $.parseJSON(JSON.stringify(data));
                        //var obj = $.parseJSON(data);
                        $.each(obj, function (i, item) {
                            index.vm.items.push(item)
                        });
                        //$("#employees").show();
                        $("#noresults").hide();
                    } else {
                        //$("#noresults").show();
                        $("#employees").hide();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {                    
                    app.showAlert('Error ' + textStatus, 'Prototype');
                }
            });
            $('#loadingWindowLocations').hide();
    };



    index.init = function () {
        index.vm.server = app.server;
        //index.vm.getLocationsJson();
        //ko.applyBindings(index.vm, $('index-page')[0]);                
    };

})(window.index = window.index || {}, $);
    

