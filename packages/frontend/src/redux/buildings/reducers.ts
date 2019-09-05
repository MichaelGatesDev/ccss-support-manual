import {
  BuildingsState, FETCH_BUILDINGS, BuildingsActionTypes, FETCH_BUILDING,
} from "./types";

const initialState: BuildingsState = {
  buildingsLoading: true,
  building: undefined,
  buildings: [],
};

export function buildingsReducer(state = initialState, action: BuildingsActionTypes): BuildingsState {
  switch (action.type) {
    case FETCH_BUILDINGS:
      return {
        ...state,
        buildingsLoading: false,
        buildings: action.payload,
      };
    case FETCH_BUILDING:
      return {
        ...state,
        buildingsLoading: false,
        building: action.payload,
      };
    default:
      return state;
  }
}
