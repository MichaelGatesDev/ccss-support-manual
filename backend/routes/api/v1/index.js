var express = require('express');
var router = express.Router();

var _ = require('underscore');

const Building = require('../../../models/building');

const buildings = require('./buildings');
router.use('/buildings/', buildings);

const images = require('./images');
router.use('/images/', images);


router.get('/', function (req, res, next) {
  res.send("This is the primary API v1 route");
});

router.get('/rooms', function (req, res, next) {
  Building.find({}, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    let rooms = [];
    for (const result of results) {
      rooms = rooms.concat(result.rooms);
    }
    var sortedRooms = _.chain(rooms)
      .sortBy('number')
      .sortBy('buildingName')
      .value();
    res.json(sortedRooms);
  });
});

// router.post('/upload', function (req, res) {

//   if (Object.keys(req.files).length == 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   console.log("Upload complete");
//   console.log(req.files.spreadsheet);

//   // dataHelper.updateFromSpreadsheet(req.file).then(function (result) {

//   // }).catch(function (err) {
//   //   console.err("There was an error using spreadsheet data.");
//   //   console.log(err);
//   // });
// });

module.exports = router;
