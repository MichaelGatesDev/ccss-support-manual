var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');

var dbhelper = require('./dbhelper');

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

dbhelper.createConfig().catch(function (e) {
  console.log("There was an error creating the database configuration file");
}).then(function (created) {
  if (created) {
    console.log("Created database configuration file.");
    console.log("Please configure the file and restart the application.");
  }
  dbhelper.connect().then(function () {
    console.log("Connected to the database");
  }).catch(function (e) {
    console.log("There was an error connecting to the database");
    console.log(e);
  });
});


// ------------------------------------------------------ \\

module.exports = app;