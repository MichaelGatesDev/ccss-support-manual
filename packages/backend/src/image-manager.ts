import { BuildingImages, RoomImages, ImageCollection } from "@ccss-support-manual/common";

/**
 * A utility class for managing images
 */
export class ImageManager {

    public buildingImages: BuildingImages[];
    public roomImages: RoomImages[];

    public constructor() {
        this.buildingImages = [];
        this.roomImages = [];
    }

    public addBuildingImages(images: BuildingImages): void {
        this.buildingImages.push(images);
    }

    public addRoomImages(images: RoomImages): void {
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

    public getTotalSize(): number {
        let size = 0;

        for (const images of this.roomImages) {
            size += images.size();
        }

        return size;
    }

    public getAllImages(): ImageCollection {
        return new ImageCollection(this.buildingImages, this.roomImages);
    }
}
