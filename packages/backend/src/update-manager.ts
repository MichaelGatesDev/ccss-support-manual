import fetch from "node-fetch";
import os from "os";

import { Logger } from "@michaelgatesdev/common";
import { WebDownloader } from "@michaelgatesdev/common-io";

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

    public async check(): Promise<void> {
        const config = app.configManager.appConfig;
        if (config === undefined) throw new Error("Application configuration not found!");

        try {
            const latest = await this.getLatestUpdate();

            let currentVersion = config.currentVersion;
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

            Logger.info(`Current version: ${currentVersion}`);
            if (this.versionCompare(currentVersion, latestVersion) === VersionComparisonResult.Lower) {
                Logger.info(`New version found ! ${latestVersion}`);
                await this.updateTo(latest);
            } else {
                Logger.info(`Application is up-to-date!`);
            }
        } catch (error) {
            Logger.error("There was an error fetching the latest update!");
            Logger.error(error);
        }
    }

    public async afterUpdate() {
        return new Promise(() => {
            Logger.info("To complete the update, the application must exit. You will need to reopen it manually.")
            let remaining = 5;
            const timer = setInterval(() => {
                if (remaining <= 0) {
                    clearInterval(timer);
                    process.exit(0);
                    return;
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

    private async updateTo(release: Release): Promise<void> {
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
        if (download === undefined) throw new Error();
        Logger.info(`Downloading ${download.name}...`);
        await new WebDownloader(download.url, `${app.ROOT_DIR}/${download.name}`).download();
        Logger.info("Download complete!");

        await this.afterUpdate();
    }

    public async forceDownloadLatest(): Promise<void> {
        await this.updateTo(await this.getLatestUpdate());
    }
}