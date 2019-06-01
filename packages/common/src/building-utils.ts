import { Building } from "./building";
import { Room } from "./room";

export class BuildingUtils {

    /**
     * Checks if a building's name(s) contain the specified string
     * @param building The building
     * @param name The name to check
     */
    static hasName(building: Building, name: string) {
        if (building.internalName.toLowerCase().includes(name.toLowerCase())) return true;
        if (building.officialName.toLowerCase().includes(name.toLowerCase())) return true;
        for (const nick of building.nicknames) { if (nick.toLowerCase().includes(name.toLowerCase())) return true; }
        return false;
    }

    /**
     * Adds a room to the building
     * 
     * @param room Room to add
     */
    static addRoom(building: Building, room: Room): boolean {
        if (!building.rooms.includes(room)) {
            building.rooms.push(room);
            return true;
        }
        return false;
    }

    /**
     * Removes a room from the building
     * 
     * @param room Room to remove
     */
    static removeRoom(building: Building, room: Room): boolean {
        if (!building.rooms.includes(room)) return false;
        const index = building.rooms.indexOf(room, 0);
        if (index > -1) {
            building.rooms.splice(index, 1);
        }
        return true;
    }
}