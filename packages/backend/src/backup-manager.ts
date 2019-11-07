import { BackupRestoreOptions } from "@ccss-support-manual/models";

import { StringUtils, Logger } from "@michaelgatesdev/common";

import { app } from "./app";

import { FileUtils } from "@michaelgatesdev/common-io";

export class BackupManager {

    public buildingsFileName = "buildings.json";
    public roomsFileName = "rooms.json";
    public troubleshootingFileName = "troubleshooting.json";

    public async backup(options: BackupRestoreOptions): Promise<void> {
        if (StringUtils.isBlank(options.name)) throw new Error("The backup name can not be blank!");
        const destDir = `${app.BACKUPS_DIR}/${options.name}`;
        Logger.info(`Performing backup (${app.BACKUPS_DIR}/${options.name})`);
        if (await FileUtils.createDirectory(destDir)) Logger.info("Created directory");

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            if (dataOptions.all) {
                if (await FileUtils.copy(app.DATA_DIR, `${destDir}/data`)) Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.buildingsFileName}`, `${destDir}/data/${this.buildingsFileName}`)) Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.roomsFileName}`, `${destDir}/data/${this.roomsFileName}`)) Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    if (await FileUtils.copy(`${app.DATA_DIR}/${this.troubleshootingFileName}`, `${destDir}/data/${this.troubleshootingFileName}`)) Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            if (imageOptions.all) {
                if (await FileUtils.copy(app.IMAGES_DIR, `${destDir}/images`)) Logger.info("Copied all images");
            }
            else {
                //TODO implement specific image type
            }
        }

        const settingsOptions = options.settings;
        if (settingsOptions !== undefined) {
            if (settingsOptions.all) {
                if (await FileUtils.copy(app.SETTINGS_DIR, `${destDir}/settings`)) Logger.info("Copied all settings");
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

    public async restore(options: BackupRestoreOptions) {
        const path = `${app.BACKUPS_DIR}/${options.name}`;
        if (StringUtils.isBlank(options.name)) throw new Error("The restore name can not be blank!");
        Logger.info(`Performing restore (${app.BACKUPS_DIR}/${options.name})`);

        const dataOptions = options.data;
        if (dataOptions !== undefined) {
            // await FileUtils.delete(app.DATA_DIR);
            // await FileUtils.createDirectory(app.DATA_DIR);
            if (dataOptions.all) {
                if (await FileUtils.copy(`${path}/data`, app.DATA_DIR)) Logger.info("Copied all data");
            }
            else {
                if (dataOptions.buildings) {
                    if (await FileUtils.copy(`${path}/data/${this.buildingsFileName}`, `${app.DATA_DIR}/${this.buildingsFileName}`)) Logger.info("Copied buildings data");
                }
                if (dataOptions.rooms) {
                    if (await FileUtils.copy(`${path}/data/${this.roomsFileName}`, `${app.DATA_DIR}/${this.roomsFileName}`)) Logger.info("Copied rooms data");
                }
                if (dataOptions.troubleshooting) {
                    if (await FileUtils.copy(`${path}/data/${this.troubleshootingFileName}`, `${app.DATA_DIR}/${this.troubleshootingFileName}`)) Logger.info("Copied troubleshooting data");
                }
            }
        }

        const imageOptions = options.images;
        if (imageOptions !== undefined) {
            // await FileUtils.delete(app.IMAGES_DIR);
            // await FileUtils.createDirectory(app.IMAGES_DIR);
            if (imageOptions.all) {
                if (await FileUtils.copy(`${path}/images`, app.IMAGES_DIR)) Logger.info("Copied all images");
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
                if (await FileUtils.copy(`${path}/settings`, app.SETTINGS_DIR)) Logger.info("Copied all settings");
            }
            else {
                //TODO implement specific image type
            }
        }

        Logger.info("Restore complete");
    }
}