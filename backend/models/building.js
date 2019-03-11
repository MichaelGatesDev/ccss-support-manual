const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = require('./room');

const BuildingSchema = new Schema({
    internalName: {
        type: [String],
        required: [true, 'Building must have internal name']
    },
    officialName: {
        type: String,
        required: [true, 'Buildings must have an official name']
    },
    nicknames: {
        type: [String],
        default: []
    },
    rooms: {
        type: [Room.RoomSchema],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    coverImages: {
        type: [String],
        default: []
    },
    panoramicImages: {
        type: [String],
        default: []
    },
});

const Building = mongoose.model('building', BuildingSchema);

module.exports = Building;