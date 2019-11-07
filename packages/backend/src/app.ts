import express, { Response, Request } from "express";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { Logger } from "@michaelgatesdev/common";
import { FileUtils } from "@michaelgatesdev/common-io";

import indexRoute from "./routes/index";
import { ConfigManager } from "./config-manager";
import { BuildingManager } from "./building-manager";
import { RoomManager } from "./room-manager";
import { ImageManager } from "./image-manager";
import { TroubleshootingDataManager } from "./troubleshooting-data-manager";
import { SpreadsheetManager } from "./spreadsheet-manager";
import { DataManager } from './data-manager';

export const expressApp: express.Application = express();

export class App {

    // ------------------------------------------------------ \\
    //              Configure express backend
    // ------------------------------------------------------ \\

    public ROOT_DIR: string = "./";
    public PUBLIC_DIR: string = `${this.ROOT_DIR}/public`;
    public TEMP_DIR: string = `${this.ROOT_DIR}/temp`;
    public DOWNLOADS_DIR: string = `${this.PUBLIC_DIR}/downloads`;
    public UPLOADS_DIR: string = `${this.PUBLIC_DIR}/uploads`;
    public BACKUPS_DIR: string = `${this.PUBLIC_DIR}/backups`;
    public DATA_DIR: string = `${this.PUBLIC_DIR}/data`;
    public SETTINGS_DIR: string = `${this.PUBLIC_DIR}/settings`;
    public IMAGES_DIR: string = `${this.PUBLIC_DIR}/images`;
    public BUILDING_IMAGES_DIR: string = `${this.IMAGES_DIR}/buildings`;

    public spreadsheetManager: SpreadsheetManager;
    public configManager: ConfigManager;
    public imageManager: ImageManager;
    public buildingManager: BuildingManager;
    public roomManager: RoomManager;
    public troubleshootingDataManager: TroubleshootingDataManager;
    public dataManager: DataManager;


    public constructor() {
        this.spreadsheetManager = new SpreadsheetManager();
        this.configManager = new ConfigManager();
        this.imageManager = new ImageManager();
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager();
        this.troubleshootingDataManager = new TroubleshootingDataManager();
        this.dataManager = new DataManager();
    }

    public async initialize(): Promise<void> {

        // Setup express stuff
        Logger.debug("Setting up express server...");
        Logger.debug("Setting up express server...");
        this.setupExpress();
        Logger.debug("Finished setting up express server.");


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

        // check for updates
        // if (this.configManager.appConfig !== undefined) {
        //     if (this.configManager.appConfig.checkForDataUpdates) {
        //         // await this.checkForUpdates();
        //     }
        // }

        await this.dataManager.initialize();


        // load images
        await this.imageManager.initialize();
    }

    public setupExpress(): void {
        Logger.debug("Setting up views");
        // view engine setup 
        expressApp.set("views", path.join(__dirname, "../views"));
        expressApp.set("view engine", "ejs");

        Logger.debug("Using dev logger");
        expressApp.use(logger("dev"));

        Logger.debug("Setting up middleware");
        expressApp.use(express.json());
        expressApp.use(express.urlencoded({
            extended: true,
        }));
        expressApp.use(cookieParser());

        Logger.debug("Setting up static directories");
        expressApp.use("/images", express.static("public/images"));
        expressApp.use(express.static(path.join(__dirname, "dist")));

        Logger.debug("Setting up routes");
        expressApp.use("/", indexRoute);

        Logger.debug("Setting up static files to serve");
        expressApp.use("*", (_req: Request, res: express.Response): void => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });

        Logger.debug("Setting up error handling");
        //catch 404 and forward to error handler
        expressApp.use((next: express.NextFunction): void => {
            next(createError(404));
        });

        // development error handler
        // will print stacktrace
        if (expressApp.get("env") === "development") {
            expressApp.use((err: any, res: express.Response): void => {
                res.status(err["status"] || 500);
                res.render("error", {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        expressApp.use((err: any, res: Response): void => {
            res.status(err.status || 500);
            res.render("error", {
                message: err.message,
                error: {}
            });
        });
    }

    public async setupDirectories(): Promise<void> {
        if (!await FileUtils.checkExists(this.PUBLIC_DIR)) {
            if (await FileUtils.createDirectory(this.PUBLIC_DIR)) {
                Logger.info(`Created public directory: ${this.PUBLIC_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.DOWNLOADS_DIR)) {
            if (await FileUtils.createDirectory(this.DOWNLOADS_DIR)) {
                Logger.info(`Created public directory: ${this.DOWNLOADS_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.UPLOADS_DIR)) {
            if (await FileUtils.createDirectory(this.UPLOADS_DIR)) {
                Logger.info(`Created public directory: ${this.UPLOADS_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.BACKUPS_DIR)) {
            if (await FileUtils.createDirectory(this.BACKUPS_DIR)) {
                Logger.info(`Created backups directory: ${this.BACKUPS_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.DATA_DIR)) {
            if (await FileUtils.createDirectory(this.DATA_DIR)) {
                Logger.info(`Created data directory: ${this.DATA_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.SETTINGS_DIR)) {
            if (await FileUtils.createDirectory(this.SETTINGS_DIR)) {
                Logger.info(`Created settings directory: ${this.SETTINGS_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.IMAGES_DIR)) {
            if (await FileUtils.createDirectory(this.IMAGES_DIR)) {
                Logger.info(`Created images directory: ${this.IMAGES_DIR}`);
            }
        }
    }

}

export const app = new App();

// ------------------------------------------------------ \\