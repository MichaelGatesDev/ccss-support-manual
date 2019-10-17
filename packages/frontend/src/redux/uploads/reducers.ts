import {
  UPLOAD_SPREADSHEET_TO_IMPORT, UploadActionTypes, UploadState,
} from "./types";

const initialState: UploadState = {
  uploading: true,
};

export function uploadsReducer(state = initialState, action: UploadActionTypes): UploadState {
  switch (action.type) {
    case UPLOAD_SPREADSHEET_TO_IMPORT:
      return {
        ...state,
        uploading: false,
      };
    default:
      return state;
  }
}
