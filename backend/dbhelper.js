var mongoose = require('mongoose');
var fs = require('fs');
const Excel = require('exceljs');

var Building = require('./models/building');
var Room = require('./models/room');


async function createConfig() {
    return new Promise((resolve, reject) => {
        let dbConfigFile = "dbconfig.json";
        if (!fs.existsSync(dbConfigFile)) {
            let dbConfig = {
                username: "",
                password: "",
                url: "",
                useNewParser: true
            };
            fs.writeFile(dbConfigFile, JSON.stringify(dbConfig), (err) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                };
            });
            return resolve(true);
        }
        return resolve(false);
    });
}
exports.createConfig = createConfig;


async function connect() {
    return new Promise((resolve, reject) => {
        let dbConfigFile = "dbconfig.json";
        var dbConfig = JSON.parse(fs.readFileSync(dbConfigFile));

        if (!dbConfigFile) {
            return reject("There was an error loading the database configuration file.");
        }
        let dbUsername = dbConfig.username;
        let dbPassword = dbConfig.password;
        let databaseURL = dbConfig.url
            .replace("{username}", dbUsername)
            .replace("{password}", dbPassword);

        mongoose.connect(databaseURL, {
            useNewUrlParser: true
        }).then(function () {
            mongoose.Promise = global.Promise;

            var db = mongoose.connection;

            //Bind connection to error event (to get notification of connection errors)
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));

            return resolve();
        }).catch(function (e) {
            return reject(e);
        });
    });
}
exports.connect = connect;


function updateFromSpreadsheet(file) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(file).then(function () {

        let buildings = [];

        // buildings
        var buildingsWS = workbook.getWorksheet("Buildings");
        buildingsWS.eachRow({
            includeEmpty: false
        }, function (row, rowNumber) {

            // skip  the first row (headers)
            if (rowNumber == 1) return;

            var officialName = row.getCell(1).text.toLowerCase();
            var nicknames = row.getCell(2).text.toLowerCase().split(",");
            var internalName = officialName.toLowerCase().replace(/\s/g, "-");

            var building = new Building({
                officialName: officialName,
                nicknames: nicknames,
                internalName: internalName
            })

            buildings.push(building);
            console.log("Created building: " + building.internalName);
        });

        // rooms
        var roomsWS = workbook.getWorksheet("Rooms");
        roomsWS.eachRow({
            includeEmpty: false
        }, function (row, rowNumber) {

            // skip  the first row (headers)
            if (rowNumber == 1) return;

            var timestamp = row.getCell(1).text.toLowerCase();
            var lookup = row.getCell(2).text.toLowerCase();
            var buildingName = row.getCell(3).text.toLowerCase();
            var number = row.getCell(4).text.toLowerCase();
            var name = row.getCell(5).text.toLowerCase();
            var type = row.getCell(6).text.toLowerCase();
            var lockType = row.getCell(7).text.toLowerCase();
            var capacity = row.getCell(8).text;
            var furnitureType = row.getCell(9).text;
            var chairCount = row.getCell(10).text;
            var tableCount = row.getCell(11).text;
            var extension = row.getCell(12).text;
            var phoneStatus = row.getCell(13).text.toLowerCase();
            var audioRequiresProjector = row.getCell(14).text.toLowerCase();
            var hasProjector = row.getCell(15).text.toLowerCase() !== "n/a";
            var hasAudio = row.getCell(16).text.toLowerCase() !== "n/a";
            var hasScreen = row.getCell(17).text.toLowerCase() !== "n/a";
            var hasTeachingStationComputer = row.getCell(18).text.toLowerCase() !== "n/a";
            var teachingStationComputerType = row.getCell(19).text.toLowerCase();
            var teachingStationComputerOS = row.getCell(20).text.toLowerCase();
            var hasDocCam = row.getCell(21).text.toLowerCase() !== "n/a";
            var hasDVDPlayer = row.getCell(22).text.toLowerCase() !== "n/a";
            var dvdPlayerType = row.getCell(23).text.toLowerCase();
            var hasPrinter = row.getCell(24).text.toLowerCase() !== "n/a";
            var printerSymquestNumber = row.getCell(25).text.toLowerCase();
            var printerCartridgeType = row.getCell(26).text.toLowerCase();

            if (isBlank(buildingName)) return;

            var room = new Room({
                buildingName: buildingName,
                lastChecked: timestamp,
                number: number,
                name: name,
                type: type,
                lockType: lockType,
                capacity: capacity,
                furnitureType: furnitureType,
                chairCount: chairCount,
                tableCount: tableCount,
                extension: extension,
                phoneStatus: phoneStatus,
                audioRequiresProjector: audioRequiresProjector,
                hasProjector: hasProjector,
                hasAudio: hasAudio,
                hasScreen: hasScreen,
                hasTeachingStationComputer: hasTeachingStationComputer,
                teachingStationComputerType: teachingStationComputerType,
                teachingStationComputerOS: teachingStationComputerOS,
                hasDocCam: hasDocCam,
                hasDVDPlayer: hasDVDPlayer,
                dvdPlayerType: dvdPlayerType,
                hasPrinter: hasPrinter,
                printerSymquestNumber: printerSymquestNumber,
                printerCartridgeType: printerCartridgeType,
            });

            var bldg = getBuildingByName(buildings, buildingName);
            if (bldg) {
                room.buildingName = bldg.internalName;
                bldg.rooms.push(room);
                console.log("Created room: " + bldg.officialName + " " + room.number);
            }
        });

        console.log("There are " + buildings.length + " buildings");

        var roomCount = 0;
        for (const b of buildings) {
            roomCount += b.rooms.length;
            console.log(b.internalName + " has " + b.rooms.length + " rooms");
        }
        console.log("There are " + roomCount + " classrooms");

        for (const b of buildings) {
            Building.create(b).then(function () {
                console.log("Added " + b.internalName + " to database");
            }).catch(function (err) {
                if (err) {
                    console.log(err.errmsg);
                }
            });
        }
    });
}

updateFromSpreadsheet("public/spreadsheet.xlsx"); // TESTING ONLY


function getBuildingByName(allBuildings, name) {
    for (const building of allBuildings) {
        var contains = false;
        if (building.internalName.includes(name)) contains = true;
        if (building.officialName.includes(name)) contains = true;
        for (const nick of building.nicknames) {
            if (nick.includes(name)) contains = true;
            break;
        }
        if (contains) return building;
    }
}


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}