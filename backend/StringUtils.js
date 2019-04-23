"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.isValidRoomNumber = function (number) {
        return StringUtils.RoomNumberPattern.test(number);
    };
    /**
     * Checks if a string is blank, null, or undefined
     * @param str The string to test
     */
    StringUtils.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    /**
     * Capitalizes the first letter of each word
     * @param str The string to capitalize
     */
    StringUtils.capitalizeFirstLetter = function (str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
            .join(' ');
    };
    StringUtils.parseBoolean = function (text) {
        text = text.toLowerCase().trim();
        return text === "true" || text === "on" || text === "yes";
    };
    StringUtils.RoomNumberPattern = /[\d]{3}[A-Za-z]{0,1}/; //TODO make this configurable
    return StringUtils;
}());
exports.StringUtils = StringUtils;
