import debug from "debug";
import http from "http";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { Logger } from "@michaelgatesdev/common";

import indexRoute from "./routes/";

export class ExpressServer {
  private readonly FALLBACK_PORT: number = 3001;

  private server?: http.Server;
  public port?: number;

  public expressApp: express.Application = express();

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Get port from environment and store in Express.
      const port = process.env.PORT
        ? this.normalizePort(process.env.PORT)
        : this.FALLBACK_PORT;
      this.expressApp.set("port", port);

      // Create HTTP Server
      this.server = http.createServer(this.expressApp);

      // Listen on provided port, on all network interfaces.
      this.server.listen(port);
      this.server.on("error", this.onError.bind(this));
      this.server.on("error", () => {
        return reject();
      });
      this.server.on("listening", this.onListening.bind(this));
      this.server.on("listening", () => {
        return resolve();
      });

      // === Configure express server ===

      // view engine setup
      this.expressApp.set("views", path.join(__dirname, "views"));
      this.expressApp.set("view engine", "ejs");

      this.expressApp.use(cors());
      this.expressApp.options("*", cors());

      this.expressApp.use(logger("dev"));

      this.expressApp.use(express.json());
      this.expressApp.use(
        express.urlencoded({
          extended: true,
        })
      );
      this.expressApp.use(cookieParser());

      this.expressApp.use("/", indexRoute);
    });
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  private normalizePort(val: string): number {
    return parseInt(val, 10);
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  private onError(error: { syscall: string; code: string }): void {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = "Port " + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        Logger.error(bind + " requires elevated privileges");
        return process.exit(1);
      case "EADDRINUSE":
        Logger.error(bind + " is already in use");
        return process.exit(1);
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening(): void {
    if (this.server === undefined) {
      Logger.error("Server is undefined!");
      return;
    }

    const addr = this.server.address();

    if (addr === null) {
      Logger.error("Server not running because no address found!");
      return;
    }

    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);

    Logger.debug(`Server running on ${bind}`);
  }
}
