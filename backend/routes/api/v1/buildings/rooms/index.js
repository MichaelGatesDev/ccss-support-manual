const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Room = require('../../../../../models/room');

router.param('roomID', function (req, res, next, id) {
    for (const room of req.building.rooms) {
        if (room.number === id) {
            req.room = room;
        }
    }
    if (req.room) {
        next();
    } else {
        next(new Error('Failed to find room: ' + id));
    }
});

const all = require('./all');
router.use('/', all);

router.post('/create', function (req, res) {
    var room = new Room(req.body);
    //TODO lookup building and add room
    res.json(room);
});

router.post('/remove/:roomID', function (req, res, next) {
    //TODO find room in buildings
});

const single = require('./single');
router.use('/:roomID', single);


module.exports = router;