import { Room } from './room';

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