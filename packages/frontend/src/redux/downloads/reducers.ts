import {
  DOWNLOAD_SPREADSHEET_TO_IMPORT, DownloadActionTypes, DownloadState,
} from "./types";

const initialState: DownloadState = {
  downloading: true,
};

export function troubleshootingReducer(state = initialState, action: DownloadActionTypes): DownloadState {
  switch (action.type) {
    case DOWNLOAD_SPREADSHEET_TO_IMPORT:
      return {
        ...state,
        downloading: false,
      };
    default:
      return state;
  }
}
