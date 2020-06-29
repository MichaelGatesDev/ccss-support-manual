import { IMPORT_SPREADSHEET, IMPORT_SPREADSHEET_SUCCESS, IMPORT_SPREADSHEET_FAILURE, ImportState, ImportActionTypes } from "./types";

const initialState: ImportState = {
  importing: false,
  data: undefined,
  error: undefined,
};

export function importsReducer(state = initialState, action: ImportActionTypes): ImportState {
  switch (action.type) {
    case IMPORT_SPREADSHEET:
      return {
        ...state,
        importing: true,
      };
    case IMPORT_SPREADSHEET_SUCCESS:
      return {
        ...state,
        importing: false,
        data: action.data,
      };
    case IMPORT_SPREADSHEET_FAILURE:
      return {
        ...state,
        importing: false,
        error: action.error,
      };
    default:
      return state;
  }
}
