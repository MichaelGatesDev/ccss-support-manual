import { app, BrowserWindow } from "electron";

require("./backend/main.js");

(async () => {
  const createWindow = () => {
    // Create the browser window.
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: false,
      },
    });

    // and load the index.html of the app.
    win
      .loadFile("public/index.html")
      .then(() => {
        console.log("Loaded react app!");
      })
      .catch(e => {
        console.error(e);
      });
  };

  app.whenReady().then(createWindow);
})();
