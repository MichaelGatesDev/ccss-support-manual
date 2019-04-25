"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A utility class for managing images
 */
var ImageManager = /** @class */ (function () {
    function ImageManager() {
        this.images = [];
        this.roomImages = [];
    }
    /**
     * Adds a image to the array
     * @param image Image to add
     */
    ImageManager.prototype.addImage = function (image) {
        this.images.push(image);
    };
    /**
     * Removes a image from the array
     * @param image Image to remove
     */
    ImageManager.prototype.removeImage = function (image) {
        var index = this.images.indexOf(image, 0);
        if (index > -1) {
            this.images.splice(index, 1);
        }
    };
    /**
     * Gets all images
     */
    ImageManager.prototype.getImages = function () {
        return this.images;
    };
    ImageManager.prototype.setRoomImages = function (roomID, images) {
    };
    ImageManager.prototype.getImagesForRoom = function (room) {
        return null;
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
var RoomImages = /** @class */ (function () {
    function RoomImages(roomID) {
        this.roomID = roomID;
        this.rootImages = [];
        this.panoramicImages = [];
        this.equipmentImages = [];
    }
    RoomImages.prototype.getRoomID = function () {
        return this.roomID;
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
