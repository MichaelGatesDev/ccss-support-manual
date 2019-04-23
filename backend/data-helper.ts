import Excel = require('exceljs');
import fs = require('fs');

import { BuildingManager } from './BuildingManager';
import { RoomManager } from './RoomManager';
import { Building } from './models/Building';
import { Room, Computer, Audio } from './models/Room';
import { StringUtils } from './StringUtils';
import { ImageManager, Image, RoomImages } from './ImageManager';
import { TroubleshootingData } from './models/TroubleshootingData';
import { TroubleshootingDataManager } from './TroubleshootingDataManager';


class DataHelper {
    private buildingManager: BuildingManager;
    private roomManager: RoomManager;
    private imageManager: ImageManager;
    private troubleshootingDataManager: TroubleshootingDataManager;

    private roomTypes: string[] = [];
    private lockTypes: string[] = [];
    private furnitureTypes: string[] = [];

    constructor() {
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        this.imageManager = new ImageManager();
        this.troubleshootingDataManager = new TroubleshootingDataManager(this.roomManager);
    }

    public getBuildingManager() {
        return this.buildingManager;
    }
    public getRoomManager() {
        return this.roomManager;
    }
    public getImageManager() {
        return this.imageManager;
    }
    public getTroubleshootingDataManager() {
        return this.troubleshootingDataManager;
    }


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
                    StringUtils.parseBoolean(row.getCell('audio requires system').text)
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
        var self = this;
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(spreadsheet.path)) {
                return reject("File could not be found: " + spreadsheet.path);
            }

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


    private parseRooms(raw: string) {
        let results: Room[] = [];
        if (!StringUtils.isBlank(raw)) {
            for (const piece of raw.split(",")) {
                var parts = piece.split("|");

                var buildingName = parts[0];
                var roomNumber = parts[1];

                let room: Room | null = this.roomManager.getRoomByBuildingNameAndNumber(buildingName, roomNumber);
                if (!room) continue; // no location at building/room

                results.push(room);
            }
        }
        return results;
    }

    private loadTroubleshootingData(sheet: Excel.Worksheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.


            let title: string = row.getCell('incident').text;
            let description: string = row.getCell('description').text;
            let solution: string = row.getCell('solution').text;
            let types: string[] = row.getCell('types').text.split(",");
            let tags: string[] = row.getCell('tags').text.split(",");

            let data = new TroubleshootingData(
                title,
                description,
                solution
            );

            data.setTypes(types);
            data.setTags(tags);

            let rawWhitelisted: string = row.getCell('whitelisted rooms').text;
            let whitelisted: Room[] = self.parseRooms(rawWhitelisted);
            for (const room of whitelisted) {
                data.addWhitelistedRoom(room);
            }

            let rawBlacklisted: string = row.getCell('blacklisted rooms').text;
            let blacklisted: Room[] = self.parseRooms(rawBlacklisted);
            for (const room of blacklisted) {
                data.addWhitelistedRoom(room);
            }

            self.troubleshootingDataManager.addTroubleshootingData(data);
        });
        console.log(`Loaded ${self.troubleshootingDataManager.getTroubleshootingData().length} troubleshooting data blocks!`);
    }

    async loadSecondarySpreadsheet(spreadsheet: any) {
        var self = this;
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(spreadsheet.path)) {
                return reject("File could not be found: " + spreadsheet.path);
            }

            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(spreadsheet.path).then(function () {

                self.loadTroubleshootingData(workbook.getWorksheet('QA'));

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

            fs.promises.access(rootDir, fs.constants.R_OK).then(async function () {

                // console.log("ACCESSING ROOT DIR");

                for (const building of self.buildingManager.getBuildings()) {

                    var buildingDir = rootDir + building.getInternalName() + "/";

                    await fs.promises.access(buildingDir, fs.constants.R_OK).then(async function () {

                        // console.log("ACCESSING BUILDING DIR " + buildingDir);

                        for (const room of building.getRooms()) {

                            var roomDir = buildingDir + "rooms/" + room.getNumber().toLocaleLowerCase() + "/";

                            await fs.promises.access(roomDir, fs.constants.R_OK).then(async function () {
                                let roomImages = new RoomImages(room.getID());

                                // console.log("ACCESSING ROOM DIR " + roomDir);


                                // root images
                                await fs.promises.readdir(roomDir).then(async function (files) {
                                    for (const file of files) {
                                        await fs.promises.stat(roomDir + file).then(function (stat) {
                                            if (stat.isFile) {
                                                let url: string = roomDir.replace("public/", "") + file;
                                                let image: Image = new Image(url);
                                                roomImages.addMainImage(image);
                                            }
                                        });
                                    }
                                }).catch(function (err) {
                                    console.log("Error reading root images at " + roomDir);
                                });


                                // panoramic images
                                var panoramasDir = roomDir + "panoramas/";
                                await fs.promises.access(panoramasDir, fs.constants.R_OK).then(async function () {
                                    await fs.promises.readdir(panoramasDir).then(async function (files) {
                                        for (const file of files) {
                                            await fs.promises.stat(panoramasDir + file).then(function (stat) {
                                                if (stat.isFile) {
                                                    let url: string = panoramasDir.replace("public/", "") + file;
                                                    let image: Image = new Image(url);
                                                    roomImages.addPanoramicImage(image);
                                                }
                                            });
                                        }
                                    }).catch(function (err) {
                                        console.log("Error reading panoramic images at " + panoramasDir);
                                    });
                                }).catch(function () {
                                    console.log("Error accessing panoramic directory at " + panoramasDir);
                                });


                                // equipment images
                                var equipmentDir = roomDir + "equipment/";
                                await fs.promises.access(equipmentDir, fs.constants.R_OK).then(async function () {
                                    await fs.promises.readdir(equipmentDir).then(async function (files) {
                                        for (const file of files) {
                                            await fs.promises.stat(equipmentDir + file).then(function (stat) {
                                                if (stat.isFile) {
                                                    let url: string = equipmentDir.replace("public/", "") + file;
                                                    let image: Image = new Image(url);
                                                    roomImages.addEquipmentImage(image);
                                                }
                                            });
                                        }
                                    }).catch(function (err) {
                                        console.log("Error reading panoramic images at " + equipmentDir);
                                    });
                                }).catch(function () {
                                    console.log("Error accessing equipment directory at " + equipmentDir);
                                });

                                self.imageManager.setRoomImages(room.getID(), roomImages);
                                // console.debug(`Loaded ${roomImages.size()} images for ` + room.getDisplayName());

                            }).catch(async function (err) {
                                console.error("Unable to access room dir " + roomDir);
                            });
                        }
                    }).catch(async function (err) {
                        console.error(err);
                    });
                }
                return resolve();
            }).catch(async function (err) {
                return reject(err);
            });
        });
    }

}

let dataHelper = new DataHelper();
export = dataHelper;
/*
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



*/