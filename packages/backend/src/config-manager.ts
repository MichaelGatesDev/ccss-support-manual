import path from "path";
import { ConfigIOResult, ConfigurationUtilities } from "cardboard-config";
import { Logger } from "@michaelgatesdev/common";

import { App } from "./app";
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
      Logger.info("Created application config!");
    }
    this.appConfig = appConfigResult.loaded as AppConfig;
    Logger.info("Loaded application config");

    // Create images config
    const imagesConfigResult: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<ImagesConfig>(ImagesConfig, [path.join(this.app.SETTINGS_DIR, "images-config.json")]);
    if (imagesConfigResult.wasCreated) {
      Logger.info("Created images config!");
    }
    this.imagesConfig = imagesConfigResult.loaded as ImagesConfig;
    Logger.info("Loaded images config");

    // Create troubleshooting keywords
    const troubleshootingConfigResult: ConfigIOResult = await ConfigurationUtilities.createIfNotExistsAndLoad<TroubleshootingKeywords>(TroubleshootingKeywords, [
      path.join(this.app.SETTINGS_DIR, "troubleshooting-keywords-config.json"),
    ]);
    if (troubleshootingConfigResult.wasCreated) {
      Logger.info("Created troubleshooting keywords config!");
    }
    this.troubleshootingKeywordsConfig = troubleshootingConfigResult.loaded as TroubleshootingKeywords;
    Logger.info("Loaded troubleshooting keywords config");
  }
}
