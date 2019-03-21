var express = require('express');
var router = express.Router();

const all = require('./all');
router.use('/', all);

const Building = require('../../../../models/building');

router.param('roomID', function (req, res, next, id) {
    Building.find({}, function (err, results) {
        if (err) {
            console.log(err);
            next(new Error('Failed to get buildings'));
            return;
        }

        loop1:
        for (const building of results) {
            for (const room of building.rooms) {
                if (room._id == id) {
                    req.room = room;
                    break loop1;
                }
            }
        }

        next();
    });
});

const single = require('./single');
router.use('/:roomID', single);

module.exports = router;
