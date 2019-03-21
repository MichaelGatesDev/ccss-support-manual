const express = require('express');
const router = express.Router({
    mergeParams: true
});

var dataHelper = require('../../../../data-helper');


router.param('buildingID', function (req, res, next, id) {
    for (const building of dataHelper.getAllBuildings()) {
        if (building.internalName == id) {
            req.building = building;
            next();
            return;
        }
    }
    console.log(err);
    next(new Error('Failed to find building: ' + id));
});

const all = require('./all');
router.use('/', all);

const single = require('./single');
router.use('/:buildingID', single);


module.exports = router;