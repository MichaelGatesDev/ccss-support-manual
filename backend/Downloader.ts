import fs from 'fs';
import https from 'https';
import { StringUtils } from './StringUtils';

class WebDownloader {
    private url: string;
    private destination: string;

    constructor(url: string, destination: string) {
        this.url = url;
        this.destination = destination;
    }

    public async download() {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let temporaryDestination = self.destination + ".download";
            let stream = fs.createWriteStream(temporaryDestination);

            let request = https.get(self.url, (response) => {
                let writeStream = response.pipe(stream);
                writeStream.on('finish', function () {
                    fs.rename(temporaryDestination, self.destination, function (err) {
                        if (err) {
                            fs.unlink(temporaryDestination, function (err) {
                                if (err) {
                                    console.error(`Failed to delete temporary file ${temporaryDestination}`);
                                }
                            });
                            return reject(new Error(`Failed to rename downloaded file ${temporaryDestination} => ${self.destination}`));
                        }
                        return resolve();
                    });
                });
            });
            request.on('error', function (err) {
                return reject(err);
            });
        });
    }
}

class GoogleDriveDownloader {

    private static BASE_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}";
    private static SHEET_URL: string = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}&gid={sheetID}";

    async downloadSpreadsheet(docID: string, format: string, destination: string) {
        let self = this;
        return new Promise(async (resolve, reject) => {

            if (StringUtils.isBlank(docID)) return reject("The docID of the spreadsheet must be specified");
            if (StringUtils.isBlank(format)) format = 'xlsx';
            if (StringUtils.isBlank(destination)) return reject("The destination oft he spreadsheet must be specified");

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
                }).catch(function (err) {
                    console.log("Download failed!");
                    return reject(err);
                });
            });
        });
    }
}




export {
    WebDownloader,
    GoogleDriveDownloader
}