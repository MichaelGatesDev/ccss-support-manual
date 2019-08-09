import fs from "fs";
import https from "https";
import { StringUtils } from "./string-utils";
import { FileUtils } from "./file-utils";
import { Logger, LogLevel } from "../logger";

export class WebDownloader {
    private url: string;
    private destination: string;

    public constructor(url: string, destination: string) {
        this.url = url;
        this.destination = destination;
    }

    public async download(): Promise<boolean> {
        const self = this;
        const temporaryDestination = `${this.destination}.download`;
        const stream = fs.createWriteStream(temporaryDestination);
        let result = false;

        const request = https.get(this.url, (response): void => {
            let writeStream = response.pipe(stream);
            writeStream.on("finish", (): void => {
                fs.rename(temporaryDestination, self.destination, (err): void => {
                    if (err) {
                        fs.unlink(temporaryDestination, (err): void => {
                            if (err) {
                                Logger.log(LogLevel.Error, `Failed to delete temporary file ${temporaryDestination}`);
                                return;
                            }
                            result = true;
                        });
                        Logger.log(LogLevel.Error, `Failed to rename downloaded file ${temporaryDestination} => ${self.destination}`);
                    }
                });
            });
        });
        request.on("error", (err): void => {
            Logger.log(LogLevel.Error, (err).toString());
        });
        return result;
    }
}

export class GoogleDriveDownloader {

    private static BASE_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}";
    // private static SHEET_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}&gid={sheetID}";

    public static async downloadSpreadsheet(docID: string, format: string, destination: string): Promise<boolean> {
        if (StringUtils.isBlank(docID)) {
            Logger.log(LogLevel.Error, "The docID of the spreadsheet must be specified");
            return false;
        }
        if (StringUtils.isBlank(format)) { format = "xlsx"; };
        if (StringUtils.isBlank(destination)) {
            Logger.log(LogLevel.Error, "The destination oft he spreadsheet must be specified");
            return false;
        }

        if (await FileUtils.checkExists(destination)) return false;

        const downloadURL = GoogleDriveDownloader.BASE_URL
            .replace("{docID}", docID)
            .replace("{format}", format);

        let downloader = new WebDownloader(
            downloadURL,
            destination
        );

        console.log("Beginning download...");
        try {
            await downloader.download();
            console.log("Download complete!");
            return true;
        } catch (error) {
            Logger.log(LogLevel.Error, "An error occurred while downloading");
            Logger.log(LogLevel.Error, error);
            return false;
        }
    }

}
