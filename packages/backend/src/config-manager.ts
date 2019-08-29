import { ConfigIOResult, ConfigurationUtilities } from 'cardboard-config';
import { Logger } from '@michaelgatesdev/common';

import { AppConfig } from "./configs/AppConfig";
import { ImagesConfig } from "./configs/ImagesConfig";
import { ClassroomChecksSpreadsheetConfig } from "./configs/ClassroomChecksSpreadsheetConfig";
import { TroubleshootingSpreadsheetConfig } from "./configs/TroubleshootingSpreadsheetConfig";
import { app } from "./app";

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
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<AppConfig>(
                AppConfig,
                [
                    `${app.SETTINGS_DIR}/application-config.json`
                ]
            );
            if (result.wasCreated) {
                Logger.info("Created application config!");
            }
            this.appConfig = result.loaded as AppConfig;
            Logger.info("Loaded application config");
        } catch (error) {
            throw error;
        }

        // Create classroom checks spreadsheet config
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<ClassroomChecksSpreadsheetConfig>(
                ClassroomChecksSpreadsheetConfig,
                [
                    `${app.SETTINGS_DIR}/classroom-checks-spreadsheet-config.json`,
                    "1k2T8gm4JGOtp3B_Ko-dZBMc0sV5Mv1FjQjNt5NLc9hE",
                    `${app.PUBLIC_DIR}/classroom-checks-spreadsheet.xlsx`
                ]
            );
            if (result.wasCreated) {
                Logger.info("Created classroom checks spreadsheet config!");
            }
            this.classroomChecksSpreadsheetConfig = result.loaded as ClassroomChecksSpreadsheetConfig;
            Logger.info("Loaded classroom checks spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create troubleshooting config
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<TroubleshootingSpreadsheetConfig>(
                TroubleshootingSpreadsheetConfig,
                [
                    `${app.SETTINGS_DIR}/troubleshooting-spreadsheet-config.json`,
                    "1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY",
                    `${app.PUBLIC_DIR}/troubleshooting-spreadsheet.xlsx`
                ]
            );
            if (result.wasCreated) {
                Logger.info("Created troubleshooting spreadsheet config!");
            }
            this.troubleshootingSpreadsheetConfig = result.loaded as TroubleshootingSpreadsheetConfig;
            Logger.info("Loaded troubleshooting spreadsheet config");
        } catch (error) {
            throw error;
        }

        // Create images config
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<ImagesConfig>(
                ImagesConfig,
                [
                    `${app.SETTINGS_DIR}/images-config.json`
                ]
            );
            if (result.wasCreated) {
                Logger.info("Created images config!");
            }
            this.imagesConfig = result.loaded as ImagesConfig;
            Logger.info("Loaded images config");
        } catch (error) {
            throw error;
        }
    }
}