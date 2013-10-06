ko.extenders["booleanValue"] = function (target) {
    target.formattedValue = ko.computed({
        read: function () {
            if (target() === true) return "True";
            else if (target() === false) return "False";
        },
        write: function (newValue) {
            if (newValue) {
                if (newValue === "False") target(false);
                else if (newValue === "True") target(true);
            }
        }
    });

    target.formattedValue(target());
    return target;
};