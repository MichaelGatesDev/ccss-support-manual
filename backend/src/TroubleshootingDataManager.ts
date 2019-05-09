import { TroubleshootingData } from "src/TroubleshootingData";
import { RoomManager } from "src/RoomManager";

export class TroubleshootingDataManager {

    private roomManager: RoomManager;
    private troubleshootingData: TroubleshootingData[];

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager;
        this.troubleshootingData = [];
    }


    public addTroubleshootingData(data: TroubleshootingData) {
        this.troubleshootingData.push(data);
    }

    public removeTroubleshootingData(data: TroubleshootingData) {
        //TODO remove
    }


    public getTroubleshootingData() {
        return this.troubleshootingData;
    }


    public getTroubleshootingDataForRoom(buildingName: string, roomNumber: string) {
        let results: TroubleshootingData[] = [];

        let room = this.roomManager.getRoom(buildingName, roomNumber);

        if (!room) return results; // no room with that ID found

        for (const td of this.getTroubleshootingData()) {

            // trouble data doesn't apply for this room
            if (td.isRoomBlacklisted(buildingName, roomNumber)) continue;

            //TODO DON'T HARDCODE THSE IF POSSIBLE

            // whitelisted room
            if (td.isRoomWhitelisted(buildingName, roomNumber)) {
                results.push(td);
                continue;
            }

            // audio
            if (room.getAudio()) {
                if (td.getTypes().includes('audio')) {
                    results.push(td);
                    continue;
                }
            }
            // projector
            if (room.getProjector()) {
                if (td.getTypes().includes('projector')) {
                    results.push(td);
                    continue;
                }
            }
            // computer
            if (room.getTeachingStationComputer()) {
                if (td.getTypes().includes('computer')) {
                    results.push(td);
                    continue;
                }
            }
            // dvd player
            if (room.getDVDPlayer()) {
                if (td.getTypes().includes('dvd')) {
                    results.push(td);
                    continue;
                }
            }
            // printer
            if (room.getPrinter()) {
                if (td.getTypes().includes('printer')) {
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