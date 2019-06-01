/**
 * A room within a building
 */
export interface Room {

    /**
     * The actual Building object which this room is contained within
     */
    buildingName: string;

    /**
     * The last time that the room was checked or information was updated.
     */
    lastChecked: string;

    /**
     * The room number or unique identifier (e.g. 103F)
     */
    number: string;

    /**
     * The room name. May also be a nickname or brief descriptive name.
     */
    name: string;

    /**
     * The type of room
     */
    type: string;

    /**
     * The type of lock which must be unlocked to enter the room
     */
    lockType: string;

    /**
     * The capacity or 'max number of people allowed' in the room or -1 if N/A
     */
    capacity: number;

    /**
     * The phone in the room
     */
    phone: Phone;

    /**
     * The projector
     */
    projector: Projector;

    /**
     * The audio
     */
    audio: Audio;

    /**
     * The screen
     */
    screen: Screen;

    //TODO add generic video output
    //  television: Television;

    /**
     * The teaching station computer
     */
    teachingStationComputer: Computer;

    /**
     * The document camera
     */
    documentCamera: DocumentCamera;

    /**
     * The DVD Player
     */
    dvdPlayer: DVDPlayer;

    /**
     * The Printer
     */
    printer: Printer;
}

export interface Projector { }

/**
 * 
 */
export interface Audio {
    systemDependent: boolean;
}

/**
 * A screen which is used as a clear, blank, white projection surface
 */
export interface Screen {
    //TODO condition
}

/**
 * A Computer
 */
export interface Computer {
    /**
     *  The physical structure of a computer
     */
    type: string;

    /**
     * The operating system run by the computer
     */
    operatingSystem: string;
}

/**
 * A Document Camera
 */
export interface DocumentCamera {
}


/**
 * A DVD Player
 */
export interface DVDPlayer {
    /**
     * The type of player (pc, player, etc.)
     */
    type: string;
}

/**
 * A printer
 */
export interface Printer {
    /**
     * The identifying Symquest number if there is one
     */
    symquestNumber: string;

    /**
     * The type of (toner) cartridge used
     */
    cartridgeType: string;
}

/**
 * A Phone (like cellphone but older)
 */
export interface Phone {
    /**
     * The last 4 digits of the phone number
     */
    extension: string;

    /**
     * If the phone has a display
     */
    hasDisplay: boolean;

    /**
     * If the phone has a speaker
     */
    hasSpeaker: boolean;
}

/**
 * Represents a very simplified room structure
 */
export class SimpleRoom {
    buildingName: string;
    roomNumber: string;

    constructor(buildingName: string, roomNumber: string) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }
}