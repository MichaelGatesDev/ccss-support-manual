var dbhelper = require('../../../dbhelper');

module.exports = (req, res) => {
    // send data for all buildings
    const obj = dbhelper.getAllBuildings();
    res.json(obj);
};