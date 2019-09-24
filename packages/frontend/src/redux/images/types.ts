import { BuildingImage, RoomImage } from "@ccss-support-manual/models";

export interface ImagesState {
  imagesLoading: boolean;

  roomImages: RoomImage[];
  buildingImages: BuildingImage[];
}

export interface ImagesFetchedPayload {
  roomImages: RoomImage[];
  buildingImages: BuildingImage[];
}

// Describing the different ACTION NAMES available
export const FETCH_IMAGES = "FETCH_IMAGES";

interface FetchImagesAction {
  type: typeof FETCH_IMAGES;
  payload: ImagesFetchedPayload;
}

export type ImagesActionTypes = FetchImagesAction;
