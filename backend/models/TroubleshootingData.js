"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TroubleshootingData = /** @class */ (function () {
    function TroubleshootingData(title, description, solution) {
        this.title = title;
        this.description = description;
        this.solution = solution;
        this.types = [];
        this.tags = [];
        this.whitelistedRooms = [];
        this.blacklistedRooms = [];
    }
    TroubleshootingData.prototype.setTypes = function (types) {
        this.types = types;
    };
    TroubleshootingData.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    TroubleshootingData.prototype.addWhitelistedRoom = function (room) {
        this.whitelistedRooms.push(room.getSimplified());
    };
    TroubleshootingData.prototype.addBlacklistedRoom = function (room) {
        this.blacklistedRooms.push(room.getSimplified());
    };
    TroubleshootingData.prototype.getTitle = function () {
        return this.title;
    };
    TroubleshootingData.prototype.getDescription = function () {
        return this.description;
    };
    TroubleshootingData.prototype.getSolution = function () {
        return this.solution;
    };
    TroubleshootingData.prototype.getTypes = function () {
        return this.types;
    };
    TroubleshootingData.prototype.getTags = function () {
        return this.tags;
    };
    TroubleshootingData.prototype.getWhitelistedRooms = function () {
        return this.whitelistedRooms;
    };
    TroubleshootingData.prototype.isRoomWhitelisted = function (buildingName, roomNumber) {
        for (var _i = 0, _a = this.whitelistedRooms; _i < _a.length; _i++) {
            var room = _a[_i];
            if (room.getBuildingName() === buildingName && room.getRoomNumber() === roomNumber)
                return true;
        }
        return false;
    };
    TroubleshootingData.prototype.getBlacklistedRooms = function () {
        return this.blacklistedRooms;
    };
    TroubleshootingData.prototype.isRoomBlacklisted = function (buildingName, roomNumber) {
        for (var _i = 0, _a = this.blacklistedRooms; _i < _a.length; _i++) {
            var room = _a[_i];
            if (room.getBuildingName() === buildingName && room.getRoomNumber() === roomNumber)
                return true;
        }
        return false;
    };
    return TroubleshootingData;
}());
exports.TroubleshootingData = TroubleshootingData;
