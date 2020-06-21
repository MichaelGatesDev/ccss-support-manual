export enum RoomType {
  Other,

  Room,
  ProjectRoom,

  Classroom,

  SmartClassroom,
  ComputerClassroom,
  ConferenceRoom,
  LectureHall,
  MeetingRoom,
  SeminarRoom,
}

const ComputerClassroomTypes = [RoomType.ComputerClassroom];

const SmartClassroomTypes = [
  RoomType.SmartClassroom,
  RoomType.ComputerClassroom,
  RoomType.ConferenceRoom,
  RoomType.LectureHall,
  RoomType.MeetingRoom,
  RoomType.SeminarRoom,
];

const ClassroomTypes = [...SmartClassroomTypes, RoomType.Classroom];

const RoomTypes = [...ClassroomTypes, RoomType.Room, RoomType.ProjectRoom];

export class RoomTypeUtils {
  public static isComputerClassroom(toCheck: RoomType): boolean {
    return toCheck in ComputerClassroomTypes;
  }

  public static isSmartClassroom(toCheck: RoomType): boolean {
    return toCheck in SmartClassroomTypes;
  }

  public static isClassroom(toCheck: RoomType): boolean {
    return toCheck in ClassroomTypes;
  }

  public static isRoom(toCheck: RoomType): boolean {
    return toCheck in RoomTypes;
  }

  public static getPrimaryType(toCheck: RoomType): RoomType {
    if (this.isSmartClassroom(toCheck)) return RoomType.SmartClassroom;
    else if (this.isClassroom(toCheck)) return RoomType.Classroom;
    else if (this.isRoom(toCheck)) return RoomType.Room;
    return RoomType.Other;
  }
}
