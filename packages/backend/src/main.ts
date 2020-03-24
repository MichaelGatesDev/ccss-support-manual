import { ServerWrapper } from "./server";
import { app } from "./app";
import nodeCleanup from "node-cleanup";

// create new server wrapper
const myServer: ServerWrapper = new ServerWrapper();
myServer.init();

// initialize the application
app.initialize();

nodeCleanup(function(exitCode, signal) {
  console.log(exitCode);
  console.log(signal);
  // release resources here before node exits
  app.deinitialize();
});
