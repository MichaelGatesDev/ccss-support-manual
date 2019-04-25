"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var DataManager_1 = require("./DataManager");
// import config = require('./config');
// import gdriveDownloader = require('./gdrive-downloader');
var index_1 = __importDefault(require("./routes/index"));
var App = /** @class */ (function () {
    function App() {
        // ------------------------------------------------------ \\
        //              Configure express backend
        // ------------------------------------------------------ \\
        this.app = express_1.default();
        this.dataManager = new DataManager_1.DataManager();
    }
    App.prototype.initialize = function () {
        console.debug("Setting up express server...");
        this.setupExpress();
        console.debug("Finished setting up express server.");
        // Get our data 
    };
    App.prototype.setupExpress = function () {
        console.debug("Setting up views");
        this.setupViews();
        console.debug("Using dev logger");
        this.app.use(morgan_1.default('dev'));
        console.debug("Setting up middleware");
        this.setupMiddleware();
        console.debug("Setting up static directories");
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
        console.debug("Setting up routes");
        this.app.use('/', index_1.default);
        console.debug("Setting up static files to serve");
        this.app.use('*', function (req, res) { return res.sendFile(path_1.default.join(__dirname, 'build', 'index.html')); });
        console.debug("Setting up error handling");
        this.setupErrorHandling();
    };
    App.prototype.setupViews = function () {
        // view engine setup
        this.app.set('views', path_1.default.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
    };
    App.prototype.setupMiddleware = function () {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({
            extended: false
        }));
        this.app.use(cookie_parser_1.default());
    };
    App.prototype.setupErrorHandling = function () {
        //catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            next(http_errors_1.default(404));
        });
        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use(function (err, req, res, next) {
                res.status(err['status'] || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    };
    App.prototype.getDataManager = function () {
        return this.dataManager;
    };
    return App;
}());
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
var app = new App();
app.initialize();
module.exports = app;
