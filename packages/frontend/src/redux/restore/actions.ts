import { Dispatch } from "redux";
import { BackupRestoreOptions } from "@ccss-support-manual/models";

import {
  FETCH_RESTORE_OPTIONS,
  PERFORM_RESTORE,
  PERFORM_RESTORE_SUCCESS,
  PERFORM_RESTORE_FAILURE,
} from "./types";

export function fetchRestoreOptions() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/restore")
      .then((response) => response.json())
      .then((options: string[]): void => {
        dispatch({
          type: FETCH_RESTORE_OPTIONS,
          payload: options,
        });
      }).catch((error) => {
        console.error("Failed to fetch restore options");
        console.error(error);
      });
  };
}

export const performRestore = (options: BackupRestoreOptions) => async (dispatch: Dispatch) => {

  dispatch({
    type: PERFORM_RESTORE,
  });
  try {
    const response = await fetch("/api/v1/restore", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(options),
    });

    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: PERFORM_RESTORE_FAILURE,
        error,
      });
      return;
    }

    // Success response
    // TODO implement return data
    dispatch({
      type: PERFORM_RESTORE_SUCCESS,
      data: undefined,
    });
  }
  catch (error) {
    dispatch({
      type: PERFORM_RESTORE_FAILURE,
      error,
    });
  }
};
