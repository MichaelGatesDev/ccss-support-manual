"use strict";
var express_1 = require("express");
var router = express_1.Router();
var all = require('./all');
router.use('/', all);
router.param('roomNumber', function (req, res, next, number) {
    var building = req.building;
    var room = building.getRoom(number);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + number));
});
var single = require('./single');
router.use('/:roomNumber', single);
module.exports = router;
