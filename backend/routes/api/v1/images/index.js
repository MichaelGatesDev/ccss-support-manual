"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = __importDefault(require("../../../../App"));
var router = express_1.Router();
router.get("/", function (req, res) {
    res.json(App_1.default.getDataManager().getImageManager().getImages());
});
router.param('buildingID', function (req, res, next, id) {
    var building = App_1.default.getDataManager().getBuildingManager().getBuildingByName(id);
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
    for (var _i = 0, _a = App_1.default.getDataManager().getRoomManager().getRooms(); _i < _a.length; _i++) {
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
    res.json(App_1.default.getDataManager().getImageManager().getImagesForRoom(req.room));
});
module.exports = router;
