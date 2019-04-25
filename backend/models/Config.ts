import fs = require('fs');

class ConfigBase {

    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async save() {
        let self = this;
        return new Promise((resolve, reject) => {
            fs.promises.access(self.filePath, fs.constants.R_OK | fs.constants.W_OK).then(function () {
                fs.promises.writeFile(self.filePath, JSON.stringify(self), {}).then(function () {
                    return resolve();
                }).catch(function (err) {
                    return reject(err);
                })
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    public static async load(path: string) {
        return new Promise((resolve, reject) => {
            fs.promises.access(path, fs.constants.R_OK).then(function () {
                fs.promises.readFile(path, {}).then(function (rawData) {
                    let data = rawData.toJSON();
                    return resolve(data);
                }).catch(function (err) {
                    return reject(err);
                })
            }).catch(function (err) {
                return reject(err);
            });
        });
    }
}

class GoogleSpreadsheetConfig extends ConfigBase {
    private docID: string;

    constructor(docID: string, path: string) {
        super(path);
        this.docID = docID;
    }

    public getDocID() {
        return this.docID;
    }
}

class PrimarySpreadsheetConfig extends GoogleSpreadsheetConfig {

    constructor(docID: string, path: string) {
        super(docID, path);
    }

    public buildingsSheetName: string = 'Buildings';
    public buildingsSheetHeaderRow: number = 1;
    public buildingOfficialNameHeader: string = 'Official Name';
    public buildingNicknamesHeader: string = 'Nicknames';

    public roomsSheetName: string = 'Rooms';
    public roomsSheetHeaderRow: number = 1;
    public roomsTimestampHeader: string = 'Timestamp';
    public roomsBuildingHeader: string = 'Building';
    public roomsNumberHeader: string = 'Number';
    public roomsNameHeader: string = 'Name';
    public roomsTypeHeader: string = 'Type';
    public roomsLockTypeHeader: string = 'Lock Type';
    public roomsCapacityHeader: string = 'Capacity';
    public roomsFurnitureTypeHeader: string = 'Furniture Type';
    public roomsChairCountHeader: string = 'Chair Count';
    public roomsTableCountHeader: string = 'Table Count';
    public roomsPhoneExtensionHeader: string = 'Phone Extension';
    public roomsPhoneStatusHeader: string = 'Phone Status';
    public roomsAudioRequiresProjectorHeader: string = 'Audio Requires Projector';
    public roomsProjectorHeader: string = 'Projector';
    public roomsAudioHeader: string = 'Audio';
    public roomsScreenHeader: string = 'Screen';
    public roomsTeachingStationComputerHeader: string = 'TS Computer';
    public roomsTeachingStationComputerTypeHeader: string = 'TS Computer Type';
    public roomsTeachingStationComputerOSHeader: string = 'TS Computer Operating System';
    public roomsDocumentCameraHeader: string = 'Doc Cam';
    public roomsDVDPlayerHeader: string = 'DVD Player';
    public roomsDVDPlayerTypeHeader: string = 'DVD Player Type';
    public roomsPrinterHeader: string = 'Printer';
    public roomsPrinterSymquestNumberHeader: string = 'Printer Symquest Number';
    public roomsPrinterCartridgeTypeHeader: string = 'Printer Cartridge Type';
    public roomsNotesHeader: string = 'Other Notes';
}

class SecondarySpreadsheetConfig extends GoogleSpreadsheetConfig {

    constructor(docID: string, path: string) {
        super(docID, path);
    }

}



export {
    ConfigBase,
    GoogleSpreadsheetConfig,

    PrimarySpreadsheetConfig,
    SecondarySpreadsheetConfig,
}