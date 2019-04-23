import { TroubleshootingData } from "models/TroubleshootingData";
import { RoomManager } from "RoomManager";

class TroubleshootingDataManager {

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


    public getTroubleshootingDataForRoom(roomID: string) {
        let results: TroubleshootingData[] = [];

        let room = this.roomManager.getRoomByID(roomID);

        if (!room) return results; // no room with that ID found

        for (const td of this.getTroubleshootingData()) {

            // trouble data doesn't apply for this room
            if (td.getBlacklistedRoomIDs().includes(roomID))
                continue;

            //TODO DON'T HARDCODE THSE IF POSSIBLE

            // whitelisted room
            if (td.getWhitelistedRoomIDs().length > 0) {
                if (!td.getWhitelistedRoomIDs().includes(roomID))
                    continue;
                results.push(td);
            }

            // audio
            if (room.getAudio()) {
                if (td.getTypes().includes('audio')) {
                    results.push(td);
                }
            }
            // projector
            if (room.getProjector()) {
                if (td.getTypes().includes('projector')) {
                    results.push(td);
                }
            }
            // computer
            if (room.getTeachingStationComputer()) {
                if (td.getTypes().includes('computer')) {
                    results.push(td);
                }
            }
            // dvd player
            if (room.getDVDPlayer()) {
                if (td.getTypes().includes('dvd')) {
                    results.push(td);
                }
            }
            // printer
            if (room.getPrinter()) {
                if (td.getTypes().includes('printer')) {
                    results.push(td);
                }
            }

            // if there are no types, it is general
            if (td.getTypes().length === 0)
                results.push(td);
        }
        return results;
    }
}

export {
    TroubleshootingDataManager
}