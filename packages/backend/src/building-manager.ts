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
     * Adds a building
     * @param building Building to add
     * @return True if added, otherwise false
     */
    public addBuilding(building: Building): boolean {
        if (this.hasBuilding(building)) return false;
        this.buildings.push(building);
        return true;
    }

    /**
     * Adds multiple buildings
     * @param buildings Buildings to add
     */
    public addBuildings(buildings: Building[]): void {
        for (const building of buildings) {
            if (building.rooms === undefined) building.rooms = [];
            this.addBuilding(building);
        }
    }

    /**
     * Removes a building
     * @param building Building to remove
     * @returns True if removed, otherwise false
     */
    public removeBuilding(building: Building): boolean {
        if (!this.hasBuilding(building)) return false;
        const result = _.remove(this.buildings, building);
        if (result.length === this.buildings.length) return false;
        this.buildings = result;
        return true;
    }

    /**
     * Removes a building via name
     * @param name The name of the building to remove
     * @returns True if removed, otherwise false
     */
    public removeBuildingByName(name: string): boolean {
        if (!this.hasBuildingWithName(name)) return false;
        const fetched = this.getBuildingByName(name);
        if (fetched === undefined) return false;
        return this.removeBuilding(fetched);
    }

    /**
     * Updates a a building object's properties
     * @param building The object to update
     * @param updated The object with the new properties
     * @returns True if updated, otherwise false
     */
    public updateBuilding(building: Building, updated: Building): boolean {
        if (!this.hasBuilding(building)) return false;
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
     * @returns The resulting building, otherwise undefined
     */
    public getBuildingByName(name: string): Building | undefined {
        return this.buildings.find((building) => BuildingUtils.hasName(building, name));
    }

    /**
     * Checks if the building exists
     * @param building The building to check
     * @returns true if the building exists, otherwise false
     */
    public hasBuilding(building: Building): boolean {
        return this.getBuildingByName(building.internalName) !== undefined;
    }

    /**
     * Checks if a building exists with the name
     * @param name The name of the building to check
     * @returns true if the building exists, otherwise false
     */
    public hasBuildingWithName(name: string): boolean {
        return this.getBuildingByName(name) !== undefined;
    }

}