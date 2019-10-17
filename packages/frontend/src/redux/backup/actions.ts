import { Dispatch } from "redux";
import { PERFORM_BACKUP, PERFORM_BACKUP_SUCCESS, PERFORM_BACKUP_FAILURE } from "./types";


export function performBackup() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: PERFORM_BACKUP,
      });
      await fetch("/api/v1/backup");
      dispatch({
        type: PERFORM_BACKUP_SUCCESS,
      });
    }
    catch (error) {
      dispatch({
        type: PERFORM_BACKUP_FAILURE,
        payload: error,
      });
    }
  };
}
