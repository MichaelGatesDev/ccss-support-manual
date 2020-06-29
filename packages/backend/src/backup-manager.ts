import path from "path";
import { FileUtils } from "@michaelgatesdev/common-io";
import { StringUtils } from "@michaelgatesdev/common";

import { BackupRestoreOptions } from "@ccss-support-manual/models";

import { App, logger } from "./app";

export class BackupManager {
  private readonly app: App;
  public buildingsFileName = "buildings.json";
  public roomsFileName = "rooms.json";
  public troubleshootingFileName = "troubleshooting.json";

  constructor(app: App) {
    this.app = app;
  }

  public async backup(options: BackupRestoreOptions): Promise<void> {
    if (StringUtils.isBlank(options.name)) throw new Error("The backup name can not be blank!");
    const destDir = path.join(this.app.BACKUPS_DIR, options.name);
    logger.info(`Performing backup (${destDir})`);
    await this.app.createDirectory(destDir);

    const dataOptions = options.data;
    if (dataOptions !== undefined) {
      if (dataOptions.all) {
        await this.app.copy(this.app.DATA_DIR, path.join(destDir, "data"));
        logger.info("Copied all data");
      } else {
        if (dataOptions.buildings) {
          await this.app.copy(path.join(this.app.DATA_DIR, this.buildingsFileName), path.join(destDir, "data", this.buildingsFileName));
          logger.info("Copied buildings data");
        }
        if (dataOptions.rooms) {
          await this.app.copy(path.join(this.app.DATA_DIR, this.roomsFileName), path.join(destDir, "data", this.roomsFileName));
          logger.info("Copied rooms data");
        }
        if (dataOptions.troubleshooting) {
          await this.app.copy(path.join(this.app.DATA_DIR, this.troubleshootingFileName), path.join(destDir, "data", this.troubleshootingFileName));
          logger.info("Copied troubleshooting data");
        }
      }
    }

    const imageOptions = options.images;
    if (imageOptions !== undefined) {
      if (imageOptions.all) {
        await this.app.copy(this.app.IMAGES_DIR, path.join(destDir, "images"));
        logger.info("Copied all images");
      } else {
        //TODO implement specific image type
      }
    }

    const settingsOptions = options.settings;
    if (settingsOptions !== undefined) {
      if (settingsOptions.all) {
        await this.app.copy(this.app.SETTINGS_DIR, path.join(destDir, "settings"));
        logger.info("Copied all settings");
      } else {
        //TODO implement specific image type
      }
    }

    logger.info("Backup complete");
  }

  public async getRestoreOptions(): Promise<string[]> {
    const backups = await FileUtils.list(this.app.BACKUPS_DIR);
    return backups.map((backup): string => {
      return backup.path.replace(`${this.app.BACKUPS_DIR}/`, "");
    });
  }

  public async restore(options: BackupRestoreOptions): Promise<void> {
    const dir = path.join(this.app.BACKUPS_DIR, options.name);
    if (StringUtils.isBlank(options.name)) throw new Error("The restore name can not be blank!");
    logger.info(`Performing restore (${this.app.BACKUPS_DIR}/${options.name})`);

    const dataOptions = options.data;
    if (dataOptions !== undefined) {
      // await FileUtils.delete(app.DATA_DIR);
      // await FileUtils.createDirectory(app.DATA_DIR);
      if (dataOptions.all) {
        this.app.copy(path.join(dir, "data"), this.app.DATA_DIR);
        logger.info("Copied all data");
      } else {
        if (dataOptions.buildings) {
          this.app.copy(path.join(dir, "data", this.buildingsFileName), path.join(this.app.DATA_DIR, this.buildingsFileName));
          logger.info("Copied buildings data");
        }
        if (dataOptions.rooms) {
          this.app.copy(path.join(dir, "data", this.roomsFileName), path.join(this.app.DATA_DIR, this.roomsFileName));
          logger.info("Copied rooms data");
        }
        if (dataOptions.troubleshooting) {
          this.app.copy(path.join(dir, "data", this.troubleshootingFileName), path.join(this.app.DATA_DIR, this.troubleshootingFileName));
          logger.info("Copied troubleshooting data");
        }
      }
    }

    const imageOptions = options.images;
    if (imageOptions !== undefined) {
      // await FileUtils.delete(app.IMAGES_DIR);
      // await FileUtils.createDirectory(app.IMAGES_DIR);
      if (imageOptions.all) {
        this.app.copy(path.join(dir, "images"), this.app.IMAGES_DIR);
        logger.info("Copied all images");
      } else {
        //TODO implement specific image type
      }
    }

    const settingsOptions = options.settings;
    if (settingsOptions !== undefined) {
      // await FileUtils.delete(app.SETTINGS_DIR);
      // await FileUtils.createDirectory(app.SETTINGS_DIR);
      if (settingsOptions.all) {
        this.app.copy(path.join(dir, "settings"), this.app.SETTINGS_DIR);
        logger.info("Copied all settings");
      } else {
        //TODO implement specific image type
      }
    }

    logger.info("Restore complete");
  }
}
