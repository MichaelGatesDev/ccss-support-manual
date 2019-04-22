"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A utility class for managing rooms
 */
var RoomManager = /** @class */ (function () {
    function RoomManager(buildingManager) {
        this.buildingManager = buildingManager;
    }
    /**
     * Gets every room across all buildings
     */
    RoomManager.prototype.getRooms = function () {
        var result = [];
        for (var _i = 0, _a = this.buildingManager.getBuildings(); _i < _a.length; _i++) {
            var building = _a[_i];
            result = result.concat(building.getRooms());
        }
        return result;
    };
    /**
     * Gets a room by the building name and room number
     *
     * @param buildingName The name of the building
     * @param roomNumber The room number
     */
    RoomManager.prototype.getRoomByBuildingNameAndNumber = function (buildingName, roomNumber) {
        for (var _i = 0, _a = this.getRooms(); _i < _a.length; _i++) {
            var room = _a[_i];
            if (room.getBuilding().hasName(buildingName) &&
                room.getNumber() === roomNumber.toLowerCase().trim())
                return room;
        }
        return null;
    };
    return RoomManager;
}());
exports.RoomManager = RoomManager;
