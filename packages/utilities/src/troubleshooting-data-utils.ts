import { TroubleshootingData, Room, RoomFactory, TroubleshootingDataFactory, SimpleRoomFactory } from "@ccss-support-manual/models";

export class TroubleshootingDataUtils {

    public static exampleData = new TroubleshootingDataFactory()
        .withTitle("Computer will not turn on")
        .withDescription("Attempting to press the power button does nothing. No fans spin up and nothing is displayed. No lights.")
        .withSolution("Plug the computer in")
        .withTypes(["Computer"])
        .withWhitelistedRooms([
            new SimpleRoomFactory().withBuildingName("Example Building").withRoomNumber(123).build(),
            new SimpleRoomFactory().withBuildingName("Example Building").withRoomNumber("321B").build(),
        ])
        .withBlacklistedRooms([
            new SimpleRoomFactory().withBuildingName("Example Building").withRoomNumber(456).build(),
            new SimpleRoomFactory().withBuildingName("Example Building").withRoomNumber("456B").build(),
        ])
        .build();

    public static addWhitelistedRoom(data: TroubleshootingData, room: Room): void {
        data.whitelistedRooms.push(new RoomFactory().withBuildingName(room.buildingName).withNumber(`${room.number}`).buildSimple());
    }

    public static addBlacklistedRoom(data: TroubleshootingData, room: Room): void {
        data.blacklistedRooms.push(new RoomFactory().withBuildingName(room.buildingName).withNumber(`${room.number}`).buildSimple());
    }

    public static isRoomWhitelisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
        for (const room of data.whitelistedRooms) {
            if (room.buildingName === buildingName && room.number === roomNumber) return true;
        }
        return false;
    }

    public static isRoomBlacklisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
        for (const room of data.blacklistedRooms) {
            if (room.buildingName === buildingName && room.number === roomNumber) return true;
        }
        return false;
    }

    public static getAllTypes(data: TroubleshootingData[]): string[] {
        const results: string[] = [];
        data.forEach((td: TroubleshootingData) => {
            td.types.forEach((type: string) => {
                if (results.includes(type.toLowerCase())) return;
                results.push(type.toLowerCase());
            });
        });
        return results;
    }

    public static getAllTags(data: TroubleshootingData[]): string[] {
        const results: string[] = [];
        data.forEach((td: TroubleshootingData) => {
            td.tags.forEach((tag: string) => {
                if (results.includes(tag.toLowerCase())) return;
                results.push(tag.toLowerCase());
            });
        });
        return results;
    }


    public static hasAnyType(data: TroubleshootingData, types: string): boolean {
        const matches = data.types.filter((type: string) => types.includes(type.toLowerCase()));
        return matches.length > 0;
    }

    public static hasAnyTag(data: TroubleshootingData, tags: string): boolean {
        const matches = data.tags.filter((tag: string) => tags.includes(tag.toLowerCase()));
        return matches.length > 0;
    }

    public static hasAnyWord(data: TroubleshootingData, word: string): boolean {
        return (
            data.title.includes(word.toLowerCase()) ||
            data.description.includes(word.toLowerCase()) ||
            data.solution.includes(word.toLowerCase())
        );
    }

    public static hasAny(data: TroubleshootingData, any: string): boolean {
        return this.hasAnyType(data, any) || this.hasAnyTag(data, any) || this.hasAnyWord(data, any);
    }
}