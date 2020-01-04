import _ from "lodash";

import { Room, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { app } from "./app";


/**
 * A utility class for managing rooms
 */
export class RoomManager {

    /**
     * Gets every room across all buildings
     */
    public getRooms(): Room[] {
        let result: Room[] = [];
        for (const building of app.buildingManager.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }

    /**
     * Clears all rooms from buildings
     */
    public clear(): void {
        for (const building of app.buildingManager.buildings) {
            building.rooms = [];
        }
    }

    /**
     * Gets a room by the building name and room number
     * 
     * @param buildingName The name of the building
     * @param roomNumber The room number
     */
    public getRoom(buildingName: string, roomNumber: string | number): Room | undefined {
        const building = app.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return undefined;
        return this.getRooms().find((room: Room) => BuildingUtils.hasName(building, room.buildingName) && `${room.number}` === `${roomNumber}`);
    }

    public getRoomDisplayName(building: Building, room: Room): string {
        return building.officialName + " " + `${room.number}`.toLocaleUpperCase();
    }

    public addRoom(room: Room): void {
        const pb = app.buildingManager.getBuildingByName(room.buildingName);
        if (pb === undefined) return;
        if (pb.rooms === undefined) pb.rooms = [];
        pb.rooms.push(room);
    }

    public removeRoom(room: Room): void {
        const pb = app.buildingManager.getBuildingByName(room.buildingName);
        if (pb === undefined) return;
        if (pb.rooms === undefined) pb.rooms = [];
        if (!_.includes(pb.rooms, room)) return;
        pb.rooms = _.remove(pb.rooms, room);
    }

    public addRooms(rooms: Room[]): void {
        for (const room of rooms) {
            this.addRoom(room);
        }
    }
}