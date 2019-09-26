import { BuildingImage, RoomImage } from "@ccss-support-manual/models";

export interface ImagesState {
  imagesLoading: boolean;

  allRoomImages: RoomImage[];
  allBuildingImages: BuildingImage[];

  roomImages: RoomImage[];
  buildingImages: BuildingImage[];
}

export interface BuildingImagesFetchedPayload {
  images: BuildingImage[];
}

export interface AllImagesFetchedPayload {
  roomImages: RoomImage[];
  buildingImages: BuildingImage[];
}

// Describing the different ACTION NAMES available
export const FETCH_IMAGES = "FETCH_IMAGES";
export const FETCH_BUILDING_IMAGES = "FETCH_BUILDING_IMAGES";

interface FetchImagesAction {
  type: typeof FETCH_IMAGES;
  payload: AllImagesFetchedPayload;
}

interface FetchBuildingImagesAction {
  type: typeof FETCH_BUILDING_IMAGES;
  payload: BuildingImagesFetchedPayload;
}

export type ImagesActionTypes = FetchImagesAction | FetchBuildingImagesAction;
