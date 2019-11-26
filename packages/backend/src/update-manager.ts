import fetch from "node-fetch";
import os from "os";

import { Logger } from "@michaelgatesdev/common";
import { WebDownloader, FileUtils } from "@michaelgatesdev/common-io";

import { app } from "./app";

interface ReleaseDownload {
    name: string;
    url: string;
}

interface Release {
    version: string;
    downloads: ReleaseDownload[];
}

enum VersionComparisonResult {
    Lower,
    Equal,
    Greater,
    Unknown,
}

export class UpdateManager {

    private versionPattern = /((\d+)\.(\d+)\.(\d+))/;

    public latestVersion: Release | undefined;


    public async initialize(): Promise<void> {
        const oldFiles = (await FileUtils.list(app.ROOT_DIR)).filter((file) => file.path.toLowerCase().includes(".old"));
        if (oldFiles.length > 0) {
            const names = oldFiles.map((file) => file.path);
            Logger.debug(`Found old application files, deleting:\n${names.join("\n")}\n`);
            await Promise.all(names.map((name) => FileUtils.delete(name)));
        }

        const updateFiles = (await FileUtils.list(app.ROOT_DIR)).filter((file) => file.path.toLowerCase().includes(".update"));
        if (updateFiles.length > 0) {
            const first = updateFiles[0];
            Logger.debug(`Found new application file: ${first.path}`);
            //TODO apply old downloaded file
        }
    }


    public async getLatestUpdate(): Promise<Release> {
        const config = app.configManager.appConfig;
        if (config === undefined) throw new Error("Application configuration not found!");
        const url = config.programReleaseURL;

        const json: any[] = await fetch(url).then((body) => body.json());
        if (json.length < 1) throw new Error("There are no releases!");

        const newest = json[0];
        const version = newest.tag_name; // i.e. v1.3.6

        const assets = newest.assets;

        const downloads: ReleaseDownload[] = [];
        for (const asset of assets) {
            const assetName: string = asset.name;
            const assetDownloadURL: string = asset.browser_download_url;
            downloads.push({
                name: assetName,
                url: assetDownloadURL,
            });
        }

        return {
            version,
            downloads,
        };
    }

    public async check(): Promise<boolean> {
        try {
            const latest = await this.getLatestUpdate();

            const masterPackageJSON = app.masterPackageJSON;
            if (masterPackageJSON === undefined) {
                throw new Error("Master package.json not found");
            }

            let currentVersion = masterPackageJSON.version;
            let latestVersion = latest.version;
            {
                const match = currentVersion.match(this.versionPattern);
                if (match && match.length >= 1) {
                    currentVersion = match[0];
                }
            }
            {
                const match = latestVersion.match(this.versionPattern);
                if (match && match.length >= 1) {
                    latestVersion = match[0];
                }
            }

            // same version
            if (this.versionCompare(currentVersion, latestVersion) === VersionComparisonResult.Equal) return false;
            // current version is higher than latest release version
            if (this.versionCompare(currentVersion, latestVersion) === VersionComparisonResult.Greater) return false;

            this.latestVersion = latest;
            return true;
        } catch (error) {
            Logger.error("There was an error fetching the latest update!");
            Logger.error(error);
            return false;
        }
    }

    public async forceDownloadLatest(): Promise<void> {
        await this.downloadAndApplyUpdate(await this.getLatestUpdate());
    }

    public async downloadAndApplyUpdate(release: Release | undefined = this.latestVersion): Promise<void> {

        await this.download(release);

        await this.apply();

        await this.afterUpdate();
    }

    private async download(release: Release | undefined = this.latestVersion): Promise<void> {
        if (release === undefined) {
            throw new Error("There is no release to download & apply");
        }

        let download: ReleaseDownload | undefined = undefined;
        switch (os.type().toLowerCase()) {
            case "linux":
                download = release.downloads.find((download) => download.name.includes("linux"));
                break;
            case "darwin":
                download = release.downloads.find((download) => download.name.includes("mac"));
                break;
            case "windows_nt":
                download = release.downloads.find((download) => download.name.includes("win"));
                break;
        }
        if (download === undefined) throw new Error("Download is undefined!");

        // download update file
        Logger.info(`Downloading ${download.name}...`);
        const updateFilePath = `${app.masterPackageJSON.name}.update`;
        await new WebDownloader(download.url, updateFilePath).download();
        Logger.info("Download complete!");
    }

    private async apply(): Promise<void> {

        if (this.latestVersion === undefined) {
            throw new Error("Latest version is undefined!");
        }

        let appName = app.masterPackageJSON.name;
        if (os.type().toLowerCase() === "windows_nt") {
            appName += ".exe";
        }

        // rename current process to append .old
        if (!await FileUtils.rename(appName, `${appName}.old`)) {
            throw new Error("There was an issue renaming the current process!");
        }
        Logger.debug(`Renamed file: ${appName} -> ${appName}.old`)

        // rename downloaded file to original process name
        if (!await FileUtils.rename(`${appName}.update`, `${appName}`)) {
            throw new Error("There was an issue renaming the update file!");
        }
        Logger.debug(`Renamed file: ${appName}.update -> ${appName}`)
    }

    public async afterUpdate() {
        return new Promise(() => {
            Logger.info("To complete the update, the application must exit. You will need to reopen it manually.")
            let remaining = 5;
            const timer = setInterval(() => {
                if (remaining <= 0) {
                    clearInterval(timer);
                    process.exit(0);
                    // return;
                }
                Logger.info(`Application will close in ${remaining} seconds`);
                remaining--;
            }, 1000);
        });
    }


    /**
     * Returns the version comparison for the left compared to the right
     */
    private versionCompare = (left: string, right: string) => {
        let a = left.split('.'),
            b = right.split('.'),
            i = 0,
            len = Math.max(a.length, b.length);

        for (; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return VersionComparisonResult.Greater;
            } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return VersionComparisonResult.Lower;
            }
        }

        return VersionComparisonResult.Equal;
    };
}