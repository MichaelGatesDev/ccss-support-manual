import { app } from "./app";
import { Logger } from "@michaelgatesdev/common";

import fetch from "node-fetch";
import { WebDownloader } from "@michaelgatesdev/common-io";

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
        const version = newest.tag_name; // v1.3.6

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
        

        new WebDownloader(release.downloads.find(()=> return undefined)).download();
    }
}