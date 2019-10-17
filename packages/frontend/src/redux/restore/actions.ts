import { Dispatch } from "redux";

import {
  FETCH_RESTORE_OPTIONS,
  PERFORM_RESTORE,
  PERFORM_RESTORE_SUCCESS,
  PERFORM_RESTORE_FAILURE,
} from "./types";


export function fetchRestoreOptions() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/restore")
      .then(response => response.json())
      .then((options: string[]): void => {
        dispatch({
          type: FETCH_RESTORE_OPTIONS,
          payload: options,
        });
      }).catch(error => {
        console.error("Failed to fetch restore options");
        console.error(error);
      });
  };
}

export function performRestore(restorePoint: string) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: PERFORM_RESTORE,
      });
      await fetch("/api/v1/restore", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          restorePoint,
        }),
      });
      dispatch({
        type: PERFORM_RESTORE_SUCCESS,
      });
    }
    catch (error) {
      dispatch({
        type: PERFORM_RESTORE_FAILURE,
        payload: error,
      });
    }
  };
}
