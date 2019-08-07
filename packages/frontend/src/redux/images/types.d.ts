import { ImageCollection } from "@ccss-support-manual/common";
export interface ImagesState {
    images: ImageCollection | null;
    imagesLoading: boolean;
}
export declare const FETCH_IMAGES = "FETCH_IMAGES";
interface FetchImagesAction {
    type: typeof FETCH_IMAGES;
    payload: ImageCollection;
}
export declare type ImagesActionTypes = FetchImagesAction;
export {};
