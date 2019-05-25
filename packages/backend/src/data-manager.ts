import Excel from 'exceljs';
import fs from 'fs';

import { ConfigManager, GoogleSpreadsheetConfig } from './config-manager';
import { BuildingManager } from './building-manager';
import { RoomManager } from './room-manager';
import { Building } from './building';
import { Room, Computer, Audio } from './room';
import { StringUtils } from './string-utils';
import { ImageManager, Image, RoomImages } from './image-manager';
import { TroubleshootingData } from './troubleshooting-data';
import { TroubleshootingDataManager } from './troubleshooting-data-manager';
import { GoogleDriveDownloader } from './downloader';
import { FileUtils } from './file-utils';


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

            let rootDir = './public';
            // create root dir if it does not exist
            await FileUtils.checkExists(rootDir)
                .then(async (exists: boolean) => {
                    if (!exists) {
                        await FileUtils.createDirectory(rootDir);
                        console.log("Created directory: " + rootDir);
                    }
                });

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


            // load images
            await self.loadImages().then(function () {
                console.log(`Loaded ${self.imageManager.getTotalSize()} images!`);
            }).catch(function (err) {
                console.error("There was an error loading images");
                return reject(err);
            })

            return resolve();
        });
    }

    private async downloadSpreadsheet(config: GoogleSpreadsheetConfig) {
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

    private generateColumns(sheet: Excel.Worksheet, headerRowIndex: number): void {
        let row = sheet.getRow(headerRowIndex);
        if (row === null || !row.values || !row.values.length) return;

        let headers: string[] = [];
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
                nicknames.toLocaleLowerCase().split(","),
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

            let building = self.buildingManager.getBuildingByName(buildingName);
            if (!building) {
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
                building.internalName,
                number,
                type,
            );

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

            building.addRoom(room);
        });
        console.debug(`Loaded ${this.roomManager.getRooms().length} rooms!`);
    }

    private async loadPrimarySpreadsheet() {
        let self = this;
        let config = this.configManager.getPrimarySpreadsheetConfig();

        return new Promise((resolve, reject) => {

            if (!fs.existsSync(config.getSheetPath())) {
                return reject("File could not be found: " + config.getSheetPath());
            }

            let workbook = new Excel.Workbook();
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
                let parts = piece.split("|");

                let buildingName = parts[0];
                let roomNumber = parts[1];

                let room: Room | null = this.roomManager.getRoom(buildingName, roomNumber);
                if (!room) continue;

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

            let title: string = row.getCell(config.troubleshootingTitleHeader.toLocaleLowerCase()).text.trim();
            let description: string = row.getCell(config.troubleshootingDescriptionHeader.toLocaleLowerCase()).text.trim();
            let solution: string = row.getCell(config.troubleshootingSolutionHeader.toLocaleLowerCase()).text.trim();

            let types: string[] = [];
            let rawTypes = row.getCell(config.troubleshootingTypesHeader.toLocaleLowerCase()).text.trim().split(",");
            for (const type of rawTypes) {
                if (!StringUtils.isBlank(type)) {
                    types.push(type.toLocaleLowerCase());
                }
            }

            let tags: string[] = [];
            let rawTags = row.getCell(config.troubleshootingTagsHeader.toLocaleLowerCase()).text.trim().split(",");
            for (const tag of rawTags) {
                if (!StringUtils.isBlank(tag)) {
                    tags.push(tag.toLocaleLowerCase());
                }
            }

            let data = new TroubleshootingData(
                title.toLocaleLowerCase(),
                description.toLocaleLowerCase(),
                solution.toLocaleLowerCase()
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
                data.addBlacklistedRoom(room);
            }

            self.troubleshootingDataManager.addTroubleshootingData(data);
        });
        console.log(`Loaded ${self.troubleshootingDataManager.getTroubleshootingData().length} troubleshooting data blocks!`);
    }

    private async loadSecondarySpreadsheet() {
        let self = this;
        let config = this.configManager.getSecondarySpreadsheetConfig();
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(config.getSheetPath())) {
                return reject("File could not be found: " + config.getSheetPath());
            }

            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(config.getSheetPath()).then(function () {

                self.loadTroubleshootingData(workbook.getWorksheet(config.troubleshootingSheetName));

                return resolve();
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    private async loadImages() {
        const self = this;
        const config = this.configManager.getImagesConfig();
        return new Promise(async (resolve, reject) => {

            let rootDir = config.imagesDirectory;
            // create root dir if it does not exist
            await FileUtils.checkExists(rootDir)
                .then(async (exists: boolean) => {
                    if (!exists) {
                        await FileUtils.createDirectory(rootDir);
                        console.log("Created directory: " + rootDir);
                    }
                });

            let buildingsDir = rootDir + "buildings/";
            // create buildings dir if it does not exist
            await FileUtils.checkExists(buildingsDir)
                .then(async (exists: boolean) => {
                    if (!exists) {
                        await FileUtils.createDirectory(buildingsDir);
                        console.log("Created directory: " + buildingsDir);
                    }
                });

            for (const building of self.buildingManager.getBuildings()) {

                let buildingDir = buildingsDir + building.internalName + "/";
                // create building dir if not exists
                await FileUtils.checkExists(buildingDir)
                    .then(async (exists: boolean) => {
                        if (!exists) {
                            await FileUtils.createDirectory(buildingDir);
                            console.log("Created directory: " + buildingDir);
                        }
                    });

                let roomsDir = buildingDir + 'rooms/';
                // create building dir if not exists
                await FileUtils.checkExists(roomsDir)
                    .then(async (exists: boolean) => {
                        if (!exists) {
                            await FileUtils.createDirectory(roomsDir);
                            console.log("Created directory: " + roomsDir);
                        }
                    });

                for (const room of building.getRooms()) {

                    let roomImages = new RoomImages(building.internalName, room.getNumber());

                    let roomDir = roomsDir + room.getNumber().toLocaleLowerCase() + "/";
                    // create room dir if not exists
                    await FileUtils.checkExists(roomDir)
                        .then(async (exists: boolean) => {
                            if (!exists) {
                                await FileUtils.createDirectory(roomDir);
                                console.log("Created directory: " + roomDir);
                            }
                        });

                    // root images
                    await fs.promises.readdir(roomDir).then(async function (files) {
                        for (const file of files) {
                            await fs.promises.stat(roomDir + file).then(function (stat) {
                                if (!stat.isDirectory()) {
                                    let url: string = roomDir.replace("public/", "") + file;
                                    let image: Image = new Image(url);
                                    roomImages.addMainImage(image);
                                }
                            });
                        }
                    }).catch(function (err: Error) {
                        console.log("Error reading root images at " + roomDir);
                        console.error(err);
                    });


                    // panoramic images
                    let panoramasDir = roomDir + "panoramas/";
                    // create panoramas dir if not exists
                    await FileUtils.checkExists(panoramasDir)
                        .then(async (exists: boolean) => {
                            if (!exists) {
                                await FileUtils.createDirectory(panoramasDir);
                                console.log("Created directory: " + panoramasDir);
                            }
                        });

                    await fs.promises.readdir(panoramasDir).then(async function (files) {
                        for (const file of files) {
                            await fs.promises.stat(panoramasDir + file).then(function (stat) {
                                if (!stat.isDirectory()) {
                                    let url: string = panoramasDir.replace("public/", "") + file;
                                    let image: Image = new Image(url);
                                    roomImages.addPanoramicImage(image);
                                }
                            });
                        }
                    }).catch(function (err) {
                        console.log("Error reading panoramic images at " + panoramasDir);
                    });


                    // equipment images
                    let equipmentDir = roomDir + "equipment/";
                    // create equipment dir if not exists
                    await FileUtils.checkExists(equipmentDir)
                        .then(async (exists: boolean) => {
                            if (!exists) {
                                await FileUtils.createDirectory(equipmentDir);
                                console.log("Created directory: " + equipmentDir);
                            }
                        });

                    await fs.promises.readdir(equipmentDir).then(async function (files) {
                        for (const file of files) {
                            await fs.promises.stat(equipmentDir + file).then(function (stat) {
                                if (!stat.isDirectory()) {
                                    let url: string = equipmentDir.replace("public/", "") + file;
                                    let image: Image = new Image(url);
                                    roomImages.addEquipmentImage(image);
                                }
                            });
                        }
                    }).catch(function (err) {
                        console.log("Error reading panoramic images at " + equipmentDir);
                    });

                    self.imageManager.addRoomImages(roomImages);
                    // console.debug(`Loaded ${roomImages.size()} images for ` + room.getDisplayName());
                }
            }
            return resolve();
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