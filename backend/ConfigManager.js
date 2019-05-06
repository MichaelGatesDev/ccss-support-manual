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
var ConfigManager = /** @class */ (function () {
    function ConfigManager() {
    }
    ConfigManager.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var self;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    self = this;
                                    // Create app config
                                    return [4 /*yield*/, ConfigManager.createIfNotExistsAndLoad('public/app-config.json', AppConfig, [
                                            'public/app-config.json'
                                        ])
                                            .then(function (resultObj) {
                                            if (resultObj.created) {
                                                console.log("Created app config!");
                                            }
                                            self.appConfig = resultObj.loaded;
                                            console.log("Loaded app config");
                                        }).catch(function (err) {
                                            return reject(err);
                                        })];
                                case 1:
                                    // Create app config
                                    _a.sent();
                                    // Create primary config
                                    return [4 /*yield*/, ConfigManager.createIfNotExistsAndLoad('public/primary-config.json', PrimarySpreadsheetConfig, [
                                            'public/primary-config.json',
                                            '1k2T8gm4JGOtp3B_Ko-dZBMc0sV5Mv1FjQjNt5NLc9hE',
                                            'public/primary.xlsx'
                                        ])
                                            .then(function (resultObj) {
                                            if (resultObj.created) {
                                                console.log("Created primary spreadsheet config!");
                                            }
                                            self.primarySpreadsheetConfig = resultObj.loaded;
                                            console.log("Loaded primary spreadsheet config");
                                        }).catch(function (err) {
                                            return reject(err);
                                        })];
                                case 2:
                                    // Create primary config
                                    _a.sent();
                                    // Create secondary config
                                    return [4 /*yield*/, ConfigManager.createIfNotExistsAndLoad('public/secondary-config.json', SecondarySpreadsheetConfig, [
                                            'public/secondary-config.json',
                                            '1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY',
                                            'public/secondary.xlsx'
                                        ])
                                            .then(function (resultObj) {
                                            if (resultObj.created) {
                                                console.log("Created secondary spreadsheet config!");
                                            }
                                            self.secondarySpreadsheetConfig = resultObj.loaded;
                                            console.log("Loaded secondary spreadsheet config");
                                        }).catch(function (err) {
                                            return reject(err);
                                        })];
                                case 3:
                                    // Create secondary config
                                    _a.sent();
                                    // Create images config
                                    return [4 /*yield*/, ConfigManager.createIfNotExistsAndLoad('public/images-config.json', ImagesConfig, [
                                            'public/images-config.json'
                                        ])
                                            .then(function (resultObj) {
                                            if (resultObj.created) {
                                                console.log("Created images config!");
                                            }
                                            self.imagesConfig = resultObj.loaded;
                                            console.log("Loaded images config");
                                        }).catch(function (err) {
                                            return reject(err);
                                        })];
                                case 4:
                                    // Create images config
                                    _a.sent();
                                    return [2 /*return*/, resolve()];
                            }
                        });
                    }); })];
            });
        });
    };
    ConfigManager.createIfNotExists = function (path, base, baseArgs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.promises.access(path, fs.constants.W_OK)
                            .then(function () {
                            return resolve(false);
                        })
                            .catch(function (_err) {
                            new (base.bind.apply(base, [void 0].concat(baseArgs)))().save()
                                .then(function () {
                                return resolve(true);
                            }).catch(function (err) {
                                return reject(err);
                            });
                        });
                    })];
            });
        });
    };
    ConfigManager.load = function (path, base, baseArgs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.promises.access(path, fs.constants.R_OK)
                            .then(function () {
                            fs.promises.readFile(path, {
                                encoding: 'utf8'
                            })
                                .then(function (rawData) {
                                var data = JSON.parse(rawData);
                                var deserialized = new (base.bind.apply(base, [void 0].concat(baseArgs)))().deserialize(data);
                                return resolve(deserialized);
                            })
                                .catch(function (err) {
                                return reject(err);
                            });
                        })
                            .catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    ConfigManager.createIfNotExistsAndLoad = function (path, base, baseArgs) {
        return new Promise(function (resolve, reject) {
            ConfigManager.createIfNotExists(path, base, baseArgs)
                .then(function (created) {
                ConfigManager.load(path, base, baseArgs)
                    .then(function (loaded) {
                    return resolve({ created: created, loaded: loaded });
                })
                    .catch(function (err) {
                    return reject(err);
                });
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    ConfigManager.prototype.getAppConfig = function () {
        return this.appConfig;
    };
    ConfigManager.prototype.getPrimarySpreadsheetConfig = function () {
        return this.primarySpreadsheetConfig;
    };
    ConfigManager.prototype.getSecondarySpreadsheetConfig = function () {
        return this.secondarySpreadsheetConfig;
    };
    ConfigManager.prototype.getImagesConfig = function () {
        return this.imagesConfig;
    };
    return ConfigManager;
}());
exports.ConfigManager = ConfigManager;
var ConfigBase = /** @class */ (function () {
    function ConfigBase(configPath) {
        this.configPath = configPath;
    }
    ConfigBase.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // writes the file asynchronously with 4-spaced tabbing
                        fs.promises.writeFile(self.configPath, JSON.stringify(self, null, 4), null)
                            .then(function () {
                            return resolve();
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    ConfigBase.prototype.getConfigPath = function () {
        return this.configPath;
    };
    return ConfigBase;
}());
var AppConfig = /** @class */ (function (_super) {
    __extends(AppConfig, _super);
    function AppConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkForProgramUpdates = true;
        _this.checkForDataUpdates = true;
        return _this;
    }
    AppConfig.prototype.deserialize = function (input) {
        this.checkForProgramUpdates = input.checkForProgramUpdates;
        this.checkForDataUpdates = input.checkForDataUpdates;
        return this;
    };
    return AppConfig;
}(ConfigBase));
exports.AppConfig = AppConfig;
var ImagesConfig = /** @class */ (function (_super) {
    __extends(ImagesConfig, _super);
    function ImagesConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkForImageUpdates = true;
        _this.imagesDirectory = 'public/images/';
        return _this;
    }
    ImagesConfig.prototype.deserialize = function (input) {
        this.checkForImageUpdates = input.checkForImageUpdates;
        this.imagesDirectory = input.imagesDirectory;
        return this;
    };
    return ImagesConfig;
}(ConfigBase));
exports.ImagesConfig = ImagesConfig;
var GoogleSpreadsheetConfig = /** @class */ (function (_super) {
    __extends(GoogleSpreadsheetConfig, _super);
    function GoogleSpreadsheetConfig(configPath, docID, sheetPath) {
        var _this = _super.call(this, configPath) || this;
        _this.docID = docID;
        _this.sheetPath = sheetPath;
        return _this;
    }
    GoogleSpreadsheetConfig.prototype.deserialize = function (input) {
        this.sheetPath = input.sheetPath;
        this.docID = input.docID;
        return this;
    };
    GoogleSpreadsheetConfig.prototype.getDocID = function () {
        return this.docID;
    };
    GoogleSpreadsheetConfig.prototype.getSheetPath = function () {
        return this.sheetPath;
    };
    return GoogleSpreadsheetConfig;
}(ConfigBase));
exports.GoogleSpreadsheetConfig = GoogleSpreadsheetConfig;
var PrimarySpreadsheetConfig = /** @class */ (function (_super) {
    __extends(PrimarySpreadsheetConfig, _super);
    function PrimarySpreadsheetConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buildingsSheetName = 'Buildings';
        _this.buildingsSheetHeaderRow = 1;
        _this.buildingsOfficialNameHeader = 'Official Name';
        _this.buildingsNicknamesHeader = 'Nicknames';
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
        _this.roomsPhoneDisplayHeader = 'Phone Display';
        _this.roomsPhoneSpeakerHeader = 'Phone Speaker';
        _this.roomsAudioRequiresSystemHeader = 'Audio Requires System';
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
        _this.roomTypesSheetName = 'Room Types';
        _this.lockTypesSheetName = 'Lock Types';
        _this.furnitureTypesSheetName = 'Furniture Types';
        return _this;
    }
    PrimarySpreadsheetConfig.prototype.deserialize = function (input) {
        _super.prototype.deserialize.call(this, input).getDocID();
        this.buildingsSheetName = input.buildingsSheetName;
        this.buildingsSheetHeaderRow = input.buildingsSheetHeaderRow;
        this.buildingsOfficialNameHeader = input.buildingsOfficialNameHeader;
        this.buildingsNicknamesHeader = input.buildingsNicknamesHeader;
        this.roomsSheetName = input.roomsSheetName;
        this.roomsSheetHeaderRow = input.roomsSheetHeaderRow;
        this.roomsTimestampHeader = input.roomsTimestampHeader;
        this.roomsBuildingHeader = input.roomsBuildingHeader;
        this.roomsNumberHeader = input.roomsNumberHeader;
        this.roomsNameHeader = input.roomsNameHeader;
        this.roomsTypeHeader = input.roomsTypeHeader;
        this.roomsLockTypeHeader = input.roomsLockTypeHeader;
        this.roomsCapacityHeader = input.roomsCapacityHeader;
        this.roomsFurnitureTypeHeader = input.roomsFurnitureTypeHeader;
        this.roomsChairCountHeader = input.roomsChairCountHeader;
        this.roomsTableCountHeader = input.roomsTableCountHeader;
        this.roomsPhoneExtensionHeader = input.roomsPhoneExtensionHeader;
        this.roomsPhoneDisplayHeader = input.roomsPhoneDisplayHeader;
        this.roomsPhoneSpeakerHeader = input.roomsPhoneSpeakerHeader;
        this.roomsAudioRequiresSystemHeader = input.roomsAudioRequiresSystemHeader;
        this.roomsProjectorHeader = input.roomsProjectorHeader;
        this.roomsAudioHeader = input.roomsAudioHeader;
        this.roomsScreenHeader = input.roomsScreenHeader;
        this.roomsTeachingStationComputerHeader = input.roomsTeachingStationComputerHeader;
        this.roomsTeachingStationComputerTypeHeader = input.roomsTeachingStationComputerTypeHeader;
        this.roomsTeachingStationComputerOSHeader = input.roomsTeachingStationComputerOSHeader;
        this.roomsDocumentCameraHeader = input.roomsDocumentCameraHeader;
        this.roomsDVDPlayerHeader = input.roomsDVDPlayerHeader;
        this.roomsDVDPlayerTypeHeader = input.roomsDVDPlayerTypeHeader;
        this.roomsPrinterHeader = input.roomsPrinterHeader;
        this.roomsPrinterSymquestNumberHeader = input.roomsPrinterSymquestNumberHeader;
        this.roomsPrinterCartridgeTypeHeader = input.roomsPrinterCartridgeTypeHeader;
        this.roomsNotesHeader = input.roomsNotesHeader;
        this.roomTypesSheetName = input.roomTypesSheetName;
        this.lockTypesSheetName = input.lockTypesSheetName;
        this.furnitureTypesSheetName = input.furnitureTypesSheetName;
        return this;
    };
    return PrimarySpreadsheetConfig;
}(GoogleSpreadsheetConfig));
exports.PrimarySpreadsheetConfig = PrimarySpreadsheetConfig;
var SecondarySpreadsheetConfig = /** @class */ (function (_super) {
    __extends(SecondarySpreadsheetConfig, _super);
    function SecondarySpreadsheetConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.troubleshootingSheetName = 'Troubleshooting';
        _this.troubleshootingSheetHeaderRow = 1;
        _this.troubleshootingTitleHeader = 'Incident';
        _this.troubleshootingDescriptionHeader = 'Description';
        _this.troubleshootingSolutionHeader = 'Solution';
        _this.troubleshootingTypesHeader = 'Types';
        _this.troubleshootingTagsHeader = 'Tags';
        _this.troubleshootingWhitelistedRoomsHeader = 'Whitelisted Rooms';
        _this.troubleshootingBlacklistedRoomsHeader = 'Blacklisted Rooms';
        return _this;
    }
    SecondarySpreadsheetConfig.prototype.deserialize = function (input) {
        _super.prototype.deserialize.call(this, input);
        this.troubleshootingSheetName = input.troubleshootingSheetName;
        this.troubleshootingSheetHeaderRow = input.troubleshootingSheetHeaderRow;
        this.troubleshootingTitleHeader = input.troubleshootingTitleHeader;
        this.troubleshootingDescriptionHeader = input.troubleshootingDescriptionHeader;
        this.troubleshootingSolutionHeader = input.troubleshootingSolutionHeader;
        this.troubleshootingTypesHeader = input.troubleshootingTypesHeader;
        this.troubleshootingTagsHeader = input.troubleshootingTagsHeader;
        this.troubleshootingWhitelistedRoomsHeader = input.troubleshootingWhitelistedRoomsHeader;
        this.troubleshootingBlacklistedRoomsHeader = input.troubleshootingBlacklistedRoomsHeader;
        return this;
    };
    return SecondarySpreadsheetConfig;
}(GoogleSpreadsheetConfig));
exports.SecondarySpreadsheetConfig = SecondarySpreadsheetConfig;