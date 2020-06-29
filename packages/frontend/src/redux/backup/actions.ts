import { Dispatch } from "redux";
import { BackupRestoreOptions } from "@ccss-support-manual/models";
import { PERFORM_BACKUP, PERFORM_BACKUP_SUCCESS, PERFORM_BACKUP_FAILURE } from "./types";

export const performBackup = (options: BackupRestoreOptions) => async (dispatch: Dispatch) => {
  dispatch({
    type: PERFORM_BACKUP,
  });
  try {
    const response = await fetch("http://localhost:3001/api/v1/backup", {
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
        type: PERFORM_BACKUP_FAILURE,
        error,
      });
      return;
    }

    // Success response
    // TODO implement return data
    dispatch({
      type: PERFORM_BACKUP_SUCCESS,
      data: undefined,
    });
  } catch (error) {
    dispatch({
      type: PERFORM_BACKUP_FAILURE,
      error,
    });
  }
};
