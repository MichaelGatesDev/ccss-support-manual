"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Excel = require("exceljs");
var fs = require("fs");
var BuildingManager_1 = require("./BuildingManager");
var RoomManager_1 = require("./RoomManager");
var Building_1 = require("./models/Building");
// import { EnumUtils } from './EnumUtils';
var DataHelper = /** @class */ (function () {
    // private imageManager: ImageManager;
    // private troubledata: string[];
    // private images: string[];
    function DataHelper() {
        this.buildingManager = new BuildingManager_1.BuildingManager();
        this.roomManager = new RoomManager_1.RoomManager(this.buildingManager);
        // this.imageManager = new ImageManager();
    }
    DataHelper.prototype.getBuildingManager = function () { return this.buildingManager; };
    DataHelper.prototype.getRoomManager = function () { return this.roomManager; };
    // public getImageManager(){ return this.imageManager; }
    DataHelper.prototype.generateColumns = function (sheet, headerRowIndex) {
        var row = sheet.getRow(headerRowIndex);
        if (row === null || !row.values || !row.values.length)
            return [];
        var headers = [];
        for (var i = 1; i < row.values.length; i++) {
            var cell = row.getCell(i);
            headers.push(cell.text);
        }
        var numCols = sheet.actualColumnCount;
        for (var i = 0; i < numCols; i++) {
            sheet.getColumn(i + 1).key = headers[i];
            console.log("Column " + (i + 1) + " key is " + headers[i]);
        }
    };
    DataHelper.prototype.loadBuildings = function (sheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1)
                return; // skip headers row
            var officialName = row.getCell('Official Name').text;
            var nicknames = row.getCell('Nicknames').text;
            var building = new Building_1.Building(officialName, nicknames.split(","));
            self.buildingManager.addBuilding(building);
        });
        console.log("Loaded " + this.buildingManager.getBuildings().length + " buildings!");
    };
    DataHelper.prototype.loadRooms = function (sheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1)
                return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '')
                return; // skip if row is empty. exceljs doesn't work well for some reason.
            var buildingNameCell = row.getCell('Building');
            if (!buildingNameCell) {
                console.log("Building name cell empty at row " + rowNumber);
                return;
            }
            var buildingName = row.getCell('Building').text;
            var building = self.buildingManager.getBuildingByName(buildingName);
            if (!building) {
                console.log("No such building exists: " + buildingName);
                return;
            }
            // var roomA = {
            //     name: row.getCell(5).text.toLowerCase(),
            //     lockType: row.getCell(7).text.toLowerCase(),
            //     capacity: row.getCell(8).text,
            //     furnitureType: row.getCell(9).text,
            //     chairCount: row.getCell(10).text,
            //     tableCount: row.getCell(11).text,
            //     extension: row.getCell(12).text,
            //     phoneStatus: row.getCell(13).text.toLowerCase(),
            //     audioRequiresProjector: (row.getCell(14).text.toLowerCase() === "true"),
            //     hasProjector: row.getCell(15).text.toLowerCase() !== "n/a",
            //     hasAudio: row.getCell(16).text.toLowerCase() !== "n/a",
            //     hasScreen: row.getCell(17).text.toLowerCase() !== "n/a",
            //     hasTeachingStationComputer: row.getCell(18).text.toLowerCase() !== "n/a",
            //     teachingStationComputerType: row.getCell(19).text.toLowerCase(),
            //     teachingStationComputerOS: row.getCell(20).text.toLowerCase(),
            //     hasDocCam: row.getCell(21).text.toLowerCase() !== "n/a",
            //     hasDVDPlayer: row.getCell(22).text.toLowerCase() !== "n/a",
            //     dvdPlayerType: row.getCell(23).text.toLowerCase(),
            //     hasPrinter: row.getCell(24).text.toLowerCase() !== "n/a",
            //     printerSymquestNumber: row.getCell(25).text.toLowerCase(),
            //     printerCartridgeType: row.getCell(26).text.toLowerCase(),
            // };
            var number = row.getCell('Number').text;
            var rawType = row.getCell('Type').text;
            // const type: RoomType = EnumUtils.parseEnum(RoomType, rawType);
            // console.log(`Raw type is: ${rawType}, parsed type is: ${type}`);
            // let room = new Room(
            //     building,
            //     number,
            //     type,
            // );
            // room.setLastChecked(row.getCell('Timestamp').text);
            // room.setName(row.getCell('Name').text);
            // let rawLockType = row.getCell('Type').text;
            // let lockType: LockType = (<any>LockType)[rawLockType];
            // room.setLockType(lockType);
            // building.addRoom(room);
        });
        console.log("Loaded " + this.roomManager.getRooms().length + " rooms!");
    };
    DataHelper.prototype.loadPrimarySpreadsheet = function (spreadsheet) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!fs.existsSync(spreadsheet.path)) {
                            return reject("File could not be found: " + spreadsheet.path);
                        }
                        var self = _this;
                        var workbook = new Excel.Workbook();
                        workbook.xlsx.readFile(spreadsheet.path).then(function () {
                            self.loadBuildings(workbook.getWorksheet('Buildings'));
                            self.loadRooms(workbook.getWorksheet('Rooms'));
                            return resolve();
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    return DataHelper;
}());
var dataHelper = new DataHelper();
module.exports = dataHelper;
/*
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
                    description: row.getCell(2).text.toLowerCase().trim(),
                    solution: row.getCell(3).text.toLowerCase().trim(),
                    types: parseListFromString(row.getCell(4).text),
                    tags: parseListFromString(row.getCell(5).text),
                    whitelistedLocations: parseRooms(row.getCell(6).text.trim().toLowerCase()),
                    blacklistedLocations: parseRooms(row.getCell(7).text.trim().toLowerCase()),
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

function parseListFromString(str, delim) {
    if (isBlank(str)) return [];
    return str.toLowerCase().trim().split(",");
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
*/ 
