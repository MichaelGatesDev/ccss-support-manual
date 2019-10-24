import {
  UPLOAD_SPREADSHEET_TO_IMPORT, UploadActionTypes, UploadState, UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS, UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE,
} from "./types";

const initialState: UploadState = {
  uploading: false,
};

export function uploadsReducer(state = initialState, action: UploadActionTypes): UploadState {
  switch (action.type) {
    case UPLOAD_SPREADSHEET_TO_IMPORT:
      return {
        ...state,
        uploading: true,
      };
    case UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS:
      return {
        ...state,
        uploading: false,
      };
    case UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE:
      return {
        ...state,
        uploading: false,
      };
    default:
      return state;
  }
}
