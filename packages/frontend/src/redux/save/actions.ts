import { Dispatch } from "redux";

import { PERFORM_SAVE, PERFORM_SAVE_SUCCESS, PERFORM_SAVE_FAILURE } from "./types";

export function performSave() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: PERFORM_SAVE,
      });
      await fetch("http://localhost:3001/api/v1/save");
      dispatch({
        type: PERFORM_SAVE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: PERFORM_SAVE_FAILURE,
        payload: error,
      });
    }
  };
}
