const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = require('./rooms');

const BuildingSchema = new Schema({
    officialName: {
        type: String,
        required: [true, 'Name field is required']
    },
    nicknames: {
        type: [String]
    },
    internalName: {
        type: [String],
        required: [true, 'Building must have internal name']
    },
    rooms: [Room.schema],
    images: {
        type: [String]
    },
    coverImages: {
        type: [String]
    },
    panoramicImages: {
        type: [String]
    },
});

const Building = mongoose.model('building', BuildingSchema);

module.exports = Building;