"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TroubleshootingDataManager = /** @class */ (function () {
    function TroubleshootingDataManager(roomManager) {
        this.roomManager = roomManager;
        this.troubleshootingData = [];
    }
    TroubleshootingDataManager.prototype.addTroubleshootingData = function (data) {
        this.troubleshootingData.push(data);
    };
    TroubleshootingDataManager.prototype.removeTroubleshootingData = function (data) {
        //TODO remove
    };
    TroubleshootingDataManager.prototype.getTroubleshootingData = function () {
        return this.troubleshootingData;
    };
    TroubleshootingDataManager.prototype.getTroubleshootingDataForRoom = function (roomID) {
        var results = [];
        var room = this.roomManager.getRoomByID(roomID);
        if (!room)
            return results; // no room with that ID found
        for (var _i = 0, _a = this.getTroubleshootingData(); _i < _a.length; _i++) {
            var td = _a[_i];
            // trouble data doesn't apply for this room
            if (td.getBlacklistedRoomIDs().includes(roomID))
                continue;
            //TODO DON'T HARDCODE THSE IF POSSIBLE
            // whitelisted room
            if (td.getWhitelistedRoomIDs().length > 0) {
                if (!td.getWhitelistedRoomIDs().includes(roomID))
                    continue;
                results.push(td);
            }
            // audio
            if (room.getAudio()) {
                if (td.getTypes().includes('audio')) {
                    results.push(td);
                }
            }
            // projector
            if (room.getProjector()) {
                if (td.getTypes().includes('projector')) {
                    results.push(td);
                }
            }
            // computer
            if (room.getTeachingStationComputer()) {
                if (td.getTypes().includes('computer')) {
                    results.push(td);
                }
            }
            // dvd player
            if (room.getDVDPlayer()) {
                if (td.getTypes().includes('dvd')) {
                    results.push(td);
                }
            }
            // printer
            if (room.getPrinter()) {
                if (td.getTypes().includes('printer')) {
                    results.push(td);
                }
            }
            // if there are no types, it is general
            if (td.getTypes().length === 0)
                results.push(td);
        }
        return results;
    };
    return TroubleshootingDataManager;
}());
exports.TroubleshootingDataManager = TroubleshootingDataManager;
