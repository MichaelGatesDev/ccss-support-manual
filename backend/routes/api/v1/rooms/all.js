const express = require('express');
const router = express.Router({
    mergeParams: true
});

var dataHelper = require('../../../../data-helper');

router.get('/', (req, res) => {
    res.json(dataHelper.getAllRooms());
});

module.exports = router;