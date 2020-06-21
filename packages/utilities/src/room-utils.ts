import {
  Building,
  Room,
  SimpleRoom,
  RoomFactory,
  Classroom,
  SmartClassroom,
  ComputerClassroom,
  LockType,
  RoomType,
  ClassroomFactory,
  PhoneFactory,
  DeviceFactory,
  DeviceType,
  SmartClassroomFactory,
  AudioFactory,
  SpeakerType,
  VideoFactory,
  DVDPlayerFactory,
  VideoOutputType,
  TeachingStationFactory,
  TeachingStationType,
  TeachingStationComputerFactory,
  ComputerFactory,
  OperatingSystem,
} from "@ccss-support-manual/models";
import { BuildingUtils } from "./building-utils";

export class RoomUtils {
  public static RoomNumberPattern = /[\d]{3}[A-Za-z]{0,1}/; //TODO make this configurable

  public static exampleRoom = new RoomFactory()
    .withBuildingName(BuildingUtils.exampleBuilding.officialName)
    .withLockType(LockType.Key)
    .withCapacity(100)
    .withName("Example Room")
    .withNumber("123A")
    .withType(RoomType.Room)
    .build();

  public static exampleClassroom = new ClassroomFactory(
    new RoomFactory()
      .withBuildingName(BuildingUtils.exampleBuilding.officialName)
      .withLockType(LockType.Swipe)
      .withCapacity(40)
      .withName("Example Classroom")
      .withNumber("123B")
      .withType(RoomType.Classroom)
      .build()
  )
    .withLastChecked("never")
    .withPhone(
      new PhoneFactory(new DeviceFactory().ofType(DeviceType.Phone).build())
        .hasDisplay(true)
        .hasSpeaker(true)
        .withExtension("1234")
        .build()
    )
    .build();

  public static exampleSmartClassroom = new SmartClassroomFactory(
    new ClassroomFactory(
      new RoomFactory()
        .withBuildingName(BuildingUtils.exampleBuilding.officialName)
        .withLockType(LockType.Electronic)
        .withCapacity(10)
        .withName("Example Smart Classroom")
        .withNumber("215F")
        .withType(RoomType.SmartClassroom)
        .build()
    )
      .withLastChecked("never")
      .withPhone(
        new PhoneFactory(new DeviceFactory().ofType(DeviceType.Phone).build())
          .hasDisplay(true)
          .hasSpeaker(true)
          .withExtension("9999")
          .build()
      )
      .build()
  )
    .withAudio(
      new AudioFactory()
        .isSystemDependent(true)
        .withSpeakerType(SpeakerType.Mounted)
        .build()
    )
    .withVideo(
      new VideoFactory()
        .withDVDPlayer(
          new DVDPlayerFactory(
            new DeviceFactory().ofType(DeviceType.DVDPlayer).build()
          ).build()
        )
        .withOutputType(VideoOutputType.Projector)
        .build()
    )
    .withTeachingStation(
      new TeachingStationFactory()
        .ofType(TeachingStationType.Digital)
        .withComputer(
          new TeachingStationComputerFactory(
            new ComputerFactory(
              new DeviceFactory().ofType(DeviceType.Computer).build()
            )
              .withOperatingSystem(OperatingSystem.Windows10)
              .build()
          )
            .hasWebcam(true)
            .build()
        )
        .build()
    )
    .build();

  public static isValidRoomNumber(number: string): boolean {
    return RoomUtils.RoomNumberPattern.test(number);
  }

  /**
   * Gets a room within the building with the specified number
   * @param number The room number
   */
  public static getRoomByNumber(
    building: Building,
    number: string | number
  ): Room | undefined {
    return building.rooms.find(room => `${room.number}` === `${number}`);
  }

  public static getSimplified(room: Room): SimpleRoom {
    return new RoomFactory(room).buildSimple();
  }

  public static isRoom(obj: {}): obj is Room {
    return (obj as Room).buildingName !== undefined;
  }

  public static isClassroom(room: Room): room is Classroom {
    return (room as Classroom).phone !== undefined;
  }

  public static isSmartClassroom(room: Room): room is SmartClassroom {
    return (room as SmartClassroom).teachingStation !== undefined;
  }

  public static isComputerClassroom(room: Room): room is ComputerClassroom {
    return (room as ComputerClassroom).printer !== undefined;
  }

  /**
   * @returns true if roomA and roomB share the same building name and room number
   */
  public static isSameAs(
    roomA: Room | SimpleRoom,
    roomB: Room | SimpleRoom
  ): boolean {
    return (
      roomA.buildingName === roomB.buildingName && roomA.number === roomB.number
    );
  }

  // public static getDifference(roomsA: Room[], roomsB: Room[]): Room[] {
  //     return _.differenceWith(roomsA, roomsB, (roomA, roomB): boolean => this.isSameAs(roomA, roomB));
  // }
}
