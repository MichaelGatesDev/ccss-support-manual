var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');

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
let dbConfigFile = "dbconfig.json";
if (!fs.existsSync(dbConfigFile)) {
  let dbConfig = {
    username: "",
    password: "",
    url: "",
    useNewParser: true
  };
  fs.writeFile(dbConfigFile, JSON.stringify(dbConfig), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("Created database configuration file.");
    console.log("Please configure the file and restart the application.");
  });
} else {
  var dbConfig = JSON.parse(fs.readFileSync(dbConfigFile));

  if (!dbConfigFile) {
    console.log("There was an error loading the database configuration file.");
    return;
  }
  let dbUsername = dbConfig.username;
  let dbPassword = dbConfig.password;
  let databaseURL = dbConfig.url
    .replace("{username}", dbUsername)
    .replace("{password}", dbPassword);

  mongoose.connect(databaseURL, {
    useNewUrlParser: true
  }).then(function () {
    console.log("Connected to database");
  }).catch(function (e) {
    console.log("Error connecting to database: " + e);
  });
  mongoose.Promise = global.Promise;
}
// ------------------------------------------------------ \\

module.exports = app;