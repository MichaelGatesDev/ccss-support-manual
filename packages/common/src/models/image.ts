export interface Image {
    path: string;
    type: ImageType;
}

export enum ImageType {
    Building,
    BuildingPanorama,
    Room,
    RoomPanorama,
    RoomEquipment,
}