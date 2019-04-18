"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A room within a building
 */
var Room = /** @class */ (function () {
    /**
     * @param building The Building object which is the parent of the room
     * @param number The building-unique number which represents the room
     * @param type The type of room
     */
    function Room(building, number, type) {
        this.building = building;
        this.number = number;
        this.type = type;
    }
    /**
     * Gets the parent building
     */
    Room.prototype.getBuilding = function () { return this.building; };
    /**
     * Sets the timestamp when the room was last checked/updated
     */
    Room.prototype.setLastChecked = function (timestamp) {
        this.lastChecked = timestamp;
    };
    /**
     * Gets the last time that the room was checked or information was updated.
     */
    Room.prototype.getLastChecked = function () { return this.lastChecked; };
    /**
     * Gets the room number or unique identifier (e.g. 103F)
     */
    Room.prototype.getNumber = function () { return this.number; };
    /**
     * Sets the room name
     */
    Room.prototype.setName = function (name) { this.name = name; };
    /**
     * Gets the room name
     */
    Room.prototype.getName = function () { return this.name; };
    /**
     * Gets the type of room
     */
    Room.prototype.getType = function () { return this.type; };
    /**
     * Sets the type of lock which must be unlocked to enter the room
     * @param lockType The type of lock
     */
    Room.prototype.setLockType = function (lockType) { this.lockType = lockType; };
    /**
     * Gets the type of lock which must be unlocked to enter the room
     */
    Room.prototype.getLockType = function () { return this.lockType; };
    /**
     * Sets the max number of people allowed in the room or -1 if N/A
     * @param num The number of people allowed or -1 if none
     */
    Room.prototype.setCapacity = function (num) { this.capacity = num; };
    /**
     * Gets the max number of people allowed in the room or -1 if N/A
     */
    Room.prototype.getCapacity = function () { return this.capacity; };
    /**
     * Sets the furniture within the room (tables, chairs, etc.)
     * @param setup The furniture setup
     */
    Room.prototype.setFurnitureSetup = function (setup) { this.furniture = setup; };
    /**
     * Gets the furniture within the room (tables, chairs, etc.)
     */
    Room.prototype.getFurnitureSetup = function () { return this.furniture; };
    return Room;
}());
exports.Room = Room;
/**
 * A type of room
 */
var RoomType;
(function (RoomType) {
    /**
     * Standard classroom
     */
    RoomType[RoomType["Classroom"] = 0] = "Classroom";
    /**
     * A classroom which has computers (may be called a computer lab)
     */
    RoomType[RoomType["ComputerClassroom"] = 1] = "ComputerClassroom";
    /**
     * A room which is used for conferences and includes conference technology (cameras, etc.)
     */
    RoomType[RoomType["ConferenceRoom"] = 2] = "ConferenceRoom";
    /**
     * A room which is used for meetings
     */
    RoomType[RoomType["MeetingRoom"] = 3] = "MeetingRoom";
    /**
     * A classroom which is a lecture hall
     */
    RoomType[RoomType["LectureHall"] = 4] = "LectureHall";
    /**
     * A room which is not used for standard instruction but can be used by students working on projects or relaxing
     */
    RoomType[RoomType["ProjectRoom"] = 5] = "ProjectRoom";
    /**
     * A specific room used for seminars
     */
    RoomType[RoomType["SeminarRoom"] = 6] = "SeminarRoom";
    /**
     * A classroom which contains SMART (board, etc.) equipment
     */
    RoomType[RoomType["SmartClassroom"] = 7] = "SmartClassroom";
})(RoomType || (RoomType = {}));
exports.RoomType = RoomType;
/**
 * The type of lock which allows entry to a room
 */
var LockType;
(function (LockType) {
    /**
     * No lock (this is rare)
     */
    LockType[LockType["None"] = 0] = "None";
    /**
     * A lock in which the correct key must be inserted into a keyhole to unlock
     */
    LockType[LockType["Key"] = 1] = "Key";
    /**
     * A lock in which a programmed card can be swiped to unlock
     */
    LockType[LockType["Swipe"] = 2] = "Swipe";
    /**
     * A lock in which a programmed card can be tapped or placed in proximity to unlock
     */
    LockType[LockType["Electronic"] = 3] = "Electronic";
    /**
     * A lock in which a button sequence must be pressed in a specific order to unlock
     */
    LockType[LockType["Button"] = 4] = "Button";
})(LockType || (LockType = {}));
exports.LockType = LockType;
/**
 * The type of furniture layout
 */
var FurnitureLayoutType;
(function (FurnitureLayoutType) {
    /**
     * Lecture Hall
     */
    FurnitureLayoutType[FurnitureLayoutType["LectureHall"] = 0] = "LectureHall";
    /**
     * Chair & Table
     */
    FurnitureLayoutType[FurnitureLayoutType["ChairTable"] = 1] = "ChairTable";
    /**
     * Chair/Desk combo
     */
    FurnitureLayoutType[FurnitureLayoutType["ChairDeskCombo"] = 2] = "ChairDeskCombo";
    /**
     * Chair & Desk
     */
    FurnitureLayoutType[FurnitureLayoutType["ChairDesk"] = 3] = "ChairDesk";
    /**
     * Stool
     */
    FurnitureLayoutType[FurnitureLayoutType["Stools"] = 4] = "Stools";
    /**
     * Other type of furniture layout
     */
    FurnitureLayoutType[FurnitureLayoutType["Other"] = 5] = "Other";
    /**
     * No furniture layout or unknown
     */
    FurnitureLayoutType[FurnitureLayoutType["None"] = 6] = "None";
})(FurnitureLayoutType || (FurnitureLayoutType = {}));
exports.FurnitureLayoutType = FurnitureLayoutType;
/**
 * A type of furniture item (can be almost anything)
 */
var FurnitureItem;
(function (FurnitureItem) {
    /**
     * A stool
     */
    FurnitureItem[FurnitureItem["Stool"] = 0] = "Stool";
    /**
     * A chair (stools don't count)
     */
    FurnitureItem[FurnitureItem["Chair"] = 1] = "Chair";
    /**
     * A couch
     */
    FurnitureItem[FurnitureItem["Couch"] = 2] = "Couch";
    /**
     * A desk
     */
    FurnitureItem[FurnitureItem["Desk"] = 3] = "Desk";
    /**
     * A chair/desk which are connected
     */
    FurnitureItem[FurnitureItem["ChairDesk"] = 4] = "ChairDesk";
    /**
     * A table
     */
    FurnitureItem[FurnitureItem["Table"] = 5] = "Table";
    /**
     * Some other tpe of furniture item
     */
    FurnitureItem[FurnitureItem["Other"] = 6] = "Other";
})(FurnitureItem || (FurnitureItem = {}));
exports.FurnitureItem = FurnitureItem;
/**
 * The furniture setup for the room (type, amounts, etc.)
 */
var FurnitureSetup = /** @class */ (function () {
    /**
     * @param type The type of furniture present in a room
     */
    function FurnitureSetup(type) {
        this.type = type;
        this.items = new Map();
    }
    /**
     * Sets the furniture type and counts
     * @param item The item to add
     * @param amt The amount of the item to add
     */
    FurnitureSetup.prototype.setItems = function (item, amt) {
        this.items.set(item, amt);
    };
    /**
     * Gets the total number of a specific item present
     * @param item the item to fetch the count of
     */
    FurnitureSetup.prototype.getItemCount = function (item) {
        return this.items.has(item) ? this.items.get(item) : -1;
    };
    /**
     * Sets the type of furniture present
     */
    FurnitureSetup.prototype.setFurnitureType = function (type) { return this.type; };
    /**
     * Gets the type of furniture present
     */
    FurnitureSetup.prototype.getFurnitureType = function () { return this.type; };
    return FurnitureSetup;
}());
exports.FurnitureSetup = FurnitureSetup;
/**
 *
 */
var Projector = /** @class */ (function () {
    function Projector() {
    }
    return Projector;
}());
exports.Projector = Projector;
/**
 *
 */
var Audio = /** @class */ (function () {
    function Audio() {
    }
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
exports.Screen = Screen;
/**
 * The physical structure or type of a Computer
 */
var ComputerType;
(function (ComputerType) {
    /**
     * A tower (also known as a desktop)
     */
    ComputerType[ComputerType["Tower"] = 0] = "Tower";
    /**
     * A computer which is modular and self-contained. The screen is connected to the internals to be one block
     */
    ComputerType[ComputerType["AllInOne"] = 1] = "AllInOne";
    /**
     * A computer which is very small and portable with weaker hardware. Typically used for meeting rooms.
     */
    ComputerType[ComputerType["Mini"] = 2] = "Mini";
    /**
     * A computer whose purpose is to run as a server
     */
    ComputerType[ComputerType["Server"] = 3] = "Server";
    /**
     * Another type of computer
     */
    ComputerType[ComputerType["Other"] = 4] = "Other";
})(ComputerType || (ComputerType = {}));
exports.ComputerType = ComputerType;
/**
 * The operating system that a computer runs
 */
var OperatingSystem;
(function (OperatingSystem) {
    /**
     * OSX is the operating system used by Macintosh (Mac) computers.
     */
    OperatingSystem[OperatingSystem["OSX"] = 0] = "OSX";
    /**
     * Linux is a very broad way of naming various Linux distributions (e.g. Mint, Ubuntu)
     */
    OperatingSystem[OperatingSystem["Linux"] = 1] = "Linux";
    /**
     * Microsoft Windows 7
     */
    OperatingSystem[OperatingSystem["Windows7"] = 2] = "Windows7";
    /**
     * Microsoft Windows 10
     */
    OperatingSystem[OperatingSystem["Windows10"] = 3] = "Windows10";
    /**
     * Some other type of operating system
     */
    OperatingSystem[OperatingSystem["Other"] = 4] = "Other";
})(OperatingSystem || (OperatingSystem = {}));
exports.OperatingSystem = OperatingSystem;
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
exports.DocumentCamera = DocumentCamera;
/**
 * Type of DVD Player
 */
var DVDPlayerType;
(function (DVDPlayerType) {
    /**
     * DVD played through computer
     */
    DVDPlayerType[DVDPlayerType["Computer"] = 0] = "Computer";
    /**
     * Standard DVD player
     */
    DVDPlayerType[DVDPlayerType["DVD"] = 1] = "DVD";
    /**
     * DVD/VCR Combo
     */
    DVDPlayerType[DVDPlayerType["DVD_VCR"] = 2] = "DVD_VCR";
    /**
     * DVD/BLURAY Combo
     */
    DVDPlayerType[DVDPlayerType["DVD_BLURAY"] = 3] = "DVD_BLURAY";
    /**
     * DVD/VCR/BLURAY Combo
     */
    DVDPlayerType[DVDPlayerType["DVD_VCR_BLURAY"] = 4] = "DVD_VCR_BLURAY";
})(DVDPlayerType || (DVDPlayerType = {}));
exports.DVDPlayerType = DVDPlayerType;
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
exports.DVDPlayer = DVDPlayer;
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
exports.Printer = Printer;
/**
 * A Phone (like cellphone but older)
 */
var Phone = /** @class */ (function () {
    /**
     * @param extension The last 4 digits of the phone number
     * @param containsDisplay If the phone has a display
     * @param displayLegible If the display on the phone is legible
     * @param speakerWorks If the speaker phone function works
     */
    function Phone(extension, containsDisplay, displayLegible, speakerWorks) {
        this.extension = extension;
        this.containsDisplay = containsDisplay;
        this.displayLegible = displayLegible;
        this.speakerWorks = speakerWorks;
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
     * Returns true if the display is legible
     */
    Phone.prototype.isDisplayLegible = function () { return this.displayLegible; };
    /**
     * Returns true if the speaker (speakerphone) works
     */
    Phone.prototype.doesSpeakerWork = function () { return this.speakerWorks; };
    return Phone;
}());
exports.Phone = Phone;
