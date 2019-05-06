"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.param('buildingName', function (req, res, next, id) {
    var building = App_1.app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
});
var all_1 = __importDefault(require("./all"));
router.use('/', all_1.default);
var single_1 = __importDefault(require("./single"));
router.use('/:buildingName', single_1.default);
module.exports = router;
