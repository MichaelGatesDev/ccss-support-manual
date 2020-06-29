import { Dispatch } from "redux";

import { IMPORT_SPREADSHEET, IMPORT_SPREADSHEET_SUCCESS, IMPORT_SPREADSHEET_FAILURE } from "./types";

export const importSpreadsheet = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch({
    type: IMPORT_SPREADSHEET,
  });
  try {
    const response = await fetch("http://localhost:3001/api/v1/import/spreadsheet", {
      method: "POST",
      body: formData,
    });

    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: IMPORT_SPREADSHEET_FAILURE,
        error,
      });
      return;
    }

    // Success response
    // TODO implement return data
    dispatch({
      type: IMPORT_SPREADSHEET_SUCCESS,
      data: undefined,
    });
  } catch (error) {
    dispatch({
      type: IMPORT_SPREADSHEET_FAILURE,
      error,
    });
  }
};
