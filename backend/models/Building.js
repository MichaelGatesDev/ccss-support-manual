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
    function Building(officialName, nicknames, internalName) {
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
    return Building;
}());
exports.Building = Building;
__export(require("./Building"));
