var mongoose = require('mongoose');
var fs = require('fs');
const Excel = require('exceljs');

var Building = require('./models/building');


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



async function updateFromSpreadsheet(file) {
    return new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(file).then(function () {
            var buildingsWS = workbook.getWorksheet("Buildings");
            var roomsWS = workbook.getWorksheet("Rooms");
        });
    });
}
exports.updateFromSpreadsheet = updateFromSpreadsheet;




async function addBuilding(buildingObj) {
    return new Promise((resolve, reject) => {
        Building.create(buildingObj).then(
            (created) => {
                return resolve(created);
            }
        );
    });
}
exports.addBuilding = addBuilding;

async function removeBuilding(building) {
    return new Promise((resolve, reject) => {
        Building.remove(buildingObj).then(
            (removed) => {
                return resolve(removed);
            }
        );
    });
}
exports.addBuilding = addBuilding;

async function getBuilding(criteria) {
    return new Promise((resolve, reject) => {
        Building.findOne(criteria).then((removed) => {
            if (!removed) {
                return resolve();
            }
            return resolve(removed);
        });
    });
}
exports.getBuilding = getBuilding;


async function getAllBuildings() {
    return new Promise((resolve, reject) => {
        Building.find({}, function (err, buildings) {
            return resolve(buildings);
        });
    });
}
exports.getAllBuildings = getAllBuildings;