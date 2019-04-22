import Excel = require('exceljs');
import fs = require('fs');

import { BuildingManager } from './BuildingManager';
import { RoomManager } from './RoomManager';
import { Building } from './models/Building';
import { Room, RoomType, LockType } from './models/Room';
// import { EnumUtils } from './EnumUtils';


class DataHelper {
    private buildingManager: BuildingManager;
    private roomManager: RoomManager;
    // private imageManager: ImageManager;
    // private troubleDataManager: TroubleDataManager;

    // private troubledata: string[];

    constructor() {
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        // this.imageManager = new ImageManager();
    }

    public getBuildingManager() { return this.buildingManager; }
    public getRoomManager() { return this.roomManager; }
    // public getImageManager(){ return this.imageManager; }


    private generateColumns(sheet: Excel.Worksheet, headerRowIndex: number) {
        let row = sheet.getRow(headerRowIndex);

        if (row === null || !row.values || !row.values.length) return [];

        let headers = [];
        for (let i: number = 1; i < row.values.length; i++) {
            let cell = row.getCell(i);
            headers.push(cell.text);
        }

        const numCols = sheet.actualColumnCount;
        for (let i: number = 0; i < numCols; i++) {
            sheet.getColumn(i + 1).key = headers[i];
            // console.log(`Column ${i + 1} key is ${headers[i]}`);
        }
    }

    private loadBuildings(sheet: Excel.Worksheet) {
        this.generateColumns(sheet, 1);

        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1) return; // skip headers row

            let officialName = row.getCell('Official Name').text;
            let nicknames = row.getCell('Nicknames').text;

            let building = new Building(
                officialName,
                nicknames.split(","),
            );

            self.buildingManager.addBuilding(building);
        });
        console.log(`Loaded ${this.buildingManager.getBuildings().length} buildings!`);
    }

    private loadRooms(sheet: Excel.Worksheet) {
        this.generateColumns(sheet, 1);

        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.

            var buildingNameCell = row.getCell('Building');
            if (!buildingNameCell) {
                console.log(`Building name cell empty at row ${rowNumber}`);
                return;
            }

            let buildingName = row.getCell('Building').text;
            var building = self.buildingManager.getBuildingByName(buildingName);

            if (!building) {
                console.log(`No such building exists: ${buildingName}`);
                return;
            }

            let number = row.getCell('Number').text;

            let rawType: string = row.getCell('Type').text;

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
        console.log(`Loaded ${this.roomManager.getRooms().length} rooms!`);
    }

    async loadPrimarySpreadsheet(spreadsheet: any) {
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(spreadsheet.path)) {
                return reject("File could not be found: " + spreadsheet.path);
            }

            var self = this;
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(spreadsheet.path).then(function () {

                self.loadBuildings(workbook.getWorksheet('Buildings'));
                self.loadRooms(workbook.getWorksheet('Rooms'));

                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
    }
}
let dataHelper = new DataHelper();
export = dataHelper;

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