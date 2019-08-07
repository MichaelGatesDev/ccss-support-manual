import { ConfigBase, ConfigUtils } from "@ccss-support-manual/utilities";
import { AppConfig } from "./configs/AppConfig";
import { ImagesConfig } from "./configs/ImagesConfig";
import { ClassroomChecksSpreadsheetConfig } from "./configs/ClassroomChecksSpreadsheetConfig";
import { TroubleshootingSpreadsheetConfig } from "./configs/TroubleshootingSpreadsheetConfig";

interface ConfigIOResult {
    wasCreated: boolean;
    loaded: ConfigBase;
}

export class ConfigManager {

    public appConfig?: AppConfig;
    public imagesConfig?: ImagesConfig;

    public classroomChecksSpreadsheetConfig?: ClassroomChecksSpreadsheetConfig;
    public troubleshootingSpreadsheetConfig?: TroubleshootingSpreadsheetConfig;

    public constructor() {
    }

    public async initialize(): Promise<void> {

        // Create app config
        try {
            const result: ConfigIOResult = await ConfigUtils.createIfNotExistsAndLoad<AppConfig>(
                "public/application-config.json",
                AppConfig,
                [
                    "public/application-config.json"
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

        // Create classroom checks spreadsheet config
        try {
            const result: ConfigIOResult = await ConfigUtils.createIfNotExistsAndLoad<ClassroomChecksSpreadsheetConfig>(
                "public/classroom-checks-spreadsheet-config.json",
                ClassroomChecksSpreadsheetConfig,
                [
                    "public/classroom-checks-spreadsheet-config.json",
                    "1k2T8gm4JGOtp3B_Ko-dZBMc0sV5Mv1FjQjNt5NLc9hE",
                    "public/classroom-checks-spreadsheet.xlsx"
                ]
            );
            if (result.wasCreated) {
                console.log("Created primary spreadsheet config!");
            }
            this.classroomChecksSpreadsheetConfig = result.loaded as ClassroomChecksSpreadsheetConfig;
            console.log("Loaded primary spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create secondary config
        try {
            const result: ConfigIOResult = await ConfigUtils.createIfNotExistsAndLoad<TroubleshootingSpreadsheetConfig>(
                "public/secondary-config.json",
                TroubleshootingSpreadsheetConfig,
                [
                    "public/secondary-config.json",
                    "1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY",
                    "public/secondary.xlsx"
                ]
            );
            if (result.wasCreated) {
                console.log("Created secondary spreadsheet config!");
            }
            this.troubleshootingSpreadsheetConfig = result.loaded as TroubleshootingSpreadsheetConfig;
            console.log("Loaded secondary spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create images config
        try {
            const result: ConfigIOResult = await ConfigUtils.createIfNotExistsAndLoad<ImagesConfig>(
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