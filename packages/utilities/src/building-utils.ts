import { Building, Room } from "@ccss-support-manual/models";

export class BuildingUtils {
  private static exampleBuildingName = "Example Building";
  private static exampleBuildingNicknames = ["example", "building"];
  public static exampleBuilding = { name: BuildingUtils.exampleBuildingName, nicknames: BuildingUtils.exampleBuildingNicknames } as Building;

  /**
   * Checks if a building's name(s) contain the specified string
   * @param building The building
   * @param name The name to check
   */
  public static hasName(building: Building, name: string): boolean {
    if (building.name.toLowerCase().includes(name.toLowerCase())) return true;
    for (const nick of building.nicknames) {
      if (nick.toLowerCase().includes(name.toLowerCase())) return true;
    }
    return false;
  }

  public static getAllRooms(buildings: Building[]): Room[] {
    let result: Room[] = [];
    for (const building of buildings) {
      result = result.concat(building.rooms);
    }
    return result;
  }
}
