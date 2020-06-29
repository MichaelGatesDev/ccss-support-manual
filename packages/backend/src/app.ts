import path from "path";
import winston from "winston";
import { FileUtils } from "@michaelgatesdev/common-io";

import { ConfigManager } from "./config-manager";
import { BuildingManager } from "./building-manager";
import { RoomManager } from "./room-manager";
import { ImageManager } from "./image-manager";
import { TroubleshootingDataManager } from "./troubleshooting-data-manager";
// import { SpreadsheetManager } from "./spreadsheet-manager";
import { DataManager } from "./data-manager";
import { BackupManager } from "./backup-manager";
// import { UpdateManager } from "./update-manager";

// create logger
const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}][${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), loggerFormat),
  transports: [new winston.transports.File({ filename: "error.log", level: "error" }), new winston.transports.Console()],
});

export class App {
  // ------------------------------------------------------ \\
  //              Directories
  // ------------------------------------------------------ \\
  public readonly ROOT_DIR: string = path.resolve("./");
  public readonly APP_DATA_DIR: string = path.join(this.ROOT_DIR, "appdata");
  public readonly DOWNLOADS_DIR: string = path.join(this.APP_DATA_DIR, "downloads");
  public readonly BACKUPS_DIR: string = path.join(this.APP_DATA_DIR, "backups");
  public readonly DATA_DIR: string = path.join(this.APP_DATA_DIR, "data");
  public readonly SETTINGS_DIR: string = path.join(this.APP_DATA_DIR, "settings");
  public readonly IMAGES_DIR: string = path.join(this.APP_DATA_DIR, "images");
  public readonly BUILDING_IMAGES_DIR: string = path.join(this.IMAGES_DIR, "buildings");

  // ------------------------------------------------------ \\
  //              Managers
  // ------------------------------------------------------ \\
  // public spreadsheetManager: SpreadsheetManager;
  public configManager: ConfigManager;
  public imageManager: ImageManager;
  public buildingManager: BuildingManager;
  public roomManager: RoomManager;
  public troubleshootingDataManager: TroubleshootingDataManager;
  public dataManager: DataManager;
  public backupManager: BackupManager;

  public constructor() {
    // this.spreadsheetManager = new SpreadsheetManager(this);
    this.configManager = new ConfigManager(this);
    this.imageManager = new ImageManager(this);
    this.buildingManager = new BuildingManager(this);
    this.roomManager = new RoomManager(this);
    this.troubleshootingDataManager = new TroubleshootingDataManager(this);
    this.dataManager = new DataManager(this);
    this.backupManager = new BackupManager(this);
  }

  public async initialize(): Promise<void> {
    // Console ascii notice
    logger.debug("");
    logger.debug("|==================================================|");
    logger.debug("|--------------------------------------------------|");
    logger.debug("| * Classroom & Customer Support Services Manual * |");
    logger.debug("|--------------------------------------------------|");
    logger.debug("|==================================================|");
    logger.debug("");

    // create directories
    await this.setupDirectories();

    // create and load configuration files
    try {
      logger.info("Initializing configuration manager...");
      await this.configManager.initialize();
      logger.info("Finished initializing configuration manager");
    } catch (error) {
      logger.error(error);
    }

    // load data
    await this.dataManager.initialize();

    // load images
    await this.imageManager.initialize();
  }

  public async reinitialize(): Promise<void> {
    // create directories
    await this.setupDirectories();

    // create and load configuration files
    try {
      logger.info("Initializing configuration manager...");
      await this.configManager.initialize();
      logger.info("Finished initializing configuration manager");
    } catch (error) {
      logger.error(error);
    }

    await this.dataManager.initialize();

    await this.imageManager.initialize();
  }

  public async setupDirectories(): Promise<void> {
    await Promise.all([
      this.createDirectory(this.APP_DATA_DIR),
      this.createDirectory(this.DOWNLOADS_DIR),
      this.createDirectory(this.BACKUPS_DIR),
      this.createDirectory(this.DATA_DIR),
      this.createDirectory(this.SETTINGS_DIR),
      this.createDirectory(this.IMAGES_DIR),
    ]);
  }

  public async createDirectory(targetPath: string): Promise<void> {
    try {
      if (await FileUtils.checkExists(targetPath)) return;
      await FileUtils.createDirectory(targetPath);
      logger.info(`Created directory ${path.resolve(targetPath).replace(this.ROOT_DIR, ".\\")}`);
    } catch (error) {
      logger.error(error);
    }
  }

  public async copy(targetPath: string, dest: string): Promise<void> {
    try {
      await FileUtils.copy(targetPath, dest);
      logger.info(`Copied directory ${targetPath} to ${dest}`);
    } catch (error) {
      logger.error(error);
    }
  }

  public async rename(targetPath: string, dest: string): Promise<void> {
    try {
      await FileUtils.copy(targetPath, dest);
      logger.info(`Renamed ${targetPath} to ${dest}`);
    } catch (error) {
      logger.error(error);
    }
  }
}

export const app = new App();

// ------------------------------------------------------ \\
