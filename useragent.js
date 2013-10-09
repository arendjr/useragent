define("useragent", [], function() {

    "use strict";

    /**
     * @note This file is based on useragent.js, which is released under LGPL as
     *       part of the Hyves Hybrid project:
     *                                   https://code.google.com/p/hyves-hybrid/
     *
     * User-Agent recognizition.
     *
     * The UserAgent class represents the user-agent (be it a regular or a mobile
     * browser, or anything else) and allows to query for the name, version, and
     * capabilities of the agent.
     *
     * The name and version of the agent are determined by parsing the user-agent
     * string submitted to the server, and may not necessarily correspond to the
     * real agent used by the user (user-agent spoofing).
     *
     * Note: This class should never export the user-agent string, or parts
     * thereof. If you need some checks on the user-agent string which are not yet
     * provided by this class, please implement them in this class, and add
     * appropriate tests in UserAgentTestCase. This is to prevent user-agent checks
     * spreading through-out our codebase.
     *
     * There are methods for checking which browser is used, see is().
     * Methods for checking the platform, see isPlatform().
     * Methods for checking agent types, like isMobileDevice().
     * Methods for checking specific devices, like isIPhone().
     */

    /**
     * Returns whether the reported user-agent matches the name given.
     *
     * <p>The name you give should be the name of a user-agent, like "MSIE",
     * "Firefox", "Safari", or any other agent. If you are unsure about the name
     * to use, there are also convenience methods for the most common agents,
     * like isIE(), isFirefox(), etc..
     *
     * @param name Name of the agent to check for.
     * @return true if the name matches the user-agent, false otherwise.
     *
     * @see isIE(), isFirefox(), isSafari(), isChrome(), isOpera(),
     *      isOperaMini()
     */
    function is(name) {

        return properties.browser === name;
    }

    /**
     * Convenience method for checking whether the user is using MSIE.
     *
     * @see is()
     */
    function isIE() {

        return is("MSIE");
    }

    /**
     * Convenience method for checking whether the user is using Firefox.
     *
     * @see is()
     */
    function isFirefox() {

        return is("Firefox");
    }

    /**
     * Convenience method for checking whether the user is using Safari.
     *
     * @see is()
     */
    function isSafari() {

        return is("Safari");
    }

    /**
     * Convenience method for checking whether the user is using Google Chrome.
     *
     * @see is()
     */
    function isChrome() {

        return is("Chrome");
    }

    /**
     * Convenience method for checking whether the user is using Opera.
     *
     * <p>Note that this also includes Opera Mini.
     *
     * @see is(), isOperaMini()
     */
    function isOpera() {

        return is("Opera") || is("Opera Mini");
    }

    /**
     * Convenience method for checking whether the user is using Opera Mini.
     *
     * @see is(), isOpera()
     */
    function isOperaMini() {

        return is("Opera Mini");
    }

    /**
     * Checks whether the version of the user-agent matches the version given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version matches, false otherwise.
     *
     * <p>Please note that this method will test up to the granularity that you
     * specify in the version argument. For example, if the user is using
     * Firefox 3.5, isVersion("3") will return true, but isVersion("3.0") will
     * return false.
     *
     * <p>The highest granularity of versions is 3 levels deep, as in
     * "major.minor.patch".
     *
     * @see versionIsAtLeast(), versionIsLessThan()
     */
    function isVersion(version) {

        return compareVersions(version, properties.browserVersion, false, true, false);
    }

    /**
     * Checks whether the version of the user-agent is the same as or higher
     * than the version given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version is at least the version given, false
     *         otherwise.
     *
     * @see isVersion(), versionIsLessThan()
     */
    function versionIsAtLeast(version) {

        return compareVersions(version, properties.browserVersion, true, true, false);
    }

    /**
     * Checks whether the version of the user-agent is older than the version
     * given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version is less than the version given, false
     *         otherwise.
     *
     * @see isVersion(), versionIsAtLeast()
     */
    function versionIsLessThan(version) {

        return compareVersions(version, properties.browserVersion, false, false, true);
    }

    /**
     * Returns whether the reported user-agent is on the platform given.
     *
     * <p>The platform you give should be the name of a platform, like
     * "Windows", "Linux", "Mac OS", "Symbian", "Android", or any other
     * platform. If you are unsure about the platform to use, there are also
     * convenience methods for the most common platforms, like isWindows(),
     * isLinux(), etc..
     *
     * @param platform Name of the platform to check for.
     * @return true if the name matches the platform, false otherwise.
     *
     * @see isWindows(), isLinux(), isMac(), isAndroid()
     */
    function isPlatform(platform) {

        return properties.platform === platform;
    }

    /**
     * Convenience method for checking whether the user is using Windows.
     *
     * @see isPlatform()
     */
    function isWindows() {

        return isPlatform("Windows");
    }

    /**
     * Convenience method for checking whether the user is using Linux.
     *
     * @see isPlatform()
     */
    function isLinux() {

        return isPlatform("Linux");
    }

    /**
     * Convenience method for checking whether the user is using Mac OS.
     *
     * @see isPlatform()
     */
    function isMac() {

        return isPlatform("Mac OS");
    }

    /**
     * Convenience method for checking whether the user is using Android.
     *
     * @see isPlatform()
     */
    function isAndroid() {

        return isPlatform("Android");
    }

    /**
     * Convenience method for checking it's an Android tablet.
     *
     * <p>See: http://android-developers.blogspot.com/2010/12/android-browser-user-agent-issues.html
     *
     * @see isPlatform(), isMobileDevice()
     */
    function isAndroidTablet() {

        return isAndroid() && !isMobileDevice() ;
    }

    /**
     * Checks whether the reported user-agent is a desktop browser.
     *
     * @return true if the user-agent is a desktop browser, false otherwise.
     */
    function isDesktopBrowser() {

        return properties.type === "desktop";
    }

    /**
     * Checks whether the reported user-agent is a mobile device, like a mobile
     * phone, an iPod Touch, etc..
     *
     * Note that tablets are *not* considered to be mobile devices by this
     * method. Use isTablet() instead if you want to check whether the
     * user-agent is a tablet device.
     *
     * @return true if the user-agent belongs to a mobile device, false
     *         otherwise.
     */
    function isMobileDevice() {

        return properties.type === "mobile";
    }

    /**
     * Convenience method for checking whether the reported user-agent is a
     * tablet device.
     *
     * @return true if the user-agent belongs to a tablet device, false
     *         otherwise.
     *
     * @see isIPad(), isAndroidTablet()
     */
    function isTablet() {

        return isIPad() || isAndroidTablet() ;
    }

    /**
     * Checks whether the reported user-agent is on a mobile version of Mac OS.
     * This includes iPod Touch, iPhone and iPad devices.
     *
     * @return true if the user-agent belongs to a mobile Mac OS device, false
     *         otherwise.
     *
     * @see isIPhone(), isIPad()
     */
    function isIOS() {

        return (isMobileDevice() && isMac()) || isIPad();
    }

    /**
     * Returns whether the reported user-agent indicates it is on the device
     * given.
     *
     * <p>The device you give should be the name of a device, like "iPhone",
     * "BlackBerry", "PSP", etc.. If you are unsure about the name to use,
     * there are also convenience methods for the most common agents, like
     * isIPhone(), isBlackBerry(), etc..
     *
     * @param device Name of the device to check for.
     * @return true if the device matches, false otherwise.
     *
     * @see isIPhone(), isBlackBerry()
     */
    function isDevice(device) {

        return properties.device === device;
    }

    /**
     * Checks whether the reported user-agent is an iPhone.
     *
     * <p>For most purposes you probably want to use isIOS() instead to not
     * exclude iPod Touch users.
     *
     * @return true if the user-agent belongs to an iPhone, false otherwise.
     *
     * @see isIOS()
     */
    function isIPhone() {

        return isDevice("iPhone");
    }

    /**
     * Checks whether the reported user-agent is an iPad.
     *
     * @return true if the user-agent belongs to an iPad, false otherwise.
     *
     * @see isIOS()
     */
    function isIPad() {

        return isDevice("iPad");
    }

    /**
     * Checks whether the reported user-agent is on a BlackBerry device.
     *
     * @return true if the user-agent belongs to a BlackBerry, false otherwise.
     */
    function isBlackBerry() {

        return isDevice("BlackBerry");
    }

    /**
     * Checks whether the reported user-agent is an installed Google Chrome
     * Extension.
     *
     * @return true if the user-agent is an installed Google Chrome Extension,
     *         false otherwise.
     */
    function isChromeExtension() {

        return window.chrome && window.chrome.extension;
    }

    /**
     * Checks whether the reported user-agent is on Windows Phone (or old
     * Windows Mobile).
     *
     * @return true if the user-agent belongs to a Windows Phone device, false
     *         otherwise.
     */
    function isWindowsPhone() {

        return isMobileDevice() && isWindows();
    }

    /**
     * Checks whether the version of the user-agent matches the version given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version matches, false otherwise.
     *
     * <p>Please note that this method will test up to the granularity that you
     * specify in the version argument. For example, if the user is using
     * Firefox 3.5, isVersion("3") will return true, but isVersion("3.0") will
     * return false.
     *
     * <p>The highest granularity of versions is 3 levels deep, as in
     * "major.minor.patch".
     *
     * @see versionIsAtLeast(), versionIsLessThan()
     */
    function isPlatformVersion(version) {

        return compareVersions(version, properties.platformVersion, false, true, false);
    }

    /**
     * Checks whether the version of the user-agent is the same as or higher
     * than the version given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version is at least the version given, false
     *         otherwise.
     *
     * @see isVersion(), versionIsLessThan()
     */
    function platformVersionIsAtLeast(version) {

        return compareVersions(version, properties.platformVersion, true, true, false);
    }

    /**
     * Checks whether the version of the platform is older than the version
     * given.
     *
     * @param version User-agent version, like "1", or "3.0.9".
     * @return true if the version is less than the version given, false
     *         otherwise.
     *
     * @see isVersion(), versionIsAtLeast()
     */
    function platformVersionIsLessThan(version) {

        return compareVersions(version, properties.platformVersion, false, false, true);
    }

    var properties = {
        "browser": "Unknown",
        "browserVersion": [0, 0, 0],
        "type": "desktop",
        "device": "PC",
        "platform": "Unknown",
        "platformVersion": [0, 0, 0]
    };

    var userAgentCapabilities = {
        // mobile devices and browsers
        "browserng": {"type": "mobile", "browser": "BrowserNG", "browserVersionKey": "browserng/"},
        "netfront": {"type": "mobile", "browser": "NetFront", "browserVersionKey": "netfront/"},
        "windows ce": {"type": "mobile"},
        "palmos": {"type": "mobile", "platform": "PalmOS"},
        "palmsource": {"type": "mobile", "platform": "PalmSource"},
        "series60": {"type": "mobile", "platform": "S60", "platformVersionKey": "series60/"},
        "symbian": {"type": "mobile", "platform": "Symbian"},
        "android": {"platform": "Android", "platformVersionKey": "android "},
        "midp": {"type": "mobile"},
        "up.browser": {"type": "mobile"},
        "siemens": {"type": "mobile"},
        "blackberry": {"type": "mobile", "device": "BlackBerry"},
        "samsung": {"type": "mobile", "device": "Samsung"},
        "sec-": {"type": "mobile", "device": "Samsung"}, // Samsung electroncics
        "alcatel": {"type": "mobile"},
        "motorola": {"type": "mobile", "device": "Motorola"},
        "mot-": {"type": "mobile", "device": "Motorola"},
        "sagem": {"type": "mobile"},
        "telit": {"type": "mobile"},
        "lg": {"type": "mobile"},
        "philips": {"type": "mobile"},
        "hutchison": {"type": "mobile"},
        "panasonic": {"type": "mobile"},
        "sanyo": {"type": "mobile"},
        "qc": {"type": "mobile"},
        "configuration/cldc": {"type": "mobile"},
        "ericsson": {"type": "mobile", "device": "SonyEricsson"},
        "sharp": {"type": "mobile"},
        "hitachi": {"type": "mobile"},
        "compel": {"type": "mobile"},
        "docomo": {"type": "mobile"},
        "portalmmm": {"type": "mobile"},
        "opwv-sdk": {"type": "mobile"},
        "ipad": {"type": "desktop", "device": "iPad"}, // the iPod Touch has a webbrowser
        "iphone": {"type": "mobile", "device": "iPhone"},
        "ipod": {"type": "mobile", "device": "iPod"}, // the iPod Touch has a webbrowser
        "playstation portable": {"type": "mobile", "device": "PSP"},
        "opera mobi": {"type": "mobile", "browser": "Opera"},
        "opera mini": {"type": "mobile", "browser": "Opera Mini", "browserVersionKey": "opera mini/"},
        "htc_touch": {"type": "mobile"},
        "htc_diamond": {"type": "mobile"},
        "htc": {"type": "mobile", "device": "HTC"},
        "nokia": {"type": "mobile", "device": "Nokia", "platform": "Symbian"},
        "n900": {"type": "mobile", "device": "Nokia", "platform": "Linux", "browser": "Firefox"},
        "maemo": {"type": "mobile", "device": "Nokia", "platform": "Linux", "browser": "Firefox"},
        "mobile": {"type": "mobile"}, // assume all mobile devices (we support) have a touch interface

        // desktop browsers
        "opera": {"type": "desktop", "browser": "Opera", "browserVersionKey": "opera/"},
        "firefox": {"type": "desktop", "browser": "Firefox", "browserVersionKey": "firefox/"},
        "chromeframe": {"type": "desktop", "browser": "Chrome", "browserVersion": "", "browserVersionKey": "chromeframe/"}, // treat IE with Chromeframe as Chrome
        "chrome": {"type": "desktop", "browser": "Chrome", "browserVersion": "", "browserVersionKey": "chrome/"},
        "trident/4.0": {"browserVersion": "8.0"},
        "msie": {"type": "desktop", "browser": "MSIE", "browserVersionKey": "msie "},
        "safari/85": {"browserVersion": "1.0"},
        "safari/125": {"browserVersion": "1.2"},
        "safari/312": {"browserVersion": "1.3"},
        "safari/41": {"browserVersion": "2.0"},
        "safari": {"type": "desktop", "browser": "Safari", "browserVersionKey": "version/"},

        // desktop platforms
        "linux": {"platform": "Linux"},
        "mac": {"platform": "Mac OS", "device": "Mac", "platformVersionKey": "mac os x "},
        "nt ": {"platform": "Windows", "platformVersionKey": "nt "},
        "windows": {"platform": "Windows"},
        "bsd": {"platform": "Unix"},
        "x11": {"platform": "Linux"}
    };

    function init() {

        var _properties = {};

        var userAgentString = navigator.userAgent.toLowerCase();
        for (var key in userAgentCapabilities) {
            if (userAgentCapabilities.hasOwnProperty(key) && userAgentString.indexOf(key) > -1) {
                var agentProperties = userAgentCapabilities[key];

                for (var propertyName in agentProperties) {
                    if (agentProperties.hasOwnProperty(propertyName)) {
                        var propertyValue = agentProperties[propertyName];

                        if (!_properties.hasOwnProperty(propertyName)) {
                            _properties[propertyName] = propertyValue;
                        }
                    }
                }
            }
        }

        processProperties(_properties, userAgentString);

        // merge the properties we found into the real properties object
        for (var _propertyName in _properties) {
            if (_properties.hasOwnProperty(_propertyName)) {
                var _propertyValue = _properties[_propertyName];
                properties[_propertyName] = _propertyValue;
            }
        }

        var uaString = properties.browser + " " + properties.browserVersion.join(".") +
                       " on " + properties.platform + " " + properties.platformVersion.join(".") +
                       " on " + (properties.device.substr(0, 1) === "i" ? "an " : "a ") +
                       properties.device + " (" + properties.type + ")";
        console.log("Detected User-Agent: " + uaString);
    }

    function processProperties(properties, userAgentString) {

        processVersion(properties, userAgentString, "browserVersion");
        processVersion(properties, userAgentString, "platformVersion");
    }

    function processVersion(properties, userAgentString, key) {

        if (properties.hasOwnProperty(key + "Key")) {
            if (!properties.hasOwnProperty(key) || properties[key] === "") {
                properties[key] = getVersion(properties[key + "Key"], userAgentString);
            }
            delete properties[key + "Key"];
        }

        if (properties.hasOwnProperty(key)) {
            properties[key] = parseVersion(properties[key]);
        }
    }

    function getVersion(key, userAgentString) {

        var startPos = userAgentString.indexOf(key);
        if (startPos === -1) {
            return "";
        }
        startPos += key.length;

        var endPos = userAgentString.indexOf(" );", startPos);
        return userAgentString.substring(startPos, endPos > 0 ? endPos : undefined);
    }

    function parseVersion(version) {

        var normalizedVersion = "";
        var numericChars = "0123456789";
        var invalidChars = 0;
        for (var i = 0; i < version.length && invalidChars < 3; i++) {
            var character = version.charAt(i);
            if (numericChars.indexOf(character) > -1 || character === ".") {
                normalizedVersion += character;
                // fix 3.07 to become 3.0.7
                if (character === "0" && i > 0 && version.charAt(i - 1) === "." &&
                    i < version.length - 1 && numericChars.indexOf(version.charAt(i + 1))) {
                    normalizedVersion += ".";
                }
            } else if (character === "_") {
                normalizedVersion += ".";
            } else {
                invalidChars++;
            }
        }

        var components = normalizedVersion.split(".", 3);
        for (var j = 0; j < components.length; j++) {
            components[j] = parseInt(components[j], 10);
            if (isNaN(components[j])) {
                components[j] = 0;
            }
        }
        for (j; j < 3; j++) {
            components[j] = 0;
        }
        return components;
    }

    function compareVersions(version1, version2Components, lessValue, equalValue, moreValue) {

        var components = version1.split(".");
        for (var i = 0; i < 3; i++) {
            if (components.length < i + 1) {
                return equalValue;
            }
            var intVal = parseInt(components[i], 10);
            if (intVal > version2Components[i]) {
                return moreValue;
            } else if (intVal < version2Components[i]) {
                return lessValue;
            }
        }
        return equalValue;
    }

    init();

    return {
        is: is,
        isIE: isIE,
        isFirefox: isFirefox,
        isSafari: isSafari,
        isChrome: isChrome,
        isChromeExtension: isChromeExtension,
        isOpera: isOpera,
        isOperaMini: isOperaMini,
        isVersion: isVersion,
        versionIsAtLeast: versionIsAtLeast,
        versionIsLessThan: versionIsLessThan,
        isPlatform: isPlatform,
        isWindows: isWindows,
        isLinux: isLinux,
        isMac: isMac,
        isAndroid: isAndroid,
        isTablet: isTablet,
        isDesktopBrowser: isDesktopBrowser,
        isMobileDevice: isMobileDevice,
        isIOS: isIOS,
        isDevice: isDevice,
        isIPhone: isIPhone,
        isIPad: isIPad,
        isBlackBerry: isBlackBerry,
        isWindowsPhone: isWindowsPhone,
        isPlatformVersion: isPlatformVersion,
        platformVersionIsAtLeast: platformVersionIsAtLeast,
        platformVersionIsLessThan: platformVersionIsLessThan
    };

});
