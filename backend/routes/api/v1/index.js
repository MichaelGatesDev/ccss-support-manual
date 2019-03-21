var express = require('express');
var router = express.Router();

const Building = require('../../../models/building');

const buildings = require('./buildings');
router.use('/buildings/', buildings);

const rooms = require('./rooms');
router.use('/rooms/', rooms);

const images = require('./images');
router.use('/images/', images);

router.get('/', function (req, res, next) {
  res.send("This is the primary API v1 route");
});

router.get('/getbuilding', function (req, res, next) {

  if (!req.query.roomID) {
    res.send("You must specify a room ID");
    return;
  }

  Building.find({}, function (err, results) {
    if (err) {
      console.log(err);
      next(new Error('Failed to get buildings'));
      return;
    }

    for (const building of results) {
      for (const room of building.rooms) {
        if (room._id == req.query.roomID) {
          res.json(building);
          return;
        }
      }
    }

    res.json(null);
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
