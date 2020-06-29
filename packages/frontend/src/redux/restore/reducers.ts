import { RestoreActionTypes, RestoreState, FETCH_RESTORE_OPTIONS, PERFORM_RESTORE, PERFORM_RESTORE_SUCCESS, PERFORM_RESTORE_FAILURE } from "./types";

const initialState: RestoreState = {
  restoring: false,

  loadingOptions: true,
  options: [],

  data: undefined,
  error: undefined,
};

export function restoreReducer(state = initialState, action: RestoreActionTypes): RestoreState {
  switch (action.type) {
    case FETCH_RESTORE_OPTIONS:
      return {
        ...state,
        loadingOptions: false,
        options: action.payload,
      };
    case PERFORM_RESTORE:
      return {
        ...state,
        restoring: true,
      };
    case PERFORM_RESTORE_SUCCESS:
      return {
        ...state,
        restoring: false,
        data: action.data,
      };
    case PERFORM_RESTORE_FAILURE:
      return {
        ...state,
        restoring: false,
        error: action.error,
      };
    default:
      return state;
  }
}
