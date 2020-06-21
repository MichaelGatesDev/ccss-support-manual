import {
  Building,
  BuildingFactory,
  Room,
  RoomFactory,
  SimpleRoom,
} from "@ccss-support-manual/models";
import { RoomManager } from "../room-manager";
import { app } from "../app";

const roomManager = new RoomManager(app);
const buildingOfficialName = "My Cool Building";
const building: Building = new BuildingFactory()
  .withOfficialName(buildingOfficialName)
  .build();
app.buildingManager.addBuilding(building);

let exampleRoom: Room;

test("creates a room", (): void => {
  exampleRoom = new RoomFactory()
    .withBuildingName(building.internalName)
    .withNumber("200")
    .build();
  expect(exampleRoom).toBeDefined();
});

test("adds room to building", (): void => {
  // should add room
  expect(roomManager.addRoom(exampleRoom)).toBe(true);
});

test("does not add duplicate rooms", (): void => {
  // should not add duplicate room
  expect(roomManager.addRoom(exampleRoom)).toBe(false);
});

test("gets room via number", (): void => {
  // should have room with example room number
  expect(
    roomManager.getRoom(building.internalName, exampleRoom.number)
  ).toBeDefined();
});

test("gets simplified version of room", (): void => {
  const simplified: SimpleRoom = new RoomFactory()
    .withBuildingName(exampleRoom.buildingName)
    .withNumber(exampleRoom.number)
    .buildSimple();

  // should have same building name
  expect(simplified.buildingName).toBe(exampleRoom.buildingName);
  // should have same number
  expect(simplified.number).toBe(exampleRoom.number);
});

test("removes room from building", (): void => {
  // should remove the example room
  expect(roomManager.removeRoom(exampleRoom)).toBe(true);
  // should not remove a room that it does not contain
  expect(roomManager.removeRoom(exampleRoom)).toBe(false);
});
