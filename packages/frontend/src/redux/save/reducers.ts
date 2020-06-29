import { RestoreActionTypes, SaveState, PERFORM_SAVE_SUCCESS, PERFORM_SAVE_FAILURE, PERFORM_SAVE } from "./types";

const initialState: SaveState = {
  saving: false,
};

export function saveReducer(state = initialState, action: RestoreActionTypes): SaveState {
  switch (action.type) {
    case PERFORM_SAVE:
      return {
        ...state,
        saving: true,
      };
    case PERFORM_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
      };
    case PERFORM_SAVE_FAILURE:
      return {
        ...state,
        saving: false,
      };
    default:
      return state;
  }
}
