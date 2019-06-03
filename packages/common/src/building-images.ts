import { Image } from "./image";

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