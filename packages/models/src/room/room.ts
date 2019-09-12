import { RoomType } from "./room-type";
import { LockType } from "../lock-type";

/**
 * 
 */
export interface Room {

    /**
     * The name of the building in which the room exists
     */
    buildingName: string;

    /**
     * The room number or unique identifier (e.g. 103F).
     * The first number of the identifier indicates the floor (e.g. 0 = basement, 1 = 1st floor, 2 = 2nd floor, etc.)
     * The next two digits indicate the 
     */
    number: string | number;

    /**
     * The name of the room. Typically found on the sign with the room number.
     */
    name: string;

    /**
     * The type of room
     */
    roomType: RoomType;

    /**
     * The type of lock which secures the room
     */
    lockType: LockType;

    /**
     * The capacity or 'max number of people allowed' in the room or -1 if unknown
     */
    capacity: number;
}


/**
 * Represents a very simplified room structure
 */
export interface SimpleRoom {
    buildingName: string;
    roomNumber: string | number;
}



export class RoomFactory {

    private _buildingName: string = "";
    private _number: string | number = "";
    private _name: string = "";
    private _type: RoomType = RoomType.Other;
    private _lockType: LockType = LockType.Other;
    private _capacity: number = -1;

    public constructor(room?: Room) {
        if (room === undefined) return;
        this._buildingName = room.buildingName;
        this._number = room.number;
        this._type = room.roomType;
        this._lockType = room.lockType;
        this._capacity = room.capacity;
    }

    public withBuildingName(name: string): RoomFactory {
        this._buildingName = name;
        return this;
    }

    public withNumber(number: string): RoomFactory {
        this._number = number;
        return this;
    }

    public withName(name: string): RoomFactory {
        this._name = name;
        return this;
    }

    public withType(type: RoomType): RoomFactory {
        this._type = type;
        return this;
    }

    public withLockType(lockType: LockType): RoomFactory {
        this._lockType = lockType;
        return this;
    }

    public withCapacity(capacity: number): RoomFactory {
        this._capacity = capacity;
        return this;
    }

    public build(): Room {
        return {
            buildingName: this._buildingName,
            number: this._number,
            name: this._name,
            roomType: this._type,
            lockType: this._lockType,
            capacity: this._capacity
        };
    }

    public buildSimple(): SimpleRoom {
        return {
            buildingName: this._buildingName,
            roomNumber: this._number
        };
    }
}