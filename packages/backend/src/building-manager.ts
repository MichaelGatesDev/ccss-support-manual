import _ from "lodash";
import { StringUtils } from "@michaelgatesdev/common";

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
        for (const building of buildings) {
            if (building.rooms === undefined) building.rooms = [];
        }
        this.buildings.push(...buildings);
    }

    /**
     * Removes a building from the array
     * @param building Building to remove
     */
    public removeBuilding(building: Building): void {
        this.buildings = _.remove(this.buildings, building);
    }

    /**
     * Updates a a building object's properties
     * @param building The object to update
     * @param updated The object with the new properties
     */
    public updateBuilding(building: Building, updated: Building): boolean {
        const fetched = this.getBuildingByName(building.internalName);
        if (fetched === undefined) return false;
        fetched.officialName = StringUtils.capitalizeFirstLetter(updated.officialName);
        fetched.internalName = StringUtils.internalize(updated.internalName);
        return true;
    }

    /**
     * Clears all buildings
     */
    public clear(): void {
        this.buildings = [];
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