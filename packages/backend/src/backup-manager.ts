import path from "path";
import { FileUtils } from "@michaelgatesdev/common-io";
import { StringUtils, Logger } from "@michaelgatesdev/common";

import { BackupRestoreOptions } from "@ccss-support-manual/models";

import { app } from "./app";


export class BackupManager {

    public buildingsFileName = "buildings.json";
    public roomsFileName = "rooms.json";
    public troubleshootingFileName = "troubleshooting.json";

    public async backup(options: BackupRestoreOptions): Promise<void> {
        if (StringUtils.isBlank(options.name)) throw new Error("The backup name can not be blank!");
        const destDir = path.join(app.BACKUPS_DIR, options.name);
        Logger.info(`Performing backup (${destDir})`);
        await app.createDirectory(destDir);

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            if (dataOptions.all) {
                await app.copy(app.DATA_DIR, path.join(destDir, "data"));
                Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    await app.copy(path.join(app.DATA_DIR, this.buildingsFileName), path.join(destDir, "data", this.buildingsFileName));
                    Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    await app.copy(path.join(app.DATA_DIR, this.roomsFileName), path.join(destDir, "data", this.roomsFileName));
                    Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    await app.copy(path.join(app.DATA_DIR, this.troubleshootingFileName), path.join(destDir, "data", this.troubleshootingFileName));
                    Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            if (imageOptions.all) {
                await app.copy(app.IMAGES_DIR, path.join(destDir, "images"));
                Logger.info("Copied all images");
            }
            else {
                //TODO implement specific image type
            }
        }

        const settingsOptions = options.settings;
        if (settingsOptions !== undefined) {
            if (settingsOptions.all) {
                await app.copy(app.SETTINGS_DIR, path.join(destDir, "settings"));
                Logger.info("Copied all settings");
            }
            else {
                //TODO implement specific image type
            }
        }

        Logger.info("Backup complete");
    }

    public async getRestoreOptions(): Promise<string[]> {
        const backups = await FileUtils.list(app.BACKUPS_DIR);
        return backups.map((backup): string => {
            return backup.path.replace(`${app.BACKUPS_DIR}/`, "");
        });
    }

    public async restore(options: BackupRestoreOptions): Promise<void> {
        const dir = path.join(app.BACKUPS_DIR, options.name);
        if (StringUtils.isBlank(options.name)) throw new Error("The restore name can not be blank!");
        Logger.info(`Performing restore (${app.BACKUPS_DIR}/${options.name})`);

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            // await FileUtils.delete(app.DATA_DIR);
            // await FileUtils.createDirectory(app.DATA_DIR);
            if (dataOptions.all) {
                app.copy(path.join(dir, "data"), app.DATA_DIR);
                Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    app.copy(path.join(dir, "data", this.buildingsFileName), path.join(app.DATA_DIR, this.buildingsFileName));
                    Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    app.copy(path.join(dir, "data", this.roomsFileName), path.join(app.DATA_DIR, this.roomsFileName));
                    Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    app.copy(path.join(dir, "data", this.troubleshootingFileName), path.join(app.DATA_DIR, this.troubleshootingFileName));
                    Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            // await FileUtils.delete(app.IMAGES_DIR);
            // await FileUtils.createDirectory(app.IMAGES_DIR);
            if (imageOptions.all) {
                app.copy(path.join(dir, "images"), app.IMAGES_DIR);
                Logger.info("Copied all images");
            }
            else {
                //TODO implement specific image type
            }
        }

        const settingsOptions = options.settings;
        if (settingsOptions !== undefined) {
            // await FileUtils.delete(app.SETTINGS_DIR);
            // await FileUtils.createDirectory(app.SETTINGS_DIR);
            if (settingsOptions.all) {
                app.copy(path.join(dir, "settings"), app.SETTINGS_DIR);
                Logger.info("Copied all settings");
            }
            else {
                //TODO implement specific image type
            }
        }

        Logger.info("Restore complete");
    }
}
