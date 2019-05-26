import { BuildingsState, FETCH_BUILDINGS, FETCH_BUILDING, BuildingsActionTypes } from "./types";

const initialState: BuildingsState = {
    buildings: [],
    building: null,
    buildingsLoading: true,
};

export function buildingsReducer(state = initialState, action: BuildingsActionTypes): BuildingsState {
    switch (action.type) {
        case FETCH_BUILDINGS:
            return {
                ...state,
                buildings: action.payload,
                buildingsLoading: false
            };
        default:
            return state;
    }
}
