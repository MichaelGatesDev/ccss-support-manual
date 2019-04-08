var fs = require('fs');
var webDownloader = require('./web-downloader');

const BASE_URL = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/{docID}/export?format={format}&gid={sheetID}";

async function downloadSpreadsheet(docID, format, destination) {

    return new Promise(async (resolve, reject) => {

        if (docID === '') return reject("Must specify docID");
        if (format === '') format = 'xlsx';
        if (destination === '') return reject("Must specify destination");

        console.log("Checking if the file already exists...");

        fs.exists(destination, function (exists) {

            if (exists) {
                return resolve(false);
            }

            var downloadURL = BASE_URL
                .replace('{docID}', docID)
                .replace('{format}', format);

            console.log("Downloading: " + downloadURL);
            webDownloader.download(downloadURL, destination)
                .then(function () {
                    return resolve(true);
                }).catch(function (err) {
                    return reject(err);
                });
        });
    });
}
exports.downloadSpreadsheet = downloadSpreadsheet;