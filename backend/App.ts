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

  public expressApp: express.Application = express();

  private dataManager: DataManager;

  constructor() {
    this.dataManager = new DataManager();
  }

  public async initialize(): Promise<void> {

    // Setup express stuff
    console.debug("Setting up express server...");
    this.setupExpress();
    console.debug("Finished setting up express server.");

    // Setup data
    await this.dataManager.initialize()
      .then(function () {
        console.log("Finished initializing data");
      }).catch(function (err) {
        console.error("Failed to initialize data");
        console.error(err);
      });
  }

  public setupExpress(): void {
    console.debug("Setting up views");
    this.setupViews();

    console.debug("Using dev logger");
    this.expressApp.use(logger('dev'));

    console.debug("Setting up middleware");
    this.setupMiddleware();

    console.debug("Setting up static directories");
    this.expressApp.use(express.static(path.join(__dirname, 'public')));
    this.expressApp.use(express.static(path.join(__dirname, 'build')));

    console.debug("Setting up routes");
    this.expressApp.use('/', indexRoute);

    console.debug("Setting up static files to serve");
    this.expressApp.use('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

    console.debug("Setting up error handling");
    this.setupErrorHandling();
  }

  public setupViews(): void {
    // view engine setup
    this.expressApp.set('views', path.join(__dirname, 'views'));
    this.expressApp.set('view engine', 'ejs');
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
    this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
      next(createError(404));
    });

    // development error handler
    // will print stacktrace
    if (this.expressApp.get('env') === 'development') {

      this.expressApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err['status'] || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    this.expressApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500);
      res.render('error', {
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
app.initialize();

export default app.expressApp;
export { app };


/*    
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