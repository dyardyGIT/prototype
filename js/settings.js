// settings.js
//(function (settings, $) {

//    settings.vm = {
//        //showOnlyMovies: ko.observable(true),
//        //showLatestOnStartup: ko.observable(false),  
//        message : ko.observable('what')
//    };

//    settings.init = function () {
//        //alert('here settings init');
//        //ko.cleanNode($("#settings-page")[0]); //clean previous bindings

//        //ko.applyBindings(settings.vm, $("#settings-page")[0]);
//        alert('settings init');
//    };

//})(window.settings = window.settings || {}, $);

(function (settings, $) {

    settings.ViewModel = function () {

        var self = this;
        self.message = ko.observable('what');


    };

    settings.init = function () {
        var self = this;
        settings.vm = new settings.ViewModel();
    };

})(window.settings = window.settings || {}, $);