var Excel = require('exceljs');
var fs = require('fs');

let buildings = [];


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


async function loadDataFromSpreadsheet(file) {
    return new Promise((resolve, reject) => {
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
                    console.debug("Created room: " + building.officialName + " " + room.number);
                }
            });

            console.debug("There are " + buildings.length + " buildings");

            var roomCount = 0;
            for (const b of buildings) {
                roomCount += b.rooms.length;
                console.debug(b.internalName + " has " + b.rooms.length + " rooms");
            }
            console.debug("There are " + roomCount + " classrooms");

            return resolve();
        });
    }).catch(function (err) {
        return reject(err);
    });
}
exports.loadDataFromSpreadsheet = loadDataFromSpreadsheet;


let images = [];

function getAllImages() {
    return images;
}
exports.getAllImages = getAllImages;

async function loadImages() {
    return new Promise((resolve, reject) => {
        var rootDir = "public/img/buildings/";

        if (!fs.existsSync(rootDir)) {
            console.log("Root directory does not exist: " + rootDir)
            return;
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

function getImagesForRoom(room) {
    for (const item of images) {
        if (item.roomID === room.id)
            return item;
    }
    return null;
}
exports.getImagesForRoom = getImagesForRoom;

function getBuildingByName(name) {
    for (const building of buildings) {
        var contains = false;
        if (!contains && building.internalName.includes(name)) contains = true;
        if (!contains && building.officialName.includes(name)) contains = true;
        if (!contains) {
            for (const nick of building.nicknames) {
                if (nick.includes(name)) contains = true;
                break;
            }
        }
        if (contains) return building;
    }
}
exports.getBuildingByName = getBuildingByName;


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}