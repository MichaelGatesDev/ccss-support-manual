"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
var all = require('./all');
router.use('/', all);
router.param('roomID', function (req, res, next, id) {
    console.log(App_1.app);
    var room = App_1.app.getDataManager().getRoomManager().getRoomByID(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
});
var single = require('./single');
router.use('/:roomID', single);
module.exports = router;
