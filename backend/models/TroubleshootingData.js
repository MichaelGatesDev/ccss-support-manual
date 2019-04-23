"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TroubleshootingData = /** @class */ (function () {
    function TroubleshootingData(title, description, solution) {
        this.title = title;
        this.description = description;
        this.solution = solution;
        this.types = [];
        this.tags = [];
        this.whitelistedRoomIDs = [];
        this.blacklistedRoomIDs = [];
    }
    TroubleshootingData.prototype.setTypes = function (types) {
        this.types = types;
    };
    TroubleshootingData.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    TroubleshootingData.prototype.addWhitelistedRoom = function (room) {
        this.whitelistedRoomIDs.push(room.getID());
    };
    TroubleshootingData.prototype.addBlacklistedRoom = function (room) {
        this.blacklistedRoomIDs.push(room.getID());
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
    TroubleshootingData.prototype.getWhitelistedRoomIDs = function () {
        return this.whitelistedRoomIDs;
    };
    TroubleshootingData.prototype.getBlacklistedRoomIDs = function () {
        return this.blacklistedRoomIDs;
    };
    return TroubleshootingData;
}());
exports.TroubleshootingData = TroubleshootingData;
