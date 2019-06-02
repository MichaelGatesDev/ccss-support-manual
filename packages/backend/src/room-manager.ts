import { BuildingManager } from "./building-manager";

import { Building, BuildingUtils, Room } from "@ccss-support-manual/common";

/**
 * A utility class for managing rooms
 */
export class RoomManager {

    /**
     * A reference to the BuildingManager (used for all things related to building)
     */
    private buildingManager: BuildingManager;

    constructor(buildingManager: BuildingManager) {
        this.buildingManager = buildingManager;
    }

    /**
     * Gets every room across all buildings
     */
    public getRooms(): Room[] {
        let result: Room[] = [];
        for (const building of this.buildingManager.getBuildings()) {
            result = result.concat(building.rooms);
        }
        return result;
    }

    /**
     * Gets a room by the building name and room number
     * 
     * @param buildingName The name of the building
     * @param roomNumber The room number
     */
    public getRoom(buildingName: string, roomNumber: string): Room | null {
        for (const room of this.getRooms()) {
            let building = this.buildingManager.getBuildingByName(room.buildingName);
            if (!building) continue;
            if (
                BuildingUtils.hasName(building, buildingName) &&
                room.number === roomNumber.toLowerCase().trim()
            )
                return room;
        }
        return null;
    }

    public getRoomDisplayName(building: Building, room: Room): string {
        return building.officialName + " " + room.number.toLocaleUpperCase();
    }
}