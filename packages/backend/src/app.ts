import path from "path";
import nodeCleanup from "node-cleanup";
import { Logger } from "@michaelgatesdev/common";
import { FileUtils } from "@michaelgatesdev/common-io";

import { ConfigManager } from "./config-manager";
import { BuildingManager } from "./building-manager";
import { RoomManager } from "./room-manager";
import { ImageManager } from "./image-manager";
import { TroubleshootingDataManager } from "./troubleshooting-data-manager";
import { SpreadsheetManager } from "./spreadsheet-manager";
import { DataManager } from "./data-manager";
import { BackupManager } from "./backup-manager";
// import { UpdateManager } from "./update-manager";

export class App {
  // detect running mode (dev or prod)
  public isProduction = !process.title.toLowerCase().includes("node");
  // root package.json file
  //   public masterPackageJSON: {
  //     name: string;
  //     version: string;
  //   } = require("../../../package.json");

  // ------------------------------------------------------ \\
  //              Directories
  // ------------------------------------------------------ \\
  // public ROOT_DIR: string = path.resolve(this.isProduction ? path.resolve(process.execPath.replace(process.title.split(path.sep).slice(-1)[0], "")) : "./");
  public ROOT_DIR: string = path.resolve("./");
  public PUBLIC_DIR: string = path.join(this.ROOT_DIR, "public");
  public TEMP_DIR: string = path.join(this.ROOT_DIR, "temp");
  public DOWNLOADS_DIR: string = path.join(this.PUBLIC_DIR, "downloads");
  public UPLOADS_DIR: string = path.join(this.PUBLIC_DIR, "uploads");
  public BACKUPS_DIR: string = path.join(this.PUBLIC_DIR, "backups");
  public DATA_DIR: string = path.join(this.PUBLIC_DIR, "data");
  public SETTINGS_DIR: string = path.join(this.PUBLIC_DIR, "settings");
  public IMAGES_DIR: string = path.join(this.PUBLIC_DIR, "images");
  public BUILDING_IMAGES_DIR: string = path.join(this.IMAGES_DIR, "buildings");

  // ------------------------------------------------------ \\
  //              Managers
  // ------------------------------------------------------ \\
  public spreadsheetManager: SpreadsheetManager;
  public configManager: ConfigManager;
  public imageManager: ImageManager;
  public buildingManager: BuildingManager;
  public roomManager: RoomManager;
  public troubleshootingDataManager: TroubleshootingDataManager;
  public dataManager: DataManager;
  public backupManager: BackupManager;
  // public updateManager: UpdateManager;

  public constructor() {
    this.spreadsheetManager = new SpreadsheetManager();
    this.configManager = new ConfigManager();
    this.imageManager = new ImageManager();
    this.buildingManager = new BuildingManager();
    this.roomManager = new RoomManager(this.buildingManager);
    this.troubleshootingDataManager = new TroubleshootingDataManager();
    this.dataManager = new DataManager();
    this.backupManager = new BackupManager();
    // this.updateManager = new UpdateManager();
  }

  public async initialize(): Promise<void> {
    // Console ascii notice
    Logger.debug("");
    Logger.debug("|==================================================|");
    Logger.debug("|--------------------------------------------------|");
    Logger.debug("| * Classroom & Customer Support Services Manual * |");
    Logger.debug("|--------------------------------------------------|");
    Logger.debug("|==================================================|");
    Logger.debug("");
    // Logger.debug(`>> Application Version: ${this.masterPackageJSON?.version}`);
    Logger.debug(`>> Production Mode: ${this.isProduction}`);
    Logger.debug("");

    // create directories
    await this.setupDirectories();

    // create and load configuration files
    try {
      Logger.info("Initializing configuration manager...");
      await this.configManager.initialize();
      Logger.info("Finished initializing configuration manager");
    } catch (error) {
      Logger.error(error);
    }

    // // cleanup updates
    // await this.updateManager.initialize();
    // // check for updates
    // if (this.configManager.appConfig?.checkUpdates && this.isProduction) {
    //     try {
    //         Logger.info(`Current version: ${this.masterPackageJSON?.version}`);

    //         Logger.info("Checking for updates...");
    //         const available = await this.updateManager.check();
    //         if (available) {
    //             Logger.info(`New version found: ${this.updateManager?.latestVersion?.version}`);
    //             if (this.configManager.appConfig.applyUpdates) {
    //                 Logger.info("Downloading new update...")
    //                 await this.updateManager.downloadAndApplyUpdate();
    //             }
    //         } else {
    //             Logger.info("Application is up-to-date!");
    //         }
    //     } catch (error) {
    //         Logger.error("There was an error checking for updates");
    //         Logger.error(error);
    //     }
    // }

    // load data
    await this.dataManager.initialize();

    // load images
    await this.imageManager.initialize();
  }

  public deinitialize(): void {
    Logger.debug("TODO: deinitialize application");
  }

  public async reinitialize(): Promise<void> {
    // create directories
    await this.setupDirectories();

    // create and load configuration files
    try {
      Logger.info("Initializing configuration manager...");
      await this.configManager.initialize();
      Logger.info("Finished initializing configuration manager");
    } catch (error) {
      Logger.error(error);
    }

    await this.dataManager.initialize();

    await this.imageManager.initialize();
  }

  public async setupDirectories(): Promise<void> {
    await Promise.all([
      this.createDirectory(this.PUBLIC_DIR),
      this.createDirectory(this.DOWNLOADS_DIR),
      this.createDirectory(this.UPLOADS_DIR),
      this.createDirectory(this.BACKUPS_DIR),
      this.createDirectory(this.DATA_DIR),
      this.createDirectory(this.SETTINGS_DIR),
      this.createDirectory(this.IMAGES_DIR),
    ]);
  }

  public async createDirectory(path: string): Promise<void> {
    try {
      if (await FileUtils.checkExists(path)) return;
      await FileUtils.createDirectory(path);
      Logger.info(`Created directory ${path}`);
    } catch (error) {
      Logger.error(error);
    }
  }

  public async copy(path: string, dest: string): Promise<void> {
    try {
      await FileUtils.copy(path, dest);
      Logger.info(`Copied directory ${path} to ${dest}`);
    } catch (error) {
      Logger.error(error);
    }
  }

  public async rename(path: string, dest: string): Promise<void> {
    try {
      await FileUtils.copy(path, dest);
      Logger.info(`Renamed ${path} to ${dest}`);
    } catch (error) {
      Logger.error(error);
    }
  }
}

export const app = new App();

nodeCleanup(function(exitCode, signal) {
  Logger.debug(`Exiting program. Exit code: ${exitCode}, Signal: ${signal}`);
  // release resources here before node exits
  // app.deinitialize();
});

// ------------------------------------------------------ \\
