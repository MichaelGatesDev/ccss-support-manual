import { Logger, EnumUtils, StringUtils } from '@michaelgatesdev/common';
import XLSX from "xlsx";
import {
    Building,
    Room,
    BuildingFactory,
    RoomFactory,
    RoomType,
    LockType,
    ClassroomFactory,
    PhoneFactory,
    DeviceFactory,
    SmartClassroomFactory,
    TeachingStationFactory,
    TeachingStationType,
    TeachingStationComputerFactory,
    ComputerFactory,
    OperatingSystem,
    ComputerType,
    RoomTypeUtils,
    AudioFactory,
    SpeakerType,
    VideoFactory,
    VideoOutputType,
    DVDPlayerType,
    DVDPlayerFactory,
    ComputerClassroomFactory,
    PrinterFactory,
    DeviceType,
    SpreadsheetType,
    SpreadsheetImportMode,
    ClassroomChecksSpreadsheetVersion,
    SimpleRoom,
    TroubleshootingData,
    TroubleshootingDataFactory,
    SimpleRoomFactory,
    TroubleshootingSpreadsheetVersion
} from '@ccss-support-manual/models';
import { FileUtils } from "@michaelgatesdev/common-io";
import { app } from "./app";
import _ from "lodash";


export interface SpreadsheetImportResult {
}

export interface ClassroomChecksSpreadsheetImportResult extends SpreadsheetImportResult {
    buildings: Building[];
    rooms: Room[];
}

export interface TroubleshootingSpreadsheetImportResult extends SpreadsheetImportResult {
    troubleshootingData: TroubleshootingData[];
}


export class SpreadsheetManager {

    private static VersionPattern = /((Summer|Winter)\s20[0-9]{2})/gi;

    public static async getSpreadsheetVersion(type: SpreadsheetType, path: string): Promise<ClassroomChecksSpreadsheetVersion | TroubleshootingSpreadsheetVersion | undefined> {
        if (!await FileUtils.checkExists(path)) throw new Error(`File not found: ${path}`);

        const dict = await this.convertSpreadsheetToJson(path);
        const infoTab = dict.find(obj => obj.sheetName === "INFO")?.json;;
        if (infoTab === undefined) throw new Error(`Failed to find 'info' tab!`);
        if (infoTab.length === 0) throw new Error(`No info data found!`);
        const row = infoTab[0];
        const version = row['Version'];
        if (version === undefined) throw new Error(`No version value found!`);

        return this.matchVersion(type, version);
    }


    public static matchVersion(type: SpreadsheetType, rawVersion: string): ClassroomChecksSpreadsheetVersion | TroubleshootingSpreadsheetVersion | undefined {
        const matches = rawVersion.match(this.VersionPattern);
        if (matches === null || matches.length !== 1) throw new Error("No version match found for spreadsheet");

        switch (type) {
            default:
                return undefined;
            case SpreadsheetType.ClassroomChecks:
                return EnumUtils.parse(ClassroomChecksSpreadsheetVersion, matches[0]);
            case SpreadsheetType.Troubleshooting:
                return EnumUtils.parse(TroubleshootingSpreadsheetVersion, matches[0]);
        }
    }

    public static matchClassroomChecksVersion(rawVersion: string): ClassroomChecksSpreadsheetVersion {
        const matches = rawVersion.match(this.VersionPattern);
        if (matches === null || matches.length !== 1) throw new Error("No version match found for spreadsheet");
        const version = EnumUtils.parse(ClassroomChecksSpreadsheetVersion, matches[0]);
        if (version === undefined) throw new Error(`No classroom checks spreadsheet version match found in ${rawVersion}`);
        return version;
    }

    public static matchTroubleshootingVersion(rawVersion: string): TroubleshootingSpreadsheetVersion {
        const matches = rawVersion.match(this.VersionPattern);
        if (matches === null || matches.length !== 1) throw new Error("No version match found for spreadsheet");
        const version = EnumUtils.parse(TroubleshootingSpreadsheetVersion, matches[0]);
        if (version === undefined) throw new Error(`No troubleshooting spreadsheet version match found in ${rawVersion}`);
        return version;
    }

    public static async convertSpreadsheetToJson(path: string): Promise<{ sheetName: string, json: any }[]> {
        Logger.debug("Converting spreadsheet to json...");

        Logger.debug("Ensuring file exists...");
        if (!await FileUtils.checkExists(path)) throw new Error();

        const result: { sheetName: string, json: any }[] = [];

        Logger.debug("Reading file...");
        const workbook = XLSX.readFile(path);
        Logger.debug("Finished reading file");
        const sheets = workbook.SheetNames;

        Logger.debug("Converting each sheet to json");
        for (const sheet of sheets) {
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            result.push({ sheetName: sheet, json: json });
        }
        Logger.debug("Finished converting sheets to json");

        return result;
    }

    public static async importSpreadsheet(path: string, type: SpreadsheetType, importMode: SpreadsheetImportMode): Promise<void> {
        if (!await FileUtils.checkExists(path)) throw new Error(`Can not import spreadsheet because the file does not exist: ${path}`);
        Logger.debug(`Importing ${SpreadsheetType[type]} spreadsheet as mode ${SpreadsheetImportMode[importMode]} from ${path}`);

        switch (+type) {
            default: return undefined;
            case SpreadsheetType.ClassroomChecks: {
                const result = await this.importClassroomChecks(path);

                Logger.debug(
                    "Import result:"
                    + `\nBuildings: ${result.buildings.length}`
                    + `\nRooms: ${result.rooms.length}`
                );

                switch (+importMode) {
                    default:
                        Logger.debug("Default import mode. This fires if an invalid import mode is specified.");
                        break;
                    case SpreadsheetImportMode.Append:
                        Logger.debug("Append data");
                        break;
                    case SpreadsheetImportMode.ClearAndWrite:
                        Logger.debug("Clearing all data");
                        app.buildingManager.clear();
                        app.roomManager.clear();
                        Logger.debug("Writing new data");
                        app.buildingManager.addBuildings(result.buildings);
                        app.roomManager.addRooms(result.rooms);
                        break;
                    case SpreadsheetImportMode.OverwriteAndAppend:
                        Logger.debug("Overwrite and Append data");
                        break;
                }

                break;
            }
            case SpreadsheetType.Troubleshooting: {
                const result = await this.importTroubleshooting(path);
                Logger.debug(
                    "Import result:"
                    + `\nTroubleshooting Data: ${result.troubleshootingData.length}`
                );

                switch (+importMode) {
                    default:
                        Logger.debug("Default import mode. This fires if an invalid import mode is specified.");
                        break;
                    case SpreadsheetImportMode.Append:
                        Logger.debug("Append data");
                        break;
                    case SpreadsheetImportMode.ClearAndWrite:
                        Logger.debug("Clearing all data");
                        app.troubleshootingDataManager.clear();
                        Logger.debug("Writing new data");
                        app.troubleshootingDataManager.addAll(result.troubleshootingData);
                        break;
                    case SpreadsheetImportMode.OverwriteAndAppend:
                        Logger.debug("Overwrite and Append data");
                        break;
                }
                break;
            }
        }
    }

    private static async importClassroomChecks(path: string): Promise<ClassroomChecksSpreadsheetImportResult> {

        const dict = await this.convertSpreadsheetToJson(path);

        const infoTab = dict.find(obj => obj.sheetName === "INFO")?.json;;
        if (infoTab === undefined) throw new Error(`Failed to find 'info' tab!`);
        if (infoTab.length === 0) throw new Error(`No info data found!`);
        const row = infoTab[0];
        const rawVersion = row['Version'];
        if (rawVersion === undefined) throw new Error(`No version value found!`);
        const version = this.matchVersion(SpreadsheetType.ClassroomChecks, rawVersion);

        const ss = new (<any>SpreadsheetVersions)[`ClassroomChecksSpreadsheet_${ClassroomChecksSpreadsheetVersion[version as ClassroomChecksSpreadsheetVersion]}`];
        if (ss === undefined) throw new Error("Could not import Classroom Checks spreadsheet (spreadsheet undefined)");

        // buildings
        const importedBuildings: Building[] = [];
        if (ss.buildingsSheetName !== undefined) {
            let buildingsSheet = dict.find(obj => obj.sheetName === ss.buildingsSheetName)?.json;
            for (const building of buildingsSheet) {
                let factory = new BuildingFactory();

                // official name
                if (ss.buildingsOfficialNameHeader !== undefined) {
                    if (ss.buildingsOfficialNameHeader in building) {
                        let officialName: string = building[ss.buildingsOfficialNameHeader];
                        if (StringUtils.isBlank(officialName)) continue; // invalid entry
                        factory = factory.withOfficialName(officialName);
                        factory = factory.withInternalName(StringUtils.internalize(officialName));
                    }
                }

                // nicknames
                if (ss.buildingsNicknamesHeader !== undefined) {
                    if (ss.buildingsNicknamesHeader in building) {
                        let rawNicknames: string = building[ss.buildingsNicknamesHeader];
                        let nicknames = rawNicknames.split(",");
                        factory = factory.withNicknames(nicknames);
                    }
                }

                // finally add the building to the results
                importedBuildings.push(factory.build());
            }
        }
        else {
            Logger.debug("No buildings sheet defined");
        }

        // rooms 
        const importedRooms: Room[] = [];
        if (ss.roomsSheetName !== undefined) {
            let roomsSheet = dict.find(obj => obj.sheetName === ss.roomsSheetName)?.json;
            for (const room of roomsSheet) {

                // =========== ROOM ==========
                let roomFactory = new RoomFactory();
                // building name
                if (ss.roomsBuildingNameHeader !== undefined && ss.roomsBuildingNameHeader in room) {
                    let roomBuildingName: string = room[ss.roomsBuildingNameHeader];
                    roomFactory = roomFactory.withBuildingName(roomBuildingName);
                }
                // room number
                if (ss.roomsNumberHeader !== undefined && ss.roomsNumberHeader in room) {
                    let roomNumber: string = room[ss.roomsNumberHeader];
                    if (StringUtils.isBlank(roomNumber)) continue; // invalid entry
                    roomFactory = roomFactory.withNumber(roomNumber);
                }
                // room name
                if (ss.roomsNameHeader !== undefined && ss.roomsNameHeader in room) {
                    let roomName: string = room[ss.roomsNameHeader];
                    roomFactory = roomFactory.withName(roomName);
                }
                // room type
                let roomType: RoomType | undefined;
                if (ss.roomsRoomTypeHeader !== undefined && ss.roomsRoomTypeHeader in room) {
                    let roomTypeRaw: string = room[ss.roomsRoomTypeHeader];
                    roomType = EnumUtils.parse(RoomType, roomTypeRaw);
                    if (roomType !== undefined) roomFactory = roomFactory.withType(roomType);
                }
                // lock type
                if (ss.roomsLockTypeHeader !== undefined && ss.roomsLockTypeHeader in room) {
                    let roomLockTypeRaw: string = room[ss.roomsLockTypeHeader];
                    let roomLockType = EnumUtils.parse(LockType, roomLockTypeRaw);
                    if (roomLockType !== undefined) roomFactory = roomFactory.withLockType(roomLockType);
                }
                // capacity
                if (ss.roomsCapacityHeader !== undefined && ss.roomsCapacityHeader in room) {
                    let roomCapacity: number = room[ss.roomsCapacityHeader];
                    roomFactory = roomFactory.withCapacity(roomCapacity);
                }
                let createdRoom = roomFactory.build();

                if (StringUtils.isBlank(createdRoom.buildingName)) continue; // invalid entry
                if (StringUtils.isBlank(`${createdRoom.number}`)) continue; // invalid entry

                // =========== CLASSROOM ==========
                let classroomFactory = new ClassroomFactory(createdRoom);
                // classroom - last checked
                if (ss.roomsLastCheckedHeader !== undefined && ss.roomsLastCheckedHeader in room) {
                    let roomLastChecked: string = room[ss.roomsLastCheckedHeader];
                    classroomFactory = classroomFactory.withLastChecked(roomLastChecked);
                }
                // classroom - phone
                if (ss.roomsPhoneExtensionHeader !== undefined && ss.roomsPhoneExtensionHeader in room) {
                    let roomsPhoneExtension: string = room[ss.roomsPhoneExtensionHeader];
                    // ---- DEVICE ---- \\
                    let phoneDeviceFactory = new DeviceFactory();
                    // type
                    phoneDeviceFactory = phoneDeviceFactory.ofType(DeviceType.Phone);
                    // make
                    if (ss.roomsPhoneMakeHeader !== undefined && ss.roomsPhoneMakeHeader in room) {
                        let make: string = room[ss.roomsPhoneMakeHeader];
                        phoneDeviceFactory = phoneDeviceFactory.withMake(make);
                    }
                    // model
                    if (ss.roomsPhoneModelHeader !== undefined && ss.roomsPhoneModelHeader in room) {
                        let model: string = room[ss.roomsPhoneModelHeader];
                        phoneDeviceFactory = phoneDeviceFactory.withModel(model);
                    }
                    // ---- PHONE ---- \\
                    let phoneFactory = new PhoneFactory(phoneDeviceFactory.build());
                    phoneFactory = phoneFactory.withExtension(roomsPhoneExtension);
                    if (ss.roomsPhoneHasDisplayHeader !== undefined && ss.roomsPhoneHasDisplayHeader in room) {
                        let roomPhoneHasDisplay: string = room[ss.roomsPhoneHasDisplayHeader];
                        phoneFactory = phoneFactory.hasDisplay(StringUtils.parseBoolean(roomPhoneHasDisplay));
                    }
                    if (ss.roomsPhoneHasSpeakerHeader !== undefined && ss.roomsPhoneHasSpeakerHeader in room) {
                        let roomPhoneHasSpeaker: string = room[ss.roomsPhoneHasSpeakerHeader];
                        phoneFactory = phoneFactory.hasSpeaker(StringUtils.parseBoolean(roomPhoneHasSpeaker));
                    }
                    classroomFactory = classroomFactory.withPhone(phoneFactory.build());
                }
                let createdClassroom = classroomFactory.build();

                // =========== SMART CLASSROOM ==========
                let smartClassroomFactory = new SmartClassroomFactory(createdClassroom);
                // smart classroom - teaching station
                let tsFactory = new TeachingStationFactory();
                if (ss.roomsTeachingStationTypeHeader !== undefined && ss.roomsTeachingStationTypeHeader in room) {
                    let tsType = EnumUtils.parse(TeachingStationType, room[ss.roomsTeachingStationTypeHeader]);
                    if (tsType !== undefined) tsFactory = tsFactory.ofType(tsType);
                }
                // smart classroom - teaching station computer
                let computerDeviceFactory = new DeviceFactory();
                if (ss.roomsTeachingStationComputerTypeHeader !== undefined && ss.roomsTeachingStationComputerTypeHeader in room) {
                    // ---- DEVICE ---- \\
                    // type
                    computerDeviceFactory = computerDeviceFactory.ofType(DeviceType.Computer);
                    // make
                    if (ss.roomsTeachingStationComputerMakeHeader !== undefined && ss.roomsTeachingStationComputerMakeHeader in room) {
                        let make: string = room[ss.roomsTeachingStationComputerMakeHeader];
                        computerDeviceFactory = computerDeviceFactory.withMake(make);
                    }
                    // model
                    if (ss.roomsTeachingStationComputerModelHeader !== undefined && ss.roomsTeachingStationComputerModelHeader in room) {
                        let model: string = room[ss.roomsTeachingStationComputerModelHeader];
                        computerDeviceFactory = computerDeviceFactory.withModel(model);
                    }
                    let createdComputerDevice = computerDeviceFactory.build();

                    // ---- COMPUTER ---- \\
                    let computerFactory = new ComputerFactory(createdComputerDevice);
                    // type
                    if (ss.roomsTeachingStationComputerTypeHeader !== undefined && ss.roomsTeachingStationComputerTypeHeader in room) {
                        let rawType: string = room[ss.roomsTeachingStationComputerTypeHeader];
                        let type = EnumUtils.parse(ComputerType, rawType);
                        if (type !== undefined) computerFactory = computerFactory.ofType(type);
                    }
                    // OS
                    if (ss.roomsTeachingStationComputerOperatingSystemHeader !== undefined && ss.roomsTeachingStationComputerOperatingSystemHeader in room) {
                        let rawOS: string = room[ss.roomsTeachingStationComputerOperatingSystemHeader];
                        let os = EnumUtils.parse(OperatingSystem, rawOS);
                        if (os !== undefined) computerFactory = computerFactory.withOperatingSystem(os);
                    }
                    let createdComputer = computerFactory.build();

                    // ---- TS COMPUTER ---- \\
                    let tsComputerFactory = new TeachingStationComputerFactory(createdComputer);
                    // hasWebcam
                    if (ss.roomsTeachingStationComputerHasWebcamHeader !== undefined && ss.roomsTeachingStationComputerHasWebcamHeader in room) {
                        let tsHasWebcam: string = room[ss.roomsTeachingStationComputerHasWebcamHeader];
                        tsComputerFactory = tsComputerFactory.hasWebcam(StringUtils.parseBoolean(tsHasWebcam));
                    }

                    tsFactory = tsFactory.withComputer(tsComputerFactory.build());
                }
                smartClassroomFactory = smartClassroomFactory.withTeachingStation(tsFactory.build());

                // smart classroom - audio
                let audioFactory = new AudioFactory();
                // audio system dependent
                if (ss.roomsAudioSystemDependentHeader !== undefined && ss.roomsAudioSystemDependentHeader in room) {
                    let dependent: boolean = room[ss.roomsAudioSystemDependentHeader];
                    audioFactory = audioFactory.isSystemDependent(dependent);
                }
                // audio speaker type
                if (ss.roomsAudioSpeakerTypeHeader !== undefined && ss.roomsAudioSpeakerTypeHeader in room) {
                    let rawType: string = room[ss.roomsAudioSpeakerTypeHeader];
                    let type = EnumUtils.parse(SpeakerType, rawType);
                    if (type !== undefined) audioFactory = audioFactory.withSpeakerType(type);
                }
                smartClassroomFactory = smartClassroomFactory.withAudio(audioFactory.build());

                // smart classroom - video
                let videoFactory = new VideoFactory();
                // video output type
                if (ss.roomsVideoOutputTypeHeader !== undefined && ss.roomsVideoOutputTypeHeader in room) {
                    let rawType: string = room[ss.roomsVideoOutputTypeHeader];
                    let type = EnumUtils.parse(VideoOutputType, rawType);
                    if (type !== undefined) videoFactory = videoFactory.withOutputType(type);
                }
                // dvd player type
                if (ss.roomsDVDPlayerTypeHeader !== undefined && ss.roomsDVDPlayerTypeHeader in room) {
                    let rawType: string = room[ss.roomsDVDPlayerTypeHeader];
                    let type = EnumUtils.parse(DVDPlayerType, rawType);
                    if (type !== undefined) {
                        // ---- DEVICE ---- \\
                        let dvdDeviceFactory = new DeviceFactory();
                        // type
                        dvdDeviceFactory = dvdDeviceFactory.ofType(DeviceType.DVDPlayer);
                        // make
                        if (ss.roomsDVDPlayerMakeHeader !== undefined && ss.roomsDVDPlayerMakeHeader in room) {
                            let make: string = room[ss.roomsDVDPlayerMakeHeader];
                            dvdDeviceFactory = dvdDeviceFactory.withMake(make);
                        }
                        // model
                        if (ss.roomsDVDPlayerModelHeader !== undefined && ss.roomsDVDPlayerModelHeader in room) {
                            let model: string = room[ss.roomsDVDPlayerModelHeader];
                            dvdDeviceFactory = dvdDeviceFactory.withModel(model);
                        }
                        // ---- DVD Player ---- \\
                        let dvdFactory = new DVDPlayerFactory(dvdDeviceFactory.build());
                        dvdFactory = dvdFactory.ofType(type);
                        videoFactory = videoFactory.withDVDPlayer(dvdFactory.build());
                    }
                }
                let createdSmartClassroom = smartClassroomFactory.build();

                // =========== COMPUTER CLASSROOM ==========
                let computerClassroomFactory = new ComputerClassroomFactory(createdSmartClassroom);
                // printer
                if (ss.roomsPrinterCartridgeTypeHeader !== undefined && ss.roomsPrinterCartridgeTypeHeader in room) {
                    // ---- DEVICE ---- \\
                    let printerDeviceFactory = new DeviceFactory();
                    // type
                    printerDeviceFactory = printerDeviceFactory.ofType(DeviceType.Printer);
                    // make
                    if (ss.roomsPrinterMakeHeader !== undefined && ss.roomsPrinterMakeHeader in room) {
                        let make: string = room[ss.roomsPrinterMakeHeader];
                        printerDeviceFactory = printerDeviceFactory.withMake(make);
                    }
                    // model
                    if (ss.roomsPrinterModelHeader !== undefined && ss.roomsPrinterModelHeader in room) {
                        let model: string = room[ss.roomsPrinterModelHeader];
                        printerDeviceFactory = printerDeviceFactory.withModel(model);
                    }
                    // ---- PRINTER ---- \\
                    let printerFactory = new PrinterFactory(printerDeviceFactory.build());
                    let cartridge: string = room[ss.roomsPrinterCartridgeTypeHeader];
                    printerFactory = printerFactory.withCartridgeType(cartridge);

                    // symquest #
                    if (ss.roomsPrinterSymquestNumberHeader !== undefined && ss.roomsPrinterSymquestNumberHeader in room) {
                        let number: string = room[ss.roomsPrinterSymquestNumberHeader];
                        printerFactory = printerFactory.withSymquestNumber(number);
                    }

                    computerClassroomFactory = computerClassroomFactory.withPrinter(printerFactory.build());
                }
                let createdComputerClassroom = computerClassroomFactory.build();


                // finally add the room to the results
                if (roomType !== undefined && RoomTypeUtils.isComputerClassroom(roomType)) {
                    importedRooms.push(createdComputerClassroom);
                }
                else if (roomType !== undefined && RoomTypeUtils.isSmartClassroom(roomType)) {
                    importedRooms.push(createdSmartClassroom);
                }
                else if (roomType !== undefined && RoomTypeUtils.isClassroom(roomType)) {
                    importedRooms.push(createdClassroom);
                }
                else {
                    importedRooms.push(createdRoom);
                }
            }
        }
        else {
            Logger.info("No rooms sheet defined");
        }


        if (ss.roomsListSheetName !== undefined) {
            let roomsSheet = dict.find(obj => obj.sheetName === ss.roomsListSheetName)?.json;
            if (ss.roomsListBuildingHeader !== undefined && ss.roomsListNumberHeader !== undefined) {
                for (const row of roomsSheet) {
                    let buildingName = row[ss.roomsListBuildingHeader];
                    const building = app.buildingManager.getBuildingByName(buildingName);
                    if (building === undefined) continue; // invalid building name
                    let roomNumber = row[ss.roomsListNumberHeader];
                    const room: SimpleRoom = {
                        buildingName: building.officialName,
                        number: roomNumber,
                    };

                    const found = _.find(importedRooms, (toCheck: Room) => {
                        const checkBuilding = app.buildingManager.getBuildingByName(toCheck.buildingName);
                        if (checkBuilding === undefined) return undefined;
                        return (
                            building.internalName === checkBuilding.internalName &&
                            room.number.toString().toLowerCase() === toCheck.number.toString().toLowerCase()
                        );
                    });

                    if (found === undefined) {
                        importedRooms.push(
                            new RoomFactory()
                                .withBuildingName(room.buildingName)
                                .withNumber(room.number)
                                .build()
                        );
                        Logger.debug(`Adding incomplete room: ${room.buildingName} ${room.number}`);
                    }
                }
            }
        }

        return {
            buildings: importedBuildings,
            rooms: importedRooms
        };
    }

    public static async importTroubleshooting(path: string): Promise<TroubleshootingSpreadsheetImportResult> {

        const dict = await this.convertSpreadsheetToJson(path);

        const infoTab = dict.find(obj => obj.sheetName === "INFO")?.json;;
        if (infoTab === undefined) throw new Error(`Failed to find 'info' tab!`);
        if (infoTab.length === 0) throw new Error(`No info data found!`);
        const row = infoTab[0];
        const rawVersion = row['Version'];
        if (rawVersion === undefined) throw new Error(`No version value found!`);
        const version = this.matchVersion(SpreadsheetType.Troubleshooting, rawVersion);

        const ss = new (<any>SpreadsheetVersions)[`TroubleshootingDataSpreadsheet_${TroubleshootingSpreadsheetVersion[version as TroubleshootingSpreadsheetVersion]}`];
        if (ss === undefined) throw new Error("Could not import Troubleshooting spreadsheet (spreadsheet undefined)");


        const importedTroubleshootingData: TroubleshootingData[] = [];
        if (ss.sheetName !== undefined) {
            let sheet = dict.find(obj => obj.sheetName === ss.sheetName)?.json;
            for (const entry of sheet.json) {
                let dataFactory = new TroubleshootingDataFactory();

                // title
                if (ss.titleHeader !== undefined && ss.titleHeader in entry) {
                    let title: string = entry[ss.titleHeader];
                    dataFactory = dataFactory.withTitle(title.toLowerCase().trim());
                }
                // description
                if (ss.descriptionHeader !== undefined && ss.descriptionHeader in entry) {
                    let description: string = entry[ss.descriptionHeader];
                    dataFactory = dataFactory.withDescription(description.toLowerCase().trim());
                }
                // solution
                if (ss.solutionHeader !== undefined && ss.solutionHeader in entry) {
                    let solution: string = entry[ss.solutionHeader];
                    dataFactory = dataFactory.withSolution(solution.toLowerCase().trim());
                }
                // types
                if (ss.typesHeader !== undefined && ss.typesHeader in entry) {
                    let types: string[] = entry[ss.typesHeader].split(",");
                    dataFactory = dataFactory.withTypes(types.map(type => type.trim().toLowerCase()));
                }
                // tags
                if (ss.tagsHeader !== undefined && ss.tagsHeader in entry) {
                    let tags: string[] = entry[ss.tagsHeader].split(",");
                    dataFactory = dataFactory.withTags(tags.map(type => type.trim().toLowerCase()));
                }
                // whitelisted rooms
                if (ss.whitelistedRoomsHeader !== undefined && ss.whitelistedRoomsHeader in entry) {
                    let rawRooms: string[] = entry[ss.whitelistedRoomsHeader].split(",");
                    let rooms: SimpleRoom[] = [];
                    for (const rawRoom of rawRooms) {
                        let split = rawRoom.split("|");
                        if (split.length < 2) continue;
                        let buildingName = split[0].trim().toLowerCase();
                        let roomNumber = split[1].trim().toLowerCase();
                        rooms.push(
                            new SimpleRoomFactory()
                                .withBuildingName(buildingName)
                                .withRoomNumber(roomNumber)
                                .build()
                        );
                    }
                    dataFactory = dataFactory.withWhitelistedRooms(rooms);
                }
                // blacklisted rooms
                if (ss.blacklistedRoomsHeader !== undefined && ss.blacklistedRoomsHeader in entry) {
                    let rawRooms: string[] = entry[ss.blacklistedRoomsHeader].split(",");
                    let rooms: SimpleRoom[] = [];
                    for (const rawRoom of rawRooms) {
                        let split = rawRoom.split("|");
                        if (split.length < 2) continue;
                        let buildingName = split[0];
                        let roomNumber = split[1];
                        rooms.push(
                            new SimpleRoomFactory()
                                .withBuildingName(buildingName)
                                .withRoomNumber(roomNumber)
                                .build()
                        );
                    }
                    dataFactory = dataFactory.withBlacklistedRooms(rooms);
                }

                importedTroubleshootingData.push(dataFactory.build());
            }
        }
        else {
            Logger.error("No troubleshooting sheet defined");
        }


        return {
            troubleshootingData: importedTroubleshootingData,
        }
    }
}


export namespace SpreadsheetVersions {

    export abstract class ClassroomChecksSpreadsheetBase {
        // =================================== \\
        //              BUILDINGS              \\
        // =================================== \\
        buildingsSheetName?: string;
        buildingsOfficialNameHeader?: string;
        buildingsNicknamesHeader?: string;

        // =================================== \\
        //              ROOMS LIST             \\
        // =================================== \\
        roomsListSheetName?: string;
        roomsListSheetHeaderRow?: number;
        roomsListBuildingHeader?: string;
        roomsListNumberHeader?: string;

        // =================================== \\
        //              ROOMS                  \\
        // =================================== \\
        roomsSheetName?: string;

        // room
        roomsBuildingNameHeader?: string;
        roomsNumberHeader?: string;
        roomsNameHeader?: string;
        roomsRoomTypeHeader?: string;
        roomsLockTypeHeader?: string;
        roomsCapacityHeader?: string;

        // classroom
        roomsLastCheckedHeader?: string;
        // classroom - phone
        roomsPhoneMakeHeader?: string;
        roomsPhoneModelHeader?: string;
        roomsPhoneExtensionHeader?: string;
        roomsPhoneHasDisplayHeader?: string;
        roomsPhoneHasSpeakerHeader?: string;

        // smart classroom - teaching station
        roomsTeachingStationTypeHeader?: string;
        roomsTeachingStationComputerMakeHeader?: string;
        roomsTeachingStationComputerModelHeader?: string;
        roomsTeachingStationComputerTypeHeader?: string;
        roomsTeachingStationComputerOperatingSystemHeader?: string;
        roomsTeachingStationComputerHasWebcamHeader?: string;
        // smart classroom - audio
        roomsAudioSystemDependentHeader?: string;
        roomsAudioSpeakerTypeHeader?: string;
        roomsAudioSpeakerMakeHeader?: string;
        roomsAudioSpeakerModelHeader?: string;
        // smart classroom - video
        roomsVideoOutputTypeHeader?: string;
        roomsDVDPlayerTypeHeader?: string;
        roomsDVDPlayerMakeHeader?: string;
        roomsDVDPlayerModelHeader?: string;

        // computer classroom
        roomsPrinterMakeHeader?: string;
        roomsPrinterModelHeader?: string;
        roomsPrinterSymquestNumberHeader?: string;
        roomsPrinterCartridgeTypeHeader?: string;
    }

    export class ClassroomChecksSpreadsheet_Summer2017 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.roomsSheetName = "Main";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Room #";

            this.roomsListSheetName = "Rooms";
            this.roomsListSheetHeaderRow = 1;
            this.roomsListBuildingHeader = "Building";
            this.roomsListNumberHeader = "Room #";
        }
    }


    export class ClassroomChecksSpreadsheet_Winter2017 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.roomsSheetName = "Main";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Room #";
            this.roomsCapacityHeader = "Capacity";
            this.roomsLockTypeHeader = "Lock Type";
            this.roomsPhoneExtensionHeader = "Phone Extension";

            this.roomsListSheetName = "Rooms";
            this.roomsListSheetHeaderRow = 1;
            this.roomsListBuildingHeader = "Building";
            this.roomsListNumberHeader = "Room #";
        }
    }

    export class ClassroomChecksSpreadsheet_Summer2018 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.roomsSheetName = "Main";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Room #";
            this.roomsCapacityHeader = "Capacity";
            this.roomsLockTypeHeader = "Lock Type";
            this.roomsPhoneExtensionHeader = "Phone Extension";

            this.roomsListSheetName = "Rooms";
            this.roomsListSheetHeaderRow = 1;
            this.roomsListBuildingHeader = "Building";
            this.roomsListNumberHeader = "Room #";
        }
    }

    export class ClassroomChecksSpreadsheet_Winter2018 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.buildingsSheetName = "Buildings";
            this.buildingsOfficialNameHeader = "Official Name";
            this.buildingsNicknamesHeader = "Other Names";

            this.roomsListSheetName = "Rooms";
            this.roomsListSheetHeaderRow = 1;
            this.roomsListBuildingHeader = "Building";
            this.roomsListNumberHeader = "Room #";

            this.roomsSheetName = "Main";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Room #";
            this.roomsCapacityHeader = "Capacity";
            this.roomsLockTypeHeader = "Lock Type";
            this.roomsPhoneExtensionHeader = "Phone Extension";
        }
    }

    export class ClassroomChecksSpreadsheet_Summer2019 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.buildingsSheetName = "Buildings";
            this.buildingsOfficialNameHeader = "Official Name";
            this.buildingsNicknamesHeader = "Nicknames";

            this.roomsListSheetName = "Rooms List";
            this.roomsListSheetHeaderRow = 1;
            this.roomsListBuildingHeader = "Building";
            this.roomsListNumberHeader = "Room #";

            this.roomsSheetName = "Rooms";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Number";
            this.roomsNameHeader = "Name";
            this.roomsRoomTypeHeader = "Type";
            this.roomsLockTypeHeader = "Lock Type";
            this.roomsCapacityHeader = "Capacity";
            this.roomsPhoneExtensionHeader = "Phone Extension";
            this.roomsTeachingStationTypeHeader = "Teaching Station Type";
            this.roomsTeachingStationComputerTypeHeader = "Teaching Station Computer Type";
            this.roomsTeachingStationComputerOperatingSystemHeader = "Teaching Station Computer Operating System";
            this.roomsVideoOutputTypeHeader = "Video Output Type";
            this.roomsDVDPlayerTypeHeader = "DVD Player Type";
            this.roomsAudioSystemDependentHeader = "Audio Requires System";
            this.roomsAudioSpeakerTypeHeader = "Audio Speakers Type";
            this.roomsPrinterSymquestNumberHeader = "Printer SymQuest Number";
            this.roomsPrinterCartridgeTypeHeader = "Printer Cartridge Type";
        }
    }

    export class ClassroomChecksSpreadsheet_Winter2019 extends ClassroomChecksSpreadsheetBase {
        public constructor() {
            super();
            this.buildingsSheetName = "Buildings";
            this.buildingsOfficialNameHeader = "Official Name";
            this.buildingsNicknamesHeader = "Nicknames";

            this.roomsSheetName = "Rooms";
            this.roomsBuildingNameHeader = "Building";
            this.roomsNumberHeader = "Number";
            this.roomsNameHeader = "Name";
            this.roomsRoomTypeHeader = "Type";
            this.roomsLockTypeHeader = "Lock Type";
            this.roomsCapacityHeader = "Capacity";

            this.roomsPhoneExtensionHeader = "Phone Extension";

            this.roomsTeachingStationTypeHeader = "Teaching Station Type";
            this.roomsTeachingStationComputerTypeHeader = "Teaching Station Computer Type";
            this.roomsTeachingStationComputerOperatingSystemHeader = "Teaching Station Computer Operating System";

            this.roomsVideoOutputTypeHeader = "Video Output Type";
            this.roomsDVDPlayerTypeHeader = "DVD Player Type";

            this.roomsAudioSystemDependentHeader = "Audio Requires System";
            this.roomsAudioSpeakerTypeHeader = "Audio Speakers Type";

            this.roomsPrinterSymquestNumberHeader = "Printer SymQuest Number";
            this.roomsPrinterCartridgeTypeHeader = "Printer Cartridge Type";
        }
    }

    export abstract class TroubleshootingDataSpreadsheetBase {
        sheetName?: string;
        titleHeader?: string;
        descriptionHeader?: string;
        solutionHeader?: string;
        typesHeader?: string;
        tagsHeader?: string;
        whitelistedRoomsHeader?: string;
        blacklistedRoomsHeader?: string;
    }

    export class TroubleshootingDataSpreadsheet_Summer2019 extends TroubleshootingDataSpreadsheetBase {
        public constructor() {
            super();
            this.sheetName = "Troubleshooting";
            this.titleHeader = "Incident";
            this.descriptionHeader = "Description";
            this.solutionHeader = "Solution";
            this.typesHeader = "Types";
            this.tagsHeader = "Tags";
            this.whitelistedRoomsHeader = "Whitelisted Rooms";
            this.blacklistedRoomsHeader = "Blacklisted Rooms";
        }
    }
}


