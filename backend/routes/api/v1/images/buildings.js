"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get("/", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getBuildingImages());
});
router.param('buildingName', function (req, res, next, id) {
    var building = App_1.app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
    return;
});
router.get("/:buildingName", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getImagesForBuilding(req.building.internalName));
});
var rooms_1 = __importDefault(require("./rooms"));
router.use('/:buildingName/rooms', rooms_1.default);
module.exports = router;
