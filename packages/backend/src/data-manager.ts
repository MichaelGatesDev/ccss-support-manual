import { Logger, StringUtils } from '@michaelgatesdev/common';
import { FileUtils } from "@michaelgatesdev/common-io";

import { app } from './app';
import { BuildingUtils, RoomUtils, TroubleshootingDataUtils } from '@ccss-support-manual/utilities';
import { Building, Room, TroubleshootingData, BackupRestoreOptions } from '@ccss-support-manual/models';


export class DataManager {

    public buildingsFileName = "buildings.json";
    private buildingsFilePath?: string;

    public roomsFileName = "rooms.json";
    private roomsFilePath?: string;

    public troubleshootingFileName = "troubleshooting.json";
    private troubleshootingFilePath?: string;

    public async initialize(): Promise<void> {

        // buildings file
        this.buildingsFilePath = `${app.DATA_DIR}/${this.buildingsFileName}`
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
        this.roomsFilePath = `${app.DATA_DIR}/${this.roomsFileName}`
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
        this.troubleshootingFilePath = `${app.DATA_DIR}/${this.troubleshootingFileName}`
        if (!await FileUtils.checkExists(this.troubleshootingFilePath)) {
            Logger.info(`No troubleshooting data file found at ${this.troubleshootingFilePath}. Creating default...`);
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
        if (this.troubleshootingFilePath === undefined) throw new Error("Troubleshooting Data file path is undefined");
        return await FileUtils.writeJSON(
            this.troubleshootingFilePath,
            data
        );
    }

    /**
     * Loads troubleshooting data
     * @returns an array of the loaded troubleshooting data
     */
    private async loadTroubleshootingDataFile(): Promise<TroubleshootingData[]> {
        if (this.troubleshootingFilePath === undefined) throw new Error("Troubleshooting Data file path is undefined");
        const json = await FileUtils.readJSON<TroubleshootingData[]>(this.troubleshootingFilePath);
        if (json === undefined) throw new Error("Troubleshooting Data is corrupted");
        return json;
    }



    public async backup(options: BackupRestoreOptions): Promise<void> {
        if (StringUtils.isBlank(options.name)) throw new Error("The backup name can not be blank!");
        const destDir = `${app.BACKUPS_DIR}/${options.name}`;
        Logger.info(`Performing backup (${app.BACKUPS_DIR}/${options.name})`);
        if (await FileUtils.createDirectory(destDir)) Logger.info("Created directory");

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            if (dataOptions.all) {
                if (await FileUtils.copy(app.DATA_DIR, `${destDir}/data`)) Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.buildingsFileName}`, `${destDir}/data/${this.buildingsFileName}`)) Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.roomsFileName}`, `${destDir}/data/${this.roomsFileName}`)) Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.troubleshootingFileName}`, `${destDir}/data/${this.troubleshootingFileName}`)) Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            if (imageOptions.all) {
                if (await FileUtils.copy(app.IMAGES_DIR, `${destDir}/images`)) Logger.info("Copied all images");
            }
            else {
                //TODO implement specific image type
            }
        }

        const settingsOptions = options.settings;
        if (settingsOptions !== undefined) {
            if (settingsOptions.all) {
                if (await FileUtils.copy(app.SETTINGS_DIR, `${destDir}/settings`)) Logger.info("Copied all settings");
            }
            else {
                //TODO implement specific image type
            }
        }

        Logger.info("Backup complete");
    }

    public async getRestoreOptions(): Promise<string[]> {
        const backups = await FileUtils.list(app.BACKUPS_DIR);
        return backups.map((backup): string => {
            return backup.path.replace(`${app.BACKUPS_DIR}/`, "");
        });
    }

    public async restore(options: BackupRestoreOptions) {
        const path = `${app.BACKUPS_DIR}/${options.name}`;
        if (StringUtils.isBlank(options.name)) throw new Error("The restore name can not be blank!");
        Logger.info(`Performing restore (${app.BACKUPS_DIR}/${options.name})`);

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            // await FileUtils.delete(app.DATA_DIR);
            // await FileUtils.createDirectory(app.DATA_DIR);
            if (dataOptions.all) {
                if (await FileUtils.copy(`${path}/data`, app.DATA_DIR)) Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    if (await FileUtils.copy(`${path}/data/${this.buildingsFileName}`, `${app.DATA_DIR}/${this.buildingsFileName}`)) Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    if (await FileUtils.copy(`${path}/data/${this.roomsFileName}`, `${app.DATA_DIR}/${this.roomsFileName}`)) Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    if (await FileUtils.copy(`${path}/data/${this.troubleshootingFileName}`, `${app.DATA_DIR}/${this.troubleshootingFileName}`)) Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            // await FileUtils.delete(app.IMAGES_DIR);
            // await FileUtils.createDirectory(app.IMAGES_DIR);
            if (imageOptions.all) {
                if (await FileUtils.copy(`${path}/images`, app.IMAGES_DIR)) Logger.info("Copied all images");
            }
            else {
                //TODO implement specific image type
            }
        }

        const settingsOptions = options.settings;
        if (settingsOptions !== undefined) {
            // await FileUtils.delete(app.SETTINGS_DIR);
            // await FileUtils.createDirectory(app.SETTINGS_DIR);
            if (settingsOptions.all) {
                if (await FileUtils.copy(`${path}/settings`, app.SETTINGS_DIR)) Logger.info("Copied all settings");
            }
            else {
                //TODO implement specific image type
            }
        }

        Logger.info("Restore complete");

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