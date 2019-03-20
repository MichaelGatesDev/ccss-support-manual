const express = require('express');
const router = express.Router({
    mergeParams: true
});

var fs = require('fs');

const Building = require('../../../../models/building');
const Room = require('../../../../models/room');


function getParentBuilding(roomObj) {
    for (const building of this.state.buildings) {
        for (const room of building.rooms) {
            if (room._id === roomObj._id) return building;
        }
    }
    return null;
}

router.get("/", function (req, res) {

    var images = [];

    var rootDir = "public/img/buildings/";

    if (!fs.existsSync(rootDir)) {
        console.log("Root directory does not exist: " + rootDir)
        return;
    }

    Building.find({}, function (err, buildings) {
        if (err) {
            console.log(err);
            return;
        }

        let result = [];

        for (const building of buildings) {
            var buildingDir = rootDir + building.internalName + "/";
            if (!fs.existsSync(buildingDir)) {
                console.log("Building directory does not exist: " + buildingDir);
                continue;
            }

            for (const room of building.rooms) {

                var mainImages = [];
                var panoramicImages = [];
                var equipmentImages = [];

                var roomDir = buildingDir + "rooms/" + room.number + "/";

                // check if room dir exists
                if (!fs.existsSync(roomDir)) {
                    console.log("Room directory does not exist: " + roomDir);
                    continue;
                }

                // root images
                for (const file of fs.readdirSync(roomDir)) {
                    var stat = fs.statSync(roomDir + file);
                    if (!stat.isDirectory()) {
                        mainImages.push(roomDir.replace("public/", "") + file);
                    }
                }

                // panoramic images
                var panoramasDir = roomDir + "panoramas/";
                if (fs.existsSync(panoramasDir)) {
                    for (const file of fs.readdirSync(panoramasDir)) {
                        var stat = fs.statSync(panoramasDir + file);
                        if (!stat.isDirectory()) {
                            panoramicImages.push(panoramasDir.replace("public/", "") + file);
                        }
                    }
                }

                // equipment images
                var equipmentDir = roomDir + "equipment/";
                if (fs.existsSync(equipmentDir)) {
                    for (const file of fs.readdirSync(equipmentDir)) {
                        var stat = fs.statSync(equipmentDir + file);
                        if (!stat.isDirectory()) {
                            equipmentImages.push(equipmentDir.replace("public/", "") + file);
                        }
                    }
                }

                result.push({
                    roomID: room._id,
                    mainImages: mainImages,
                    panoramicImages: panoramicImages,
                    equipmentImages: equipmentImages
                });
            }
        }

        res.json(result);
    });
});


router.param('buildingID', function (req, res, next, id) {
    console.log("Searching for building: " + id);
    Building.findOne({
        _id: id
    }, function (err, res) {
        if (err) {
            console.log(err);
            next(new Error('Failed to find building: ' + id));
            return;
        }
        req.building = res;
        next();
        return;
    });
});

router.param('roomID', function (req, res, next, id) {
    console.log("Searching for room: " + id);
    for (const room of req.building.rooms) {
        if (room._id.toString() === id) {
            req.room = room;
            next();
            return;
        }
    }
    next(new Error('Failed to find room: ' + id));
});


router.get('/:buildingID/:roomID', function (req, res) {

    if (!req.building || !req.room) {
        res.json(null);
        console.log("NO BUILDING OR NO ROOM!");
        return;
    }

    var mainImages = [];
    var panoramicImages = [];
    var equipmentImages = [];

    var rootDir = "public/img/buildings/";
    if (fs.existsSync(rootDir)) {
        var buildingDir = rootDir + req.building.internalName + "/";
        if (fs.existsSync(buildingDir)) {
            var roomDir = buildingDir + "rooms/" + req.room.number + "/";
            if (fs.existsSync(roomDir)) {

                // root images
                for (const file of fs.readdirSync(roomDir)) {
                    var stat = fs.statSync(roomDir + file);
                    if (!stat.isDirectory()) {
                        mainImages.push(roomDir.replace("public/", "") + file);
                    }
                }

                // panoramic images
                var panoramasDir = roomDir + "panoramas/";
                if (fs.existsSync(panoramasDir)) {
                    for (const file of fs.readdirSync(panoramasDir)) {
                        var stat = fs.statSync(panoramasDir + file);
                        if (!stat.isDirectory()) {
                            panoramicImages.push(panoramasDir.replace("public/", "") + file);
                        }
                    }
                }

                // equipment images
                var equipmentDir = roomDir + "equipment/";
                if (fs.existsSync(equipmentDir)) {
                    for (const file of fs.readdirSync(equipmentDir)) {
                        var stat = fs.statSync(equipmentDir + file);
                        if (!stat.isDirectory()) {
                            equipmentImages.push(equipmentDir.replace("public/", "") + file);
                        }
                    }
                }
            } else {
                console.log("Room directory does not exist: " + roomDir);
            }
        }
        else {
            console.log("Building directory does not exist: " + buildingDir);
        }
    } else {
        console.log("Root directory does not exist: " + rootDir)
    }

    res.json({
        mainImages: mainImages,
        panoramicImages: panoramicImages,
        equipmentImages: equipmentImages
    });
});

module.exports = router;