const express = require('express');
const router = express.Router({
    mergeParams: true
});

var fs = require('fs');

var dataHelper = require('../../../../data-helper');

router.get("/", function (req, res) {
    res.json(dataHelper.getAllImages());
});


router.param('buildingID', function (req, res, next, id) {
    for (const building of dataHelper.getAllBuildings()) {
        if (building.internalName == id) {
            req.building = building;
            next();
            return;
        }
    }
    next(new Error('Failed to find building: ' + id));
    return;
});

router.param('roomNumber', function (req, res, next, id) {
    for (const room of dataHelper.getAllRooms()) {
        if (room.number == id) {
            req.room = room;
            next();
            return;
        }
    }
    next(new Error('Failed to find room: ' + id));
    return;
});

router.param('roomID', function (req, res, next, id) {
    for (const room of dataHelper.getAllRooms()) {
        if (room.id == id) {
            req.room = room;
            next();
            return;
        }
    }
    next(new Error('Failed to find room: ' + id));
    return;
});


router.get('/:roomID', function (req, res) {
    res.json(dataHelper.getImagesForRoom(req.room));
});

module.exports = router;