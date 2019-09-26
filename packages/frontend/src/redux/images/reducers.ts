import {
  ImagesActionTypes,
  ImagesState,
  FETCH_IMAGES,
  FETCH_BUILDING_IMAGES,
} from "./types";

const initialState: ImagesState = {
  imagesLoading: true,

  allBuildingImages: [],
  allRoomImages: [],

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
    case FETCH_BUILDING_IMAGES:
      return {
        ...state,
        imagesLoading: false,
        buildingImages: action.payload.images,
      };
    default:
      return state;
  }
}
