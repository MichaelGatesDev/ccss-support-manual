import { TroubleshootingData } from "@ccss-support-manual/models";
import {
  TroubleshootingDataUtils,
  RoomUtils,
} from "@ccss-support-manual/utilities";

import { App } from "./app";

export class TroubleshootingDataManager {
  private readonly app: App;
  public troubleshootingData: TroubleshootingData[];

  public constructor(app: App) {
    this.app = app;
    this.troubleshootingData = [];
  }

  public add(data: TroubleshootingData): void {
    this.troubleshootingData.push(data);
  }

  public addAll(data: TroubleshootingData[]): void {
    this.troubleshootingData.push(...data);
  }

  public getTroubleshootingData(): TroubleshootingData[] {
    return this.troubleshootingData;
  }

  public getTroubleshootingDataForRoom(
    buildingName: string,
    roomNumber: string | number
  ): TroubleshootingData[] {
    const room = this.app.roomManager.getRoom(buildingName, `${roomNumber}`);
    if (room === undefined) return []; // no room with that ID found

    const config = this.app.configManager.troubleshootingKeywordsConfig;
    if (config === undefined) return []; // no keywords config

    const results: TroubleshootingData[] = [];
    for (const td of this.troubleshootingData) {
      // trouble data doesn't apply for this room
      if (
        TroubleshootingDataUtils.isRoomBlacklisted(
          td,
          buildingName,
          `${roomNumber}`
        )
      )
        continue;

      // whitelisted room
      if (td.whitelistedRooms.length > 0) {
        if (
          TroubleshootingDataUtils.isRoomWhitelisted(
            td,
            buildingName,
            `${roomNumber}`
          )
        ) {
          results.push(td);
        }
        continue;
      }

      if (RoomUtils.isRoom(room)) {
        const match = config.roomKeywords.find((keyword: string) =>
          TroubleshootingDataUtils.hasAny(td, keyword)
        );
        if (match !== undefined) {
          results.push(td);
          continue;
        }
      }

      if (RoomUtils.isClassroom(room)) {
        const match = config.classroomKeywords.find((keyword: string) =>
          TroubleshootingDataUtils.hasAny(td, keyword)
        );
        if (match !== undefined) {
          results.push(td);
          continue;
        }
      }

      if (RoomUtils.isSmartClassroom(room)) {
        const match = config.smartClassroomKeywords.find((keyword: string) =>
          TroubleshootingDataUtils.hasAny(td, keyword)
        );
        if (match !== undefined) {
          results.push(td);
          continue;
        }
      }

      if (RoomUtils.isComputerClassroom(room)) {
        const match = config.computerClassroomKeywords.find((keyword: string) =>
          TroubleshootingDataUtils.hasAny(td, keyword)
        );
        if (match !== undefined) {
          results.push(td);
          continue;
        }
      }
    }

    return results;
  }

  public clear(): void {
    this.troubleshootingData = [];
  }
}
