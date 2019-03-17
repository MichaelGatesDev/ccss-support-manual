var express = require('express');
var router = express.Router();

var dataHelper = require('../../../data-helper');

const buildings = require('./buildings');
router.use('/buildings/', buildings);


router.get('/', function (req, res, next) {
  res.send("This is the primary API v1 route");
});


router.post('/upload', function (req, res, next) {
  dataHelper.updateFromSpreadsheet(req.file).then(function (result) {

  }).catch(function (err) {
    console.err("There was an error using spreadsheet data.");
    console.log(err);
  });
});

module.exports = router;
