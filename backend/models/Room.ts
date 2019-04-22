import { Building } from './Building';

/**
 * A room within a building
 */
class Room {

    /**
     * The actual Building object which this room is contained within
     */
    private building: Building;

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
    private type: RoomType;

    /**
     * The type of lock which must be unlocked to enter the room
     */
    private lockType !: LockType;

    /**
     * The capacity or 'max number of people allowed' in the room or -1 if N/A
     */
    private capacity !: number;

    /**
     * The furniture within the room (tables, chairs, etc.)
     */
    private furniture !: FurnitureSetup;

    /**
     * The phone in the room
     */
    private phone !: Phone;

    /**
     * If the audio system requires the control panel to be on
     */
    private audioRequiresProjector !: boolean;

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
    constructor(building: Building, number: string, type: RoomType) {
        this.building = building;
        this.number = number;
        this.type = type;
    }

    /**
     * Gets the parent building
     */
    public getBuilding() { return this.building; }

    /**
     * Sets the timestamp when the room was last checked/updated
     */
    public setLastChecked(timestamp: string) {
        this.lastChecked = timestamp;
    }

    /**
     * Gets the last time that the room was checked or information was updated.
     */
    public getLastChecked() { return this.lastChecked; }

    /**
     * Gets the room number or unique identifier (e.g. 103F)
     */
    public getNumber() { return this.number; }

    /**
     * Sets the room name
     */
    public setName(name: string) { this.name = name; }

    /**
     * Gets the room name
     */
    public getName() { return this.name; }

    /**
     * Gets the type of room
     */
    public getType() { return this.type; }

    /**
     * Sets the type of lock which must be unlocked to enter the room
     * @param lockType The type of lock
     */
    public setLockType(lockType: LockType) { this.lockType = lockType; }

    /**
     * Gets the type of lock which must be unlocked to enter the room
     */
    public getLockType() { return this.lockType; }

    /**
     * Sets the max number of people allowed in the room or -1 if N/A
     * @param num The number of people allowed or -1 if none
     */
    public setCapacity(num: number) { this.capacity = num; }

    /**
     * Gets the max number of people allowed in the room or -1 if N/A
     */
    public getCapacity() { return this.capacity; }

    /**
     * Sets the furniture within the room (tables, chairs, etc.)
     * @param setup The furniture setup
     */
    public setFurnitureSetup(setup: FurnitureSetup) { this.furniture = setup; }

    /**
     * Gets the furniture within the room (tables, chairs, etc.)
     */
    public getFurnitureSetup() { return this.furniture; }


}

/**
 * A type of room
 */
enum RoomType {
    /**
     * Standard classroom
     */
    Classroom = "classroom",
    /**
     * A classroom which has computers (may be called a computer lab)
     */
    ComputerClassroom = "computer classroom",
    /**
     * A room which is used for conferences and includes conference technology (cameras, etc.)
     */
    ConferenceRoom = "conference room",
    /**
     * A room which is used for meetings
     */
    MeetingRoom = "meeting room",
    /**
     * A classroom which is a lecture hall
     */
    LectureHall = "lecture hall",
    /**
     * A room which is not used for standard instruction but can be used by students working on projects or relaxing
     */
    ProjectRoom = "project room",
    /**
     * A specific room used for seminars
     */
    SeminarRoom = "seminar room",
    /**
     * A classroom which contains SMART (board, etc.) equipment
     */
    SmartClassroom = "smart classroom"
}

/**
 * The type of lock which allows entry to a room
 */
enum LockType {
    /**
     * No lock (this is rare)
     */
    None,
    /**
     * A lock in which the correct key must be inserted into a keyhole to unlock
     */
    Key,
    /**
     * A lock in which a programmed card can be swiped to unlock
     */
    Swipe,
    /**
     * A lock in which a programmed card can be tapped or placed in proximity to unlock
     */
    Electronic,
    /**
     * A lock in which a button sequence must be pressed in a specific order to unlock
     */
    Button
}

/**
 * The type of furniture layout
 */
enum FurnitureLayoutType {
    /**
     * Lecture Hall
     */
    LectureHall,
    /**
     * Chair & Table
     */
    ChairTable,
    /**
     * Chair/Desk combo
     */
    ChairDeskCombo,
    /**
     * Chair & Desk
     */
    ChairDesk,
    /**
     * Stool
     */
    Stools,
    /**
     * Other type of furniture layout
     */
    Other,
    /**
     * No furniture layout or unknown
     */
    None
}

/**
 * A type of furniture item (can be almost anything)
 */
enum FurnitureItem {
    /**
     * A stool
     */
    Stool,
    /**
     * A chair (stools don't count)
     */
    Chair,
    /**
     * A couch
     */
    Couch,
    /**
     * A desk
     */
    Desk,
    /**
     * A chair/desk which are connected
     */
    ChairDesk,
    /**
     * A table
     */
    Table,
    /**
     * Some other tpe of furniture item
     */
    Other
}

/**
 * The furniture setup for the room (type, amounts, etc.)
 */
class FurnitureSetup {

    /**
     * The actual items (chairs, tables, etc.) and their counts
     */
    private items: Map<FurnitureItem, number>;

    /**
     * The type of furniture present in a room
     */
    private type: FurnitureLayoutType;

    /**
     * @param type The type of furniture present in a room
     */
    constructor(type: FurnitureLayoutType) {
        this.type = type;
        this.items = new Map<FurnitureItem, number>();
    }

    /**
     * Sets the furniture type and counts
     * @param item The item to add
     * @param amt The amount of the item to add
     */
    public setItems(item: FurnitureItem, amt: number) {
        this.items.set(item, amt);
    }

    /**
     * Gets the total number of a specific item present
     * @param item the item to fetch the count of
     */
    public getItemCount(item: FurnitureItem) {
        return this.items.has(item) ? this.items.get(item) : -1;
    }

    /**
     * Sets the type of furniture present
     */
    public setFurnitureType(type: FurnitureLayoutType) { return this.type }

    /**
     * Gets the type of furniture present
     */
    public getFurnitureType() { return this.type; }
}

/**
 * 
 */
class Projector { }

/**
 * 
 */
class Audio {
    //TODO requires system to be on 
}

/**
 * A screen which is used as a clear, blank, white projection surface
 */
class Screen {
    //TODO condition
}

/**
 * The physical structure or type of a Computer
 */
enum ComputerType {
    /**
     * A tower (also known as a desktop)
     */
    Tower,
    /**
     * A computer which is modular and self-contained. The screen is connected to the internals to be one block
     */
    AllInOne,
    /**
     * A computer which is very small and portable with weaker hardware. Typically used for meeting rooms.
     */
    Mini,
    /**
     * A computer whose purpose is to run as a server
     */
    Server,
    /**
     * Another type of computer
     */
    Other
}

/**
 * The operating system that a computer runs
 */
enum OperatingSystem {
    /**
     * OSX is the operating system used by Macintosh (Mac) computers.
     */
    OSX,
    /**
     * Linux is a very broad way of naming various Linux distributions (e.g. Mint, Ubuntu)
     */
    Linux,
    /**
     * Microsoft Windows 7
     */
    Windows7,
    /**
     * Microsoft Windows 10
     */
    Windows10,
    /**
     * Some other type of operating system
     */
    Other
}

/**
 * A Computer
 */
class Computer {

    /**
     *  The physical structure of a computer
     */
    private type: ComputerType;

    /**
     * The operating system run by the computer
     */
    private operatingSystem: OperatingSystem;

    /**
     * @param type The physical structure of a computer 
     * @param operatingSystem The operating system run by the computer
     */
    constructor(type: ComputerType, operatingSystem: OperatingSystem) {
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
class DocumentCamera { }

/**
 * Type of DVD Player
 */
enum DVDPlayerType {
    /**
     * DVD played through computer
     */
    Computer,
    /**
     * Standard DVD player
     */
    DVD,
    /**
     * DVD/VCR Combo
     */
    DVD_VCR,
    /**
     * DVD/BLURAY Combo
     */
    DVD_BLURAY,
    /**
     * DVD/VCR/BLURAY Combo
     */
    DVD_VCR_BLURAY,
}

/**
 * A DVD Player
 */
class DVDPlayer {

    /**
     * The type of player (pc, player, etc.)
     */
    private type: DVDPlayerType;

    /**
     * @param type The type of player (pc, player, etc.)
     */
    constructor(type: DVDPlayerType) {
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
     * If the display on the phone is legible
     */
    private displayLegible: boolean;

    /**
     * If the speaker phone function works
     */
    private speakerWorks: boolean;

    /**
     * @param extension The last 4 digits of the phone number
     * @param containsDisplay If the phone has a display
     * @param displayLegible If the display on the phone is legible
     * @param speakerWorks If the speaker phone function works
     */
    constructor(extension: string, containsDisplay: boolean, displayLegible: boolean, speakerWorks: boolean) {
        this.extension = extension;
        this.containsDisplay = containsDisplay;
        this.displayLegible = displayLegible;
        this.speakerWorks = speakerWorks;
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
     * Returns true if the display is legible 
     */
    public isDisplayLegible() { return this.displayLegible; }

    /**
     * Returns true if the speaker (speakerphone) works
     */
    public doesSpeakerWork() { return this.speakerWorks; }
}

export {
    Room,
    RoomType,
    LockType,
    FurnitureLayoutType,
    FurnitureItem,
    FurnitureSetup,
    Projector,
    Audio,
    Screen,
    ComputerType,
    OperatingSystem,
    Computer,
    DocumentCamera,
    DVDPlayerType,
    DVDPlayer,
    Printer,
    Phone,
}


