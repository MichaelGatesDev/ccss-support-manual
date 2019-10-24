import { Dispatch } from "redux";
import { SpreadsheetType } from "@ccss-support-manual/models";

import {
  UPLOAD_SPREADSHEET_TO_IMPORT,
  UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS,
  UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE,
} from "./types";


function getSpreadsheetURL(fileType: SpreadsheetType) {
  switch (fileType) {
    default: break;
    case SpreadsheetType.ClassroomChecks: return "classroom-checks";
    case SpreadsheetType.Troubleshooting: return "troubleshooting-data";
  }
  return "";
}

export function uploadSpreadsheetToImport(fileType: SpreadsheetType, formData: FormData) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: UPLOAD_SPREADSHEET_TO_IMPORT,
      });
      await fetch(
        `/api/v1/upload/${getSpreadsheetURL(fileType)}`,
        {
          method: "POST",
          body: formData,
        },
      );
      dispatch({
        type: UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS,
      });
    }
    catch (error) {
      dispatch({
        type: UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE,
        payload: error,
      });
    }
  };
}
