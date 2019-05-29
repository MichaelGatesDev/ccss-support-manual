import { Building } from "./building";

/**
 * A utility class for managing buildings
 */
export class BuildingManager {
    /**
     * An array of all buildings
     */
    private buildings: Building[];

    constructor() {
        this.buildings = [];
    }

    /**
     * Adds a building to the array
     * @param building Building to add
     */
    public addBuilding(building: Building) {
        this.buildings.push(building);
    }

    /**
     * Removes a building from the array
     * @param building Building to remove
     */
    public removeBuilding(building: Building) {
        const index = this.buildings.indexOf(building, 0);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    }

    /**
     * Gets a building by the specified name
     * @param name The name of the building
     */
    public getBuildingByName(name: string): Building | null {
        for (const building of this.buildings) {
            if (building.hasName(name)) return building;
        }
        return null;
    }

    /**
     * Gets all buildings
     */
    public getBuildings() {
        return this.buildings;
    }
}