import { Building } from "./building";
import { Phone } from "./equipment/phone";
import { TeachingStation } from "./equipment/teaching-station";
import { SpeakerType, DVDPlayer, Printer, DocumentCamera, Projector } from "./equipment";
import { VideoDisplayType } from "./equipment/video-display-type";
import { RoomType } from "./room-type";
import { LockType } from "./lock-type";

export interface Room {
  /**
   * The name of the building in which the room exists
   */
  building: Building;

  /**
   * The room number or unique identifier (e.g. 103F).
   * The first number of the identifier indicates the floor (e.g. 0 = basement, 1 = 1st floor, 2 = 2nd floor, etc.)
   * The next two digits indicate the
   */
  number: string | number;

  /**
   * The name of the room. Typically found on the sign with the room number.
   */
  name?: string;

  /**
   * The type of room
   */
  roomType?: RoomType;

  /**
   * The type of lock which secures the room
   */
  lockType?: LockType;

  /**
   * The capacity or 'max number of people allowed' in the room or -1 if unknown
   */
  capacity?: number;

  phone?: Phone;

  teachingStation?: TeachingStation;

  //

  doesAudioRelyOnSystemPower?: boolean;
  speakerType?: SpeakerType;

  videoDisplayType?: VideoDisplayType;
  projector?: Projector;

  documentCamera?: DocumentCamera;
  dvdPlayer?: DVDPlayer;

  printer?: Printer;
}

export interface SimpleRoom {
  buildingName: string;
  roomNumber: string | number;
}

export const getSimplifiedRoom = (room: Room) => {
  return {
    buildingName: room.building.name,
    roomNumber: room.number,
  } as SimpleRoom;
};
