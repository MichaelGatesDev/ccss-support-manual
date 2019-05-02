"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("../App");
/**
 * A room within a building
 */
var Room = /** @class */ (function () {
    /**
     * @param building The Building object which is the parent of the room
     * @param number The building-unique number which represents the room
     * @param type The type of room
     */
    function Room(buildingName, number, type) {
        this.buildingName = buildingName;
        this.number = number;
        this.type = type;
    }
    Room.prototype.getSimplified = function () {
        return new SimpleRoom(this.buildingName, this.number);
    };
    Room.prototype.getBuilding = function () {
        return App_1.app.getDataManager().getBuildingManager().getBuildingByName(this.buildingName);
    };
    Room.prototype.getDisplayName = function () {
        return this.getBuilding().getOfficialName() + " " + this.number.toLocaleUpperCase();
    };
    Room.prototype.setLastChecked = function (timestamp) {
        this.lastChecked = timestamp;
    };
    Room.prototype.getLastChecked = function () {
        return this.lastChecked;
    };
    Room.prototype.getNumber = function () {
        return this.number;
    };
    Room.prototype.setName = function (name) {
        this.name = name;
    };
    Room.prototype.getName = function () {
        return this.name;
    };
    Room.prototype.getType = function () {
        return this.type;
    };
    Room.prototype.setLockType = function (lockType) {
        this.lockType = lockType;
    };
    Room.prototype.getLockType = function () {
        return this.lockType;
    };
    /**
     * Sets the max number of people allowed in the room or -1 if N/A
     * @param num The number of people allowed or -1 if none
     */
    Room.prototype.setCapacity = function (num) {
        this.capacity = num;
    };
    /**
     * Gets the max number of people allowed in the room or -1 if N/A
     */
    Room.prototype.getCapacity = function () {
        return this.capacity;
    };
    // /**
    //  * Sets the furniture within the room (tables, chairs, etc.)
    //  * @param setup The furniture setup
    //  */
    // public setFurnitureSetup(setup: FurnitureSetup) { this.furniture = setup; }
    // /**
    //  * Gets the furniture within the room (tables, chairs, etc.)
    //  */
    // public getFurnitureSetup() { return this.furniture; }
    Room.prototype.getPhone = function () {
        return this.phone;
    };
    Room.prototype.setPhone = function (extension, display, speaker) {
        this.phone = new Phone(extension, display, speaker);
    };
    Room.prototype.getProjector = function () {
        return this.projector;
    };
    Room.prototype.setProjector = function () {
        //TODO
    };
    Room.prototype.getAudio = function () {
        return this.audio;
    };
    Room.prototype.setAudio = function (audio) {
        this.audio = audio;
    };
    Room.prototype.getScreen = function () {
        return this.screen;
    };
    Room.prototype.setScreen = function () {
        //TODO
    };
    Room.prototype.getTeachingStationComputer = function () {
        return this.teachingStationComputer;
    };
    Room.prototype.setTeachingStationComputer = function (computer) {
        this.teachingStationComputer = computer;
    };
    Room.prototype.getDocumentCamera = function () {
        return this.documentCamera;
    };
    Room.prototype.setDocumentCamera = function (docCam) {
        this.documentCamera = docCam;
    };
    Room.prototype.getDVDPlayer = function () {
        return this.dvdPlayer;
    };
    Room.prototype.setDVDPlayer = function (dvdPlayer) {
        this.dvdPlayer = dvdPlayer;
    };
    Room.prototype.getPrinter = function () {
        return this.printer;
    };
    Room.prototype.setPrinter = function (printer) {
        this.printer = printer;
    };
    return Room;
}());
exports.Room = Room;
// /**
//  * The furniture setup for the room (type, amounts, etc.)
//  */
// class FurnitureSetup {
//     /**
//      * The actual items (chairs, tables, etc.) and their counts
//      */
//     private items: Map<FurnitureItem, number>;
//     /**
//      * The type of furniture present in a room
//      */
//     private type: FurnitureLayoutType;
//     /**
//      * @param type The type of furniture present in a room
//      */
//     constructor(type: FurnitureLayoutType) {
//         this.type = type;
//         this.items = new Map<FurnitureItem, number>();
//     }
//     /**
//      * Sets the furniture type and counts
//      * @param item The item to add
//      * @param amt The amount of the item to add
//      */
//     public setItems(item: FurnitureItem, amt: number) {
//         this.items.set(item, amt);
//     }
//     /**
//      * Gets the total number of a specific item present
//      * @param item the item to fetch the count of
//      */
//     public getItemCount(item: FurnitureItem) {
//         return this.items.has(item) ? this.items.get(item) : -1;
//     }
//     /**
//      * Sets the type of furniture present
//      */
//     public setFurnitureType(type: FurnitureLayoutType) { return this.type }
//     /**
//      * Gets the type of furniture present
//      */
//     public getFurnitureType() { return this.type; }
// }
/**
 *
 */
var Projector = /** @class */ (function () {
    function Projector() {
    }
    return Projector;
}());
/**
 *
 */
var Audio = /** @class */ (function () {
    function Audio(systemDependent) {
        this.systemDependent = systemDependent;
    }
    Audio.prototype.setSystemDependent = function (requires) {
        this.systemDependent = requires;
    };
    Audio.prototype.isSystemDependent = function () {
        return this.systemDependent;
    };
    return Audio;
}());
exports.Audio = Audio;
/**
 * A screen which is used as a clear, blank, white projection surface
 */
var Screen = /** @class */ (function () {
    function Screen() {
    }
    return Screen;
}());
/**
 * A Computer
 */
var Computer = /** @class */ (function () {
    /**
     * @param type The physical structure of a computer
     * @param operatingSystem The operating system run by the computer
     */
    function Computer(type, operatingSystem) {
        this.type = type;
        this.operatingSystem = operatingSystem;
    }
    /**
     * Gets the type of computer
     */
    Computer.prototype.getType = function () { return this.type; };
    /**
     * Gets the type of operating system which the computer runs
     */
    Computer.prototype.getOperatingSystem = function () { return this.operatingSystem; };
    return Computer;
}());
exports.Computer = Computer;
/**
 * A Document Camera
 */
var DocumentCamera = /** @class */ (function () {
    function DocumentCamera() {
    }
    return DocumentCamera;
}());
/**
 * A DVD Player
 */
var DVDPlayer = /** @class */ (function () {
    /**
     * @param type The type of player (pc, player, etc.)
     */
    function DVDPlayer(type) {
        this.type = type;
    }
    /**
     * Gets the type of DVD player
     */
    DVDPlayer.prototype.getType = function () { return this.type; };
    return DVDPlayer;
}());
/**
 * A printer
 */
var Printer = /** @class */ (function () {
    /**
     * @param symquestNumber The identifying Symquest number if there is one
     * @param cartridgeType The type of (toner) cartridge used
     */
    function Printer(symquestNumber, cartridgeType) {
        this.symquestNumber = symquestNumber;
        this.cartridgeType = cartridgeType;
    }
    /**
     * Gets the identifying Symquest number
     */
    Printer.prototype.getSymquestNumber = function () { return this.symquestNumber; };
    /**
     * Gets the toner cartridge type
     */
    Printer.prototype.getCatridgeType = function () { return this.cartridgeType; };
    return Printer;
}());
/**
 * A Phone (like cellphone but older)
 */
var Phone = /** @class */ (function () {
    /**
     * @param extension The last 4 digits of the phone number
     * @param containsDisplay If the phone has a display
     * @param containsSpeaker If the phone has a speaker
     */
    function Phone(extension, displayStatus, speakerStatus) {
        this.extension = extension;
        this.containsDisplay = displayStatus !== 'N/A';
        this.containsSpeaker = speakerStatus !== 'N/A';
    }
    /**
     * Gets the phone extension
     */
    Phone.prototype.getExtension = function () { return this.extension; };
    /**
     * Returns true if the phone has a display
     */
    Phone.prototype.hasDisplay = function () { return this.containsDisplay; };
    /**
     * Returns true if the phone has a speaker
     */
    Phone.prototype.hasSpeaker = function () { return this.containsSpeaker; };
    return Phone;
}());
/**
 * Represents a very simplified room structure
 */
var SimpleRoom = /** @class */ (function () {
    function SimpleRoom(buildingName, roomNumber) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }
    SimpleRoom.prototype.getBuildingName = function () {
        return this.buildingName;
    };
    SimpleRoom.prototype.getRoomNumber = function () {
        return this.roomNumber;
    };
    return SimpleRoom;
}());
exports.SimpleRoom = SimpleRoom;
