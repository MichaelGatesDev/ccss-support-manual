import { app, BrowserWindow } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";

import { ExpressServer } from "@ccss-support-manual/backend";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1600,
    width: 900,
  });
  mainWindow.maximize();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // create web server
  const webServer = new ExpressServer();
  webServer
    .init()
    .then(() => {
      console.log("Web server initialized!");
      // when server is ready, load the

      if (electronIsDev) {
        mainWindow?.loadURL("http://localhost:3000");
      } else {
        mainWindow?.loadFile(path.join(__dirname, "index.html"));
      }
    })
    .catch(() => {
      console.error("Failed to start web server!");
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
