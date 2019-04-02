var Excel = require('exceljs');
var fs = require('fs');

let buildings = [];
let troubledata = [];
let images = [];


async function loadPrimarySpreadsheet(file) {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(file)) {
            return reject("File could not be found: " + file);
        }

        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(file).then(function () {

            buildings = [];

            // buildings
            var buildingsWS = workbook.getWorksheet("Buildings");
            buildingsWS.eachRow({
                includeEmpty: false
            }, function (row, rowNumber) {

                // skip  the first row (headers)
                if (rowNumber == 1) return;

                var officialName = row.getCell(1).text.toLowerCase();
                var nicknames = row.getCell(2).text.toLowerCase().split(",");
                var internalName = officialName.toLowerCase().replace(/\s/g, "-");

                var building = {
                    officialName: officialName,
                    nicknames: nicknames,
                    internalName: internalName,
                    rooms: []
                };

                buildings.push(building);
                console.debug("Added building (empty): " + building.internalName);
            });

            // rooms
            var roomsWS = workbook.getWorksheet("Rooms");
            roomsWS.eachRow({
                includeEmpty: false
            }, function (row, rowNumber) {

                // skip  the first row (headers)
                if (rowNumber == 1) return;

                // building name first
                var buildingName = row.getCell(3).text.toLowerCase();

                // can't do anything with invalid rows
                if (isBlank(buildingName)) return;

                var room = {
                    buildingName: buildingName,
                    lastChecked: row.getCell(1).text.toLowerCase(),
                    number: row.getCell(4).text.toLowerCase(),
                    name: row.getCell(5).text.toLowerCase(),
                    type: row.getCell(6).text.toLowerCase(),
                    lockType: row.getCell(7).text.toLowerCase(),
                    capacity: row.getCell(8).text,
                    furnitureType: row.getCell(9).text,
                    chairCount: row.getCell(10).text,
                    tableCount: row.getCell(11).text,
                    extension: row.getCell(12).text,
                    phoneStatus: row.getCell(13).text.toLowerCase(),
                    audioRequiresProjector: row.getCell(14).text.toLowerCase(),
                    hasProjector: row.getCell(15).text.toLowerCase() !== "n/a",
                    hasAudio: row.getCell(16).text.toLowerCase() !== "n/a",
                    hasScreen: row.getCell(17).text.toLowerCase() !== "n/a",
                    hasTeachingStationComputer: row.getCell(18).text.toLowerCase() !== "n/a",
                    teachingStationComputerType: row.getCell(19).text.toLowerCase(),
                    teachingStationComputerOS: row.getCell(20).text.toLowerCase(),
                    hasDocCam: row.getCell(21).text.toLowerCase() !== "n/a",
                    hasDVDPlayer: row.getCell(22).text.toLowerCase() !== "n/a",
                    dvdPlayerType: row.getCell(23).text.toLowerCase(),
                    hasPrinter: row.getCell(24).text.toLowerCase() !== "n/a",
                    printerSymquestNumber: row.getCell(25).text.toLowerCase(),
                    printerCartridgeType: row.getCell(26).text.toLowerCase(),
                };

                var building = getBuildingByName(buildingName);
                if (building) {
                    room.buildingName = building.officialName;
                    room.id = building.internalName + "." + room.number; // building-name.roomNumber
                    building.rooms.push(room); // add the room to the parent building
                    // console.debug("Created room: " + building.officialName + " " + room.number);
                }
            });

            console.debug("There are " + buildings.length + " buildings");

            var roomCount = 0;
            for (const b of buildings) {
                roomCount += b.rooms.length;
                console.debug(b.internalName + " has " + b.rooms.length + " rooms: [" + b.rooms.map(function (room) {
                    return room.number;
                }).join(",") + "]");
            }
            console.debug("There are " + roomCount + " classrooms");

            return resolve();
        }).catch(function (err) {
            return reject(err);
        });
    });
}
exports.loadPrimarySpreadsheet = loadPrimarySpreadsheet;


function getBuildingByName(name) {
    for (const building of buildings) {
        var contains = false;
        if (!contains && building.internalName.toLowerCase().includes(name.toLowerCase())) contains = true;
        if (!contains && building.officialName.toLowerCase().includes(name.toLowerCase())) contains = true;
        if (!contains) {
            for (const nick of building.nicknames) {
                if (nick.toLowerCase().includes(name.toLowerCase())) contains = true;
                break;
            }
        }
        if (contains) return building;
    }
}
exports.getBuildingByName = getBuildingByName;


function getRoomByBuildingNameAndNumber(buildingName, roomNumber) {
    for (const room of getAllRooms()) {
        if (getBuildingByName(room.buildingName) === getBuildingByName(buildingName) && room.number === roomNumber.toLowerCase())
            return room;
    }
    return null;
}
exports.getRoomByBuildingNameAndNumber = getRoomByBuildingNameAndNumber;


function getAllBuildings() {
    return buildings;
}
exports.getAllBuildings = getAllBuildings;


function getAllRooms() {
    let result = [];
    for (const building of buildings) {
        result = result.concat(building.rooms);
    }
    return result;
}
exports.getAllRooms = getAllRooms;

function getRoomByID(roomID) {
    for (const room of getAllRooms())
        if (room.id === roomID)
            return room;
    return null;
}
exports.getRoomByID = getRoomByID;


async function loadSecondarySpreadsheet(file) {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(file)) {
            return reject("File could not be found: " + file);
        }

        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(file).then(function () {

            let results = [];

            // rooms
            var roomsWS = workbook.getWorksheet("QA");
            roomsWS.eachRow({
                includeEmpty: false
            }, function (row, rowNumber) {

                // skip  the first row (headers)
                if (rowNumber == 1) return;

                // building name first
                var title = row.getCell(1).text.toLowerCase();

                // can't do anything with invalid rows
                if (isBlank(title)) return;

                var troubleshootingDataObj = {
                    title: title,
                    description: row.getCell(2).text.toLowerCase(),
                    solution: row.getCell(3).text.toLowerCase(),
                    types: row.getCell(4).text.toLowerCase().split(","),
                    tags: row.getCell(5).text.toLowerCase().split(","),
                    whitelistedLocations: parseRooms(row.getCell(6).text.toLowerCase()),
                    blacklistedLocations: parseRooms(row.getCell(7).text.toLowerCase()),
                };

                results.push(troubleshootingDataObj);
            });

            console.debug("There are " + results.length + " troubleshooting data segments");

            troubledata = results;

            return resolve();
        }).catch(function (err) {
            return reject(err);
        });
    });
}
exports.loadSecondarySpreadsheet = loadSecondarySpreadsheet;


function parseRooms(raw) {
    let results = [];
    if (isBlank(raw)) return results;
    for (const piece of raw.split(",")) {
        var parts = piece.split("|");

        var buildingName = parts[0];
        var roomNumber = parts[1];

        var room = getRoomByBuildingNameAndNumber(buildingName, roomNumber);
        if (!room) continue; // no location at building/room

        results.push(room.id);
    }
    return results;
}


function getAllTroubleshootingData() {
    return troubledata;
}
exports.getAllTroubleshootingData = getAllTroubleshootingData;


function getTroubleshootingDataForRoom(roomID) {
    let results = [];

    var room = getRoomByID(roomID);

    if (!room) return results; // no room with that ID found

    for (const td of troubledata) {

        // trouble data doesn't apply for this room
        if (td.blacklistedLocations.includes(roomID))
            continue;

        // whitelisted room
        if (td.whitelistedLocations.length > 0) {
            if (td.whitelistedLocations.includes(roomID))
                results.push(td);
            else
                continue;
        }

        // audio
        if (room.hasAudio) {
            if (td.types.includes('audio')) {
                results.push(td);
            }
        }
        // projector
        if (room.hasProjector) {
            if (td.types.includes('projector')) {
                results.push(td);
            }
        }
        // computer
        if (room.hasTeachingStationComputer) {
            if (td.types.includes('computer')) {
                results.push(td);
            }
        }
        // dvd player
        if (room.hasDVDPlayer) {
            if (td.types.includes('dvd')) {
                results.push(td);
            }
        }
        // printer
        if (room.hasPrinter) {
            if (td.types.includes('printer')) {
                results.push(td);
            }
        }

        // if there are no types, it is general
        if (td.types.length === 0)
            results.push(td);
    }
    return results;
}
exports.getTroubleshootingDataForRoom = getTroubleshootingDataForRoom;


async function loadImages() {
    return new Promise((resolve, reject) => {
        var rootDir = "public/images/buildings/";

        if (!fs.existsSync(rootDir)) {
            console.log()
            return reject("Image directory does not exist: " + rootDir);
        }

        images = [];
        for (const building of getAllBuildings()) {
            var buildingDir = rootDir + building.internalName + "/";
            if (!fs.existsSync(buildingDir)) {
                console.log("Building directory does not exist: " + buildingDir);
                continue;
            }

            for (const room of building.rooms) {

                var mainImages = [];
                var panoramicImages = [];
                var equipmentImages = [];

                var roomDir = buildingDir + "rooms/" + room.number + "/";

                // check if room dir exists
                if (!fs.existsSync(roomDir)) {
                    console.log("Room directory does not exist: " + roomDir);
                    continue;
                }

                // root images
                for (const file of fs.readdirSync(roomDir)) {
                    var stat = fs.statSync(roomDir + file);
                    if (!stat.isDirectory()) {
                        mainImages.push(roomDir.replace("public/", "") + file);
                    }
                }

                // panoramic images
                var panoramasDir = roomDir + "panoramas/";
                if (fs.existsSync(panoramasDir)) {
                    for (const file of fs.readdirSync(panoramasDir)) {
                        var stat = fs.statSync(panoramasDir + file);
                        if (!stat.isDirectory()) {
                            panoramicImages.push(panoramasDir.replace("public/", "") + file);
                        }
                    }
                }

                // equipment images
                var equipmentDir = roomDir + "equipment/";
                if (fs.existsSync(equipmentDir)) {
                    for (const file of fs.readdirSync(equipmentDir)) {
                        var stat = fs.statSync(equipmentDir + file);
                        if (!stat.isDirectory()) {
                            equipmentImages.push(equipmentDir.replace("public/", "") + file);
                        }
                    }
                }

                images.push({
                    roomID: room.id,
                    mainImages: mainImages,
                    panoramicImages: panoramicImages,
                    equipmentImages: equipmentImages
                });
            }
        }
        resolve();
    });
}
exports.loadImages = loadImages;


function getAllImages() {
    return images;
}
exports.getAllImages = getAllImages;


function getImagesForRoom(room) {
    for (const item of images) {
        if (item.roomID === room.id)
            return item;
    }
    return null;
}
exports.getImagesForRoom = getImagesForRoom;


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}