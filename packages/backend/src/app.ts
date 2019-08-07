import express, { Response } from "express";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRoute from "./routes/index";
import { ConfigManager } from "./config-manager";
import { BuildingManager } from "./building-manager";
import { RoomManager } from "./room-manager";
import { ImageManager } from "./image-manager";
import { TroubleshootingDataManager } from "./troubleshooting-data-manager";
import { SpreadsheetManager } from "./spreadsheet-manager";
import { FileUtils } from "@ccss-support-manual/utilities";

export const expressApp: express.Application = express();

export class App {

    // ------------------------------------------------------ \\
    //              Configure express backend
    // ------------------------------------------------------ \\

    public ROOT_DIR: string = path.resolve("./");
    public PUBLIC_DIR: string = path.join(this.ROOT_DIR, "/public");
    public SETTINGS_DIR: string = path.join(this.PUBLIC_DIR, "/settings");
    public IMAGES_DIR: string = path.join(this.PUBLIC_DIR, "/images");
    public BUILDING_IMAGES_DIR: string = path.join(this.IMAGES_DIR, "/buildings");

    public spreadsheetManager: SpreadsheetManager;
    public configManager: ConfigManager;
    public imageManager: ImageManager;
    public buildingManager: BuildingManager;
    public roomManager: RoomManager;
    public troubleshootingDataManager: TroubleshootingDataManager;


    public constructor() {
        this.spreadsheetManager = new SpreadsheetManager();
        this.configManager = new ConfigManager();
        this.imageManager = new ImageManager();
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        this.troubleshootingDataManager = new TroubleshootingDataManager(this.roomManager);
    }

    public async initialize(): Promise<void> {

        // Setup express stuff
        console.debug("Setting up express server...");
        this.setupExpress();
        console.debug("Finished setting up express server.");

        // create directories 
        this.setupDirectories();

        // 
        await this.configManager.initialize();

        // check for updates
        if (this.configManager.appConfig !== undefined) {
            if (this.configManager.appConfig.checkForDataUpdates) {
                // await this.checkForUpdates();
            }
        }

        // // Setup data
        // try {
        //     await this.spreadsheetManager.initialize();
        //     console.log("Finished initializing data");
        // } catch (error) {
        //     console.error("Failed to initialize data");
        //     console.error(error);
        // }


        // load images
        await this.imageManager.initialize();
    }

    public setupExpress(): void {
        console.debug("Setting up views");
        // view engine setup 
        expressApp.set("views", path.join(__dirname, "../views"));
        expressApp.set("view engine", "ejs");

        console.debug("Using dev logger");
        expressApp.use(logger("dev"));

        console.debug("Setting up middleware");
        expressApp.use(express.json());
        expressApp.use(express.urlencoded({
            extended: false
        }));
        expressApp.use(cookieParser());

        console.debug("Setting up static directories");
        expressApp.use("/images", express.static("public/images"));
        expressApp.use(express.static(path.join(__dirname, "dist")));

        console.debug("Setting up routes");
        expressApp.use("/", indexRoute);

        console.debug("Setting up static files to serve");
        expressApp.use("*", (res: express.Response): void => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });

        console.debug("Setting up error handling");
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
                console.log(`Created data directory: ${this.PUBLIC_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.SETTINGS_DIR)) {
            if (await FileUtils.createDirectory(this.SETTINGS_DIR)) {
                console.log(`Created settings directory: ${this.SETTINGS_DIR}`);
            }
        }
        if (!await FileUtils.checkExists(this.IMAGES_DIR)) {
            if (await FileUtils.createDirectory(this.IMAGES_DIR)) {
                console.log(`Created images directory: ${this.IMAGES_DIR}`);
            }
        }
    }

}

export const app = new App();

// ------------------------------------------------------ \\