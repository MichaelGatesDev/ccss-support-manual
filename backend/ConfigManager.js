"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigManager = /** @class */ (function () {
    function ConfigManager(primarySpreadsheetConfig, secondarySpreadsheetConfig) {
        this.primarySpreadsheetConfig = primarySpreadsheetConfig;
        this.secondarySpreadsheetConfig = secondarySpreadsheetConfig;
    }
    ConfigManager.prototype.getPrimarySpreadsheetConfig = function () {
        return this.primarySpreadsheetConfig;
    };
    ConfigManager.prototype.getSecondarySpreadsheetConfig = function () {
        return this.secondarySpreadsheetConfig;
    };
    return ConfigManager;
}());
exports.ConfigManager = ConfigManager;
