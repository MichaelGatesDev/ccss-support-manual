const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    buildingName: {
        type: String,
        required: [true, 'Building name is required']
    },
    lastChecked: {
        type: Date
    },
    number: {
        type: String,
        unique: true,
        required: [true, 'Number field is required']
    },
    name: {
        type: String
    },
    type: {
        type: String,
        required: [true, 'Type field is required']
    },
    lockType: {
        type: String,
        required: [true, 'Number field is required']
    },
    capacity: {
        type: Number,
        min: -1,
        max: 65535
    },
    furnitureType: {
        type: String
    },
    chairCount: {
        type: Number,
        min: -1,
        max: 65535
    },
    tableCount: {
        type: Number,
        min: -1,
        max: 65535
    },
    extension: {
        type: String,
        unique: true,
    },

    audioRequiresProjector: {
        type: Boolean
    },

    hasProjector: {
        type: Boolean,
        required: [true, 'hasProjector field is required']
    },
    hasAudio: {
        type: Boolean,
        required: [true, 'hasAudio field is required']
    },
    hasScreen: {
        type: Boolean,
        required: [true, 'hasScreen field is required']
    },
    hasTeachingStationComputer: {
        type: Boolean,
        required: [true, 'hasTeachingStationComputer field is required']
    },
    teachingStationComputerType: {
        type: String
    },
    teachingStationComputerOS: {
        type: String
    },

    hasDocCam: {
        type: Boolean,
        required: [true, 'hasDocCam field is required']
    },

    hasDVDPlayer: {
        type: Boolean,
        required: [true, 'hasDVDPlayer field is required']
    },
    dvdPlayerType: {
        type: String,
    },

    hasPrinter: {
        type: Boolean,
        required: [true, 'hasPrinter field is required']
    },
    printerSymquestNumber: {
        type: String,
    },
    printerCartridgeType: {
        type: String,
    },

    coverImage: {
        type: String
    },
    images: {
        type: [String]
    },
    panoramicImages: {
        type: [String]
    },
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;