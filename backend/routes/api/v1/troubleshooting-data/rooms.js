"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get("/", function (req, res) {
    var tdm = App_1.app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
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
    var tdm = App_1.app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingDataForRoom(req.building.internalName, req.room.number));
});
module.exports = router;
