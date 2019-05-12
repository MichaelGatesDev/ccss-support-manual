import fs from 'fs';

interface Serializable<T> {
    deserialize(input: Object): T;
}

export class ConfigManager {

    private appConfig!: AppConfig;
    private primarySpreadsheetConfig!: PrimarySpreadsheetConfig;
    private secondarySpreadsheetConfig!: SecondarySpreadsheetConfig;
    private imagesConfig!: ImagesConfig;

    constructor() {
    }

    public async initialize() {
        return new Promise(async (resolve, reject) => {
            let self = this;

            // Create app config
            await ConfigManager.createIfNotExistsAndLoad<AppConfig>(
                'public/app-config.json',
                AppConfig,
                [
                    'public/app-config.json'
                ]
            )
                .then(function (resultObj: any) {
                    if (resultObj.created) {
                        console.log("Created app config!");
                    }
                    self.appConfig = resultObj.loaded;
                    console.log("Loaded app config");
                }).catch(function (err) {
                    return reject(err);
                });

            // Create primary config
            await ConfigManager.createIfNotExistsAndLoad<PrimarySpreadsheetConfig>(
                'public/primary-config.json',
                PrimarySpreadsheetConfig,
                [
                    'public/primary-config.json',
                    '1k2T8gm4JGOtp3B_Ko-dZBMc0sV5Mv1FjQjNt5NLc9hE',
                    'public/primary.xlsx'
                ]
            )
                .then(function (resultObj: any) {
                    if (resultObj.created) {
                        console.log("Created primary spreadsheet config!");
                    }
                    self.primarySpreadsheetConfig = resultObj.loaded as PrimarySpreadsheetConfig;
                    console.log("Loaded primary spreadsheet config");
                }).catch(function (err) {
                    return reject(err);
                });

            // Create secondary config
            await ConfigManager.createIfNotExistsAndLoad<SecondarySpreadsheetConfig>(
                'public/secondary-config.json',
                SecondarySpreadsheetConfig,
                [
                    'public/secondary-config.json',
                    '1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY',
                    'public/secondary.xlsx'
                ]
            )
                .then(function (resultObj: any) {
                    if (resultObj.created) {
                        console.log("Created secondary spreadsheet config!");
                    }
                    self.secondarySpreadsheetConfig = resultObj.loaded as SecondarySpreadsheetConfig;
                    console.log("Loaded secondary spreadsheet config");
                }).catch(function (err) {
                    return reject(err);
                });


            // Create images config
            await ConfigManager.createIfNotExistsAndLoad<ImagesConfig>(
                'public/images-config.json',
                ImagesConfig,
                [
                    'public/images-config.json'
                ]
            )
                .then(function (resultObj: any) {
                    if (resultObj.created) {
                        console.log("Created images config!");
                    }
                    self.imagesConfig = resultObj.loaded as ImagesConfig;
                    console.log("Loaded images config");
                }).catch(function (err) {
                    return reject(err);
                });

            return resolve();
        });
    }

    public static async createIfNotExists<T extends ConfigBase>(path: string, base: { new(...args: any[]): T; }, baseArgs: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.promises.access(path, fs.constants.W_OK)
                .then(function () {
                    return resolve(false);
                })
                .catch(function (_err) {
                    new base(...baseArgs).save()
                        .then(function () {
                            return resolve(true);
                        }).catch(function (err) {
                            return reject(err);
                        });
                });
        });
    }

    public static async load<T extends ConfigBase>(path: string, base: { new(...args: any[]): T; }, baseArgs: any[]): Promise<ConfigBase> {
        return new Promise((resolve, reject) => {
            fs.promises.access(path, fs.constants.R_OK)
                .then(function () {
                    fs.promises.readFile(path, {
                        encoding: 'utf8'
                    })
                        .then(function (rawData) {
                            let data = JSON.parse(rawData);
                            let deserialized: ConfigBase = new base(...baseArgs).deserialize(data);
                            return resolve(deserialized);
                        })
                        .catch(function (err: any) {
                            return reject(err);
                        });
                })
                .catch(function (err: any) {
                    return reject(err);
                });
        });
    }

    public static createIfNotExistsAndLoad<T extends ConfigBase>(path: string, base: { new(...args: any[]): T; }, baseArgs: any[]): Promise<{}> {
        return new Promise((resolve, reject) => {
            ConfigManager.createIfNotExists(path, base, baseArgs)
                .then(function (created: boolean) {
                    ConfigManager.load(path, base, baseArgs)
                        .then(function (loaded: ConfigBase) {
                            return resolve({ created: created, loaded: loaded });
                        })
                        .catch(function (err: any) {
                            return reject(err);
                        });
                })
                .catch(function (err: any) {
                    return reject(err);
                });
        });
    }

    public getAppConfig(): AppConfig {
        return this.appConfig;
    }

    public getPrimarySpreadsheetConfig(): PrimarySpreadsheetConfig {
        return this.primarySpreadsheetConfig;
    }

    public getSecondarySpreadsheetConfig(): SecondarySpreadsheetConfig {
        return this.secondarySpreadsheetConfig;
    }

    public getImagesConfig(): ImagesConfig {
        return this.imagesConfig;
    }
}

abstract class ConfigBase implements Serializable<ConfigBase> {

    private configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    public abstract deserialize(input: any): ConfigBase;

    public async save() {
        let self = this;
        return new Promise((resolve, reject) => {
            // writes the file asynchronously with 4-spaced tabbing
            fs.promises.writeFile(self.configPath, JSON.stringify(self, null, 4), null)
                .then(function () {
                    return resolve();
                }).catch(function (err) {
                    return reject(err);
                });
        });
    }

    public getConfigPath() {
        return this.configPath;
    }
}


export class AppConfig extends ConfigBase {
    public checkForProgramUpdates?: boolean = true;
    public checkForDataUpdates?: boolean = true;

    public deserialize(input: any): AppConfig {
        this.checkForProgramUpdates = input.checkForProgramUpdates;
        this.checkForDataUpdates = input.checkForDataUpdates;
        return this;
    }
}

export class ImagesConfig extends ConfigBase {
    public checkForImageUpdates?: boolean = true;
    public imagesDirectory?: string = 'public/images/';

    public deserialize(input: any): AppConfig {
        this.checkForImageUpdates = input.checkForImageUpdates;
        this.imagesDirectory = input.imagesDirectory;
        return this;
    }
}


export abstract class GoogleSpreadsheetConfig extends ConfigBase {
    private docID: string;
    private sheetPath: string;

    constructor(configPath: string, docID: string, sheetPath: string) {
        super(configPath);
        this.docID = docID;
        this.sheetPath = sheetPath;
    }

    public deserialize(input: any): GoogleSpreadsheetConfig {
        this.sheetPath = input.sheetPath;
        this.docID = input.docID;
        return this;
    }

    public getDocID() {
        return this.docID;
    }

    public getSheetPath() {
        return this.sheetPath;
    }
}


export class PrimarySpreadsheetConfig extends GoogleSpreadsheetConfig {

    public buildingsSheetName: string = 'Buildings';
    public buildingsSheetHeaderRow: number = 1;
    public buildingsOfficialNameHeader: string = 'Official Name';
    public buildingsNicknamesHeader: string = 'Nicknames';

    public roomsSheetName: string = 'Rooms';
    public roomsSheetHeaderRow: number = 1;
    public roomsTimestampHeader: string = 'Timestamp';
    public roomsBuildingHeader: string = 'Building';
    public roomsNumberHeader: string = 'Number';
    public roomsNameHeader: string = 'Name';
    public roomsTypeHeader: string = 'Type';
    public roomsLockTypeHeader: string = 'Lock Type';
    public roomsCapacityHeader: string = 'Capacity';
    public roomsFurnitureTypeHeader: string = 'Furniture Type';
    public roomsChairCountHeader: string = 'Chair Count';
    public roomsTableCountHeader: string = 'Table Count';
    public roomsPhoneExtensionHeader: string = 'Phone Extension';
    public roomsPhoneDisplayHeader: string = 'Phone Display';
    public roomsPhoneSpeakerHeader: string = 'Phone Speaker';
    public roomsAudioRequiresSystemHeader: string = 'Audio Requires System';
    public roomsProjectorHeader: string = 'Projector';
    public roomsAudioHeader: string = 'Audio';
    public roomsScreenHeader: string = 'Screen';
    public roomsTeachingStationComputerHeader: string = 'TS Computer';
    public roomsTeachingStationComputerTypeHeader: string = 'TS Computer Type';
    public roomsTeachingStationComputerOSHeader: string = 'TS Computer Operating System';
    public roomsDocumentCameraHeader: string = 'Doc Cam';
    public roomsDVDPlayerHeader: string = 'DVD Player';
    public roomsDVDPlayerTypeHeader: string = 'DVD Player Type';
    public roomsPrinterHeader: string = 'Printer';
    public roomsPrinterSymquestNumberHeader: string = 'Printer Symquest Number';
    public roomsPrinterCartridgeTypeHeader: string = 'Printer Cartridge Type';
    public roomsNotesHeader: string = 'Other Notes';

    public roomTypesSheetName: string = 'Room Types';
    public lockTypesSheetName: string = 'Lock Types';
    public furnitureTypesSheetName: string = 'Furniture Types';

    public deserialize(input: any): PrimarySpreadsheetConfig {
        super.deserialize(input).getDocID();

        this.buildingsSheetName = input.buildingsSheetName;
        this.buildingsSheetHeaderRow = input.buildingsSheetHeaderRow;
        this.buildingsOfficialNameHeader = input.buildingsOfficialNameHeader;
        this.buildingsNicknamesHeader = input.buildingsNicknamesHeader;

        this.roomsSheetName = input.roomsSheetName;
        this.roomsSheetHeaderRow = input.roomsSheetHeaderRow;
        this.roomsTimestampHeader = input.roomsTimestampHeader;
        this.roomsBuildingHeader = input.roomsBuildingHeader;
        this.roomsNumberHeader = input.roomsNumberHeader;
        this.roomsNameHeader = input.roomsNameHeader;
        this.roomsTypeHeader = input.roomsTypeHeader;
        this.roomsLockTypeHeader = input.roomsLockTypeHeader;
        this.roomsCapacityHeader = input.roomsCapacityHeader;
        this.roomsFurnitureTypeHeader = input.roomsFurnitureTypeHeader;
        this.roomsChairCountHeader = input.roomsChairCountHeader;
        this.roomsTableCountHeader = input.roomsTableCountHeader;
        this.roomsPhoneExtensionHeader = input.roomsPhoneExtensionHeader;
        this.roomsPhoneDisplayHeader = input.roomsPhoneDisplayHeader;
        this.roomsPhoneSpeakerHeader = input.roomsPhoneSpeakerHeader;
        this.roomsAudioRequiresSystemHeader = input.roomsAudioRequiresSystemHeader;
        this.roomsProjectorHeader = input.roomsProjectorHeader;
        this.roomsAudioHeader = input.roomsAudioHeader;
        this.roomsScreenHeader = input.roomsScreenHeader;
        this.roomsTeachingStationComputerHeader = input.roomsTeachingStationComputerHeader;
        this.roomsTeachingStationComputerTypeHeader = input.roomsTeachingStationComputerTypeHeader;
        this.roomsTeachingStationComputerOSHeader = input.roomsTeachingStationComputerOSHeader;
        this.roomsDocumentCameraHeader = input.roomsDocumentCameraHeader;
        this.roomsDVDPlayerHeader = input.roomsDVDPlayerHeader;
        this.roomsDVDPlayerTypeHeader = input.roomsDVDPlayerTypeHeader;
        this.roomsPrinterHeader = input.roomsPrinterHeader;
        this.roomsPrinterSymquestNumberHeader = input.roomsPrinterSymquestNumberHeader;
        this.roomsPrinterCartridgeTypeHeader = input.roomsPrinterCartridgeTypeHeader;
        this.roomsNotesHeader = input.roomsNotesHeader;

        this.roomTypesSheetName = input.roomTypesSheetName;
        this.lockTypesSheetName = input.lockTypesSheetName;
        this.furnitureTypesSheetName = input.furnitureTypesSheetName;

        return this;
    }

}


export class SecondarySpreadsheetConfig extends GoogleSpreadsheetConfig {

    public troubleshootingSheetName: string = 'Troubleshooting';
    public troubleshootingSheetHeaderRow: number = 1;
    public troubleshootingTitleHeader: string = 'Incident';
    public troubleshootingDescriptionHeader: string = 'Description';
    public troubleshootingSolutionHeader: string = 'Solution';
    public troubleshootingTypesHeader: string = 'Types';
    public troubleshootingTagsHeader: string = 'Tags';
    public troubleshootingWhitelistedRoomsHeader: string = 'Whitelisted Rooms';
    public troubleshootingBlacklistedRoomsHeader: string = 'Blacklisted Rooms';

    public deserialize(input: any): SecondarySpreadsheetConfig {
        super.deserialize(input);

        this.troubleshootingSheetName = input.troubleshootingSheetName;
        this.troubleshootingSheetHeaderRow = input.troubleshootingSheetHeaderRow;
        this.troubleshootingTitleHeader = input.troubleshootingTitleHeader;
        this.troubleshootingDescriptionHeader = input.troubleshootingDescriptionHeader;
        this.troubleshootingSolutionHeader = input.troubleshootingSolutionHeader;
        this.troubleshootingTypesHeader = input.troubleshootingTypesHeader;
        this.troubleshootingTagsHeader = input.troubleshootingTagsHeader;
        this.troubleshootingWhitelistedRoomsHeader = input.troubleshootingWhitelistedRoomsHeader;
        this.troubleshootingBlacklistedRoomsHeader = input.troubleshootingBlacklistedRoomsHeader;

        return this;
    }
}