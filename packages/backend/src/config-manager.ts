import path from "path";
import { ConfigIOResult, ConfigurationUtilities } from "cardboard-config";
import { Logger } from '@michaelgatesdev/common';

import { app } from "./app";
import { AppConfig } from "./configs/AppConfig";
import { ImagesConfig } from "./configs/ImagesConfig";
import { TroubleshootingKeywords } from "./configs/TroubleshootingKeywords";

export class ConfigManager {

    public appConfig?: AppConfig;
    public imagesConfig?: ImagesConfig;
    public troubleshootingKeywordsConfig?: TroubleshootingKeywords;

    public constructor() {
    }

    public async initialize(): Promise<void> {

        // Create app config
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<AppConfig>(
                AppConfig,
                [
                    path.join(app.SETTINGS_DIR, "application-config.json"),
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

        // Create images config
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<ImagesConfig>(
                ImagesConfig,
                [
                    path.join(app.SETTINGS_DIR, "images-config.json"),
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

        // Create troubleshooting keywords
        try {
            const result: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<TroubleshootingKeywords>(
                TroubleshootingKeywords,
                [
                    path.join(app.SETTINGS_DIR, "troubleshooting-keywords-config.json"),
                ]
            );
            if (result.wasCreated) {
                Logger.info("Created troubleshooting keywords config!");
            }
            this.troubleshootingKeywordsConfig = result.loaded as TroubleshootingKeywords;
            Logger.info("Loaded troubleshooting keywords config");
        } catch (error) {
            throw error;
        }
    }
}