import { Room } from './Room';

/**
 * Represents a building which contains rooms 
 */
export class Building {

    /**
     * Official Name of the building. (e.g. "Myers Fine Arts Building")
     */
    private officialName: string;

    /**
     * Nicknames/abbreviations that a building may have.
     */
    private nicknames: string[];

    /**
     * Internal Name which used used by the program to identify the building.
     */
    private internalName: string;

    /**
     * An array of Room objects representing the rooms in the building
     */
    private rooms: Room[];

    /**
     * 
     * @param officialName Official Name of the building. (e.g. "Myers Fine Arts Building")
     * @param nicknames Nicknames/abbreviations that a building may have.
     * @param internalName Internal Name which used used by the program to identify the building.
     */
    constructor(officialName: string, nicknames: string[]) {
        this.officialName = officialName;
        this.nicknames = nicknames;
        this.internalName = this.createInternalName();
        this.rooms = new Array<Room>();
    }

    /**
     * Creates the internal name from the official name
     */
    private createInternalName() {
        return this.officialName.toLowerCase().replace(/\s/g, "-");
    }

    /**
     * Gets the official name of the building
     */
    public getOfficialName() {
        return this.officialName;
    }

    /**
     * Gets the nicknames/abbreviations of the building
     */
    public getNicknames() {
        return this.nicknames;
    }

    /**
     * Gets the internal name of the building
     */
    public getInternalName() {
        return this.internalName;
    }

    /**
     * Adds a room to the building
     * 
     * @param room Room to add
     */
    public addRoom(room: Room): boolean {
        if (!this.rooms.includes(room)) {
            this.rooms.push(room);
            return true;
        }
        return false;
    }

    /**
     * Removes a room from the building
     * 
     * @param room Room to remove
     */
    public removeRoom(room: Room) {
        const index = this.rooms.indexOf(room, 0);
        if (index > -1) {
            this.rooms.splice(index, 1);
        }
    }

    /**
     * Gets all rooms in the building
     */
    public getRooms() {
        return this.rooms;
    }

    /**
     * Gets a room within the building with the specified number
     * @param number The room number
     */
    public getRoom(number: string) {
        for (const room of this.getRooms()) {
            if (room.getNumber() === number)
                return room;
        }
        return null;
    }

    /**
     * Checks if the building has the specified name
     * 
     * @param name The name (or partial word) to check for
     */
    public hasName(name: string) {
        if (this.internalName.toLowerCase().includes(name.toLowerCase())) return true;
        if (this.officialName.toLowerCase().includes(name.toLowerCase())) return true;
        for (const nick of this.nicknames) { if (nick.toLowerCase().includes(name.toLowerCase())) return true; }
        return false;
    }
}