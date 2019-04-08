const fs = require('fs');
const https = require('https');

async function download(url, destination) {
    return new Promise((resolve, reject) => {
        var temporaryDestination = destination + ".download";
        var stream = fs.createWriteStream(temporaryDestination);

        var request = https.get(url, (response) => {
            var writeStream = response.pipe(stream);

            writeStream.on('finish', function () {
                fs.rename(temporaryDestination, destination, function () {
                    return resolve();
                });
            });
        });
        request.on('error', function (err) {
            return reject(err);
        });
    });
}
exports.download = download;