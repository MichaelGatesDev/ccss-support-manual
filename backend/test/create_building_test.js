const assert = require('assert');
const Building = require('../models/building');

describe('Creating building', () => {
    it('creates and saves a building', (done) => {
        const building = new Building({
            internalName: "official-building-name",
            officialName: "Official Building Name",
        });
        building.save()
            .then(() => {
                assert(!building.isNew);
                done();
            });
    });
});