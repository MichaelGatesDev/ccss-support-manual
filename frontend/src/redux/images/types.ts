import { Building } from 'backend/src/Building';
import { ImageCollection } from 'backend/src/ImageManager';

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

export type BuildingsActionTypes = FetchImagesAction;
