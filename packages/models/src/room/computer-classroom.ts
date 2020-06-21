import { Printer } from "../equipment/printer";
import { SmartClassroom } from "./smart-classroom";
import { RoomType } from "./room-type";

export interface ComputerClassroom extends SmartClassroom {
  // labComputers: LabComputer[];

  /**
   *
   */
  printer?: Printer;
}

export class ComputerClassroomFactory {
  private _room: SmartClassroom;
  private _printer?: Printer;

  public constructor(room: SmartClassroom) {
    room.roomType = RoomType.SmartClassroom;
    this._room = room;
  }

  public withPrinter(printer: Printer): ComputerClassroomFactory {
    this._printer = printer;
    return this;
  }

  public build(): ComputerClassroom {
    return {
      ...this._room,
      printer: this._printer,
    };
  }
}
