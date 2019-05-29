import { Room } from './room';
import { StringUtils } from './string-utils';

// import { Type } from "class-transformer";


/**
 * Represents a building which contains rooms 
 */
export class Building {

    /**
     * Official Name of the building. (e.g. "Myers Fine Arts Building")
     */
    officialName: string;

    /**
     * Nicknames/abbreviations that a building may have.
     */
    nicknames: string[];

    /**
     * Internal Name which used used by the program to identify the building.
     */
    internalName: string;

    /**
     * An array of Room objects representing the rooms in the building
     */
    // @Type(() => Room)
    rooms: Room[];

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

    createInternalName(): string {
        return StringUtils.internalize(this.officialName);
    }

    getInternalName() {
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
    public removeRoom(room: Room): boolean {
        if (!this.rooms.includes(room)) return false;
        const index = this.rooms.indexOf(room, 0);
        if (index > -1) {
            this.rooms.splice(index, 1);
        }
        return true;
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