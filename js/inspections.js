// inspections.js
(function (inspections, $) {

    inspections.vm = {
        initialized: false,
        items: ko.observableArray([]),
        msg: ko.observable('helo'),
        server: ko.observable(''),
        locationId: ko.observable(''),
        selectedInspection: ko.observable(null)
    };

    inspections.vm.activeItems = ko.computed(function () {
        if (inspections.vm.items().length === 0)
            return inspections.vm.items();

        return ko.utils.arrayFilter(inspections.vm.items(), function (item) {
            if (item.Removed() !== true) return true;
        });
    })
    
    inspections.vm.save = function () {        
        var changedItems = ko.utils.arrayFilter(inspections.vm.items(), function (item) {
            if (item.Modified() === true) return true;
        });
        var d = ko.toJSON(changedItems);

        //var d = ko.toJSON(inspections.vm.items);
        ajaxLogin(app.server + "/Inspection/Save", "POST", {
            context: this,
            data: d,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                app.showAlert('Saved', 'Inspections');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                app.showAlert('Error ' + textStatus, 'Prototype');
            }
        });
    };

    inspections.vm.onChange = function (val, e) {
        //var el = e.srcElement;
        //var newVal = parseInt(el.value);
        //var index = parseInt(el.getAttribute('data-index'));
        val.Modified(true);
        
        //val.State(16);

        //Detached = 1,        
        //Unchanged = 2,        
        //Added = 4,
        //Deleted = 8,        
        //Modified = 16
    };

    inspections.vm.addNew = function () {        
        var newItem = {
            "InspectionImages": [],
            "InspectionType": null,
            "Location": inspections.vm.locationId(),
            "InspectionId": -1,
            "LocationId": 1,
            "InspectionTypeId": 1,
            "Latitude": 0,
            "Longitude": 0,
            "Name": "Inspection Name",
            "Description": "",
            "DateModified": null,
            "State": 4,
            "MapUrl": '',
            "LatLng":''
        }
        var count = inspections.vm.items().length;
        inspections.vm.items.push(ko.mapping.fromJS(newItem, mapping));
        var recentlyAddedItem = inspections.vm.items()[count];        
        recentlyAddedItem.Modified(true);
        inspections.vm.selectedInspection(recentlyAddedItem);
    };

    inspections.vm.remove = function (item) {                
        item.State(8);
        item.Removed(true);
        item.Modified(true);        
        inspections.vm.selectedInspection(null);
    };

    var mapping = {
        create: function (options) {            
            var innerModel = ko.mapping.fromJS(options.data);
            innerModel.Modified = ko.observable(false);
            innerModel.Removed = ko.observable(false);
            return innerModel;
        }
    };

    inspections.vm.getInspections = function (id) {
        
        //$('#inspections').hide();
        //$('#noresultsInspections').hide();
        //$('#loadingWindowInspections').show();

        if (inspections.vm.locationId()==='' || inspections.vm.locationId() === null || inspections.vm.locationId() === undefined) {
            location.href = '#/';
        }        
        var search = { locationId: id };
        ajaxLogin(app.server + "/Inspection/GetInspectionsByLocationId", "GET", {
            context: this,
            data: search,
            success: function (data) {
                inspections.vm.items([]);
                if (data.length > 0) {
                    //var obj = $.parseJSON(JSON.stringify(data));

                    //ko.utils.arrayForEach(obj, function (item) {
                    //    item.Latitude = ko.observable(item.Latitude);
                    //    item.Longitude = ko.observable(item.Longitude);
                    //});

                    //ko.mapping.fromJS(data, {}, inspections.vm.items);

                    ko.mapping.fromJS(data, mapping, inspections.vm.items);

                    //$.each(obj, function (i, item) {
                    //    inspections.vm.items.push(item)
                    //});

                    //$("#inspections").show();
                    //$("#noresultsInspections").hide();
                } else {
                    //$("#noresultsInspections").show();
                    //$("#inspections").hide();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                app.showAlert('Error ' + textStatus, 'Prototype');                
            }
        });
        //$('#loadingWindowInspections').hide();
        
    };

    inspections.vm.selectInspection = function (inspection) {        
        inspections.vm.selectedInspection(inspection);                     
    };





    inspections.vm.capturePhoto = function () {
        try {
            //http://docs.phonegap.com/en/2.9.0/cordova_camera_camera.md.html
            //navigator.camera.getPicture( cameraSuccess, cameraError, [ cameraOptions ] );
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL 
            });

        } catch (exc) {
            alert(exc.message);
        }
    };

    function onPhotoURISuccess(imageData) {
        try{
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;

            var newImg = {
                "ImageId": -1,
                "InspectionId":  inspections.vm.selectedInspection.InspectionId(),
                "CameraImage": imageData
            };
            
            inspections.vm.selectedInspection.Modified(true);
            inspections.vm.selectedInspection.InspectionImages.push(newImg);

        } catch (ex) {
            alert('problem on success of picture');
        }
    }

    //function onPhotoURISuccess(imageURI) {
    //    //var msg = document.getElementById('msg');
    //    //msg.innerText = 'got the image URI: ' + imageURI + ' attempting to upload ...';
    //    try {
    //        var options = new FileUploadOptions();
    //        options.fileKey = 'file';
    //        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    //        options.mimeType = 'image/jpeg';

    //        var params = new Object();
    //        params.value1 = 'test';
    //        params.value2 = 'param';

    //        options.params = params;

    //        var ft = new FileTransfer();
    //        ft.upload(imageURI, 'http://ipaddressofmycomputer/File/UploadFile', win, fail, options);
    //        //msg.innerText = 'upload complete';
    //    } catch (err) {
    //        //var msg = document.getElementById('msg');
    //        //msg.innerText = 'error from catch: ' + err;
    //    }
    //};

    function onFail(message) {        
        alert('Failed because: ' + message);
    }


    ////
    //inspections.vm.getPicture = function () {
    //    // Retrieve image file location from specified source
    //    navigator.camera.getPicture(uploadPhoto,
    //                                    function (message) { alert('get picture failed'); },
    //                                    {
    //                                        quality: 50,
    //                                        destinationType: navigator.camera.DestinationType.FILE_URI,
    //                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    //                                    }
    //                                );
    //};

    function uploadPhoto(imageURI) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.png';
        options.mimeType = "text/plain";

        var params = new Object();

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(app.server + '/inspection/upload'), win, fail, options);
        
    };

    function win(r) {
        var msg = "Code = " + r.responseCode + " Response = " + r.response + " Sent = " + r.bytesSent;
        alert(msg);
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code + " upload error source " + error.source + " upload error target " + error.target);
    }

    inspections.vm.getCurrentPosition = function () {        
        navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);

    }

    //=======================Geolocation Operations=======================//
    // onGeolocationSuccess Geolocation
    function onGeolocationSuccess(position) {
        // Use Google API to get the location data for the current coordinates
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        geocoder.geocode({ "latLng": latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if ((results.length > 1) && results[1]) {
                    $("#myLocation").html(results[1].formatted_address);
                }
            }
        });

        // Use Google API to get a map of the current location
        // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
        var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
        var mapImg = '<img src="' + googleApis_map_Url + '" />';
        $("#map_canvas").html(mapImg);

        var current = inspections.vm.selectedInspection();
        current.Latitude(position.coords.latitude);
        current.Longitude(position.coords.longitude);
        current.LatLng(latlng.lb + '|' + latlng.mb);
        current.MapUrl(googleApis_map_Url);
        current.Modified(true);
        
    }

    // onGeolocationError Callback receives a PositionError object
    function onGeolocationError(error) {
        $("#myLocation").html("<span class='err'>" + error.message + "</span>");
    }
    
    inspections.vm.loadPage = function (id) {        
        inspections.vm.items([]);
        inspections.vm.locationId(id);
        inspections.vm.getInspections(id);
    };

    inspections.init = function () {
        
        //ko.cleanNode($("#office-page")[0]); //clean previous bindings
        
        inspections.vm.server = app.server;

    };

})(window.inspections = window.inspections || {}, $);