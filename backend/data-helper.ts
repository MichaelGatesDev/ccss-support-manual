import Excel = require('exceljs');
import fs = require('fs');

import { BuildingManager } from './BuildingManager';
import { RoomManager } from './RoomManager';
import { Building } from './models/Building';
import { Room, Computer, Audio } from './models/Room';
import { StringUtils } from './StringUtils';
import { ImageManager, Image, RoomImages } from './ImageManager';


class DataHelper {
    private buildingManager: BuildingManager;
    private roomManager: RoomManager;
    private imageManager: ImageManager;
    // private troubleDataManager: TroubleDataManager;

    private roomTypes: string[] = [];
    private lockTypes: string[] = [];
    private furnitureTypes: string[] = [];

    constructor() {
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        this.imageManager = new ImageManager();
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
            sheet.getColumn(i + 1).key = headers[i].toLocaleLowerCase();
            // console.debug(`Column ${i + 1} key is ${headers[i]}`);
        }
    }

    private loadBuildings(sheet: Excel.Worksheet) {
        this.generateColumns(sheet, 1);

        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1) return; // skip headers row

            let officialName = row.getCell('official name').text;
            let nicknames = row.getCell('nicknames').text;

            let building = new Building(
                officialName,
                nicknames.split(","),
            );

            self.buildingManager.addBuilding(building);
        });
        console.debug(`Loaded ${this.buildingManager.getBuildings().length} buildings!`);
    }

    private loadSingleColumnValues(sheet: Excel.Worksheet) {
        let values: string[] = [];
        sheet.eachRow({ includeEmpty: false }, function (row: Excel.Row, rowNumber: number) {
            let type = row.getCell(1).text;
            if (type && !StringUtils.isBlank(type) && !values.includes(type)) {
                values.push(type);
            }
        });
        return values;
    }

    private loadRooms(sheet: Excel.Worksheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.

            let buildingName = row.getCell('building').text;
            var building = self.buildingManager.getBuildingByName(buildingName);
            if (!building) {
                console.debug(`No such building exists: ${buildingName}`);
                return;
            }

            let number = row.getCell('number').text;
            if (StringUtils.isBlank(number) || !StringUtils.isValidRoomNumber(number)) {
                console.debug(`Room number is blank or invalid: ${number}`);
                return;
            }

            let type: string = row.getCell('type').text;
            if (StringUtils.isBlank(number) || !self.roomTypes.includes(type)) {
                console.debug(`Room type is blank or invalid: ${type}`);
                return;
            }

            let room = new Room(
                building,
                number,
                type,
            );

            room.setLastChecked(row.getCell('timestamp').text);
            room.setName(row.getCell('name').text);
            room.setLockType(row.getCell('lock type').text);
            room.setCapacity(parseInt(row.getCell('capacity').text));
            room.setPhone(
                row.getCell('phone extension').text,
                row.getCell('phone display').text,
                row.getCell('phone speaker').text,
            );

            // room.setProjector(); 

            room.setAudio(
                new Audio(
                    StringUtils.parseBoolean(row.getCell('audio requires projector').text)
                )
            );

            // room.setScreen();

            room.setTeachingStationComputer(
                new Computer(
                    row.getCell('ts computer type').text,
                    row.getCell('ts computer operating system').text
                )
            );

            // room.setDocumentCamera();

            // room.setDVDPlayer();

            // room.setPrinter();

            building.addRoom(room);
        });
        console.debug(`Loaded ${this.roomManager.getRooms().length} rooms!`);
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

                let roomTypes = self.loadSingleColumnValues(workbook.getWorksheet('Room Types'));
                self.roomTypes = roomTypes;
                // console.debug(`Loaded ${roomTypes.length} room types!`);

                let lockTypes = self.loadSingleColumnValues(workbook.getWorksheet('Lock Types'));
                self.lockTypes = lockTypes;
                // console.debug(`Loaded ${lockTypes.length} room types!`);

                let furnitureTypes = self.loadSingleColumnValues(workbook.getWorksheet('Furniture Types'));
                self.furnitureTypes = furnitureTypes;
                // console.debug(`Loaded ${furnitureTypes.length} room types!`);

                self.loadRooms(workbook.getWorksheet('Rooms'));

                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    async loadSecondarySpreadsheet(spreadsheet: any) {
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(spreadsheet.path)) {
                return reject("File could not be found: " + spreadsheet.path);
            }

            var self = this;
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(spreadsheet.path).then(function () {

                // self.loadRooms(workbook.getWorksheet('Rooms'));

                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    async loadImages() {
        let self = this;
        return new Promise((resolve, reject) => {

            var rootDir = "public/images/buildings/";
            if (!fs.existsSync(rootDir)) {
                console.debug()
                return reject(`Image directory does not exist: ${rootDir}`);
            }

            for (const building of this.buildingManager.getBuildings()) {

                var buildingDir = rootDir + building.getInternalName() + "/";
                if (!fs.existsSync(buildingDir)) {
                    console.debug(`Building directory does not exist:${buildingDir}`);
                    continue;
                }

                for (const room of building.getRooms()) {

                    var roomDir = buildingDir + "rooms/" + room.getNumber() + "/";
                    if (!fs.existsSync(roomDir)) {
                        console.debug("Room directory does not exist: " + roomDir);
                        continue;
                    }

                    let roomImages = new RoomImages(room.getID());

                    // root images
                    for (const file of fs.readdirSync(roomDir)) {
                        var stat = fs.statSync(roomDir + file);
                        if (!stat.isDirectory()) {
                            let url: string = roomDir.replace("public/", "") + file;
                            let image: Image = new Image(url);
                            roomImages.addMainImage(image);
                        }
                    }

                    // panoramic images
                    var panoramasDir = roomDir + "panoramas/";
                    if (fs.existsSync(panoramasDir)) {
                        for (const file of fs.readdirSync(panoramasDir)) {
                            var stat = fs.statSync(panoramasDir + file);
                            if (!stat.isDirectory()) {
                                let url: string = panoramasDir.replace("public/", "") + file;
                                let image: Image = new Image(url);
                                roomImages.addPanoramicImage(image);
                            }
                        }
                    }

                    // equipment images
                    var equipmentDir = roomDir + "equipment/";
                    if (fs.existsSync(equipmentDir)) {
                        for (const file of fs.readdirSync(equipmentDir)) {
                            var stat = fs.statSync(equipmentDir + file);
                            if (!stat.isDirectory()) {
                                let url: string = equipmentDir.replace("public/", "") + file;
                                let image: Image = new Image(url);
                                roomImages.addEquipmentImage(image);
                            }
                        }
                    }

                    self.imageManager.setRoomImages(room.getID(), roomImages);
                    console.debug(`Loaded ${roomImages.size()} images for ` + room.getDisplayName());
                }
                
            }
            return resolve();
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

*/