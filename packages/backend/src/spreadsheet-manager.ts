import { Logger, StringUtils, GoogleDriveDownloader, EnumUtils, FileUtils } from '@michaelgatesdev/common';
import Excel from "exceljs";

import { GoogleSpreadsheetConfig } from "./configs/GoogleSpreadsheetConfig";
import { app } from "./app";
import { BuildingFactory, RoomType, LockType, RoomFactory, Classroom, RoomTypeUtils, ClassroomFactory, PhoneFactory, DeviceFactory, DeviceType, SmartClassroom, SmartClassroomFactory, TeachingStationFactory, TeachingStationType, ComputerType, OperatingSystem, TeachingStationComputerFactory, ComputerFactory, AudioFactory, SpeakerType, SimpleRoom, TroubleshootingDataFactory } from "@ccss-support-manual/models";
import { BuildingUtils, RoomUtils, ExcelJSUtils } from '@ccss-support-manual/utilities';

export class SpreadsheetManager {

    public async initialize(): Promise<void> {

        if (app.configManager.appConfig !== undefined) {
            if (app.configManager.appConfig.checkForDataUpdates) {
                await this.checkForUpdates();
            }
        }

        // load data from classroom checks spreadsheet
        try {
            Logger.info("Loading classroom checks spreadsheet...");
            await this.loadClassroomChecksSpreadsheet();
            Logger.info("Finished loading classroom checks spreadsheet");
        } catch (error) {
            Logger.error("There was an error loading the classroom checks spreadsheet");
            Logger.error(error);
            return;
        }

        // load data from troubleshoting spreadsheet
        try {
            await this.loadTroubleshootingDataSpreadsheet();
            Logger.info("Loaded troubleshooting data spreadsheet");
        } catch (error) {
            Logger.error("There was an error loading the troubleshooting data spreadsheet");
            Logger.error(error);
            return;
        }
    }

    public async checkForUpdates(): Promise<void> {
        Logger.info("Checking for spreadsheet updates...");
        await this.checkUpdateForSpreadsheet(app.configManager.classroomChecksSpreadsheetConfig);
        await this.checkUpdateForSpreadsheet(app.configManager.troubleshootingSpreadsheetConfig);
        Logger.info("Finished checking for spreadsheet updates");
    }

    public async checkUpdateForSpreadsheet(config?: GoogleSpreadsheetConfig): Promise<void> {
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }
        await this.downloadSpreadsheet(config.docID, config.sheetPath);
    }

    private async downloadSpreadsheet(docID: string, sheetPath: string): Promise<void> {
        if (StringUtils.isBlank(docID)) {
            Logger.error("No docID specified");
            return;
        }

        try {
            Logger.info(`Downloading spreadsheet ${docID}`);
            await GoogleDriveDownloader.downloadSpreadsheet(
                docID,
                "xlsx",
                sheetPath
            );
            Logger.info(`Finished download spreadsheet ${docID}`);
        } catch (error) {
            Logger.error(`Failed to download spreadsheet: ${docID}`);
            Logger.error(error);
        }
    }


    private loadBuildings(sheet: Excel.Worksheet): void {
        const config = app.configManager.classroomChecksSpreadsheetConfig;
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }

        ExcelJSUtils.generateColumnHeaders(sheet, config.buildingsSheetHeaderRow);

        sheet.eachRow({ includeEmpty: false }, (row, rowNumber): void => {
            if (rowNumber == config.buildingsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

            const officialName = row.getCell(config.buildingsOfficialNameHeader.toLocaleLowerCase()).text.toLowerCase();
            const nicknames = row.getCell(config.buildingsNicknamesHeader.toLocaleLowerCase()).text.toLowerCase();

            const building = new BuildingFactory()
                .withOfficialName(officialName)
                .withNicknames(nicknames.split(","))
                .withInternalName(StringUtils.internalize(officialName))
                .withRooms([])
                .build();

            app.buildingManager.addBuilding(building);
        });
        console.debug(`Loaded ${app.buildingManager.buildings.length} buildings`);
    }


    private loadRooms(sheet: Excel.Worksheet): void {

        const config = app.configManager.classroomChecksSpreadsheetConfig;
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }

        ExcelJSUtils.generateColumnHeaders(sheet, config.roomsSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber): void => {
            if (rowNumber == config.roomsSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

            const buildingName = row.getCell(config.roomsBuildingHeader.toLocaleLowerCase()).text.toLowerCase();
            if (!buildingName) {
                console.debug(`No such building exists: ${buildingName}`);
                return;
            }

            const building = app.buildingManager.getBuildingByName(buildingName);
            if (!building) {
                console.debug(`No such building exists: ${buildingName}`);
                return;
            }

            const number = row.getCell(config.roomsNumberHeader.toLocaleLowerCase()).text.toLowerCase();
            if (StringUtils.isBlank(number) || !RoomUtils.isValidRoomNumber(number)) {
                console.debug(`Room number is blank or invalid: ${number}`);
                return;
            }

            const name = row.getCell(config.roomsNameHeader.toLocaleLowerCase()).text.toLowerCase();

            const roomType: RoomType = RoomType[row.getCell(config.roomsTypeHeader.toLocaleLowerCase()).text as keyof typeof RoomType];
            if (roomType === undefined) {
                console.debug(`Room type is invalid: ${roomType}`);
                return;
            }

            const lockType: LockType = LockType[row.getCell(config.roomsLockTypeHeader.toLocaleLowerCase()).text as keyof typeof LockType];
            if (lockType === undefined) {
                console.debug(`Lock type is invalid: ${lockType}`);
                return;
            }

            const capacity: number = parseInt(row.getCell(config.roomsCapacityHeader.toLocaleLowerCase()).text);


            const room = new RoomFactory()
                .withBuildingName(building.internalName)
                .withNumber(number)
                .withName(name)
                .withType(roomType)
                .withLockType(lockType)
                .withCapacity(capacity)
                .build();

            let classroom: Classroom | undefined;
            if (RoomTypeUtils.isClassroom(roomType)) {
                let roomFactory = new ClassroomFactory(room);

                // timestamp / last checked
                const lastChecked = row.getCell(config.roomsTimestampHeader.toLocaleLowerCase()).text.toLowerCase();
                roomFactory = roomFactory.withLastChecked(lastChecked);

                // phone
                const roomsPhoneStatus: string = row.getCell(config.roomsPhoneStatusHeader.toLocaleLowerCase()).text.toLowerCase();
                const roomsPhoneExtension: string = row.getCell(config.roomsPhoneExtensionHeader.toLocaleLowerCase()).text.toLowerCase();
                const roomsPhoneDisplayStatus: string = row.getCell(config.roomsPhoneDisplayStatusHeader.toLocaleLowerCase()).text.toLowerCase();
                const roomsPhoneSpeakerStatus: string = row.getCell(config.roomsPhoneSpeakerStatusHeader.toLocaleLowerCase()).text.toLowerCase();
                if (roomsPhoneStatus !== "n/a") {
                    roomFactory = roomFactory.withPhone(
                        new PhoneFactory(
                            new DeviceFactory().ofType(DeviceType.Phone).build()
                        )
                            .withExtension(roomsPhoneExtension)
                            .hasDisplay(roomsPhoneDisplayStatus !== "n/a")
                            .hasSpeaker(roomsPhoneSpeakerStatus !== "n/a")
                            .build()
                    );
                }
                classroom = roomFactory.build();
            }


            let smartClassroom: SmartClassroom | undefined;
            if (RoomTypeUtils.isSmartClassroom(roomType)) {
                if (classroom === undefined) return;
                let roomFactory = new SmartClassroomFactory(classroom);


                // teaching station
                let teachingStationFactory = new TeachingStationFactory();

                const rawTeachingStationType = row.getCell(config.roomsTeachingStationTypeHeader.toLocaleLowerCase()).text.toLowerCase();
                const tsType = EnumUtils.parse(TeachingStationType, rawTeachingStationType);
                if (tsType === undefined) {
                    console.debug(`Teaching Station Type is invalid: ${rawTeachingStationType}`);
                    return;
                }

                const tsComputerStatus = config.roomsTeachingStationComputerStatusHeader.toLocaleLowerCase();
                if (tsComputerStatus !== "n/a") {

                    const rawTeachingStationComputerType = row.getCell(config.roomsTeachingStationComputerTypeHeader.toLocaleLowerCase()).text.toLowerCase();
                    const teachingStationComputerType = EnumUtils.parse(ComputerType, rawTeachingStationComputerType);
                    if (teachingStationComputerType === undefined) {
                        console.debug(`Teaching Station Computer Type is invalid: ${rawTeachingStationComputerType}`);
                        return;
                    }

                    const rawTeachingStationComputerOperatingSystem = row.getCell(config.roomsTeachingStationComputerOperatingSystemHeader.toLocaleLowerCase()).text.toLowerCase();
                    const teachingStationComputerOperatingSystem = EnumUtils.parse(OperatingSystem, rawTeachingStationComputerOperatingSystem);
                    if (teachingStationComputerOperatingSystem === undefined) {
                        console.debug(`Teaching Station Computer Operating System is invalid: ${rawTeachingStationComputerOperatingSystem}`);
                        return;
                    }

                    const rawTeachingStationComputerCameraStatus = row.getCell(config.roomsTeachingStationComputerCameraStatusHeader.toLocaleLowerCase()).text.toLowerCase();

                    teachingStationFactory = teachingStationFactory.withComputer(
                        new TeachingStationComputerFactory(
                            new ComputerFactory(
                                new DeviceFactory()
                                    .ofType(DeviceType.Computer)
                                    .build()
                            )
                                .ofType(teachingStationComputerType)
                                .withOperatingSystem(teachingStationComputerOperatingSystem)
                                .build()
                        )
                            .hasWebcam(rawTeachingStationComputerCameraStatus !== "n/a")
                            .build()
                    )
                        .ofType(tsType);
                }
                roomFactory = roomFactory.withTeachingStation(teachingStationFactory.build());


                // audio
                let audioFactory = new AudioFactory();

                const audioStatus = row.getCell(config.roomsAudioStatusHeader.toLocaleLowerCase()).text.toLowerCase();
                if (audioStatus !== "n/a") {

                    const isSystemDependent: boolean = StringUtils.parseBoolean(row.getCell(config.roomsAudioRequiresSystemHeader.toLocaleLowerCase()).text);
                    audioFactory = audioFactory.isSystemDependent(isSystemDependent);

                    const speakerType = SpeakerType[row.getCell(config.roomsAudioSpeakersTypeHeader.toLocaleLowerCase()).text as keyof typeof SpeakerType];
                    if (speakerType !== undefined) {
                        audioFactory = audioFactory.withSpeakerType(speakerType);
                    }
                }

                roomFactory = roomFactory.withAudio(audioFactory.build());


                // video
                // let videoFactory = new VideoFactory();

                smartClassroom = roomFactory.build();
            }


            // register room
            if (smartClassroom !== undefined && smartClassroom) {
                BuildingUtils.addRoom(building, room);
            } else if (classroom !== undefined && classroom) {
                BuildingUtils.addRoom(building, classroom);
            }

        });
        console.debug(`Loaded ${app.roomManager.getRooms().length} rooms`);
    }


    private async loadClassroomChecksSpreadsheet(): Promise<void> {

        let config = app.configManager.classroomChecksSpreadsheetConfig;
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }

        if (!await FileUtils.checkExists(config.sheetPath)) {
            Logger.error(`File could not be found: ${config.sheetPath}`);
            return;
        }

        const workbook = await new Excel.Workbook().xlsx.readFile(config.sheetPath);
        this.loadBuildings(workbook.getWorksheet(config.buildingsSheetName));
        this.loadRooms(workbook.getWorksheet(config.roomsSheetName));
    }


    private parseRooms(raw: string): SimpleRoom[] {
        let results: SimpleRoom[] = [];
        if (!StringUtils.isBlank(raw)) {
            for (const piece of raw.split(",")) {
                let parts = piece.split("|");

                let buildingName = parts[0];
                let roomNumber = parts[1];

                const room = app.roomManager.getRoom(buildingName, roomNumber);
                if (room === undefined) continue;

                results.push(RoomUtils.getSimplified(room));
            }
        }
        return results;
    }

    private loadTroubleshootingData(sheet: Excel.Worksheet): void {

        const config = app.configManager.troubleshootingSpreadsheetConfig;
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }

        ExcelJSUtils.generateColumnHeaders(sheet, config.troubleshootingSheetHeaderRow);
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber): void => {

            if (config === undefined) {
                Logger.error("Config is undefined");
                return;
            }

            if (rowNumber == config.troubleshootingSheetHeaderRow) return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === "") return; // skip if row is empty. exceljs doesn"t work well for some reason.

            const title: string = row.getCell(config.troubleshootingTitleHeader.toLocaleLowerCase()).text.trim();
            const description: string = row.getCell(config.troubleshootingDescriptionHeader.toLocaleLowerCase()).text.trim();
            const solution: string = row.getCell(config.troubleshootingSolutionHeader.toLocaleLowerCase()).text.trim();

            const types: string[] = [];
            const rawTypes = row.getCell(config.troubleshootingTypesHeader.toLocaleLowerCase()).text.trim().split(",");
            for (const type of rawTypes) {
                if (!StringUtils.isBlank(type)) {
                    types.push(type.toLocaleLowerCase());
                }
            }

            const tags: string[] = [];
            const rawTags = row.getCell(config.troubleshootingTagsHeader.toLocaleLowerCase()).text.trim().split(",");
            for (const tag of rawTags) {
                if (!StringUtils.isBlank(tag)) {
                    tags.push(tag.toLocaleLowerCase());
                }
            }

            const rawWhitelisted: string = row.getCell(config.troubleshootingWhitelistedRoomsHeader.toLocaleLowerCase()).text.toLowerCase();
            const whitelisted: SimpleRoom[] = this.parseRooms(rawWhitelisted);


            const rawBlacklisted: string = row.getCell(config.troubleshootingBlacklistedRoomsHeader.toLocaleLowerCase()).text.toLowerCase();
            const blacklisted: SimpleRoom[] = this.parseRooms(rawBlacklisted);



            let dataFactory = new TroubleshootingDataFactory()
                .withTitle(title)
                .withDescription(description)
                .withSolution(solution)
                .withTypes(types)
                .withWhitelistedRooms(whitelisted)
                .withBlacklistedRooms(blacklisted)
                .withTags(tags);


            app.troubleshootingDataManager.addTroubleshootingData(dataFactory.build());
        });
        Logger.info(`Loaded ${app.troubleshootingDataManager.troubleshootingData.length} troubleshooting data items`);
    }

    private async loadTroubleshootingDataSpreadsheet(): Promise<void> {

        let config = app.configManager.troubleshootingSpreadsheetConfig;
        if (config === undefined) {
            Logger.error("Config is undefined");
            return;
        }

        if (!await FileUtils.checkExists(config.sheetPath)) {
            Logger.error(`File could not be found: ${config.sheetPath}`);
            return;
        }

        let workbook = await new Excel.Workbook().xlsx.readFile(config.sheetPath);
        this.loadTroubleshootingData(workbook.getWorksheet(config.troubleshootingSheetName));
    }

}