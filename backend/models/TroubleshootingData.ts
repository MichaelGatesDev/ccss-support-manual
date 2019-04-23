import { Room } from './Room';

class TroubleshootingData {
    private title: string;
    private description: string;
    private solution: string;
    private types: string[];
    private tags: string[];
    private whitelistedRoomIDs: string[];
    private blacklistedRoomIDs: string[];


    constructor(title: string, description: string, solution: string) {
        this.title = title;
        this.description = description;
        this.solution = solution;
        this.types = [];
        this.tags = [];
        this.whitelistedRoomIDs = [];
        this.blacklistedRoomIDs = [];
    }

    public setTypes(types: string[]) {
        this.types = types;
    }

    public setTags(tags: string[]) {
        this.tags = tags;
    }

    public addWhitelistedRoom(room: Room) {
        this.whitelistedRoomIDs.push(room.getID());
    }

    public addBlacklistedRoom(room: Room) {
        this.blacklistedRoomIDs.push(room.getID());
    }

    public getTitle() {
        return this.title;
    }


    public getDescription() {
        return this.description;
    }

    public getSolution() {
        return this.solution;
    }

    public getTypes() {
        return this.types;
    }

    public getTags() {
        return this.tags;
    }

    public getWhitelistedRoomIDs() {
        return this.whitelistedRoomIDs;
    }

    public getBlacklistedRoomIDs() {
        return this.blacklistedRoomIDs;
    }
}

export {
    TroubleshootingData
}