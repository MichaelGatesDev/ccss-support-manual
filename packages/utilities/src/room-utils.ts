import {
    Building,
    Room,
    SimpleRoom,
    RoomFactory,
    Classroom,
    SmartClassroom,
    ComputerClassroom
} from "@ccss-support-manual/models";

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

    public static getSimplified(room: Room): SimpleRoom {
        return new RoomFactory(room).buildSimple();
    }

    public static isRoom(obj: any): obj is Room {
        return (obj as Room).buildingName !== undefined;
    }

    public static isClassroom(obj: any): obj is Classroom {
        return (obj as Classroom).phone !== undefined;
    }

    public static isSmartClassroom(obj: any): obj is SmartClassroom {
        return (obj as SmartClassroom).teachingStation !== undefined;
    }

    public static isComputerClassroom(obj: any): obj is ComputerClassroom {
        return (obj as ComputerClassroom).printer !== undefined;
    }
}