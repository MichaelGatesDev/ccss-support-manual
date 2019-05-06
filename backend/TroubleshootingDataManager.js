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
    TroubleshootingDataManager.prototype.getTroubleshootingDataForRoom = function (buildingName, roomNumber) {
        var results = [];
        var room = this.roomManager.getRoom(buildingName, roomNumber);
        if (!room)
            return results; // no room with that ID found
        for (var _i = 0, _a = this.getTroubleshootingData(); _i < _a.length; _i++) {
            var td = _a[_i];
            // trouble data doesn't apply for this room
            if (td.isRoomBlacklisted(buildingName, roomNumber))
                continue;
            //TODO DON'T HARDCODE THSE IF POSSIBLE
            // whitelisted room
            if (td.isRoomWhitelisted(buildingName, roomNumber)) {
                results.push(td);
                continue;
            }
            // audio
            if (room.getAudio()) {
                if (td.getTypes().includes('audio')) {
                    results.push(td);
                    continue;
                }
            }
            // projector
            if (room.getProjector()) {
                if (td.getTypes().includes('projector')) {
                    results.push(td);
                    continue;
                }
            }
            // computer
            if (room.getTeachingStationComputer()) {
                if (td.getTypes().includes('computer')) {
                    results.push(td);
                    continue;
                }
            }
            // dvd player
            if (room.getDVDPlayer()) {
                if (td.getTypes().includes('dvd')) {
                    results.push(td);
                    continue;
                }
            }
            // printer
            if (room.getPrinter()) {
                if (td.getTypes().includes('printer')) {
                    results.push(td);
                    continue;
                }
            }
            // if there are no types, it is general
            if (td.getTypes().length === 0) {
                results.push(td);
                continue;
            }
        }
        return results;
    };
    return TroubleshootingDataManager;
}());
exports.TroubleshootingDataManager = TroubleshootingDataManager;
