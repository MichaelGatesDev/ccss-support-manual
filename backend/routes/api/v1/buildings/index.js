const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Building = require('../../../../models/building');


router.param('buildingID', function (req, res, next, id) {
    Building.findOne({
        internalName: req.params.buildingID
    }, function (err, res) {
        if (err) {
            console.log(err);
            next(new Error('Failed to find building: ' + id));
            return;
        }
        req.building = res;
        next();
    });
});

const all = require('./all');
router.use('/', all);

router.post('/create', function (req, res) {
    Building.create(req.body).then(
        (building) => {
            res.json(building);
        }
    );
});

router.post('/remove/:buildingID', function (req, res, next) {
    if (!req.building) {
        res.send("No such building exists");
        return;
    }

    req.building.deleteOne().exec(function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(data);
    });
});

const single = require('./single');
router.use('/:buildingID', single);

const rooms = require('./rooms');
router.use('/:buildingID/rooms', rooms);



module.exports = router;