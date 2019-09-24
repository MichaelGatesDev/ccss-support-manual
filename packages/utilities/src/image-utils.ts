import { Image, ImageType } from "@ccss-support-manual/models";

export class ImageUtils {

    public static isRoomImage(image: Image): boolean {
        return (
            image.type === ImageType.Room ||
            image.type === ImageType.RoomEquipment ||
            image.type === ImageType.RoomPanorama ||
            image.type === ImageType.RoomTitle
        );
    }

    public static isBuildingImage(image: Image): boolean {
        return (
            image.type === ImageType.Building ||
            image.type === ImageType.BuildingPanorama
        );
    }

}