import { Dispatch } from "redux";
import { BackupOptions } from "@ccss-support-manual/models";
import { PERFORM_BACKUP, PERFORM_BACKUP_SUCCESS, PERFORM_BACKUP_FAILURE } from "./types";

export const performBackup = (
  options: BackupOptions,
) => async (dispatch: Dispatch) => {

  const formData = new FormData();
  formData.append("options", JSON.stringify(options));

  dispatch({
    type: PERFORM_BACKUP,
  });
  try {
    const response = await fetch("/api/v1/backup", {
      method: "POST",
      body: formData,
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
  }
  catch (error) {
    dispatch({
      type: PERFORM_BACKUP_FAILURE,
      error,
    });
  }
};
