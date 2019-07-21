import { TroubleshootingData } from "@ccss-support-manual/common";

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
            if (td.isRoomBlacklisted(buildingName, roomNumber)) continue;

            //TODO DON'T HARDCODE THSE IF POSSIBLE

            // whitelisted room
            if (td.isRoomWhitelisted(buildingName, roomNumber)) {
                results.push(td);
                continue;
            }

            // audio
            if (room.audio) {
                if (td.getTypes().includes("audio")) {
                    results.push(td);
                    continue;
                }
            }
            // projector
            if (room.projector) {
                if (td.getTypes().includes("projector")) {
                    results.push(td);
                    continue;
                }
            }
            // computer
            if (room.teachingStationComputer) {
                if (td.getTypes().includes("computer")) {
                    results.push(td);
                    continue;
                }
            }
            // dvd player
            if (room.dvdPlayer) {
                if (td.getTypes().includes("dvd")) {
                    results.push(td);
                    continue;
                }
            }
            // printer
            if (room.printer) {
                if (td.getTypes().includes("printer")) {
                    results.push(td);
                    continue;
                }
            }

            // if there are no types, it is general
            if (td.getTypes().length === 0) {
                results.push(td);
                continue;
            }
        }

        return results;
    }
}