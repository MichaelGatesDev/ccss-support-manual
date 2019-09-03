import { Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

/**
 * A utility class for managing buildings
 */
export class BuildingManager {
    /**
     * An array of all buildings
     */
    public buildings: Building[];

    public constructor() {
        this.buildings = [];
    }

    /**
     * Adds a building to the array
     * @param building Building to add
     */
    public addBuilding(building: Building): void {
        this.buildings.push(building);
    }

    /**
     * Adds multiple buildings to the array
     * @param buildings Buildings to add
     */
    public addBuildings(buildings: Building[]): void {
        this.buildings.push(...buildings);
    }

    /**
     * Removes a building from the array
     * @param building Building to remove
     */
    public removeBuilding(building: Building): void {
        const index = this.buildings.indexOf(building, 0);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    }

    /**
     * Gets a building by the specified name
     * @param name The name of the building
     */
    public getBuildingByName(name: string): Building | undefined {
        for (const building of this.buildings) {
            if (BuildingUtils.hasName(building, name)) return building;
        }
        return undefined;
    }
}