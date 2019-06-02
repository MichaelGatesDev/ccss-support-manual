/**
 * A utility class for managing images
 */
export class ImageManager {

    public buildingImages: BuildingImages[];
    public roomImages: RoomImages[];

    constructor() {
        this.buildingImages = [];
        this.roomImages = [];
    }

    public addBuildingImages(images: BuildingImages) {
        this.buildingImages.push(images);
    }

    public addRoomImages(images: RoomImages) {
        this.roomImages.push(images);
    }

    public getImagesForBuilding(buildingName: string): BuildingImages | null {
        for (const images of this.buildingImages) {
            if (images.getBuildingID() === buildingName) return images;
        }
        return null;
    }

    public getImagesForRoom(buildingName: string, roomNumber: string): RoomImages | null {
        for (const images of this.roomImages) {
            if (images.getBuildingName() === buildingName && images.getRoomNumber() === roomNumber) return images;
        }
        return null;
    }

    public getTotalSize() {
        let size = 0;

        for (const images of this.roomImages) {
            size += images.size();
        }

        return size;
    }

    public getAllImages(): ImageCollection {
        return new ImageCollection(this.buildingImages, this.roomImages);
    }

    public getBuildingImages() {
        return this.buildingImages;
    }

    public getRoomImages() {
        return this.roomImages;
    }
}

export class ImageCollection {
    public buildingImages: BuildingImages[];
    public roomImages: RoomImages[];

    constructor(buildingImages: BuildingImages[], roomImages: RoomImages[]) {
        this.buildingImages = buildingImages;
        this.roomImages = roomImages;
    }

    public getBuildingImages() {
        return this.buildingImages;
    }

    public getRoomImages() {
        return this.roomImages;
    }
}

export class Image {

    public url: string;

    constructor(url: string) {
        this.url = url;
    }

    public getURL() {
        return this.url;
    }

}


export class BuildingImages {
    public buildingName: string;
    public rootImages: Image[];
    public panoramicImages: Image[];

    constructor(buildingName: string) {
        this.buildingName = buildingName;
        this.rootImages = [];
        this.panoramicImages = [];
    }

    public getBuildingID() {
        return this.buildingName;
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

    public getAllImages() {
        return this.rootImages
            .concat(this.panoramicImages);
    }

    public size() {
        return (
            this.rootImages.length +
            this.panoramicImages.length
        );
    }
}

export class RoomImages {
    public buildingName: string;
    public roomNumber: string;
    public rootImages: Image[];
    public panoramicImages: Image[];
    public equipmentImages: Image[];

    constructor(buildingName: string, roomNumber: string) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
        this.rootImages = [];
        this.panoramicImages = [];
        this.equipmentImages = [];
    }

    public getBuildingName() {
        return this.buildingName;
    }

    public getRoomNumber() {
        return this.roomNumber;
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
