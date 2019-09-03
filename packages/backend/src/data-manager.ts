import { FileUtils, Logger } from '@michaelgatesdev/common';

import { app } from './app';
import { BuildingUtils, RoomUtils } from '@ccss-support-manual/utilities';
import { Building, Room, BuildingFactory } from '@ccss-support-manual/models';


export class DataManager {

    private buildingsFilePath?: string;
    private roomsFilePath?: string;

    public async initialize(): Promise<void> {

        // buildings file
        this.buildingsFilePath = `${app.DATA_DIR}/buildings.json`
        if (!await FileUtils.checkExists(this.buildingsFilePath)) {
            Logger.info(`No buildings file found at ${this.buildingsFilePath}. Creating default...`);
            try {
                const result = await this.createDefaultBuildingsFile();
                if (result) {
                    Logger.info("Created default buildings file");
                }
            } catch (error) {
                Logger.error("There was an error while trying to create the default buildings file");
                Logger.error(error);
            }
        }
        const loadedBuildings = await this.loadBuildingsFile();
        app.buildingManager.addBuildings(loadedBuildings);
        Logger.info(`Loaded ${loadedBuildings.length} buildings`);

        // rooms file
        this.roomsFilePath = `${app.DATA_DIR}/rooms.json`
        if (!await FileUtils.checkExists(this.roomsFilePath)) {
            Logger.info(`No rooms file found at ${this.roomsFilePath}. Creating default...`);
            try {
                const result = await this.createDefaultRoomsFile();
                if (result) {
                    Logger.info("Created default rooms file");
                }
            } catch (error) {
                Logger.error("There was an error while trying to create the default rooms file");
                Logger.error(error);
            }
        }
        const loadedRooms = await this.loadRoomsFile();
        app.roomManager.addRooms(loadedRooms);
        Logger.info(`Loaded ${loadedRooms.length} rooms`);
    }

    /**
     * Saves all of the buildings currently stored in the BuildingManager
     * @returns true if successful otherwise false
     */
    public async saveBuildings(): Promise<boolean> {
        return await this.writeBuildingsFile(app.buildingManager.buildings);
    }

    /**
     * Creates the buildings file with an example building
     * @returns true if successful otherwise false
     */
    private async createDefaultBuildingsFile(): Promise<boolean> {
        return await this.writeBuildingsFile([BuildingUtils.exampleBuilding]);
    }

    /**
     * Writes the specified buildings
     * Note: overwrites, does not append
     * @param buildings The buildings to be written to the file
     * @returns true if successful otherwise false
     */
    private async writeBuildingsFile(buildings: Building[]): Promise<boolean> {
        if (this.buildingsFilePath === undefined) throw new Error("Buildings file path is undefined");
        return await FileUtils.writeJSON(
            this.buildingsFilePath,
            buildings,
            (key, value): any => {
                if (key === "rooms") return undefined;
                return value;
            }
        );
    }

    /**
     * Loads buildings
     * @returns an array of the loaded buildings
     */
    private async loadBuildingsFile(): Promise<Building[]> {
        if (this.buildingsFilePath === undefined) throw new Error("Buildings file path is undefined");
        const json = await FileUtils.readJSON<Building[]>(this.buildingsFilePath);
        if (json === undefined) throw new Error("Buildings data is corrupted");
        return json;
    }


    /**
     * Saves all of the rooms currently stored in the RoomManager
     * @returns true if successful otherwise false
     */
    public async saveRooms(): Promise<boolean> {
        return await this.writeRoomsFile(app.roomManager.getRooms());
    }

    /**
     * Creates the rooms file with an example room
     * @returns true if successful otherwise false
     */
    private async createDefaultRoomsFile(): Promise<boolean> {
        return await this.writeRoomsFile([RoomUtils.exampleRoom, RoomUtils.exampleClassroom, RoomUtils.exampleSmartClassroom]);
    }

    /**
     * Writes the specified rooms
     * Note: overwrites, does not append
     * @param rooms The rooms to be written to the file
     * @returns true if successful otherwise false
     */
    private async writeRoomsFile(rooms: Room[]): Promise<boolean> {
        if (this.roomsFilePath === undefined) throw new Error("Rooms file path is undefined");
        return await FileUtils.writeJSON(
            this.roomsFilePath,
            rooms
        );
    }

    /**
     * Loads rooms
     * @returns an array of the loaded rooms
     */
    private async loadRoomsFile(): Promise<Room[]> {
        if (this.roomsFilePath === undefined) throw new Error("Rooms file path is undefined");
        const json = await FileUtils.readJSON<Room[]>(this.roomsFilePath);
        if (json === undefined) throw new Error("Rooms data is corrupted");
        return json;
    }

}