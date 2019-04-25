"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ConfigBase = /** @class */ (function () {
    function ConfigBase(filePath) {
        this.filePath = filePath;
    }
    ConfigBase.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.promises.access(self.filePath, fs.constants.R_OK | fs.constants.W_OK).then(function () {
                            fs.promises.writeFile(self.filePath, JSON.stringify(self), {}).then(function () {
                                return resolve();
                            }).catch(function (err) {
                                return reject(err);
                            });
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    ConfigBase.load = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.promises.access(path, fs.constants.R_OK).then(function () {
                            fs.promises.readFile(path, {}).then(function (rawData) {
                                var data = rawData.toJSON();
                                return resolve(data);
                            }).catch(function (err) {
                                return reject(err);
                            });
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    return ConfigBase;
}());
exports.ConfigBase = ConfigBase;
var GoogleSpreadsheetConfig = /** @class */ (function (_super) {
    __extends(GoogleSpreadsheetConfig, _super);
    function GoogleSpreadsheetConfig(docID, path) {
        var _this = _super.call(this, path) || this;
        _this.docID = docID;
        return _this;
    }
    GoogleSpreadsheetConfig.prototype.getDocID = function () {
        return this.docID;
    };
    return GoogleSpreadsheetConfig;
}(ConfigBase));
exports.GoogleSpreadsheetConfig = GoogleSpreadsheetConfig;
var PrimarySpreadsheetConfig = /** @class */ (function (_super) {
    __extends(PrimarySpreadsheetConfig, _super);
    function PrimarySpreadsheetConfig(docID, path) {
        var _this = _super.call(this, docID, path) || this;
        _this.buildingsSheetName = 'Buildings';
        _this.buildingsSheetHeaderRow = 1;
        _this.buildingOfficialNameHeader = 'Official Name';
        _this.buildingNicknamesHeader = 'Nicknames';
        _this.roomsSheetName = 'Rooms';
        _this.roomsSheetHeaderRow = 1;
        _this.roomsTimestampHeader = 'Timestamp';
        _this.roomsBuildingHeader = 'Building';
        _this.roomsNumberHeader = 'Number';
        _this.roomsNameHeader = 'Name';
        _this.roomsTypeHeader = 'Type';
        _this.roomsLockTypeHeader = 'Lock Type';
        _this.roomsCapacityHeader = 'Capacity';
        _this.roomsFurnitureTypeHeader = 'Furniture Type';
        _this.roomsChairCountHeader = 'Chair Count';
        _this.roomsTableCountHeader = 'Table Count';
        _this.roomsPhoneExtensionHeader = 'Phone Extension';
        _this.roomsPhoneStatusHeader = 'Phone Status';
        _this.roomsAudioRequiresProjectorHeader = 'Audio Requires Projector';
        _this.roomsProjectorHeader = 'Projector';
        _this.roomsAudioHeader = 'Audio';
        _this.roomsScreenHeader = 'Screen';
        _this.roomsTeachingStationComputerHeader = 'TS Computer';
        _this.roomsTeachingStationComputerTypeHeader = 'TS Computer Type';
        _this.roomsTeachingStationComputerOSHeader = 'TS Computer Operating System';
        _this.roomsDocumentCameraHeader = 'Doc Cam';
        _this.roomsDVDPlayerHeader = 'DVD Player';
        _this.roomsDVDPlayerTypeHeader = 'DVD Player Type';
        _this.roomsPrinterHeader = 'Printer';
        _this.roomsPrinterSymquestNumberHeader = 'Printer Symquest Number';
        _this.roomsPrinterCartridgeTypeHeader = 'Printer Cartridge Type';
        _this.roomsNotesHeader = 'Other Notes';
        return _this;
    }
    return PrimarySpreadsheetConfig;
}(GoogleSpreadsheetConfig));
exports.PrimarySpreadsheetConfig = PrimarySpreadsheetConfig;
var SecondarySpreadsheetConfig = /** @class */ (function (_super) {
    __extends(SecondarySpreadsheetConfig, _super);
    function SecondarySpreadsheetConfig(docID, path) {
        return _super.call(this, docID, path) || this;
    }
    return SecondarySpreadsheetConfig;
}(GoogleSpreadsheetConfig));
exports.SecondarySpreadsheetConfig = SecondarySpreadsheetConfig;
