#!/usr/bin/env node

import expressApp, { app } from "./app";

import debug from "debug";
import http from "http";

class ServerWrapper {

    public port?: number;

    public constructor() {
    }

    public init(): void {

        // Get port from environment and store in Express.
        const port = this.normalizePort(process.env.PORT || "3001");
        expressApp.set("port", port);

        // Create HTTP Server
        const server = http.createServer(expressApp);

        // Listen on provided port, on all network interfaces.
        server.listen(port);
        server.on("error", this.onError);
        server.on("listening", this.onListening);
    }

    /**
     * Normalize a port into a number, string, or false.
     */
    public normalizePort(val: string): boolean | number | string {
        return parseInt(val, 10);;
    }


    /**
     * Event listener for HTTP server "error" event.
     */
    public onError(error: { syscall: string; code: string }): void {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = "Port " + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    public onListening(server: http.Server): void {
        const addr = server.address();

        if (addr === null) {
            console.error("Server not running because no address found!");
            return;
        }

        const bind = typeof addr === "string" ?
            "pipe " + addr :
            "port " + addr.port;
        debug("Listening on " + bind);

        console.log(`Server running on ${bind}`);
    }
}


const myServer: ServerWrapper = new ServerWrapper();
myServer.init();

app.initialize();