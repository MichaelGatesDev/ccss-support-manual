import { Building, Room, BuildingFactory } from "@ccss-support-manual/models";

export class BuildingUtils {
  private static exampleBuildingName = "Example Building";
  public static exampleBuilding = new BuildingFactory()
    .withOfficialName(BuildingUtils.exampleBuildingName)
    .withNicknames([
      ...BuildingUtils.exampleBuildingName.split(" "),
      "nicknames",
    ])
    .build();

  /**
   * Checks if a building's name(s) contain the specified string
   * @param building The building
   * @param name The name to check
   */
  public static hasName(building: Building, name: string): boolean {
    if (building.internalName.toLowerCase().includes(name.toLowerCase()))
      return true;
    if (building.officialName.toLowerCase().includes(name.toLowerCase()))
      return true;
    for (const nick of building.nicknames) {
      if (nick.toLowerCase().includes(name.toLowerCase())) return true;
    }
    return false;
  }

  //TODO remove or refractor
  public static getParentBuilding(
    targetRoom: Room,
    allBuildings: Building[]
  ): Building | undefined {
    for (const building of allBuildings) {
      for (const room of building.rooms) {
        if (
          room.buildingName === targetRoom.buildingName &&
          room.number === targetRoom.number
        )
          return building;
      }
    }
    return undefined;
  }

  //TODO remove or refractor
  public static getAllRooms(buildings: Building[]): Room[] {
    let result: Room[] = [];
    for (const building of buildings) {
      result = result.concat(building.rooms);
    }
    return result;
  }
}
