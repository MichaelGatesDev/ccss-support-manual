"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.capitalizeFirstLetter = function (str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
            .join(' ');
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
