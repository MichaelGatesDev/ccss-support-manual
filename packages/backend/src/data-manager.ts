import Excel from "exceljs";
import fs from "fs";

import { ConfigManager, GoogleSpreadsheetConfig, AppConfig, PrimarySpreadsheetConfig } from "./config-manager";
import { BuildingManager } from "./building-manager";
import { RoomManager } from "./room-manager";
import { ImageManager } from "./image-manager";
import { TroubleshootingDataManager } from "./troubleshooting-data-manager";

import { FileUtils, StringUtils, GoogleDriveDownloader, Building, BuildingUtils, TroubleshootingData, Room, RoomImages, Image, ExcelJSUtils } from "@ccss-support-manual/common";

export class DataManager {

    private configManager: ConfigManager;
    private buildingManager: BuildingManager;
    private roomManager: RoomManager;
    private imageManager: ImageManager;
    private troubleshootingDataManager: TroubleshootingDataManager;

    private roomTypes: string[] = [];
    // private lockTypes: string[] = [];
    // private furnitureTypes: string[] = [];

    public constructor() {
        this.configManager = new ConfigManager();
        this.buildingManager = new BuildingManager();
        this.roomManager = new RoomManager(this.buildingManager);
        this.imageManager = new ImageManager();
        this.troubleshootingDataManager = new TroubleshootingDataManager(this.roomManager);
    }

    public async initialize(): Promise<void> {

        // create root dir if it does not exist
        const rootDir = "./public";
        try {
            const exists: boolean = await FileUtils.checkExists(rootDir);
            if (!exists) {
                await FileUtils.createDirectory(rootDir);
                console.log("Created directory: " + rootDir);
            }
        } catch (error) {
            console.error("There ewas an error checking if the rootDir exists");
            return;
        }

        // configs
        await this.configManager.initialize();

        let appConfig: AppConfig | undefined = this.configManager.appConfig;
        if (appConfig === undefined) {
            console.error("AppConfig is undefined");
            return;
        }

        // check for updates
        if (appConfig.checkForDataUpdates) {
            await this.checkForUpdates();
        }

        // load data
        try {
            await this.loadPrimarySpreadsheet();
            console.log("Loaded primary spreadsheet");
        } catch (error) {
            console.error("There was an error loading the primary spreadsheet");
            console.error(error);
            return;
        }
        try {
            await this.loadSecondarySpreadsheet();
            console.log("Loaded secondary spreadsheet");
        } catch (error) {
            console.error("There was an error loading the secondary spreadsheet");
            console.error(error);
            return;
        }

        // load images
        try {
            await this.loadImages();
            console.log(`Loaded ${this.imageManager.getTotalSize()} images!`);
        } catch (error) {
            console.error("There was an error loading images");
            console.error(error);
            return;
        }
    }

    public async checkForUpdates(): Promise<void> {
        console.log("Checking for spreadsheet updates...");
        await this.checkUpdateForConfig(this.configManager.primarySpreadsheetConfig);
        await this.checkUpdateForConfig(this.configManager.secondarySpreadsheetConfig);
        console.log("Finished checking for spreadsheet updates");
    }

    public async checkUpdateForConfig(config?: GoogleSpreadsheetConfig): Promise<void> {
        try {
            if (config === undefined) {
                console.error("Config is undefind");
                return;
            }
            await this.downloadSpreadsheet(config);
            console.log("Downloaded spreadsheet!");
        } catch (error) {
            console.error("There was an error downloading the spreadsheet!");
            console.error(error);
        }
    }

    private async downloadSpreadsheet(config: GoogleSpreadsheetConfig): Promise<void> {
        if (!config) {
            console.error("Config invalid or not found");
            return;
        }

        if (StringUtils.isBlank(config.docID)) {
            console.error("No docID specified");
            return;
        }

        await GoogleDriveDownloader.downloadSpreadsheet(
            config.docID,
            "xlsx",
            config.sheetPath
        );
    }


    private loadBuildings(sheet: Excel.Worksheet): void {
        const self = this;

        const config = this.configManager.primarySpreadsheetConfig;
        if (config === undefined) {
            console.error("Config is undefined");
            return;
        }

        this.generateColumns(sheet, config.buildingsSheetHeaderRow);

        ExcelJSUtils.generateColumnHeaders(sheet, config.buildingsSheetHeaderRow);

        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == config.buildingsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

            const officialName = row.getCell(config.buildingsOfficialNameHeader.toLocaleLowerCase()).text;
            const nicknames = row.getCell(config.buildingsNicknamesHeader.toLocaleLowerCase()).text;

            const building: Building = {
                officialName: officialName,
                nicknames: nicknames.toLocaleLowerCase().split(","),
                internalName: StringUtils.internalize(officialName),
                rooms: []
            };

            self.buildingManager.addBuilding(building);
        });
        console.debug(`Loaded ${this.buildingManager.getBuildings().length} buildings!`);
    }

    private loadSingleColumnValues(sheet: Excel.Worksheet): string[] {
        let values: string[] = [];
        sheet.eachRow({ includeEmpty: false }, function (row: Excel.Row, _rowNumber: number) {
            let type = row.getCell(1).text;
            if (type && !StringUtils.isBlank(type) && !values.includes(type)) {
                values.push(type);
            }
        });
        return values;
    }

    private loadRooms(sheet: Excel.Worksheet): void {
        const self = this;

        let config = this.configManager.primarySpreadsheetConfig;
        if (config === undefined) {
            console.error("Config is undefined");
            return;
        }

        this.generateColumns(sheet, config.roomsSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

            if (config === undefined) {
                console.error("Config is undefined");
                return;
            }

            if (rowNumber == config.roomsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

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

            let room: Room = {
                buildingName: building.internalName,
                lastChecked: row.getCell(config.roomsTimestampHeader.toLocaleLowerCase()).text,
                number: number,
                name: row.getCell(config.roomsNameHeader.toLocaleLowerCase()).text,
                type: type,
                lockType: row.getCell(config.roomsLockTypeHeader.toLocaleLowerCase()).text,
                capacity: parseInt(row.getCell(config.roomsCapacityHeader.toLocaleLowerCase()).text),
                phone: {
                    extension: row.getCell(config.roomsPhoneExtensionHeader.toLocaleLowerCase()).text,
                    hasDisplay: row.getCell(config.roomsPhoneDisplayHeader.toLocaleLowerCase()).text.toLocaleLowerCase() === "true",
                    hasSpeaker: row.getCell(config.roomsPhoneSpeakerHeader.toLocaleLowerCase()).text.toLocaleLowerCase() === "true"
                },
                // projector: {},
                audio: {
                    systemDependent: StringUtils.parseBoolean(row.getCell(config.roomsAudioRequiresSystemHeader.toLocaleLowerCase()).text)
                },
                // screen: {},
                teachingStationComputer: {
                    type: row.getCell(config.roomsTeachingStationComputerTypeHeader.toLocaleLowerCase()).text,
                    operatingSystem: row.getCell(config.roomsTeachingStationComputerOSHeader.toLocaleLowerCase()).text
                },
                // documentCamera: {},
                // dvdPlayer: {},
                // printer: {}
            } as any;

            BuildingUtils.addRoom(building, room);
        });
        console.debug(`Loaded ${this.roomManager.getRooms().length} rooms!`);
    }

    private async loadPrimarySpreadsheet() {

        let config = this.configManager.primarySpreadsheetConfig;
        if (config === undefined) {
            console.error("Config is undefined");
            return;
        }

        try {
            await fs.promises.access(config.sheetPath);

            let workbook = await new Excel.Workbook().xlsx.readFile(config.sheetPath);

            this.loadBuildings(workbook.getWorksheet(config.buildingsSheetName));

            let roomTypes = this.loadSingleColumnValues(workbook.getWorksheet(config.roomTypesSheetName));
            this.roomTypes = roomTypes;
            // console.debug(`Loaded ${roomTypes.length} room types!`);

            // let lockTypes = this.loadSingleColumnValues(workbook.getWorksheet(config.lockTypesSheetName));
            // this.lockTypes = lockTypes;
            // console.debug(`Loaded ${lockTypes.length} room types!`);

            // let furnitureTypes = this.loadSingleColumnValues(workbook.getWorksheet(config.furnitureTypesSheetName));
            // this.furnitureTypes = furnitureTypes;
            // console.debug(`Loaded ${furnitureTypes.length} room types!`);

            this.loadRooms(workbook.getWorksheet(config.roomsSheetName));
        } catch (error) {
            console.error(`File could not be found: ${config.sheetPath}`);
            return;
        }
    }


    private parseRooms(raw: string): Room[] {
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

        let config = this.configManager.secondarySpreadsheetConfig;
        if (config === undefined) {
            console.error("Config is undefined");
            return;
        }

        this.generateColumns(sheet, config.troubleshootingSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

            if (config === undefined) {
                console.error("Config is undefined");
                return;
            }

            if (rowNumber == config.troubleshootingSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

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
        console.log(`Loaded ${this.troubleshootingDataManager.troubleshootingData.length} troubleshooting data blocks!`);
    }

    private async loadSecondarySpreadsheet(): Promise<void> {
        const self = this;

        let config = this.configManager.secondarySpreadsheetConfig;
        if (config === undefined) {
            console.error("Config is undefined");
            return;
        }

        try {
            await fs.promises.access(config.sheetPath);
            let workbook = await new Excel.Workbook().xlsx.readFile(config.sheetPath);
            self.loadTroubleshootingData(workbook.getWorksheet(config.troubleshootingSheetName));
        } catch (error) {
            console.error(`File could not be found: ${config.sheetPath}`);
        }
    }

    private async loadImages(): Promise<void> {
        const self = this;
        const config = this.configManager.imagesConfig;




        // create root dir if it does not exist
        let rootDir = config.imagesDirectory;
        try {
            const exists: boolean = await FileUtils.checkExists(rootDir);
            if (!exists) {
                await FileUtils.createDirectory(rootDir);
                console.log("Created directory: " + rootDir);
            }
        } catch (error) {
            console.error("There was an error creating the directory: " + rootDir);
        }

        let buildingsDir = rootDir + "buildings/";
        // create buildings dir if it does not exist
        await FileUtils.checkExists(buildingsDir)
            .then(async (exists: boolean) => {
                if (!exists) {
                    await FileUtils.createDirectory(buildingsDir);
                    console.log("Created directory: " + buildingsDir);
                }
            });

        for (const building of this.buildingManager.getBuildings()) {

            let buildingDir = buildingsDir + building.internalName + "/";
            // create building dir if not exists
            await FileUtils.checkExists(buildingDir)
                .then(async (exists: boolean) => {
                    if (!exists) {
                        await FileUtils.createDirectory(buildingDir);
                        console.log("Created directory: " + buildingDir);
                    }
                });

            let roomsDir = buildingDir + "rooms/";
            // create building dir if not exists
            await FileUtils.checkExists(roomsDir)
                .then(async (exists: boolean) => {
                    if (!exists) {
                        await FileUtils.createDirectory(roomsDir);
                        console.log("Created directory: " + roomsDir);
                    }
                });

            for (const room of building.rooms) {

                let roomImages = new RoomImages(building.internalName, room.number);

                let roomDir = roomsDir + room.number.toLocaleLowerCase() + "/";
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
                }).catch(function (_err) {
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
                }).catch(function (_err) {
                    console.log("Error reading panoramic images at " + equipmentDir);
                });

                this.imageManager.addRoomImages(roomImages);
                // console.debug(`Loaded ${roomImages.size()} images for ` + room.getDisplayName());
            }
        }
    }
}