import { BuildingImages } from "./building-images";

import { RoomImages } from "./room-images";

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