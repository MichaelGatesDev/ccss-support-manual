const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Building = require('../../../../models/building');

router.get('/', (req, res, next) => {
    Building.find({}, function (err, buildings) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(buildings);
    });
});

module.exports = router;