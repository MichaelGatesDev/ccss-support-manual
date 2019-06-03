import { Image } from "./image";

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