import { BuildingsActionTypes, FETCH_IMAGES, ImagesState } from "./types";

const initialState: ImagesState = {
    images: null,
    imagesLoading: true
};

export function imagesReducer(state = initialState, action: BuildingsActionTypes): ImagesState {
    switch (action.type) {
        case FETCH_IMAGES:
            return {
                ...state,
                images: action.payload,
                imagesLoading: false
            };
        default:
            return state;
    }
}
