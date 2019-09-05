import { BuildingImage, RoomImage } from "@ccss-support-manual/models";

export interface ImagesState {
  imagesLoading: boolean;

  buildingImages: BuildingImage[];
  roomImages: RoomImage[];
}

export interface ImagesFetchedPayload {
  buildingImages: BuildingImage[];
  roomImages: RoomImage[];
}

// Describing the different ACTION NAMES available
export const FETCH_IMAGES = "FETCH_IMAGES";

interface FetchImagesAction {
  type: typeof FETCH_IMAGES;
  payload: ImagesFetchedPayload;
}

export type ImagesActionTypes = FetchImagesAction;
