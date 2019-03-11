const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// created.lastChecked = json['Timestamp'] ? json['Timestamp'] : '';
// created.number = json['Room Number'] ? json['Room Number'].toLowerCase() : '';
// created.name = json['Room Name'] ? json['Room Name'].toLowerCase() : '';
// created.type = json['Room Type'] ? json['Room Type'] : '';
// created.lockType = json['Lock Type'] ? json['Lock Type'] : '';
// created.capacity = json['Capacity'] ? json['Capacity'] == 'N/A' ? -1 : json['Capacity'] : '';
// created.furnitureType = json['Furniture Type'] ? json['Furniture Type'] : '';
// created.chairCount = json['Chair Count'] ? json['Chair Count'] : '';
// created.tableCount = json['Table Count'] ? json['Table Count'] : '';
// created.extension = json['Phone Extension'] ? json['Phone Extension'].length == 4 ? json['Phone Extension'] : 'N/A' : '';
// created.audioRequiresProjector = json['Audio Requires Projector'] ? json['Audio Requires Projector'] : '';

// created.hasProjector = json['Projector'] && json['Projector'] != 'N/A';
// created.hasAudio = json['Audio'] && json['Audio'] != 'N/A';
// created.hasScreen = json['Screen'] && json['Screen'] != 'N/A';
// created.hasComputer = json['TS Computer'] && json['TS Computer'] != 'N/A';
// created.computerType = json['TS Computer Type'] ? json['TS Computer Type'] : '';
// created.computerOS = json['TS Computer Operating System'] ? json['TS Computer Operating System'] : '';
// created.hasDocumentCamera = json['Doc Cam'] && json['Doc Cam'] != 'N/A';
// created.hasDVDPlayer = json['DVD Player'] && json['DVD Player'] != 'N/A';
// created.dvdPlayerType = json['DVD Player Type'] ? json['DVD Player Type'] : '';
// created.hasPrinter = json['Printer'] && json['Printer'] != 'N/A';
// created.printerSymQuestNumber = json['Printer Symquest Number'] ? json['Printer Symquest Number'] : '';
// created.printerCartridgeType = json['Printer Cartridge Type'] ? json['Printer Cartridge Type'] : '';


const RoomSchema = new Schema({
    lastChecked: {
        type: Date
    },
    number: {
        type: String,
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
        default: "0000"
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
    hasComputer: {
        type: Boolean,
        required: [true, 'hasComputer field is required']
    },

    computerType: {
        type: String
    },


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

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;