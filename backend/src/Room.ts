import { Building } from './Building';
import { app } from '../src/App';

/**
 * A room within a building
 */
export class Room {

    /**
     * The actual Building object which this room is contained within
     */
    private buildingName: string;

    /**
     * The last time that the room was checked or information was updated.
     */
    private lastChecked !: string;

    /**
     * The room number or unique identifier (e.g. 103F)
     */
    private number: string;

    /**
     * The room name. May also be a nickname or brief descriptive name.
     */
    private name !: string;

    /**
     * The type of room
     */
    private type: string;

    /**
     * The type of lock which must be unlocked to enter the room
     */
    private lockType !: string;

    /**
     * The capacity or 'max number of people allowed' in the room or -1 if N/A
     */
    private capacity !: number;

    // /**
    //  * The furniture within the room (tables, chairs, etc.)
    //  */
    // private furniture !: FurnitureSetup;

    /**
     * The phone in the room
     */
    private phone !: Phone;

    /**
     * The projector
     */
    private projector!: Projector;

    /**
     * The audio
     */
    private audio !: Audio;

    /**
     * The screen
     */
    private screen !: Screen;

    //TODO add generic video output
    // private television: Television;

    /**
     * The teaching station computer
     */
    private teachingStationComputer !: Computer;

    /**
     * The document camera
     */
    private documentCamera !: DocumentCamera;

    /**
     * The DVD Player
     */
    private dvdPlayer !: DVDPlayer;

    /**
     * The Printer
     */
    private printer !: Printer;

    /**
     * @param building The Building object which is the parent of the room
     * @param number The building-unique number which represents the room
     * @param type The type of room
     */
    constructor(buildingName: string, number: string, type: string) {
        this.buildingName = buildingName;
        this.number = number;
        this.type = type;
    }

    public getSimplified(): SimpleRoom {
        return new SimpleRoom(this.buildingName, this.number);
    }

    public getBuilding(): Building | undefined {
        return app.getDataManager().getBuildingManager().getBuildingByName(this.buildingName);
    }

    public getDisplayName(): string {
        return this.getBuilding()!.getOfficialName() + " " + this.number.toLocaleUpperCase();
    }

    public setLastChecked(timestamp: string) {
        this.lastChecked = timestamp;
    }


    public getLastChecked(): string {
        return this.lastChecked;
    }


    public getNumber(): string {
        return this.number;
    }


    public setName(name: string) {
        this.name = name;
    }


    public getName(): string {
        return this.name;
    }


    public getType(): string {
        return this.type;
    }


    public setLockType(lockType: string) {
        this.lockType = lockType;
    }

    public getLockType(): string {
        return this.lockType;
    }

    /**
     * Sets the max number of people allowed in the room or -1 if N/A
     * @param num The number of people allowed or -1 if none
     */
    public setCapacity(num: number) {
        this.capacity = num;
    }

    /**
     * Gets the max number of people allowed in the room or -1 if N/A
     */
    public getCapacity() {
        return this.capacity;
    }

    // /**
    //  * Sets the furniture within the room (tables, chairs, etc.)
    //  * @param setup The furniture setup
    //  */
    // public setFurnitureSetup(setup: FurnitureSetup) { this.furniture = setup; }

    // /**
    //  * Gets the furniture within the room (tables, chairs, etc.)
    //  */
    // public getFurnitureSetup() { return this.furniture; }


    public getPhone() {
        return this.phone;
    }

    public setPhone(extension: string, display: string, speaker: string) {
        this.phone = new Phone(extension, display, speaker);
    }


    public getProjector() {
        return this.projector;
    }

    public setProjector() {
        //TODO
    }


    public getAudio() {
        return this.audio;
    }

    public setAudio(audio: Audio) {
        this.audio = audio;
    }


    public getScreen() {
        return this.screen;
    }

    public setScreen() {
        //TODO
    }


    public getTeachingStationComputer() {
        return this.teachingStationComputer;
    }

    public setTeachingStationComputer(computer: Computer) {
        this.teachingStationComputer = computer;
    }


    public getDocumentCamera() {
        return this.documentCamera;
    }

    public setDocumentCamera(docCam: DocumentCamera) {
        this.documentCamera = docCam;
    }


    public getDVDPlayer() {
        return this.dvdPlayer;
    }

    public setDVDPlayer(dvdPlayer: DVDPlayer) {
        this.dvdPlayer = dvdPlayer;
    }


    public getPrinter() {
        return this.printer;
    }

    public setPrinter(printer: Printer) {
        this.printer = printer;
    }
}

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
class Projector { }

/**
 * 
 */
export class Audio {

    private systemDependent: boolean;

    constructor(systemDependent: boolean) {
        this.systemDependent = systemDependent;
    }

    public setSystemDependent(requires: boolean) {
        this.systemDependent = requires;
    }

    public isSystemDependent() {
        return this.systemDependent;
    }
}

/**
 * A screen which is used as a clear, blank, white projection surface
 */
class Screen {
    //TODO condition
}

/**
 * A Computer
 */
export class Computer {

    /**
     *  The physical structure of a computer
     */
    private type: string;

    /**
     * The operating system run by the computer
     */
    private operatingSystem: string;

    /**
     * @param type The physical structure of a computer 
     * @param operatingSystem The operating system run by the computer
     */
    constructor(type: string, operatingSystem: string) {
        this.type = type;
        this.operatingSystem = operatingSystem;
    }

    /**
     * Gets the type of computer 
     */
    public getType() { return this.type; }

    /**
     * Gets the type of operating system which the computer runs
     */
    public getOperatingSystem() { return this.operatingSystem; }
}

/**
 * A Document Camera
 */
class DocumentCamera {

}


/**
 * A DVD Player
 */
class DVDPlayer {

    /**
     * The type of player (pc, player, etc.)
     */
    private type: string;

    /**
     * @param type The type of player (pc, player, etc.)
     */
    constructor(type: string) {
        this.type = type;
    }

    /**
     * Gets the type of DVD player
     */
    public getType() { return this.type; }
}

/**
 * A printer
 */
class Printer {

    /**
     * The identifying Symquest number if there is one
     */
    private symquestNumber: string;

    /**
     * The type of (toner) cartridge used
     */
    private cartridgeType: string;

    /**
     * @param symquestNumber The identifying Symquest number if there is one
     * @param cartridgeType The type of (toner) cartridge used
     */
    constructor(symquestNumber: string, cartridgeType: string) {
        this.symquestNumber = symquestNumber;
        this.cartridgeType = cartridgeType;
    }

    /**
     * Gets the identifying Symquest number
     */
    public getSymquestNumber() { return this.symquestNumber; }

    /**
     * Gets the toner cartridge type
     */
    public getCatridgeType() { return this.cartridgeType; }
}

/**
 * A Phone (like cellphone but older)
 */
class Phone {

    /**
     * The last 4 digits of the phone number
     */
    private extension: string;

    /**
     * If the phone has a display
     */
    private containsDisplay: boolean;

    /**
     * If the phone has a speaker
     */
    private containsSpeaker: boolean;

    /**
     * @param extension The last 4 digits of the phone number
     * @param containsDisplay If the phone has a display
     * @param containsSpeaker If the phone has a speaker
     */
    constructor(extension: string, displayStatus: string, speakerStatus: string) {
        this.extension = extension;
        this.containsDisplay = displayStatus !== 'N/A';
        this.containsSpeaker = speakerStatus !== 'N/A';
    }

    /**
     * Gets the phone extension
     */
    public getExtension() { return this.extension; }

    /**
     * Returns true if the phone has a display
     */
    public hasDisplay() { return this.containsDisplay; }

    /**
     * Returns true if the phone has a speaker
     */
    public hasSpeaker() { return this.containsSpeaker; }
}

/**
 * Represents a very simplified room structure
 */
export class SimpleRoom {
    private buildingName: string;
    private roomNumber: string;

    constructor(buildingName: string, roomNumber: string) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }

    public getBuildingName() {
        return this.buildingName;
    }

    public getRoomNumber() {
        return this.roomNumber;
    }
}