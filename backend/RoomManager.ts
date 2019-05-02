import { BuildingManager } from "./BuildingManager";

import { Room } from "./models/Room";

/**
 * A utility class for managing rooms
 */
class RoomManager {

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
            result = result.concat(building.getRooms());
        }
        return result;
    }

    /**
     * Gets a room by the building name and room number
     * 
     * @param buildingName The name of the building
     * @param roomNumber The room number
     */
    public getRoom(buildingName: string, roomNumber: string): Room | undefined {
        for (const room of this.getRooms()) {
            if (
                room.getBuilding()!.hasName(buildingName) &&
                room.getNumber() === roomNumber.toLowerCase().trim()
            )
                return room;
        }
    }
}

export {
    RoomManager
}