import { Building } from "../models/building";
import { Room } from "../models/room";

export class RoomUtils {
    /**
     * Gets a room within the building with the specified number
     * @param number The room number
     */
    public static getRoomByNumber(building: Building, number: string): Room | undefined {
        for (const room of building.rooms) {
            if (room.number === number)
                return room;
        }
        return undefined;
    }
}