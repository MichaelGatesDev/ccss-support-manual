import express, { Router, Request, Response, NextFunction } from 'express';

import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { DataManager } from './DataManager';
// import config = require('./config');
// import gdriveDownloader = require('./gdrive-downloader');

import indexRoute from "./routes/index";

class App {

  // ------------------------------------------------------ \\
  //              Configure express backend
  // ------------------------------------------------------ \\

  public app: express.Application = express();

  private dataManager: DataManager;

  constructor() {
    this.dataManager = new DataManager();
  }

  public initialize() {
    console.debug("Setting up express server...");
    this.setupExpress();
    console.debug("Finished setting up express server.");

    // Get our data 

  }

  public setupExpress() {
    console.debug("Setting up views");
    this.setupViews();

    console.debug("Using dev logger");
    this.app.use(logger('dev'));

    console.debug("Setting up middleware");
    this.setupMiddleware();

    console.debug("Setting up static directories");
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(express.static(path.join(__dirname, 'build')));

    console.debug("Setting up routes");
    this.app.use('/', indexRoute);

    console.debug("Setting up static files to serve");
    this.app.use('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

    console.debug("Setting up error handling");
    this.setupErrorHandling();
  }

  public setupViews() {
    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
  }

  public setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({
      extended: false
    }));
    this.app.use(cookieParser());
  }

  public setupErrorHandling() {
    //catch 404 and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(createError(404));
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {

      this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err['status'] || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  }

  public getDataManager() {
    return this.dataManager;
  }
}

/*
// create the configs
config.create('config.json', defaultAppConfig)
  // after the config is created
  .then(function (created) {
    if (created) {
      console.log("Created default application configuration file.");
    }
    // load the config
    return config.load('config.json');
  })
  // after the config is loaded
  .then(async function (loadedConfig) {
    appConfig = loadedConfig;
    console.log("Finished loaded configuration file");


    if (appConfig.checkForDataUpdates) {
      console.log("Checking for updates to primary spreadsheet...");
      // check for updates to spreadsheets
      await gdriveDownloader.downloadSpreadsheet(
        appConfig.primarySpreadsheet.docID,
        "xlsx",
        appConfig.primarySpreadsheet.path,
        false
      )
        .then(function (downloaded) {
          if (downloaded)
            console.log("Finished downloading primary spreadsheet.");
          else
            console.log("Primary spreadsheet already exists.");
        })
        .catch(function (err) {
          console.error(err);
        });

      console.log("Checking for updates to secondary spreadsheet...");
      await gdriveDownloader.downloadSpreadsheet(
        appConfig.secondarySpreadsheet.docID,
        "xlsx",
        appConfig.secondarySpreadsheet.path,
        false
      )
        .then(function (downloaded) {
          if (downloaded)
            console.log("Finished downloading secondary spreadsheet.");
          else
            console.log("Secondary spreadsheet already exists.");
        })
        .catch(function (err) {
          console.error(err);
        });
    }

    if (appConfig.checkForProgramUpdates) {
      // check for program updates
    }


    // load primary(troubleshooting) spreadsheet
    console.log("Loading data from primary spreadsheet...");
    return dataHelper.loadPrimarySpreadsheet(appConfig.primarySpreadsheet);
  })
  // after we load data from the primary spreadsheet
  .then(function () {
    console.log("Finished loading data from primary spreadsheet");

    // load secondary(troubleshooting) spreadsheet
    console.log("Loading data from secondary spreadsheet...");
    return dataHelper.loadSecondarySpreadsheet(appConfig.secondarySpreadsheet);
  })
  // after we load data from the secondary (troubleshooting) spreadsheet
  .then(function () {
    console.log("Finished loading datafrom secondary spreadsheet");

    // load images
    console.log("Loading images...");
    return dataHelper.loadImages(appConfig.images_directory);
  })
  // load all images
  .then(function () {
    console.log("Loaded application images");
  })
  // catch any errors
  .catch(function (err) {
    console.log(err);
    process.exit();
    return;
  });
*/


// ------------------------------------------------------ \\

let app = new App();
app.initialize();

export = app;