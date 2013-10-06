// about.js
(function (about, $) {

    about.init = function () {
        if (sessionStorage) {
            if (sessionStorage.helloWorld) {
                var msg = sessionStorage.helloWorld;
                alert(msg);
            }
        }

        var $plat = $("#plat");
        var platform = "Unknown";

        if (window.cordova) {
            if (device.platform === "iOS") {
                platform = "Apple iOS";
            }
            if (device.platform === "Android") {
                platform = "Android";
            }
        }

        $plat.text(platform);

    };

})(window.about = window.about || {}, $);