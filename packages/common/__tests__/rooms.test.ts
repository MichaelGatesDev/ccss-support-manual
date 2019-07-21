import { Room, SimpleRoom, RoomFactory } from "../src/models/";
import { Building, BuildingFactory } from "../src/models/building";
import { RoomUtils, StringUtils, BuildingUtils } from "../src/utils";

let buildingOfficialName = "My Cool Building";
let buildingNicknames: string[] = ["my", "cool", "building", "mcb"];
let building: Building = new BuildingFactory()
    .withOfficialName(buildingOfficialName)
    .withInternalName(StringUtils.internalize(buildingOfficialName))
    .withNicknames(buildingNicknames)
    .build();

let exampleRoom: Room;

test("creates a room", (): void => {
    exampleRoom = new RoomFactory()
        .withBuildingName(building.internalName)
        .withNumber("200")
        .build();

    expect(exampleRoom);
});

test("adds room to building", (): void => {
    // should add room
    expect(BuildingUtils.addRoom(building, exampleRoom));
});

test("does not add duplicate rooms", (): void => {
    // should not add duplicate room
    expect(BuildingUtils.addRoom(building, exampleRoom));
});

test("gets room via number", (): void => {
    // should have room with example room number
    expect(RoomUtils.getRoomByNumber(building, exampleRoom.number));
});

test("gets simplified version of room", (): void => {
    let simplified: SimpleRoom = new RoomFactory()
        .withBuildingName(exampleRoom.buildingName)
        .withNumber(exampleRoom.number)
        .buildSimple();

    // should have same building name
    expect(simplified.buildingName === exampleRoom.buildingName);
    // should have same number
    expect(simplified.roomNumber === exampleRoom.number);
});

test("removes from from building", (): void => {
    // should remove the example room
    expect(BuildingUtils.removeRoom(building, exampleRoom));
    // should not remove a room that it does not contain
    expect(!BuildingUtils.removeRoom(building, exampleRoom));
});