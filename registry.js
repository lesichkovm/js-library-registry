function Registry(namespace) {
    var namespace = typeof namespace === "undefined" ? '' : "@" + namespace;

    function jsonDecode(json) {
        return JSON.parse(json);
    }

    function jsonEncode(string) {
        return JSON.stringify(string);
    }

    /**
     * Gets a key from the key-vaue store, if it does not exist returns NULL
     * @param {string} key
     * @returns {Object}
     */
    this.get = function (key) {
        var key = key + namespace;
        if (localStorage.getItem(key) !== null) {
            var expiresDate = localStorage.getItem(key + "&&expires");
            if (expiresDate === null) {
                return null;
            }
            var expires = new Date(expiresDate);
            var now = new Date();
            var isExpired = now.getTime() > expires.getTime() ? true : false;
            if (isExpired) {
                this.remove(key);
                return null;
            }
            var value = window.localStorage.getItem(key);
            if (value === null) {
                return value;
            }
            if (value === "undefined") {
                return null;
            }
            if (typeof value === "undefined") {
                value = null;
                return null;
            }

            return jsonDecode(value);
        } else {
            return null;
        }
    };
    /**
     * Sets a value to a key
     * @param {string} key
     * @param {Object} value
     * @param {number} expires
     * @returns {void}
     */
    this.set = function (key, value, expires) {
        console.log(key);
        console.log(value);
        if (typeof value === "undefined") {
            value = null;
        }
        var expires = typeof expires === "undefined" ? 60000000000 : expires * 1000;
        var key = key + namespace;
        if (value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, jsonEncode(value));
            var expiresTime = ((new Date()).getTime() + expires);
            var expires = new Date();
            expires.setTime(expiresTime);
            localStorage.setItem(key + "&&expires", expires);
        }
    };
    this.remove = function (key) {
        var key = key + namespace;
        localStorage.removeItem(key);
        localStorage.removeItem(key + "&&expires");
    };
    this.empty = function () {
        var keys = Object.keys(localStorage);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.indexOf(namespace) > -1) {
                localStorage.removeItem(key);
            }
        }
    };
}
