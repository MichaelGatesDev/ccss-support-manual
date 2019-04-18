var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dataHelper = require('./data-helper');
var config = require('./config');
var gdriveDownloader = require('./gdrive-downloader');

var indexRouter = require('./routes/index');


// ------------------------------------------------------ \\
//              Configure express backend
// ------------------------------------------------------ \\

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', indexRouter);
app.use('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// ------------------------------------------------------ \\
//              Application Configuration
// ------------------------------------------------------ \\

var defaultAppConfig = {

  checkForDataUpdates: false,
  checkForProgramUpdates: false,

  primarySpreadsheet: {
    docID: '',
    path: 'public/primary.xlsx',

    buildingsSheetName: 'Buildings',
    officialNameHeader: 'Official Name',
    nicknamesHeader: 'Nicknames',

    roomsSheetName: 'Rooms',
    roomTimestampHeader: 'Timestamp',
    roomBuildingHeader: 'Building',
    roomNumberHeader: 'Number',
    roomNameHeader: 'Name',
    roomTypeHeader: 'Type',
    roomLockTypeHeader: 'Lock Type',
    roomCapacityHeader: 'Capacity',

    roomFurnitureTypeHeader: 'Furniture Type',
    roomChairCountHeader: 'Chair Count',
    roomTableCountHeader: 'Table Count',
    roomPhoneExtensionHeader: 'Phone Extension',
    roomPhoneStatusHeader: 'Phone Status',

    roomAudioRequiresProjectorHeader: 'Audio Requires Projector',
    roomProjectorHeader: 'Projector',
    roomAudioHeader: 'Audio',
    roomScreenHeader: 'Screen',
    roomTeachingStationComputerHeader: 'TS Computer',
    roomTeachingStationComputerTypeHeader: 'TS Computer Type',
    roomTeachingStationComputerOSHeader: 'TS Computer Operating System',
    roomDocumentCameraHeader: 'Doc Cam',
    roomDVDPlayerHeader: 'DVD Player',
    roomDVDPlayerTypeHeader: 'DVD Player Type',
    roomPrinterHeader: 'Printer',
    roomPrinterSymquestNumberHeader: 'Printer Symquest Number',
    roomPrinterCartridgeTypeHeader: 'Printer Cartridge Type',
    roomNotesHeader: 'Other Notes'
  },

  secondarySpreadsheet: {
    docID: '',
    path: 'public/secondary.xlsx'
  },

  images_directory: 'public/images/',
}

let appConfig;

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



// ------------------------------------------------------ \\

module.exports = app;