"use strict";
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
var Excel = require("exceljs");
var fs = require("fs");
var BuildingManager_1 = require("./BuildingManager");
var RoomManager_1 = require("./RoomManager");
var Building_1 = require("./models/Building");
var Room_1 = require("./models/Room");
var StringUtils_1 = require("./StringUtils");
var ImageManager_1 = require("./ImageManager");
var DataHelper = /** @class */ (function () {
    function DataHelper() {
        // private troubleDataManager: TroubleDataManager;
        this.roomTypes = [];
        this.lockTypes = [];
        this.furnitureTypes = [];
        this.buildingManager = new BuildingManager_1.BuildingManager();
        this.roomManager = new RoomManager_1.RoomManager(this.buildingManager);
        this.imageManager = new ImageManager_1.ImageManager();
    }
    DataHelper.prototype.getBuildingManager = function () { return this.buildingManager; };
    DataHelper.prototype.getRoomManager = function () { return this.roomManager; };
    // public getImageManager(){ return this.imageManager; }
    DataHelper.prototype.generateColumns = function (sheet, headerRowIndex) {
        var row = sheet.getRow(headerRowIndex);
        if (row === null || !row.values || !row.values.length)
            return [];
        var headers = [];
        for (var i = 1; i < row.values.length; i++) {
            var cell = row.getCell(i);
            headers.push(cell.text);
        }
        var numCols = sheet.actualColumnCount;
        for (var i = 0; i < numCols; i++) {
            sheet.getColumn(i + 1).key = headers[i].toLocaleLowerCase();
            // console.debug(`Column ${i + 1} key is ${headers[i]}`);
        }
    };
    DataHelper.prototype.loadBuildings = function (sheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1)
                return; // skip headers row
            var officialName = row.getCell('official name').text;
            var nicknames = row.getCell('nicknames').text;
            var building = new Building_1.Building(officialName, nicknames.split(","));
            self.buildingManager.addBuilding(building);
        });
        console.debug("Loaded " + this.buildingManager.getBuildings().length + " buildings!");
    };
    DataHelper.prototype.loadSingleColumnValues = function (sheet) {
        var values = [];
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            var type = row.getCell(1).text;
            if (type && !StringUtils_1.StringUtils.isBlank(type) && !values.includes(type)) {
                values.push(type);
            }
        });
        return values;
    };
    DataHelper.prototype.loadRooms = function (sheet) {
        this.generateColumns(sheet, 1);
        var self = this;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber == 1)
                return; // skip headers row
            if (row.getCell(1) === undefined || row.getCell(1).text === '')
                return; // skip if row is empty. exceljs doesn't work well for some reason.
            var buildingName = row.getCell('building').text;
            var building = self.buildingManager.getBuildingByName(buildingName);
            if (!building) {
                console.debug("No such building exists: " + buildingName);
                return;
            }
            var number = row.getCell('number').text;
            if (StringUtils_1.StringUtils.isBlank(number) || !StringUtils_1.StringUtils.isValidRoomNumber(number)) {
                console.debug("Room number is blank or invalid: " + number);
                return;
            }
            var type = row.getCell('type').text;
            if (StringUtils_1.StringUtils.isBlank(number) || !self.roomTypes.includes(type)) {
                console.debug("Room type is blank or invalid: " + type);
                return;
            }
            var room = new Room_1.Room(building, number, type);
            room.setLastChecked(row.getCell('timestamp').text);
            room.setName(row.getCell('name').text);
            room.setLockType(row.getCell('lock type').text);
            room.setCapacity(parseInt(row.getCell('capacity').text));
            room.setPhone(row.getCell('phone extension').text, row.getCell('phone display').text, row.getCell('phone speaker').text);
            // room.setProjector(); 
            room.setAudio(new Room_1.Audio(StringUtils_1.StringUtils.parseBoolean(row.getCell('audio requires projector').text)));
            // room.setScreen();
            room.setTeachingStationComputer(new Room_1.Computer(row.getCell('ts computer type').text, row.getCell('ts computer operating system').text));
            // room.setDocumentCamera();
            // room.setDVDPlayer();
            // room.setPrinter();
            building.addRoom(room);
        });
        console.debug("Loaded " + this.roomManager.getRooms().length + " rooms!");
    };
    DataHelper.prototype.loadPrimarySpreadsheet = function (spreadsheet) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!fs.existsSync(spreadsheet.path)) {
                            return reject("File could not be found: " + spreadsheet.path);
                        }
                        var self = _this;
                        var workbook = new Excel.Workbook();
                        workbook.xlsx.readFile(spreadsheet.path).then(function () {
                            self.loadBuildings(workbook.getWorksheet('Buildings'));
                            var roomTypes = self.loadSingleColumnValues(workbook.getWorksheet('Room Types'));
                            self.roomTypes = roomTypes;
                            // console.debug(`Loaded ${roomTypes.length} room types!`);
                            var lockTypes = self.loadSingleColumnValues(workbook.getWorksheet('Lock Types'));
                            self.lockTypes = lockTypes;
                            // console.debug(`Loaded ${lockTypes.length} room types!`);
                            var furnitureTypes = self.loadSingleColumnValues(workbook.getWorksheet('Furniture Types'));
                            self.furnitureTypes = furnitureTypes;
                            // console.debug(`Loaded ${furnitureTypes.length} room types!`);
                            self.loadRooms(workbook.getWorksheet('Rooms'));
                            return resolve();
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    DataHelper.prototype.loadSecondarySpreadsheet = function (spreadsheet) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!fs.existsSync(spreadsheet.path)) {
                            return reject("File could not be found: " + spreadsheet.path);
                        }
                        var self = _this;
                        var workbook = new Excel.Workbook();
                        workbook.xlsx.readFile(spreadsheet.path).then(function () {
                            // self.loadRooms(workbook.getWorksheet('Rooms'));
                            return resolve();
                        }).catch(function (err) {
                            return reject(err);
                        });
                    })];
            });
        });
    };
    DataHelper.prototype.loadImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var rootDir = "public/images/buildings/";
                        fs.promises.access(rootDir, fs.constants.R_OK).then(function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _loop_1, buildingDir, _i, _a, building;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _loop_1 = function (building) {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            buildingDir = rootDir + building.getInternalName() + "/";
                                                            return [4 /*yield*/, fs.promises.access(buildingDir, fs.constants.R_OK).then(function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        var _loop_2, roomDir, _i, _a, room;
                                                                        return __generator(this, function (_b) {
                                                                            switch (_b.label) {
                                                                                case 0:
                                                                                    _loop_2 = function (room) {
                                                                                        return __generator(this, function (_a) {
                                                                                            switch (_a.label) {
                                                                                                case 0:
                                                                                                    roomDir = buildingDir + "rooms/" + room.getNumber().toLocaleLowerCase() + "/";
                                                                                                    return [4 /*yield*/, fs.promises.access(roomDir, fs.constants.R_OK).then(function () {
                                                                                                            return __awaiter(this, void 0, void 0, function () {
                                                                                                                var roomImages, panoramasDir, equipmentDir;
                                                                                                                return __generator(this, function (_a) {
                                                                                                                    switch (_a.label) {
                                                                                                                        case 0:
                                                                                                                            roomImages = new ImageManager_1.RoomImages(room.getID());
                                                                                                                            // console.log("ACCESSING ROOM DIR " + roomDir);
                                                                                                                            // root images
                                                                                                                            return [4 /*yield*/, fs.promises.readdir(roomDir).then(function (files) {
                                                                                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                                                                                        var _loop_3, _i, files_1, file;
                                                                                                                                        return __generator(this, function (_a) {
                                                                                                                                            switch (_a.label) {
                                                                                                                                                case 0:
                                                                                                                                                    _loop_3 = function (file) {
                                                                                                                                                        return __generator(this, function (_a) {
                                                                                                                                                            switch (_a.label) {
                                                                                                                                                                case 0: return [4 /*yield*/, fs.promises.stat(roomDir + file).then(function (stat) {
                                                                                                                                                                        if (stat.isFile) {
                                                                                                                                                                            var url = roomDir.replace("public/", "") + file;
                                                                                                                                                                            var image = new ImageManager_1.Image(url);
                                                                                                                                                                            roomImages.addMainImage(image);
                                                                                                                                                                        }
                                                                                                                                                                    })];
                                                                                                                                                                case 1:
                                                                                                                                                                    _a.sent();
                                                                                                                                                                    return [2 /*return*/];
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    };
                                                                                                                                                    _i = 0, files_1 = files;
                                                                                                                                                    _a.label = 1;
                                                                                                                                                case 1:
                                                                                                                                                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                                                                                                                                                    file = files_1[_i];
                                                                                                                                                    return [5 /*yield**/, _loop_3(file)];
                                                                                                                                                case 2:
                                                                                                                                                    _a.sent();
                                                                                                                                                    _a.label = 3;
                                                                                                                                                case 3:
                                                                                                                                                    _i++;
                                                                                                                                                    return [3 /*break*/, 1];
                                                                                                                                                case 4: return [2 /*return*/];
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                }).catch(function (err) {
                                                                                                                                    console.log("Error reading root images at " + roomDir);
                                                                                                                                })];
                                                                                                                        case 1:
                                                                                                                            // console.log("ACCESSING ROOM DIR " + roomDir);
                                                                                                                            // root images
                                                                                                                            _a.sent();
                                                                                                                            panoramasDir = roomDir + "panoramas/";
                                                                                                                            return [4 /*yield*/, fs.promises.access(panoramasDir, fs.constants.R_OK).then(function () {
                                                                                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                                                                                        return __generator(this, function (_a) {
                                                                                                                                            switch (_a.label) {
                                                                                                                                                case 0: return [4 /*yield*/, fs.promises.readdir(panoramasDir).then(function (files) {
                                                                                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                                                                                            var _loop_4, _i, files_2, file;
                                                                                                                                                            return __generator(this, function (_a) {
                                                                                                                                                                switch (_a.label) {
                                                                                                                                                                    case 0:
                                                                                                                                                                        _loop_4 = function (file) {
                                                                                                                                                                            return __generator(this, function (_a) {
                                                                                                                                                                                switch (_a.label) {
                                                                                                                                                                                    case 0: return [4 /*yield*/, fs.promises.stat(panoramasDir + file).then(function (stat) {
                                                                                                                                                                                            if (stat.isFile) {
                                                                                                                                                                                                var url = panoramasDir.replace("public/", "") + file;
                                                                                                                                                                                                var image = new ImageManager_1.Image(url);
                                                                                                                                                                                                roomImages.addPanoramicImage(image);
                                                                                                                                                                                            }
                                                                                                                                                                                        })];
                                                                                                                                                                                    case 1:
                                                                                                                                                                                        _a.sent();
                                                                                                                                                                                        return [2 /*return*/];
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        };
                                                                                                                                                                        _i = 0, files_2 = files;
                                                                                                                                                                        _a.label = 1;
                                                                                                                                                                    case 1:
                                                                                                                                                                        if (!(_i < files_2.length)) return [3 /*break*/, 4];
                                                                                                                                                                        file = files_2[_i];
                                                                                                                                                                        return [5 /*yield**/, _loop_4(file)];
                                                                                                                                                                    case 2:
                                                                                                                                                                        _a.sent();
                                                                                                                                                                        _a.label = 3;
                                                                                                                                                                    case 3:
                                                                                                                                                                        _i++;
                                                                                                                                                                        return [3 /*break*/, 1];
                                                                                                                                                                    case 4: return [2 /*return*/];
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        });
                                                                                                                                                    }).catch(function (err) {
                                                                                                                                                        console.log("Error reading panoramic images at " + panoramasDir);
                                                                                                                                                    })];
                                                                                                                                                case 1:
                                                                                                                                                    _a.sent();
                                                                                                                                                    return [2 /*return*/];
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                }).catch(function () {
                                                                                                                                    console.log("Error accessing panoramic directory at " + panoramasDir);
                                                                                                                                })];
                                                                                                                        case 2:
                                                                                                                            _a.sent();
                                                                                                                            equipmentDir = roomDir + "equipment/";
                                                                                                                            return [4 /*yield*/, fs.promises.access(equipmentDir, fs.constants.R_OK).then(function () {
                                                                                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                                                                                        return __generator(this, function (_a) {
                                                                                                                                            switch (_a.label) {
                                                                                                                                                case 0: return [4 /*yield*/, fs.promises.readdir(equipmentDir).then(function (files) {
                                                                                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                                                                                            var _loop_5, _i, files_3, file;
                                                                                                                                                            return __generator(this, function (_a) {
                                                                                                                                                                switch (_a.label) {
                                                                                                                                                                    case 0:
                                                                                                                                                                        _loop_5 = function (file) {
                                                                                                                                                                            return __generator(this, function (_a) {
                                                                                                                                                                                switch (_a.label) {
                                                                                                                                                                                    case 0: return [4 /*yield*/, fs.promises.stat(equipmentDir + file).then(function (stat) {
                                                                                                                                                                                            if (stat.isFile) {
                                                                                                                                                                                                var url = equipmentDir.replace("public/", "") + file;
                                                                                                                                                                                                var image = new ImageManager_1.Image(url);
                                                                                                                                                                                                roomImages.addEquipmentImage(image);
                                                                                                                                                                                            }
                                                                                                                                                                                        })];
                                                                                                                                                                                    case 1:
                                                                                                                                                                                        _a.sent();
                                                                                                                                                                                        return [2 /*return*/];
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        };
                                                                                                                                                                        _i = 0, files_3 = files;
                                                                                                                                                                        _a.label = 1;
                                                                                                                                                                    case 1:
                                                                                                                                                                        if (!(_i < files_3.length)) return [3 /*break*/, 4];
                                                                                                                                                                        file = files_3[_i];
                                                                                                                                                                        return [5 /*yield**/, _loop_5(file)];
                                                                                                                                                                    case 2:
                                                                                                                                                                        _a.sent();
                                                                                                                                                                        _a.label = 3;
                                                                                                                                                                    case 3:
                                                                                                                                                                        _i++;
                                                                                                                                                                        return [3 /*break*/, 1];
                                                                                                                                                                    case 4: return [2 /*return*/];
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        });
                                                                                                                                                    }).catch(function (err) {
                                                                                                                                                        console.log("Error reading panoramic images at " + equipmentDir);
                                                                                                                                                    })];
                                                                                                                                                case 1:
                                                                                                                                                    _a.sent();
                                                                                                                                                    return [2 /*return*/];
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                }).catch(function () {
                                                                                                                                    console.log("Error accessing equipment directory at " + equipmentDir);
                                                                                                                                })];
                                                                                                                        case 3:
                                                                                                                            _a.sent();
                                                                                                                            self.imageManager.setRoomImages(room.getID(), roomImages);
                                                                                                                            console.debug("Loaded " + roomImages.size() + " images for " + room.getDisplayName());
                                                                                                                            return [2 /*return*/];
                                                                                                                    }
                                                                                                                });
                                                                                                            });
                                                                                                        }).catch(function (err) {
                                                                                                            return __awaiter(this, void 0, void 0, function () {
                                                                                                                return __generator(this, function (_a) {
                                                                                                                    console.error("Unable to access room dir " + roomDir);
                                                                                                                    return [2 /*return*/];
                                                                                                                });
                                                                                                            });
                                                                                                        })];
                                                                                                case 1:
                                                                                                    _a.sent();
                                                                                                    return [2 /*return*/];
                                                                                            }
                                                                                        });
                                                                                    };
                                                                                    _i = 0, _a = building.getRooms();
                                                                                    _b.label = 1;
                                                                                case 1:
                                                                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                                                    room = _a[_i];
                                                                                    return [5 /*yield**/, _loop_2(room)];
                                                                                case 2:
                                                                                    _b.sent();
                                                                                    _b.label = 3;
                                                                                case 3:
                                                                                    _i++;
                                                                                    return [3 /*break*/, 1];
                                                                                case 4: return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    });
                                                                }).catch(function (err) {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            console.error(err);
                                                                            return [2 /*return*/];
                                                                        });
                                                                    });
                                                                })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _a = self.buildingManager.getBuildings();
                                            _b.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            building = _a[_i];
                                            return [5 /*yield**/, _loop_1(building)];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/, resolve()];
                                    }
                                });
                            });
                        }).catch(function (err) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    console.error(err);
                                    return [2 /*return*/];
                                });
                            });
                        });
                    })];
            });
        });
    };
    return DataHelper;
}());
var dataHelper = new DataHelper();
module.exports = dataHelper;
/*
async function loadSecondarySpreadsheet(file) {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(file)) {
            return reject("File could not be found: " + file);
        }

        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(file).then(function () {

            let results = [];

            // rooms
            var roomsWS = workbook.getWorksheet("QA");
            roomsWS.eachRow({
                includeEmpty: false
            }, function (row, rowNumber) {

                // skip  the first row (headers)
                if (rowNumber == 1) return;

                // building name first
                var title = row.getCell(1).text.toLowerCase();

                // can't do anything with invalid rows
                if (isBlank(title)) return;

                var troubleshootingDataObj = {
                    title: title,
                    description: row.getCell(2).text.toLowerCase().trim(),
                    solution: row.getCell(3).text.toLowerCase().trim(),
                    types: parseListFromString(row.getCell(4).text),
                    tags: parseListFromString(row.getCell(5).text),
                    whitelistedLocations: parseRooms(row.getCell(6).text.trim().toLowerCase()),
                    blacklistedLocations: parseRooms(row.getCell(7).text.trim().toLowerCase()),
                };

                results.push(troubleshootingDataObj);
            });

            console.debug("There are " + results.length + " troubleshooting data segments");

            troubledata = results;

            return resolve();
        }).catch(function (err) {
            return reject(err);
        });
    });
}
exports.loadSecondarySpreadsheet = loadSecondarySpreadsheet;


function parseRooms(raw) {
    let results = [];
    if (isBlank(raw)) return results;
    for (const piece of raw.split(",")) {
        var parts = piece.split("|");

        var buildingName = parts[0];
        var roomNumber = parts[1];

        var room = getRoomByBuildingNameAndNumber(buildingName, roomNumber);
        if (!room) continue; // no location at building/room

        results.push(room.id);
    }
    return results;
}

function parseListFromString(str, delim) {
    if (isBlank(str)) return [];
    return str.toLowerCase().trim().split(",");
}


function getAllTroubleshootingData() {
    return troubledata;
}
exports.getAllTroubleshootingData = getAllTroubleshootingData;


function getTroubleshootingDataForRoom(roomID) {
    let results = [];

    var room = getRoomByID(roomID);

    if (!room) return results; // no room with that ID found

    for (const td of troubledata) {

        // trouble data doesn't apply for this room
        if (td.blacklistedLocations.includes(roomID))
            continue;

        // whitelisted room
        if (td.whitelistedLocations.length > 0) {
            if (td.whitelistedLocations.includes(roomID))
                results.push(td);
            else
                continue;
        }

        // audio
        if (room.hasAudio) {
            if (td.types.includes('audio')) {
                results.push(td);
            }
        }
        // projector
        if (room.hasProjector) {
            if (td.types.includes('projector')) {
                results.push(td);
            }
        }
        // computer
        if (room.hasTeachingStationComputer) {
            if (td.types.includes('computer')) {
                results.push(td);
            }
        }
        // dvd player
        if (room.hasDVDPlayer) {
            if (td.types.includes('dvd')) {
                results.push(td);
            }
        }
        // printer
        if (room.hasPrinter) {
            if (td.types.includes('printer')) {
                results.push(td);
            }
        }

        // if there are no types, it is general
        if (td.types.length === 0)
            results.push(td);
    }
    return results;
}
exports.getTroubleshootingDataForRoom = getTroubleshootingDataForRoom;

*/ 
