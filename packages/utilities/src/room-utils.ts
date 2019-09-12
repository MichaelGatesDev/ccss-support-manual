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
    OperatingSystem
} from "@ccss-support-manual/models";
import { BuildingUtils } from "./building-utils";
import _ from "lodash";

export class RoomUtils {

    public static RoomNumberPattern: RegExp = /[\d]{3}[A-Za-z]{0,1}/; //TODO make this configurable

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
        .withPhone(new PhoneFactory(new DeviceFactory().ofType(DeviceType.Phone).build()).hasDisplay(true).hasSpeaker(true).withExtension("1234").build())
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
            .withPhone(new PhoneFactory(new DeviceFactory().ofType(DeviceType.Phone).build()).hasDisplay(true).hasSpeaker(true).withExtension("9999").build())
            .build()
    )
        .withAudio(new AudioFactory().isSystemDependent(true).withSpeakerType(SpeakerType.Mounted).build())
        .withVideo(
            new VideoFactory()
                .withDVDPlayer(
                    new DVDPlayerFactory(
                        new DeviceFactory()
                            .ofType(DeviceType.DVDPlayer)
                            .build()
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
                            new DeviceFactory()
                                .ofType(DeviceType.Computer)
                                .build()
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

    /**
     * @returns true if roomA and roomB share the same building name and room number
     */
    public static isSameAs(roomA: Room, roomB: Room): boolean {
        return roomA.buildingName === roomB.buildingName && roomA.number === roomB.number;
    }

    // public static getDifference(roomsA: Room[], roomsB: Room[]): Room[] {
    //     return _.differenceWith(roomsA, roomsB, (roomA, roomB): boolean => this.isSameAs(roomA, roomB));
    // }
}