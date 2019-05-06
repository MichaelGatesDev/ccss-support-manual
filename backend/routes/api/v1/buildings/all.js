"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get('/', function (req, res, next) {
    res.json(App_1.app.getDataManager().getBuildingManager().getBuildings());
});
module.exports = router;
