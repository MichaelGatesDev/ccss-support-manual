import _ from "lodash";

import { Building, FullyConditionalInterface } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";
import { App } from "./app";

/**
 * A utility class for managing buildings
 */
export class BuildingManager {
  private readonly app: App;

  /**
   * An array of all buildings
   */
  public buildings: Building[];

  constructor(app: App) {
    this.app = app;
    this.buildings = [];
  }

  /**
   * Adds a building
   * @param building Building to add
   * @return True if added, otherwise false
   */
  public addBuilding(building: Building): boolean {
    if (this.hasBuilding(building)) return false;
    if (building.rooms === undefined) building.rooms = [];
    if (building.nicknames === undefined) building.nicknames = [];
    this.buildings.push(building);
    return true;
  }

  /**
   * Adds multiple buildings
   * @param buildings Buildings to add
   */
  public addBuildings(buildings: Building[]): void {
    for (const building of buildings) {
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
    _.remove(this.buildings, building);
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
    return fetched == null ? false : this.removeBuilding(fetched);
  }

  /**
   * Updates a a building object's properties
   * @param buildingToUpdate The object to update
   * @param updated The object with the new properties
   * @returns True if updated, otherwise false
   */
  public updateBuilding(buildingToUpdate: Building, updated: FullyConditionalInterface<Building>): boolean {
    if (!this.hasBuilding(buildingToUpdate)) return false;
    const fetched = this.getBuildingByName(buildingToUpdate.name);
    if (fetched === undefined) return false;
    if (updated.name != null) fetched.name = updated.name;
    if (updated.nicknames != null) fetched.nicknames = updated.nicknames;
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
    return this.buildings.find(building => BuildingUtils.hasName(building, name));
  }

  /**
   * Checks if the building exists
   * @param building The building to check
   * @returns true if the building exists, otherwise false
   */
  public hasBuilding(building: Building): boolean {
    return this.getBuildingByName(building.name) != null;
  }

  /**
   * Checks if a building exists with the name
   * @param name The name of the building to check
   * @returns true if the building exists, otherwise false
   */
  public hasBuildingWithName(name: string): boolean {
    return this.getBuildingByName(name) != null;
  }
}
