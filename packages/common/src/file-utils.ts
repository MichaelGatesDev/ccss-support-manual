import fs from 'fs';

export class FileUtils {

    static async createDirectory(path: string, recursive?: boolean): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            fs.promises.access(path, fs.constants.R_OK)
                .then(function () {
                    return resolve(false);
                })
                .catch(function () {
                    fs.promises.mkdir(path, { recursive: recursive })
                        .then(function () {
                            return resolve(true);
                        })
                        .catch(function (_err: Error) {
                            return reject(new Error("There was an error creating the directory: " + path));
                        });
                });
        });
    }

    static async checkExists(path: string): Promise<boolean> {
        return new Promise(async (resolve, _reject) => {
            fs.promises.access(path, fs.constants.R_OK)
                .then(function () {
                    return resolve(true);
                })
                .catch(function () {
                    return resolve(false);
                });
        });
    }

}