import { Dispatch } from "redux";
import { SpreadsheetType } from "@ccss-support-manual/models";

import { DOWNLOAD_SPREADSHEET_TO_IMPORT } from "./types";


function getSpreadsheetURL(fileType: SpreadsheetType) {
  switch (fileType) {
    default: break;
    case SpreadsheetType.ClassroomChecks: return "classroom-checks";
    case SpreadsheetType.Troubleshooting: return "troubleshooting-data";
  }
  return "";
}

export function downloadSpreadsheetToImport(fileType: SpreadsheetType, formData: FormData) {
  return (dispatch: Dispatch) => {
    fetch(
      `/api/v1/download/${getSpreadsheetURL(fileType)}`,
      {
        method: "POST",
        body: formData,
      },
    )
      .then(() => {
        dispatch({
          type: DOWNLOAD_SPREADSHEET_TO_IMPORT,
        });
      }).catch(error => {
        console.error("Failed to download file");
        console.error(error);
      });
  };
}
