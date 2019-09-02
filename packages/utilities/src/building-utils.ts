import { Building, Room, BuildingFactory } from "@ccss-support-manual/models";
import { StringUtils } from "@michaelgatesdev/common";

export class BuildingUtils {

    private static exampleBuildingName = "Example Building";
    public static exampleBuilding = new BuildingFactory()
        .withOfficialName(BuildingUtils.exampleBuildingName)
        .withInternalName(StringUtils.internalize(BuildingUtils.exampleBuildingName))
        .withNicknames([...BuildingUtils.exampleBuildingName.split(" "), "nicknames"])
        .build();

    /**
     * Checks if a building's name(s) contain the specified string
     * @param building The building
     * @param name The name to check
     */
    public static hasName(building: Building, name: string): boolean {
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
    public static addRoom(building: Building, room: Room): boolean {
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
    public static removeRoom(building: Building, room: Room): boolean {
        if (!building.rooms.includes(room)) return false;
        const index = building.rooms.indexOf(room, 0);
        if (index > -1) {
            building.rooms.splice(index, 1);
        }
        return true;
    }
}