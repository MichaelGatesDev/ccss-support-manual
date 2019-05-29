import { ImageCollection } from "@ccss-support-manual/common";

export interface ImagesState {
    images: ImageCollection | null;
    imagesLoading: boolean;
}

// Describing the different ACTION NAMES available
export const FETCH_IMAGES = 'FETCH_IMAGES';

interface FetchImagesAction {
    type: typeof FETCH_IMAGES;
    payload: ImageCollection;
}

export type ImagesActionTypes = FetchImagesAction;
