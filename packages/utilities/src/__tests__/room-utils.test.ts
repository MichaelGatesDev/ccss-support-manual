import { RoomUtils } from "../room-utils";
import { BuildingUtils } from "../building-utils";

test("should validate room numbers", () => {
  expect(RoomUtils.isValidRoomNumber("000")).toBe(true);
  expect(RoomUtils.isValidRoomNumber("000A")).toBe(true);
  expect(RoomUtils.isValidRoomNumber("0")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("00")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("A")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("AA")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("AAA")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("AAAA")).toBe(false);
  expect(RoomUtils.isValidRoomNumber("0001")).toBe(false);
});

test("should compare rooms", () => {
  const roomA = { building: BuildingUtils.exampleBuilding, number: "123A" };
  const roomB = { building: BuildingUtils.exampleBuilding, number: "321B" };
  expect(RoomUtils.compare(roomA, roomA)).toBe(true);
  expect(RoomUtils.compare(roomA, roomB)).toBe(false);
});

test("should grab room via building name and room number", () => {
  const buildingA = BuildingUtils.exampleBuilding;
  const roomA = RoomUtils.exampleRoom;
  buildingA.rooms = [roomA];
  expect(RoomUtils.getRoomByNumber(buildingA, roomA.number)).toBeDefined();
});
