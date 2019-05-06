"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A utility class for managing images
 */
var ImageManager = /** @class */ (function () {
    function ImageManager() {
        this.buildingImages = [];
        this.roomImages = [];
    }
    ImageManager.prototype.addBuildingImages = function (images) {
        this.buildingImages.push(images);
    };
    ImageManager.prototype.addRoomImages = function (images) {
        this.roomImages.push(images);
    };
    ImageManager.prototype.getImagesForBuilding = function (buildingName) {
        for (var _i = 0, _a = this.buildingImages; _i < _a.length; _i++) {
            var images = _a[_i];
            if (images.getBuildingID() === buildingName)
                return images;
        }
    };
    ImageManager.prototype.getImagesForRoom = function (buildingName, roomNumber) {
        for (var _i = 0, _a = this.roomImages; _i < _a.length; _i++) {
            var images = _a[_i];
            if (images.getBuildingName() === buildingName && images.getRoomNumber() === roomNumber)
                return images;
        }
    };
    ImageManager.prototype.getTotalSize = function () {
        var size = 0;
        for (var _i = 0, _a = this.roomImages; _i < _a.length; _i++) {
            var images = _a[_i];
            size += images.size();
        }
        return size;
    };
    ImageManager.prototype.getAllImages = function () {
        return {
            buildingImages: this.buildingImages,
            roomImages: this.roomImages
        };
    };
    ImageManager.prototype.getBuildingImages = function () {
        return this.buildingImages;
    };
    ImageManager.prototype.getRoomImages = function () {
        return this.roomImages;
    };
    return ImageManager;
}());
exports.ImageManager = ImageManager;
var Image = /** @class */ (function () {
    function Image(url) {
        this.url = url;
    }
    Image.prototype.getURL = function () {
        return this.url;
    };
    return Image;
}());
exports.Image = Image;
var BuildingImages = /** @class */ (function () {
    function BuildingImages(buildingName) {
        this.buildingName = buildingName;
        this.rootImages = [];
        this.panoramicImages = [];
    }
    BuildingImages.prototype.getBuildingID = function () {
        return this.buildingName;
    };
    BuildingImages.prototype.addMainImage = function (image) {
        this.rootImages.push(image);
    };
    BuildingImages.prototype.getMainImages = function () {
        return this.rootImages;
    };
    BuildingImages.prototype.addPanoramicImage = function (image) {
        this.panoramicImages.push(image);
    };
    BuildingImages.prototype.getPanoramicImages = function () {
        return this.panoramicImages;
    };
    BuildingImages.prototype.getAllImages = function () {
        return this.rootImages
            .concat(this.panoramicImages);
    };
    BuildingImages.prototype.size = function () {
        return (this.rootImages.length +
            this.panoramicImages.length);
    };
    return BuildingImages;
}());
exports.BuildingImages = BuildingImages;
var RoomImages = /** @class */ (function () {
    function RoomImages(buildingName, roomNumber) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
        this.rootImages = [];
        this.panoramicImages = [];
        this.equipmentImages = [];
    }
    RoomImages.prototype.getBuildingName = function () {
        return this.buildingName;
    };
    RoomImages.prototype.getRoomNumber = function () {
        return this.roomNumber;
    };
    RoomImages.prototype.addMainImage = function (image) {
        this.rootImages.push(image);
    };
    RoomImages.prototype.getMainImages = function () {
        return this.rootImages;
    };
    RoomImages.prototype.addPanoramicImage = function (image) {
        this.panoramicImages.push(image);
    };
    RoomImages.prototype.getPanoramicImages = function () {
        return this.panoramicImages;
    };
    RoomImages.prototype.addEquipmentImage = function (image) {
        this.equipmentImages.push(image);
    };
    RoomImages.prototype.getEquipmentImages = function () {
        return this.equipmentImages;
    };
    RoomImages.prototype.getAllImages = function () {
        return this.rootImages
            .concat(this.panoramicImages)
            .concat(this.equipmentImages);
    };
    RoomImages.prototype.size = function () {
        return (this.rootImages.length +
            this.panoramicImages.length +
            this.equipmentImages.length);
    };
    return RoomImages;
}());
exports.RoomImages = RoomImages;
