import fs from "fs";
import https from "https";
import { StringUtils } from "./utils/string-utils";

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
        let result: boolean = false;

        const request = https.get(this.url, (response) => {
            let writeStream = response.pipe(stream);
            writeStream.on('finish', function () {
                fs.rename(temporaryDestination, self.destination, function (err) {
                    if (err) {
                        fs.unlink(temporaryDestination, function (err) {
                            if (err) {
                                console.error(`Failed to delete temporary file ${temporaryDestination}`);
                                return;
                            }
                            result = true;
                        });
                        console.error(`Failed to rename downloaded file ${temporaryDestination} => ${self.destination}`);
                    }
                });
            });
        });
        request.on('error', function (err) {
            console.error(err);
        });
        return result;
    }
}

export class GoogleDriveDownloader {

    private static BASE_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}";
    // private static SHEET_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}&gid={sheetID}";

    public static async downloadSpreadsheet(docID: string, format: string, destination: string): Promise<any> {
        if (StringUtils.isBlank(docID)) {
            console.error("The docID of the spreadsheet must be specified");
            return;
        }
        if (StringUtils.isBlank(format)) { format = 'xlsx' };
        if (StringUtils.isBlank(destination)) {
            console.error("The destination oft he spreadsheet must be specified");
            return;
        }

        console.log("Checking if the file already exists...");

        fs.exists(destination, function (exists) {

            if (exists) {
                return resolve(false);
            }

            var downloadURL = GoogleDriveDownloader.BASE_URL
                .replace('{docID}', docID)
                .replace('{format}', format);

            let downloader = new WebDownloader(
                downloadURL,
                destination
            );

            console.log("Beginning download...");
            downloader.download().then(function () {
                console.log("Download complete!");
                return resolve();
            }).catch(function (err) {
                console.log("Download failed!");
                return reject(err);
            });
        });
    }

}
