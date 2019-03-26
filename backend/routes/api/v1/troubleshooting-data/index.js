var express = require('express');
var router = express.Router();

var dataHelper = require('../../../../data-helper');

const all = require('./all');
router.use('/', all);

router.param('roomID', function (req, res, next, id) {
    for (const room of dataHelper.getAllRooms()) {
        if (room.id == id) {
            req.room = room;
            next();
            return;
        }
    }
    console.log(err);
    next(new Error('Failed to find room: ' + id));
});

const single = require('./single');
router.use('/:roomID', single);

module.exports = router;