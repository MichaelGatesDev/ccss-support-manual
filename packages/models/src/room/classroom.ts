import { Room } from "./room";
import { Phone, PhoneFactory } from "../equipment/phone";
import { DeviceFactory, DeviceType } from "../equipment/device";
import { RoomType } from "./room-type";

/**
 * 
 */
export interface Classroom extends Room {
    phone: Phone;

    /**
     * The last time that the room was checked or information was updated.
     */
    lastChecked?: string;
}


export class ClassroomFactory {

    private _room: Room;
    private _phone: Phone = new PhoneFactory(new DeviceFactory().ofType(DeviceType.Phone).build()).build();
    private _lastChecked = "";

    public constructor(room: Room) {
        room.roomType = RoomType.Classroom;
        this._room = room;
    }

    public withPhone(phone: Phone): ClassroomFactory {
        this._phone = phone;
        return this;
    }

    public withLastChecked(lastChecked: string): ClassroomFactory {
        this._lastChecked = lastChecked;
        return this;
    }

    public build(): Classroom {
        return {
            ...this._room,
            phone: this._phone,
            lastChecked: this._lastChecked
        };
    }
}