async function updateFromSpreadsheet(file) {
    return new Promise((resolve, reject) => {
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
                console.debug("Created building: " + building.internalName);
            });

            // rooms
            var roomsWS = workbook.getWorksheet("Rooms");
            roomsWS.eachRow({
                includeEmpty: false
            }, function (row, rowNumber) {

                // skip  the first row (headers)
                if (rowNumber == 1) return;

                // can't do anything with invalid rows
                if (isBlank(buildingName)) return;

                var room = new Room({
                    buildingName: row.getCell(3).text.toLowerCase(),
                    lastChecked: row.getCell(1).text.toLowerCase(),
                    number: row.getCell(4).text.toLowerCase(),
                    name: row.getCell(5).text.toLowerCase(),
                    type: row.getCell(6).text.toLowerCase(),
                    lockType: row.getCell(7).text.toLowerCase(),
                    capacity: row.getCell(8).text,
                    furnitureType: row.getCell(9).text,
                    chairCount: row.getCell(10).text,
                    tableCount: row.getCell(11).text,
                    extension: row.getCell(12).text,
                    phoneStatus: row.getCell(13).text.toLowerCase(),
                    audioRequiresProjector: row.getCell(14).text.toLowerCase(),
                    hasProjector: row.getCell(15).text.toLowerCase() !== "n/a",
                    hasAudio: row.getCell(16).text.toLowerCase() !== "n/a",
                    hasScreen: row.getCell(17).text.toLowerCase() !== "n/a",
                    hasTeachingStationComputer: row.getCell(18).text.toLowerCase() !== "n/a",
                    teachingStationComputerType: row.getCell(19).text.toLowerCase(),
                    teachingStationComputerOS: row.getCell(20).text.toLowerCase(),
                    hasDocCam: row.getCell(21).text.toLowerCase() !== "n/a",
                    hasDVDPlayer: row.getCell(22).text.toLowerCase() !== "n/a",
                    dvdPlayerType: row.getCell(23).text.toLowerCase(),
                    hasPrinter: row.getCell(24).text.toLowerCase() !== "n/a",
                    printerSymquestNumber: row.getCell(25).text.toLowerCase(),
                    printerCartridgeType: row.getCell(26).text.toLowerCase(),
                });

                var bldg = getBuildingByName(buildings, buildingName);
                if (bldg) {
                    room.buildingName = bldg.internalName;
                    bldg.rooms.push(room);
                    console.debug("Created room: " + bldg.officialName + " " + room.number);
                }
            });

            console.debug("There are " + buildings.length + " buildings");

            var roomCount = 0;
            for (const b of buildings) {
                roomCount += b.rooms.length;
                console.debug(b.internalName + " has " + b.rooms.length + " rooms");
            }
            console.debug("There are " + roomCount + " classrooms");

            for (const b of buildings) {
                Building.create(b).then(function () {
                    console.debug("Added " + b.internalName + " to database");
                }).catch(function (err) {
                    if (err) {
                        console.debug(err.errmsg);
                    }
                });
            }

            return resolve(buildings);
        });
    }).catch(function (err) {
        return reject(err);
    });
}
exports.updateFromSpreadsheet = updateFromSpreadsheet;


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