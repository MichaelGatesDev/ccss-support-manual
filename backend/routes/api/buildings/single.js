var dbhelper = require('../../../dbhelper');

module.exports = (req, res) => {
    dbhelper.getBuilding({
        id: req.params.building
    }).then(function (result) {
        res.json(result);
    });
};