import { StringUtils } from "StringUtils";

/**
 * A utility class for managing images
 */
class ImageManager {

    /**
     * An array of all images
     */
    private images: Image[];

    private roomImages: RoomImages[];

    constructor() {
        this.images = [];
        this.roomImages = [];
    }

    /**
     * Adds a image to the array
     * @param image Image to add
     */
    public addImage(image: Image) {
        this.images.push(image);
    }

    /**
     * Removes a image from the array
     * @param image Image to remove
     */
    public removeImage(image: Image) {
        const index = this.images.indexOf(image, 0);
        if (index > -1) {
            this.images.splice(index, 1);
        }
    }

    /**
     * Gets all images
     */
    public getImages() {
        return this.images;
    }


    public setRoomImages(roomID: string, images: RoomImages) {

    }
}


class Image {

    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public getURL() {
        return this.url;
    }

}


class RoomImages {
    private roomID: string;
    private rootImages: Image[];
    private panoramicImages: Image[];
    private equipmentImages: Image[];

    constructor(roomID: string) {
        this.roomID = roomID;
        this.rootImages = [];
        this.panoramicImages = [];
        this.equipmentImages = [];
    }

    public getRoomID() {
        return this.roomID;
    }

    public addMainImage(image: Image) {
        this.rootImages.push(image);
    }

    public getMainImages() {
        return this.rootImages;
    }

    public addPanoramicImage(image: Image) {
        this.panoramicImages.push(image);
    }

    public getPanoramicImages() {
        return this.panoramicImages;
    }

    public addEquipmentImage(image: Image) {
        this.equipmentImages.push(image);
    }

    public getEquipmentImages() {
        return this.equipmentImages;
    }

    public getAllImages() {
        return this.rootImages
            .concat(this.panoramicImages)
            .concat(this.equipmentImages);
    }

    public size() {
        return (
            this.rootImages.length +
            this.panoramicImages.length +
            this.equipmentImages.length
        );
    }
}


export {
    ImageManager,
    Image,
    RoomImages,
}