import path from "path";
import { Logger } from "@michaelgatesdev/common";
import { FileUtils } from "@michaelgatesdev/common-io";

import {
  BuildingUtils,
  RoomUtils,
  TroubleshootingDataUtils,
} from "@ccss-support-manual/utilities";
import {
  Building,
  Room,
  TroubleshootingData,
} from "@ccss-support-manual/models";

import { App } from "./app";

export class DataManager {
  private readonly app: App;
  public buildingsFileName = "buildings.json";
  private buildingsFilePath?: string;
  public roomsFileName = "rooms.json";
  private roomsFilePath?: string;
  public troubleshootingFileName = "troubleshooting.json";
  private troubleshootingFilePath?: string;

  constructor(app: App) {
    this.app = app;
  }

  public async initialize(): Promise<void> {
    // buildings file
    this.buildingsFilePath = path.join(
      this.app.DATA_DIR,
      this.buildingsFileName
    );
    if (!(await FileUtils.checkExists(this.buildingsFilePath))) {
      Logger.info(
        `No buildings file found at ${this.buildingsFilePath}. Creating default...`
      );
      try {
        await this.createDefaultBuildingsFile();
        Logger.info("Created default buildings file");
      } catch (error) {
        Logger.error(
          "There was an error while trying to create the default buildings file"
        );
        Logger.error(error);
      }
    }
    const loadedBuildings = await this.loadBuildingsFile();
    this.app.buildingManager.addBuildings(loadedBuildings);
    Logger.info(`Loaded ${loadedBuildings.length} buildings`);

    // rooms file
    this.roomsFilePath = path.join(this.app.DATA_DIR, this.roomsFileName);
    if (!(await FileUtils.checkExists(this.roomsFilePath))) {
      Logger.info(
        `No rooms file found at ${this.roomsFilePath}. Creating default...`
      );
      try {
        await this.createDefaultRoomsFile();
        Logger.info("Created default rooms file");
      } catch (error) {
        Logger.error(
          "There was an error while trying to create the default rooms file"
        );
        Logger.error(error);
      }
    }
    const loadedRooms = await this.loadRoomsFile();
    this.app.roomManager.addRooms(loadedRooms);
    Logger.info(`Loaded ${loadedRooms.length} rooms`);

    // troubleshooting data file
    this.troubleshootingFilePath = path.join(
      this.app.DATA_DIR,
      this.troubleshootingFileName
    );
    if (!(await FileUtils.checkExists(this.troubleshootingFilePath))) {
      Logger.info(
        `No troubleshooting data file found at ${this.troubleshootingFilePath}. Creating default...`
      );
      try {
        await this.createDefaultTroubleshootingDataFile();
        Logger.info("Created default troubleshooting data file");
      } catch (error) {
        Logger.error(
          "There was an error while trying to create the default troubleshooting data file"
        );
        Logger.error(error);
      }
    }
    const loadedData = await this.loadTroubleshootingDataFile();
    this.app.troubleshootingDataManager.addAll(loadedData);
    Logger.info(`Loaded ${loadedData.length} troubleshooting entries`);
  }

  public async reinitialize(): Promise<void> {
    this.app.roomManager.clear();
    this.app.buildingManager.clear();
    this.app.troubleshootingDataManager.clear();
    //TODO clear images
    // app.imageManager.clear();
    await this.initialize();
  }

  public async nuke(): Promise<void> {
    this.app.roomManager.clear();
    this.app.buildingManager.clear();
    this.app.troubleshootingDataManager.clear();
    await this.save();
    this.app.imageManager.clear();
    await FileUtils.delete(this.app.IMAGES_DIR);
    await FileUtils.createDirectory(this.app.IMAGES_DIR);
  }

  /**
   * Saves all of the buildings currently stored in the BuildingManager
   * @returns true if successful otherwise false
   */
  public async saveBuildings(): Promise<void> {
    await this.writeBuildingsFile(this.app.buildingManager.buildings);
  }

  /**
   * Creates the buildings file with an example building
   * @returns true if successful otherwise false
   */
  private async createDefaultBuildingsFile(): Promise<void> {
    await this.writeBuildingsFile([BuildingUtils.exampleBuilding]);
  }

  /**
   * Writes the specified buildings
   * Note: overwrites, does not append
   * @param buildings The buildings to be written to the file
   * @returns true if successful otherwise false
   */
  private async writeBuildingsFile(buildings: Building[]): Promise<void> {
    if (this.buildingsFilePath === undefined)
      throw new Error("Buildings file path is undefined");
    return FileUtils.writeJSON(
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
    if (this.buildingsFilePath === undefined)
      throw new Error("Buildings file path is undefined");
    const json = await FileUtils.readJSON<Building[]>(this.buildingsFilePath);
    if (json === undefined) throw new Error("Buildings data is corrupted");
    return json;
  }

  /**
   * Saves all of the rooms currently stored in the RoomManager
   * @returns true if successful otherwise false
   */
  public async saveRooms(): Promise<void> {
    await this.writeRoomsFile(this.app.roomManager.getRooms());
  }

  /**
   * Creates the rooms file with an example room
   * @returns true if successful otherwise false
   */
  private async createDefaultRoomsFile(): Promise<void> {
    await this.writeRoomsFile([
      RoomUtils.exampleRoom,
      RoomUtils.exampleClassroom,
      RoomUtils.exampleSmartClassroom,
    ]);
  }

  /**
   * Writes the specified rooms
   * Note: overwrites, does not append
   * @param rooms The rooms to be written to the file
   * @returns true if successful otherwise false
   */
  private async writeRoomsFile(rooms: Room[]): Promise<void> {
    if (this.roomsFilePath === undefined)
      throw new Error("Rooms file path is undefined");
    return FileUtils.writeJSON(this.roomsFilePath, rooms);
  }

  /**
   * Loads rooms
   * @returns an array of the loaded rooms
   */
  private async loadRoomsFile(): Promise<Room[]> {
    if (this.roomsFilePath === undefined)
      throw new Error("Rooms file path is undefined");
    const json = await FileUtils.readJSON<Room[]>(this.roomsFilePath);
    if (json === undefined) throw new Error("Rooms data is corrupted");
    return json;
  }

  /**
   * Saves all of the troubleshooting data currently stored in the RoomManager
   * @returns true if successful otherwise false
   */
  public async saveTroubleshootingData(): Promise<void> {
    await this.writeTroubleshootingDataFile(
      this.app.troubleshootingDataManager.getTroubleshootingData()
    );
  }

  /**
   * Creates the troubleshooting data file with an example room
   * @returns true if successful otherwise false
   */
  private async createDefaultTroubleshootingDataFile(): Promise<void> {
    await this.writeTroubleshootingDataFile([
      TroubleshootingDataUtils.exampleData,
    ]);
  }

  /**
   * Writes the specified troubleshooting data
   * Note: overwrites, does not append
   * @param data The troubleshooting data to be written to the file
   * @returns true if successful otherwise false
   */
  private async writeTroubleshootingDataFile(
    data: TroubleshootingData[]
  ): Promise<void> {
    if (this.troubleshootingFilePath === undefined)
      throw new Error("Troubleshooting Data file path is undefined");
    return await FileUtils.writeJSON(this.troubleshootingFilePath, data);
  }

  /**
   * Loads troubleshooting data
   * @returns an array of the loaded troubleshooting data
   */
  private async loadTroubleshootingDataFile(): Promise<TroubleshootingData[]> {
    if (this.troubleshootingFilePath === undefined)
      throw new Error("Troubleshooting Data file path is undefined");
    const json = await FileUtils.readJSON<TroubleshootingData[]>(
      this.troubleshootingFilePath
    );
    if (json === undefined)
      throw new Error("Troubleshooting Data is corrupted");
    return json;
  }

  public async save(): Promise<void> {
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
