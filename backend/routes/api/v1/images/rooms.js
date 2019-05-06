"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get("/", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getRoomImages());
});
router.param('roomNumber', function (req, res, next, id) {
    var building = req.building;
    var room = building.getRoom(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
    return;
});
router.get("/:roomNumber", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getImagesForRoom(req.building.internalName, req.room.number));
});
module.exports = router;
