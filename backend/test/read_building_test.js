const assert = require('assert');
const Building = require('../models/building');

describe('Reading documents', () => {
    it('reads a building', (done) => {
        // create the building
        const building = new Building({
            internalName: "my-cool-building",
            officialName: "my cool building",
            nicknames: ["nickname_a", "nickname_b", "nickname_c"],
        });
        building.save()
            .then(() => {
                // find theb uilding
                Building.findOne({
                    internalName: "my-cool-building"
                }).then(function (result) {
                    assert(result);
                    done();
                });
            });
    });
});