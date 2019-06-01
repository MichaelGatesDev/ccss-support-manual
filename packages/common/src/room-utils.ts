import { Building } from "./building";

export class RoomUtils {
    /**
     * Gets a room within the building with the specified number
     * @param number The room number
     */
    static getRoomByNumber(building: Building, number: string) {
        for (const room of building.rooms) {
            if (room.number === number)
                return room;
        }
        return null;
    }
}