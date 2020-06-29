import path from "path";
import { ConfigIOResult, ConfigurationUtilities } from "cardboard-config";

import { App, logger } from "./app";
import { AppConfig } from "./configs/AppConfig";
import { ImagesConfig } from "./configs/ImagesConfig";
import { TroubleshootingKeywords } from "./configs/TroubleshootingKeywords";

export class ConfigManager {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  public appConfig?: AppConfig;
  public imagesConfig?: ImagesConfig;
  public troubleshootingKeywordsConfig?: TroubleshootingKeywords;

  public async initialize(): Promise<void> {
    // Create app config
    const appConfigResult: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<AppConfig>(AppConfig, [path.join(this.app.SETTINGS_DIR, "application-config.json")]);
    if (appConfigResult.wasCreated) {
      logger.info("Created application config!");
    }
    this.appConfig = appConfigResult.loaded as AppConfig;
    logger.info("Loaded application config");

    // Create images config
    const imagesConfigResult: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<ImagesConfig>(ImagesConfig, [path.join(this.app.SETTINGS_DIR, "images-config.json")]);
    if (imagesConfigResult.wasCreated) {
      logger.info("Created images config!");
    }
    this.imagesConfig = imagesConfigResult.loaded as ImagesConfig;
    logger.info("Loaded images config");

    // Create troubleshooting keywords
    const troubleshootingConfigResult: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<TroubleshootingKeywords>(TroubleshootingKeywords, [
      path.join(this.app.SETTINGS_DIR, "troubleshooting-keywords-config.json"),
    ]);
    if (troubleshootingConfigResult.wasCreated) {
      logger.info("Created troubleshooting keywords config!");
    }
    this.troubleshootingKeywordsConfig = troubleshootingConfigResult.loaded as TroubleshootingKeywords;
    logger.info("Loaded troubleshooting keywords config");
  }
}
