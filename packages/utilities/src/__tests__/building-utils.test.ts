import { BuildingUtils } from "../building-utils";
import { RoomUtils } from "../room-utils";

test("should confirm that a building has name or nickname", () => {
  const buildingA = BuildingUtils.exampleBuilding;
  expect(BuildingUtils.hasName(buildingA, buildingA.nicknames[0])).toBe(true);
  expect(BuildingUtils.hasName(buildingA, buildingA.name)).toBe(true);
  const roomA = RoomUtils.exampleRoom;
  buildingA.rooms = [roomA];
});

test("should confirm amount of rooms in building", () => {
  const buildingA = BuildingUtils.exampleBuilding;
  expect(BuildingUtils.getAllRooms([buildingA]).length).toBe(buildingA.rooms.length);
});
