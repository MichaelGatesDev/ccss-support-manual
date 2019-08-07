import { Room } from "./room";

/**
 * Represents a building which contains rooms 
 */
export interface Building {

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
    rooms: Room[];
}


export class BuildingFactory {

    private _officialName: string = "";
    private _nicknames: string[] = [];
    private _internalName: string = "";
    private _rooms: Room[] = [];

    public withOfficialName(name: string): BuildingFactory {
        this._officialName = name;
        return this;
    }

    public withNicknames(nicknames: string[]): BuildingFactory {
        this._nicknames = nicknames;
        return this;
    }

    public withInternalName(name: string): BuildingFactory {
        this._internalName = name;
        return this;
    }

    public withRooms(rooms: Room[]): BuildingFactory {
        this._rooms = rooms;
        return this;
    }

    public build(): Building {
        return {
            officialName: this._officialName,
            nicknames: this._nicknames,
            internalName: this._internalName,
            rooms: this._rooms
        };
    }
}