import { Room } from './Room';

/**
 * Represents a building which contains rooms 
 */
class Building {

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
    constructor(officialName: string, nicknames: string[], internalName: string) {
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
    public addRoom(room: Room) {
        this.rooms.push(room);
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
}

export {
    Building
}

export * from './Building';