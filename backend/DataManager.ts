import Excel = require('exceljs');
import fs = require('fs');

import { ConfigManager, GoogleSpreadsheetConfig } from './ConfigManager';
import { BuildingManager } from './BuildingManager';
import { RoomManager } from './RoomManager';
import { Building } from './models/Building';
import { Room, Computer, Audio } from './models/Room';
import { StringUtils } from './StringUtils';
import { ImageManager, Image, RoomImages } from './ImageManager';
import { TroubleshootingData } from './models/TroubleshootingData';
import { TroubleshootingDataManager } from './TroubleshootingDataManager';
import { GoogleDriveDownloader } from './Downloader';


class DataManager {

    private configManager: ConfigManager;
    private buildingManager: BuildingManager;
    private roomManager: RoomManager;
    private imageManager: ImageManager;
    private troubleshootingDataManager: TroubleshootingDataManager;

    private roomTypes: string[] = [];
    private lockTypes: string[] = [];
    private furnitureTypes: string[] = [];

    constructor() {
        this.configManager = new ConfigManager();
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        this.imageManager = new ImageManager();
        this.troubleshootingDataManager = new TroubleshootingDataManager(this.roomManager);
    }

    public async initialize() {
        const self = this;
        return new Promise(async (resolve, reject) => {

            // configs
            await self.configManager.initialize();

            let config = self.configManager.getAppConfig();
            if (!config) {
                return reject(new Error("No app config found"));
            }

            // check for updates
            if (config.checkForDataUpdates) {
                console.log("Checking for data updates...");

                await self.downloadSpreadsheet(self.configManager.getPrimarySpreadsheetConfig())
                    .then(function () {
                        console.log("Downloaded primary spreadsheet!");
                    })
                    .catch(function (err) {
                        console.error("There was an error downloading the primary spreadsheet!");
                        return reject(err);
                    });

                await self.downloadSpreadsheet(self.configManager.getSecondarySpreadsheetConfig())
                    .then(function () {
                        console.log("Downloaded secondary spreadsheet!");
                    })
                    .catch(function (err) {
                        console.error("There was an error downloading the secondary spreadsheet!");
                        return reject(err);
                    });
            }

            // load data

            await self.loadPrimarySpreadsheet().then(function () {
                console.log("Loaded primary spreadsheet");
            }).catch(function (err) {
                console.error("There was an error loading the primary spreadsheet");
                return reject(err);
            });

            await self.loadSecondarySpreadsheet().then(function () {
                console.log("Loaded secondary spreadsheet");
            }).catch(function (err) {
                console.error("There was an error loading the secondary spreadsheet");
                return reject(err);
            });

            return resolve();
        });
    }

    public async downloadSpreadsheet(config: GoogleSpreadsheetConfig) {
        return new Promise((resolve, reject) => {
            if (!config) {
                return reject(new Error("Config invalid or not found"));
            }

            if (StringUtils.isBlank(config.getDocID())) {
                return reject(new Error("No docID specified"));
            }

            GoogleDriveDownloader.downloadSpreadsheet(
                config.getDocID(),
                'xlsx',
                config.getSheetPath()
            ).then(function () {
                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
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
        const self = this;
        let config = self.configManager.getPrimarySpreadsheetConfig();
        this.generateColumns(sheet, config.buildingsSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == config.buildingsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.

            let officialName = row.getCell(config.buildingsOfficialNameHeader.toLocaleLowerCase()).text;
            let nicknames = row.getCell(config.buildingsNicknamesHeader.toLocaleLowerCase()).text;

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
        const self = this;
        let config = self.configManager.getPrimarySpreadsheetConfig();
        this.generateColumns(sheet, config.roomsSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == config.roomsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.

            let buildingName = row.getCell(config.roomsBuildingHeader.toLocaleLowerCase()).text;
            if (!buildingName) {
                console.debug(`No such building exists: ${buildingName}`);
                return;
            }

            let number = row.getCell(config.roomsNumberHeader.toLocaleLowerCase()).text;
            if (StringUtils.isBlank(number) || !StringUtils.isValidRoomNumber(number)) {
                console.debug(`Room number is blank or invalid: ${number}`);
                return;
            }

            let type: string = row.getCell(config.roomsTypeHeader.toLocaleLowerCase()).text;
            if (StringUtils.isBlank(number) || !self.roomTypes.includes(type)) {
                console.debug(`Room type is blank or invalid: ${type}`);
                return;
            }

            let room = new Room(
                buildingName,
                number,
                type,
            );

            if (!room.getBuilding()) {
                console.debug("Room building is not valid!");
                return;
            }

            room.setLastChecked(row.getCell(config.roomsTimestampHeader.toLocaleLowerCase()).text);
            room.setName(row.getCell(config.roomsNameHeader.toLocaleLowerCase()).text);
            room.setLockType(row.getCell(config.roomsLockTypeHeader.toLocaleLowerCase()).text);
            room.setCapacity(parseInt(row.getCell(config.roomsCapacityHeader.toLocaleLowerCase()).text));
            room.setPhone(
                row.getCell(config.roomsPhoneExtensionHeader.toLocaleLowerCase()).text,
                row.getCell(config.roomsPhoneDisplayHeader.toLocaleLowerCase()).text,
                row.getCell(config.roomsPhoneSpeakerHeader.toLocaleLowerCase()).text,
            );

            // room.setProjector(); 

            room.setAudio(
                new Audio(
                    StringUtils.parseBoolean(row.getCell(config.roomsAudioRequiresSystemHeader.toLocaleLowerCase()).text)
                )
            );

            // room.setScreen();

            if (row.getCell(config.roomsTeachingStationComputerHeader.toLocaleLowerCase())) {
                room.setTeachingStationComputer(
                    new Computer(
                        row.getCell(config.roomsTeachingStationComputerTypeHeader.toLocaleLowerCase()).text,
                        row.getCell(config.roomsTeachingStationComputerOSHeader.toLocaleLowerCase()).text
                    )
                );
            }

            // room.setDocumentCamera();

            // room.setDVDPlayer();

            // room.setPrinter();

            room.getBuilding()!.addRoom(room);
        });
        console.debug(`Loaded ${this.roomManager.getRooms().length} rooms!`);
    }

    async loadPrimarySpreadsheet() {
        var self = this;
        let config = this.configManager.getPrimarySpreadsheetConfig();

        return new Promise((resolve, reject) => {

            if (!fs.existsSync(config.getSheetPath())) {
                return reject("File could not be found: " + config.getSheetPath());
            }

            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(config.getSheetPath()).then(function () {

                self.loadBuildings(workbook.getWorksheet(config.buildingsSheetName));

                let roomTypes = self.loadSingleColumnValues(workbook.getWorksheet(config.roomTypesSheetName));
                self.roomTypes = roomTypes;
                // console.debug(`Loaded ${roomTypes.length} room types!`);

                let lockTypes = self.loadSingleColumnValues(workbook.getWorksheet(config.lockTypesSheetName));
                self.lockTypes = lockTypes;
                // console.debug(`Loaded ${lockTypes.length} room types!`);

                let furnitureTypes = self.loadSingleColumnValues(workbook.getWorksheet(config.furnitureTypesSheetName));
                self.furnitureTypes = furnitureTypes;
                // console.debug(`Loaded ${furnitureTypes.length} room types!`);

                self.loadRooms(workbook.getWorksheet(config.roomsSheetName));

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

                let room: Room | undefined = this.roomManager.getRoomByBuildingNameAndNumber(buildingName, roomNumber);
                if (!room) continue; // no location at building/room

                results.push(room);
            }
        }
        return results;
    }

    private loadTroubleshootingData(sheet: Excel.Worksheet) {
        const self = this;
        const config = this.configManager.getSecondarySpreadsheetConfig();
        this.generateColumns(sheet, config.troubleshootingSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == config.troubleshootingSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '') return; // skip if row is empty. exceljs doesn't work well for some reason.

            let title: string = row.getCell(config.troubleshootingTitleHeader.toLocaleLowerCase()).text;
            let description: string = row.getCell(config.troubleshootingDescriptionHeader.toLocaleLowerCase()).text;
            let solution: string = row.getCell(config.troubleshootingSolutionHeader.toLocaleLowerCase()).text;
            let types: string[] = row.getCell(config.troubleshootingTypesHeader.toLocaleLowerCase()).text.split(",");
            let tags: string[] = row.getCell(config.troubleshootingTagsHeader.toLocaleLowerCase()).text.split(",");

            let data = new TroubleshootingData(
                title,
                description,
                solution
            );

            data.setTypes(types);
            data.setTags(tags);

            let rawWhitelisted: string = row.getCell(config.troubleshootingWhitelistedRoomsHeader.toLocaleLowerCase()).text;
            let whitelisted: Room[] = self.parseRooms(rawWhitelisted);
            for (const room of whitelisted) {
                data.addWhitelistedRoom(room);
            }

            let rawBlacklisted: string = row.getCell(config.troubleshootingBlacklistedRoomsHeader.toLocaleLowerCase()).text;
            let blacklisted: Room[] = self.parseRooms(rawBlacklisted);
            for (const room of blacklisted) {
                data.addWhitelistedRoom(room);
            }

            self.troubleshootingDataManager.addTroubleshootingData(data);
        });
        console.log(`Loaded ${self.troubleshootingDataManager.getTroubleshootingData().length} troubleshooting data blocks!`);
    }

    async loadSecondarySpreadsheet() {
        var self = this;
        let config = this.configManager.getSecondarySpreadsheetConfig();
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(config.getSheetPath())) {
                return reject("File could not be found: " + config.getSheetPath());
            }

            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(config.getSheetPath()).then(function () {

                self.loadTroubleshootingData(workbook.getWorksheet(config.troubleshootingSheetName));

                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    async loadImages() {
        const self = this;
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

    public getConfigManager() {
        return this.configManager;
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
}

export {
    DataManager
}