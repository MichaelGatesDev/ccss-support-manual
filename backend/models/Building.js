"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a building which contains rooms
 */
var Building = /** @class */ (function () {
    /**
     *
     * @param officialName Official Name of the building. (e.g. "Myers Fine Arts Building")
     * @param nicknames Nicknames/abbreviations that a building may have.
     * @param internalName Internal Name which used used by the program to identify the building.
     */
    function Building(officialName, nicknames) {
        this.officialName = officialName;
        this.nicknames = nicknames;
        this.internalName = this.createInternalName();
        this.rooms = new Array();
    }
    /**
     * Creates the internal name from the official name
     */
    Building.prototype.createInternalName = function () {
        return this.officialName.toLowerCase().replace(/\s/g, "-");
    };
    /**
     * Gets the official name of the building
     */
    Building.prototype.getOfficialName = function () {
        return this.officialName;
    };
    /**
     * Gets the nicknames/abbreviations of the building
     */
    Building.prototype.getNicknames = function () {
        return this.nicknames;
    };
    /**
     * Gets the internal name of the building
     */
    Building.prototype.getInternalName = function () {
        return this.internalName;
    };
    /**
     * Adds a room to the building
     *
     * @param room Room to add
     */
    Building.prototype.addRoom = function (room) {
        this.rooms.push(room);
    };
    /**
     * Removes a room from the building
     *
     * @param room Room to remove
     */
    Building.prototype.removeRoom = function (room) {
        var index = this.rooms.indexOf(room, 0);
        if (index > -1) {
            this.rooms.splice(index, 1);
        }
    };
    /**
     * Gets all rooms in the building
     */
    Building.prototype.getRooms = function () {
        return this.rooms;
    };
    /**
     * Gets a room within the building with the specified number
     * @param number The room number
     */
    Building.prototype.getRoom = function (number) {
        for (var _i = 0, _a = this.getRooms(); _i < _a.length; _i++) {
            var room = _a[_i];
            if (room.getNumber() === number)
                return room;
        }
        return null;
    };
    /**
     * Checks if the building has the specified name
     *
     * @param name The name (or partial word) to check for
     */
    Building.prototype.hasName = function (name) {
        if (this.internalName.toLowerCase().includes(name.toLowerCase()))
            return true;
        if (this.officialName.toLowerCase().includes(name.toLowerCase()))
            return true;
        for (var _i = 0, _a = this.nicknames; _i < _a.length; _i++) {
            var nick = _a[_i];
            if (nick.toLowerCase().includes(name.toLowerCase()))
                return true;
        }
        return false;
    };
    return Building;
}());
exports.Building = Building;
__export(require("./Building"));
