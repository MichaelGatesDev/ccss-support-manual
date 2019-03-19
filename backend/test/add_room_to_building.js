const assert = require('assert');
const Building = require('../models/building');
const Room = require('../models/room');

describe('Creating building', () => {
    it('creates a building and adds a room to it', (done) => {
        const building = new Building({
            internalName: "small-building",
            officialName: "small building",
        });
        building.save()
            .then(() => {
                Building.findOne({ internalName: "small-building" }, function (err, res) {
                    var room = new Room({
                        number: 15,
                        type: "meeting",
                        lockType: "swipe",
                        capacity: 13,
                        furnitureType: "conference seating",
                        chairCount: 30,
                        tableCount: 15,
                        extension: "0123",
                        audioRequiresProjector: false,
                        hasProjector: true,
                        hasAudio: true,
                        hasScreen: true,
                        hasTeachingStationComputer: false,
                        hasDocCam: false,
                        hasDVDPlayer: false,
                        hasPrinter: false,
                    });
                    res.rooms.push(room);
                    res.save().then(function () {
                        assert(res.rooms.length == 1);
                        done();
                    });
                });
            });
    });
});