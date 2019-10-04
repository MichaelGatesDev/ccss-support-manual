import { TroubleshootingData, SmartClassroom, Classroom } from "@ccss-support-manual/models";
import { TroubleshootingDataUtils, RoomUtils } from "@ccss-support-manual/utilities";
import { app } from "./app";
import { Logger } from "@michaelgatesdev/common";

export class TroubleshootingDataManager {

    public troubleshootingData: TroubleshootingData[];

    public constructor() {
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

    public getTroubleshootingDataForRoom(buildingName: string, roomNumber: string | number): TroubleshootingData[] {
        let room = app.roomManager.getRoom(buildingName, `${roomNumber}`);
        if (room === undefined) return []; // no room with that ID found

        Logger.debug(`trouble data size: ${this.troubleshootingData.length}`);

        let results: TroubleshootingData[] = [];
        for (const td of this.troubleshootingData) {

            // trouble data doesn't apply for this room
            if (TroubleshootingDataUtils.isRoomBlacklisted(td, buildingName, `${roomNumber}`)) continue;

            // whitelisted room
            if (td.whitelistedRooms.length > 0) {
                if (TroubleshootingDataUtils.isRoomWhitelisted(td, buildingName, `${roomNumber}`)) {
                    results.push(td);
                    continue;
                }
                continue;
            }

            if (RoomUtils.isRoom(room)) {
                const config = app.configManager.troubleshootingKeywordsConfig;
                if (config !== undefined) {
                    Logger.debug(`${buildingName} ${roomNumber} is room`);
                    const match = td.types.find((type: string) => config.roomKeywords.includes(type.toLowerCase()));
                    if (match !== undefined) {
                        results.push(td);
                        continue;
                    }
                }
            }

            if (RoomUtils.isClassroom(room)) {
                const config = app.configManager.troubleshootingKeywordsConfig;
                if (config !== undefined) {
                    Logger.debug(`${buildingName} ${roomNumber} is classroom`);
                    const match = td.types.find((type: string) => config.classroomKeywords.includes(type.toLowerCase()));
                    if (match !== undefined) {
                        results.push(td);
                        Logger.debug(`${match}`);
                        continue;
                    }
                }
            }

            if (RoomUtils.isSmartClassroom(room)) {
                const config = app.configManager.troubleshootingKeywordsConfig;
                if (config !== undefined) {
                    Logger.debug(`${buildingName} ${roomNumber} is smart classroom`);
                    const match = td.types.find((type: string) => config.smartClassroomKeywords.includes(type.toLowerCase()));
                    if (match !== undefined) {
                        results.push(td);
                        continue;
                    }
                }
            }

            if (RoomUtils.isComputerClassroom(room)) {
                const config = app.configManager.troubleshootingKeywordsConfig;
                if (config !== undefined) {
                    Logger.debug(`${buildingName} ${roomNumber} is computer classroom`);
                    const match = td.types.find((type: string) => config.computerClassroomKeywords.includes(type.toLowerCase()));
                    if (match !== undefined) {
                        results.push(td);
                        continue;
                    }
                }
            }
        }

        return results;
    }

    public clear(): void {
        this.troubleshootingData = [];
    }

}