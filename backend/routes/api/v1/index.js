var express = require('express');
var router = express.Router();

var dataHelper = require('../../../data-helper');

const buildings = require('./buildings');
router.use('/buildings/', buildings);

const rooms = require('./rooms');
router.use('/rooms/', rooms);

const images = require('./images');
router.use('/images/', images);

const troubelshootingData = require('./troubleshooting-data');
router.use('/troubleshooting-data/', troubelshootingData);

router.get('/', function (req, res, next) {
  res.send("This is the primary API v1 route");
});

router.get('/getbuilding', function (req, res, next) {

  if (!req.query.roomID) {
    res.send("You must specify a room ID");
    return;
  }

  for (const building of dataHelper.getAllBuildings()) {
    for (const room of building.rooms) {
      if (room.id == req.query.roomID) {
        res.json(building);
        return;
      }
    }
  }

  res.json(null);
});

module.exports = router;