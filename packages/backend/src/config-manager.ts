import fs from "fs";

// ===================================================================================================================================================== //

interface Serializable<T> {
    deserialize(input: any): T;
}

interface ConfigResult {
    wasCreated: boolean;
    loaded: ConfigBase;
}

export class ConfigUtils {

    public static async createIfNotExists<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<boolean> {
        try {
            await fs.promises.access(path, fs.constants.W_OK);
            return false;
        } catch (error) {
            try {
                await new base(...baseArgs).save();
                return true;
            } catch (error) {
                throw error;
            }
        }
    }

    public static async load<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigBase> {
        try {
            await fs.promises.access(path, fs.constants.R_OK);
            const rawData = await fs.promises.readFile(path, {
                encoding: "utf8"
            });
            const data = JSON.parse(rawData);
            const deserialized: ConfigBase = new base(...baseArgs).deserialize(data);
            return deserialized;
        } catch (error) {
            throw error;
        }
    }

    public static async createIfNotExistsAndLoad<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigResult> {
        const wasCreated = await ConfigUtils.createIfNotExists(path, base, baseArgs);
        const loadedConfigBase = await ConfigUtils.load(path, base, baseArgs);
        return { wasCreated: wasCreated, loaded: loadedConfigBase };
    }
}

export abstract class ConfigBase implements Serializable<ConfigBase> {

    public configPath: string;

    public constructor(configPath: string) {
        this.configPath = configPath;
    }

    public deserialize(input: any): ConfigBase {
        Object.keys(input).forEach((key): void => {
            this[key as keyof this] = input[key as keyof any];
        });
        return this;
    }

    public async save(): Promise<void> {
        // writes the file asynchronously with 4-spaced tabbing
        await fs.promises.writeFile(this.configPath, JSON.stringify(this, null, 4), null);
    }
}

// ===================================================================================================================================================== //


export class AppConfig extends ConfigBase {
    public checkForProgramUpdates: boolean = true;
    public checkForDataUpdates: boolean = true;
}

export class ImagesConfig extends ConfigBase {
    public checkForImageUpdates: boolean = true;
    public imagesDirectory: string = "./public/images/";
}

export abstract class GoogleSpreadsheetConfig extends ConfigBase {
    public docID: string;
    public sheetPath: string;

    public constructor(configPath: string, docID: string, sheetPath: string) {
        super(configPath);
        this.docID = docID;
        this.sheetPath = sheetPath;
    }
}

export class PrimarySpreadsheetConfig extends GoogleSpreadsheetConfig {

    public buildingsSheetName: string = "Buildings";
    public buildingsSheetHeaderRow: number = 1;
    public buildingsOfficialNameHeader: string = "Official Name";
    public buildingsNicknamesHeader: string = "Nicknames";

    public roomsSheetName: string = "Rooms";
    public roomsSheetHeaderRow: number = 1;
    public roomsTimestampHeader: string = "Timestamp";
    public roomsBuildingHeader: string = "Building";
    public roomsNumberHeader: string = "Number";
    public roomsNameHeader: string = "Name";
    public roomsTypeHeader: string = "Type";
    public roomsLockTypeHeader: string = "Lock Type";
    public roomsCapacityHeader: string = "Capacity";
    public roomsFurnitureTypeHeader: string = "Furniture Type";
    public roomsChairCountHeader: string = "Chair Count";
    public roomsTableCountHeader: string = "Table Count";
    public roomsPhoneExtensionHeader: string = "Phone Extension";
    public roomsPhoneDisplayHeader: string = "Phone Display";
    public roomsPhoneSpeakerHeader: string = "Phone Speaker";
    public roomsAudioRequiresSystemHeader: string = "Audio Requires System";
    public roomsProjectorHeader: string = "Projector";
    public roomsAudioHeader: string = "Audio";
    public roomsScreenHeader: string = "Screen";
    public roomsTeachingStationComputerHeader: string = "TS Computer";
    public roomsTeachingStationComputerTypeHeader: string = "TS Computer Type";
    public roomsTeachingStationComputerOSHeader: string = "TS Computer Operating System";
    public roomsDocumentCameraHeader: string = "Doc Cam";
    public roomsDVDPlayerHeader: string = "DVD Player";
    public roomsDVDPlayerTypeHeader: string = "DVD Player Type";
    public roomsPrinterHeader: string = "Printer";
    public roomsPrinterSymquestNumberHeader: string = "Printer Symquest Number";
    public roomsPrinterCartridgeTypeHeader: string = "Printer Cartridge Type";
    public roomsNotesHeader: string = "Other Notes";

    public roomTypesSheetName: string = "Room Types";
    public lockTypesSheetName: string = "Lock Types";
    public furnitureTypesSheetName: string = "Furniture Types";
}


export class SecondarySpreadsheetConfig extends GoogleSpreadsheetConfig {
    public troubleshootingSheetName: string = "Troubleshooting";
    public troubleshootingSheetHeaderRow: number = 1;
    public troubleshootingTitleHeader: string = "Incident";
    public troubleshootingDescriptionHeader: string = "Description";
    public troubleshootingSolutionHeader: string = "Solution";
    public troubleshootingTypesHeader: string = "Types";
    public troubleshootingTagsHeader: string = "Tags";
    public troubleshootingWhitelistedRoomsHeader: string = "Whitelisted Rooms";
    public troubleshootingBlacklistedRoomsHeader: string = "Blacklisted Rooms";
}

export class ConfigManager {

    public appConfig?: AppConfig;
    public primarySpreadsheetConfig?: PrimarySpreadsheetConfig;
    public secondarySpreadsheetConfig?: SecondarySpreadsheetConfig;
    public imagesConfig?: ImagesConfig;

    public constructor() {
    }

    public async initialize(): Promise<void> {
        // Create app config
        try {
            const result: ConfigResult = await ConfigUtils.createIfNotExistsAndLoad<AppConfig>(
                "public/app-config.json",
                AppConfig,
                [
                    "public/app-config.json"
                ]
            );
            if (result.wasCreated) {
                console.log("Created app config!");
            }
            this.appConfig = result.loaded as AppConfig;
            console.log("Loaded app config");
        } catch (error) {
            throw error;
        }


        // Create primary config
        try {
            const result: ConfigResult = await ConfigUtils.createIfNotExistsAndLoad<PrimarySpreadsheetConfig>(
                "public/primary-config.json",
                PrimarySpreadsheetConfig,
                [
                    "public/primary-config.json",
                    "1k2T8gm4JGOtp3B_Ko-dZBMc0sV5Mv1FjQjNt5NLc9hE",
                    "public/primary.xlsx"
                ]
            );
            if (result.wasCreated) {
                console.log("Created primary spreadsheet config!");
            }
            this.primarySpreadsheetConfig = result.loaded as PrimarySpreadsheetConfig;
            console.log("Loaded primary spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create secondary config
        try {
            const result: ConfigResult = await ConfigUtils.createIfNotExistsAndLoad<SecondarySpreadsheetConfig>(
                "public/secondary-config.json",
                SecondarySpreadsheetConfig,
                [
                    "public/secondary-config.json",
                    "1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY",
                    "public/secondary.xlsx"
                ]
            );
            if (result.wasCreated) {
                console.log("Created secondary spreadsheet config!");
            }
            this.secondarySpreadsheetConfig = result.loaded as SecondarySpreadsheetConfig;
            console.log("Loaded secondary spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create images config
        try {
            const result: ConfigResult = await ConfigUtils.createIfNotExistsAndLoad<ImagesConfig>(
                "public/images-config.json",
                ImagesConfig,
                [
                    "public/images-config.json"
                ]
            );
            if (result.wasCreated) {
                console.log("Created images config!");
            }
            this.imagesConfig = result.loaded as ImagesConfig;
            console.log("Loaded images config");
        } catch (error) {
            throw error;
        }
    }
}