import { ImagesActionTypes, FETCH_IMAGES, ImagesState } from "./types";

const initialState: ImagesState = {
  imagesLoading: true,
  buildingImages: [],
  roomImages: [],
};

export function imagesReducer(state = initialState, action: ImagesActionTypes): ImagesState {
  switch (action.type) {
    case FETCH_IMAGES:
      return {
        ...state,
        imagesLoading: false,
        buildingImages: action.payload.buildingImages,
        roomImages: action.payload.roomImages,
      };
    default:
      return state;
  }
}
