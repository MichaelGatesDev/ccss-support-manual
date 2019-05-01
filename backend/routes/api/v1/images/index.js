"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get("/", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getImages());
});
router.param('buildingID', function (req, res, next, id) {
    var building = App_1.app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
    return;
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
router.param('roomID', function (req, res, next, id) {
    for (var _i = 0, _a = App_1.app.getDataManager().getRoomManager().getRooms(); _i < _a.length; _i++) {
        var room = _a[_i];
        if (room.getID() == id) {
            req.room = room;
            next();
            return;
        }
    }
    next(new Error('Failed to find room: ' + id));
    return;
});
router.get("/:buildingID/:roomID", function (req, res) {
    //TODO this
    // res.json(app.getDataManager().getImageManager().getImagesFor());
});
router.get('/:roomID', function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getImagesForRoom(req.room));
});
module.exports = router;
