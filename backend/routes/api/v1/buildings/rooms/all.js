const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Room = require('../../../../../models/room');

router.get('/', (req, res, next) => {
    res.json(req.building.rooms);
});

module.exports = router;