function isEquivalent(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var i in a) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a[i]);
        var bProps = Object.getOwnPropertyNames(b[i]);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var j = 0; j < aProps[i].length; j++) {
            var propName = aProps[i][j];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[i][propName] !== b[i][propName]) {
                return false;
            }
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function getLoggedInUser()
{
    if (window.sessionStorage.getItem("user") != null) {
        return JSON.parse(window.sessionStorage.getItem("user"));
    } else {
        return {};
    }
}