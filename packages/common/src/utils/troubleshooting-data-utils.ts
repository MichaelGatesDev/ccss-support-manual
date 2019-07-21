import { TroubleshootingData } from "../models/troubleshooting-data";
import { Room, RoomFactory } from "../models/room";

export default class TroubleshootingDataUtils {

    public static addWhitelistedRoom(data: TroubleshootingData, room: Room): void {
        data.whitelistedRooms.push(new RoomFactory().withBuildingName(room.buildingName).withNumber(room.number).buildSimple());
    }

    public static addBlacklistedRoom(data: TroubleshootingData, room: Room): void {
        data.blacklistedRooms.push(new RoomFactory().withBuildingName(room.buildingName).withNumber(room.number).buildSimple());
    }

    public static isRoomWhitelisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
        for (const room of data.whitelistedRooms) {
            if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
        }
        return false;
    }

    public static isRoomBlacklisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
        for (const room of data.blacklistedRooms) {
            if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
        }
        return false;
    }
}