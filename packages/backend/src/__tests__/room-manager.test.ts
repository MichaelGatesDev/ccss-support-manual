import { getSimplifiedRoom } from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";
import { app } from "../app";

const room = RoomUtils.exampleRoom;
const building = room.building;

test("should add the building to the building manager", () => {
  expect(app.buildingManager.getBuildingByName(building.name)).toBeUndefined();
  expect(app.buildingManager.addBuilding(building)).toBe(true);
  expect(app.buildingManager.getBuildingByName(building.name)).toBeDefined();
});

test("adds room to building", (): void => {
  // should add room
  expect(app.roomManager.addRoom(room)).toBe(true);
});

test("does not add duplicate rooms", (): void => {
  // should not add duplicate room
  expect(app.roomManager.addRoom(room)).toBe(false);
});

test("gets room via number", (): void => {
  // should have room with example room number
  expect(app.roomManager.getRoom(building.name, room.number)).toBeDefined();
});

test("gets simplified version of room", (): void => {
  const simplified = getSimplifiedRoom(room);

  // should have same building name
  expect(simplified.buildingName).toBe(room.building.name);
  // should have same number
  expect(simplified.roomNumber).toBe(room.number);
});

test("removes room from building", (): void => {
  // should remove the example room
  expect(app.roomManager.removeRoom(room)).toBe(true);
  // should not remove a room that it does not contain
  expect(app.roomManager.removeRoom(room)).toBe(false);
});
