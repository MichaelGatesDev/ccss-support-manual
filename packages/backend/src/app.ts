import express, { Response } from "express";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { DataManager } from "./data-manager";

import indexRoute from "./routes/index";

class App {

    // ------------------------------------------------------ \\
    //              Configure express backend
    // ------------------------------------------------------ \\

    public expressApp: express.Application = express();

    private dataManager: DataManager;

    public constructor() {
        this.dataManager = new DataManager();
    }

    public async initialize(): Promise<void> {

        // Setup express stuff
        console.debug("Setting up express server...");
        this.setupExpress();
        console.debug("Finished setting up express server.");

        // Setup data
        try {
            await this.dataManager.initialize();
            console.log("Finished initializing data");
        } catch (error) {
            console.error("Failed to initialize data");
            console.error(error);
        }
    }

    public setupExpress(): void {
        console.debug("Setting up views");
        this.setupViews();

        console.debug("Using dev logger");
        this.expressApp.use(logger("dev"));

        console.debug("Setting up middleware");
        this.setupMiddleware();

        console.debug("Setting up static directories");
        this.expressApp.use("/images", express.static("public/images"));
        this.expressApp.use(express.static(path.join(__dirname, "dist")));

        console.debug("Setting up routes");
        this.expressApp.use("/", indexRoute);

        console.debug("Setting up static files to serve");
        this.expressApp.use("*", (res: express.Response): void => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });

        console.debug("Setting up error handling");
        this.setupErrorHandling();
    }

    public setupViews(): void {
        // view engine setup 
        this.expressApp.set("views", path.join(__dirname, "../views"));
        this.expressApp.set("view engine", "ejs");
    }

    public setupMiddleware(): void {
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({
            extended: false
        }));
        this.expressApp.use(cookieParser());
    }

    public setupErrorHandling(): void {
        //catch 404 and forward to error handler
        this.expressApp.use((next: express.NextFunction): void => {
            next(createError(404));
        });

        // development error handler
        // will print stacktrace
        if (this.expressApp.get("env") === "development") {

            this.expressApp.use((err: any, res: express.Response): void => {
                res.status(err["status"] || 500);
                res.render("error", {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        this.expressApp.use((err: any, res: Response): void => {
            res.status(err.status || 500);
            res.render("error", {
                message: err.message,
                error: {}
            });
        });
    }

    public getDataManager(): DataManager {
        return this.dataManager;
    }
}

const app = new App();
export default app.expressApp;
export { app };

// ------------------------------------------------------ \\