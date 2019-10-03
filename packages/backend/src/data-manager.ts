import { Logger, StringUtils } from '@michaelgatesdev/common';
import { FileUtils } from "@michaelgatesdev/common-io";

import { app } from './app';
import { BuildingUtils, RoomUtils, TroubleshootingDataUtils } from '@ccss-support-manual/utilities';
import { Building, Room, TroubleshootingData } from '@ccss-support-manual/models';


export class DataManager {
    private buildingsFilePath?: string;
    private roomsFilePath?: string;
    private troubleshootingDataFilePath?: string;

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

        // troubleshooting data file
        this.troubleshootingDataFilePath = `${app.DATA_DIR}/troubleshooting.json`
        if (!await FileUtils.checkExists(this.troubleshootingDataFilePath)) {
            Logger.info(`No troubleshooting data file found at ${this.troubleshootingDataFilePath}. Creating default...`);
            try {
                const result = await this.createDefaultTroubleshootingDataFile();
                if (result) {
                    Logger.info("Created default troubleshooting data file");
                }
            } catch (error) {
                Logger.error("There was an error while trying to create the default troubleshooting data file");
                Logger.error(error);
            }
        }
        const loadedData = await this.loadTroubleshootingDataFile();
        app.troubleshootingDataManager.addAll(loadedData);
        Logger.info(`Loaded ${loadedData.length} troubleshooting entries`);
    }

    public async reinitialize(): Promise<void> {
        app.roomManager.clear();
        app.buildingManager.clear();
        app.troubleshootingDataManager.clear();
        //TODO clear troubleshooting data
        //TODO clear images
        // app.imageManager.clear();
        await this.initialize();
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
            (key: any, value: any): any => {
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


    /**
     * Saves all of the troubleshooting data currently stored in the RoomManager
     * @returns true if successful otherwise false
     */
    public async saveTroubleshootingData(): Promise<boolean> {
        return await this.writeTroubleshootingDataFile(app.troubleshootingDataManager.getTroubleshootingData());
    }

    /**
     * Creates the troubleshooting data file with an example room
     * @returns true if successful otherwise false
     */
    private async createDefaultTroubleshootingDataFile(): Promise<boolean> {
        return await this.writeTroubleshootingDataFile([TroubleshootingDataUtils.exampleData]);
    }

    /**
     * Writes the specified troubleshooting data
     * Note: overwrites, does not append
     * @param data The troubleshooting data to be written to the file
     * @returns true if successful otherwise false
     */
    private async writeTroubleshootingDataFile(data: TroubleshootingData[]): Promise<boolean> {
        if (this.troubleshootingDataFilePath === undefined) throw new Error("Troubleshooting Data file path is undefined");
        return await FileUtils.writeJSON(
            this.troubleshootingDataFilePath,
            data
        );
    }

    /**
     * Loads troubleshooting data
     * @returns an array of the loaded troubleshooting data
     */
    private async loadTroubleshootingDataFile(): Promise<TroubleshootingData[]> {
        if (this.troubleshootingDataFilePath === undefined) throw new Error("Troubleshooting Data file path is undefined");
        const json = await FileUtils.readJSON<TroubleshootingData[]>(this.troubleshootingDataFilePath);
        if (json === undefined) throw new Error("Troubleshooting Data is corrupted");
        return json;
    }



    public async backup(): Promise<void> {
        Logger.info("Performing backup...");
        const now = new Date();

        const month = StringUtils.pad(`${now.getMonth()}`, "0", 2);
        const day = StringUtils.pad(`${now.getDate()}`, "0", 2);
        const hours = StringUtils.pad(`${now.getHours()}`, "0", 2);
        const minutes = StringUtils.pad(`${now.getMinutes()}`, "0", 2);
        const seconds = StringUtils.pad(`${now.getSeconds()}`, "0", 2);
        const nowStr = `${now.getFullYear()}${month}${day}${hours}${minutes}${seconds}`;
        Logger.info(`Backup directory: ${app.BACKUPS_DIR}/${nowStr}`);
        const destDir = `${app.BACKUPS_DIR}/${nowStr}`;
        if (await FileUtils.createDirectory(destDir)) Logger.info("Created directory");
        if (await FileUtils.copy(app.DATA_DIR, `${destDir}/data`)) Logger.info("Copied data");
        if (await FileUtils.copy(app.IMAGES_DIR, `${destDir}/images`)) Logger.info("Copied images");
        if (await FileUtils.copy(app.SETTINGS_DIR, `${destDir}/settings`)) Logger.info("Copied settings");
        Logger.info("Backup complete");
    }

    public async getRestoreOptions(): Promise<string[]> {
        const backups = await FileUtils.list(app.BACKUPS_DIR);
        return backups.map((backup): string => {
            return backup.path.replace(`${app.BACKUPS_DIR}/`, "");
        });
    }

    public async restore(restorePoint: string) {
        const path = `${app.BACKUPS_DIR}/${restorePoint}`;
        if (! await FileUtils.checkExists(path)) return;
        Logger.info(`Restoring to ${restorePoint}`);

        await FileUtils.delete(app.DATA_DIR);
        await FileUtils.delete(app.IMAGES_DIR);
        await FileUtils.delete(app.SETTINGS_DIR);

        await FileUtils.copy(`${path}/data`, app.DATA_DIR);
        await FileUtils.copy(`${path}/images`, app.IMAGES_DIR);
        await FileUtils.copy(`${path}/settings`, app.SETTINGS_DIR);

        await this.reinitialize();
    }

    public async save() {
        Logger.info("Saving buildings data...");
        await this.saveBuildings();
        Logger.info("Finished saving buildings data");
        Logger.info("Saving rooms data...");
        await this.saveRooms();
        Logger.info("Finished saving rooms data");
        Logger.info("Saving troubleshooting data...");
        await this.saveTroubleshootingData();
        Logger.info("Finished saving troubleshooting data");
    }

}