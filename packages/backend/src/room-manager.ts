import _ from "lodash";

import { Room, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { BuildingManager } from "./building-manager";


/**
 * A utility class for managing rooms
 */
export class RoomManager {

    private buildingManager: BuildingManager;

    constructor(buildingManager: BuildingManager) {
        this.buildingManager = buildingManager;
    }

    /**
     * Adds a room 
     * @param room The room to add
     * @returns True if the room was added, otherwise false
     */
    public addRoom(room: Room): boolean {
        if (this.hasRoom(room)) return false;
        const building = this.buildingManager.getBuildingByName(room.buildingName);
        if (building === undefined) return false;
        if (building.rooms === undefined) building.rooms = [];
        building.rooms.push(room);
        return true;
    }

    /**
     * Adds zero, one, or more rooms
     * @param rooms An array of rooms to add
     */
    public addRooms(rooms: Room[]): void {
        for (const room of rooms) {
            this.addRoom(room);
        }
    }

    /**
     * Removes a room
     * @param room The remove to remove
     */
    public removeRoom(room: Room): boolean {
        const building = this.buildingManager.getBuildingByName(room.buildingName);
        if (building === undefined) return false;
        if (building.rooms === undefined) building.rooms = [];
        if (!this.hasRoom(room)) return false;
        _.remove(building.rooms, room);

        return true;
    }

    public removeRoomByBuildingNameAndNumber(buildingName: string, number: string | number): boolean {
        const building = this.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return false;
        const room = this.getRoom(buildingName, number);
        if (room === undefined) return false;
        return this.removeRoom(room);
    }

    /**
     * Clears all rooms from buildings
     */
    public clear(): void {
        for (const building of this.buildingManager.buildings) {
            building.rooms = [];
        }
    }

    /**
     * Clears all rooms for the specified building
     * @param building The building to clear
     */
    public clearFor(building: Building): void {
        building.rooms = [];
    }

    /**
     * Gets a room by the building name and room number
     * 
     * @param buildingName The name of the building
     * @param roomNumber The room number
     */
    public getRoom(buildingName: string, roomNumber: string | number): Room | undefined {
        const building = this.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return undefined;
        return this.getRooms().find((room: Room) => BuildingUtils.hasName(building, room.buildingName) && room.number === roomNumber);
    }

    /**
     * Gets every room across all buildings
     */
    public getRooms(): Room[] {
        let result: Room[] = [];
        for (const building of this.buildingManager.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }

    /**
     * Checks if the room exists
     * @param room The room to check
     * @return True if it exists, otherwise false
     */
    public hasRoom(room: Room): boolean {
        return this.getRoom(room.buildingName, room.number) !== undefined;
    }

    /**
     * Checks if the specified room exists
     * @param buildingName The name of the building the room is in
     * @param number The number of the room
     * @return True if it exists, otherwise false
     */
    public hasRoomWithBuildingNameAndNumber(buildingName: string, number: string | number): boolean {
        const building = this.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return false;
        const room = this.getRoom(buildingName, number);
        if (room === undefined) return false;
        return true;
    }

    /**
     * @param building 
     * @param room 
     * @return The display name of the room (official building name + number) e.g. "Awesome Building 131D"
     */
    public getRoomDisplayName(building: Building, room: Room): string {
        return building.officialName + " " + `${room.number}`.toLocaleUpperCase();
    }
}