import { Room, SimpleRoom } from './room';

class TroubleshootingData {

    private title: string;
    private description: string;
    private solution: string;
    private types: string[];
    private tags: string[];
    private whitelistedRooms: SimpleRoom[];
    private blacklistedRooms: SimpleRoom[];

    constructor(title: string, description: string, solution: string) {
        this.title = title;
        this.description = description;
        this.solution = solution;
        this.types = [];
        this.tags = [];
        this.whitelistedRooms = [];
        this.blacklistedRooms = [];
    }

    public setTypes(types: string[]) {
        this.types = types;
    }

    public setTags(tags: string[]) {
        this.tags = tags;
    }

    public addWhitelistedRoom(room: Room) {
        this.whitelistedRooms.push(new SimpleRoom(room.buildingName, room.number));
    }

    public addBlacklistedRoom(room: Room) {
        this.blacklistedRooms.push(new SimpleRoom(room.buildingName, room.number));
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getSolution(): string {
        return this.solution;
    }

    public getTypes(): string[] {
        return this.types;
    }

    public getTags(): string[] {
        return this.tags;
    }

    public getWhitelistedRooms(): SimpleRoom[] {
        return this.whitelistedRooms;
    }

    public isRoomWhitelisted(buildingName: string, roomNumber: string) {
        for (const room of this.whitelistedRooms) {
            if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
        }
        return false;
    }

    public getBlacklistedRooms(): SimpleRoom[] {
        return this.blacklistedRooms;
    }

    public isRoomBlacklisted(buildingName: string, roomNumber: string) {
        for (const room of this.blacklistedRooms) {
            if (room.buildingName === buildingName && room.roomNumber === roomNumber) return true;
        }
        return false;
    }
}

export {
    TroubleshootingData
}