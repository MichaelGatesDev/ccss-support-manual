import { TroubleshootingData, Room, getSimplifiedRoom } from "@ccss-support-manual/models";

export class TroubleshootingDataUtils {
  public static exampleData = {
    title: "Computer won't turn on",
    description: "After pressing the power button on the computer, nothing happens.",
    solution: "Plug in the computer",
    tags: ["computer"],
  } as TroubleshootingData;

  public static addWhitelistedRoom(data: TroubleshootingData, room: Room): void {
    data.whitelistedRooms.push(getSimplifiedRoom(room));
  }

  public static addBlacklistedRoom(data: TroubleshootingData, room: Room): void {
    data.blacklistedRooms.push(getSimplifiedRoom(room));
  }

  public static isRoomWhitelisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
    for (const room of data.whitelistedRooms) {
      if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
    }
    return false;
  }

  public static isRoomBlacklisted(data: TroubleshootingData, buildingName: string, roomNumber: string): boolean {
    for (const room of data.blacklistedRooms) {
      if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
    }
    return false;
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

  public static hasAnyTag(data: TroubleshootingData, tags: string): boolean {
    const matches = data.tags.filter((tag: string) => tags.includes(tag.toLowerCase()));
    return matches.length > 0;
  }

  public static hasAnyWord(data: TroubleshootingData, word: string): boolean {
    return data.title.includes(word.toLowerCase()) || data.description.includes(word.toLowerCase()) || data.solution.includes(word.toLowerCase());
  }

  public static hasAny(data: TroubleshootingData, any: string): boolean {
    return this.hasAnyTag(data, any) || this.hasAnyWord(data, any);
  }
}
