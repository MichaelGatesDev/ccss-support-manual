import { TroubleshootingData, SmartClassroom } from "@ccss-support-manual/models";
import { TroubleshootingDataUtils, RoomUtils } from "@ccss-support-manual/utilities";
import { RoomManager } from "./room-manager";

export class TroubleshootingDataManager {

    private roomManager: RoomManager;
    public troubleshootingData: TroubleshootingData[];

    public constructor(roomManager: RoomManager) {
        this.roomManager = roomManager;
        this.troubleshootingData = [];
    }

    public addTroubleshootingData(data: TroubleshootingData): void {
        this.troubleshootingData.push(data);
    }

    public getTroubleshootingDataForRoom(buildingName: string, roomNumber: string): TroubleshootingData[] {
        let results: TroubleshootingData[] = [];

        let room = this.roomManager.getRoom(buildingName, roomNumber);

        if (!room) return results; // no room with that ID found

        for (const td of this.troubleshootingData) {

            // trouble data doesn't apply for this room
            if (TroubleshootingDataUtils.isRoomBlacklisted(td, buildingName, roomNumber)) continue;

            // whitelisted room
            if (TroubleshootingDataUtils.isRoomWhitelisted(td, buildingName, roomNumber)) {
                results.push(td);
                continue;
            }


            if (RoomUtils.isClassroom(room)) {
                // const classroom = room as Classroom;
            }

            if (RoomUtils.isSmartClassroom(room)) {
                const smartClassroom = room as SmartClassroom;

                // audio
                if (smartClassroom.audio) {
                    if (td.types.includes("audio")) {
                        results.push(td);
                        continue;
                    }
                }
                // video
                if (smartClassroom.video) {
                    if (td.types.includes("projector")) {
                        results.push(td);
                        continue;
                    }
                    // dvd player
                    if (smartClassroom.video.dvdPlayer) {
                        if (td.types.includes("dvd")) {
                            results.push(td);
                            continue;
                        }
                    }
                }
                // computer
                if (smartClassroom.teachingStation) {
                    if (smartClassroom.teachingStation.teachingStationComputer) {
                        if (td.types.includes("computer")) {
                            results.push(td);
                            continue;
                        }
                    }
                }
                // printer
                // if (smartClassroom.printer) {
                //     if (td.types.includes("printer")) {
                //         results.push(td);
                //         continue;
                //     }
                // }

                // if there are no types, it is general
                if (td.types.length === 0) {
                    results.push(td);
                    continue;
                }
            }
        }

        return results;
    }
}