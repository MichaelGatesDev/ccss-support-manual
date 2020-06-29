import { Building, Room } from "@ccss-support-manual/models";
import { BuildingUtils } from "./building-utils";

export class RoomUtils {
  public static RoomNumberPattern = /^[0-9]{3}[A-Za-z]{0,1}$/; //TODO make this configurable

  public static exampleRoom = {
    building: BuildingUtils.exampleBuilding,
    lockType: "key",
    capacity: 100,
    number: "123A",
    roomType: "room",
  } as Room;

  public static isValidRoomNumber(number: string): boolean {
    return RoomUtils.RoomNumberPattern.test(number);
  }

  /**
   * Gets a room within the building with the specified number
   * @param number The room number
   */
  public static getRoomByNumber(building: Building, number: string | number): Room | undefined {
    return building.rooms.find(room => room.number == number);
  }

  /**
   * @returns true if roomA and roomB share the same building name and room number
   */
  public static compare(roomA: Room, roomB: Room): boolean {
    return roomA.building.name === roomB.building.name && roomA.number === roomB.number;
  }
}
