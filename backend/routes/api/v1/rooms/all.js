const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Building = require('../../../../models/building');

router.get('/', (req, res) => {
    Building.find({}, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        let rooms = [];
        for (const result of results) {
            rooms = rooms.concat(result.rooms);
        }
        res.json(rooms);
    });
});

module.exports = router;