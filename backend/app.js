var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');

var config = require('./config');
// var testHelper = require('./test-helper');

var indexRouter = require('./routes/index');

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
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
// Connect to database here
// ------------------------------------------------------ \\

// setup database
config.create("database-config.json", {
  username: "",
  password: "",
  url: "",
  useNewParser: true
}).then(function (created) {
  if (created) {
    console.log("Created default database config file. Edit it and restart the app.");
    process.exit();
    return;
  }

  config.load("database-config.json").then(function (loaded) {
    let dbUsername = loaded.username;
    let dbPassword = loaded.password;
    let databaseURL = loaded.url
      .replace("{username}", dbUsername)
      .replace("{password}", dbPassword);
    let useNewParser = loaded.useNewParser;

    mongoose.connect(databaseURL, {
      useNewUrlParser: useNewParser
    }).then(function () {
      mongoose.Promise = global.Promise;

      var db = mongoose.connection;

      //Bind connection to error event (to get notification of connection errors)
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));

      console.log("Successfully connected to the database");


      // var dataHelper = require('./data-helper');
      // dataHelper.updateFromSpreadsheet("public/spreadsheet.xlsx").then(function (buildings) {
      //   console.log("Finished updating data from spreadsheet");
      // }).catch(function (err) {
      //   console.log(err);
      // });

    }).catch(function (err) {
      console.log("There was an error connecting to the database.");
      console.log(err);
      process.exit();
      return;
    });
  }).catch(function (err) {
    console.log("There was an error creating the database config file.");
    console.log(err);
    return;
  });
});



// ------------------------------------------------------ \\

module.exports = app;