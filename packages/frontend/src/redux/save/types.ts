export interface SaveState {
  saving: boolean;
}

// Describing the different ACTION NAMES available
export const PERFORM_SAVE = "PERFORM_SAVE";
export const PERFORM_SAVE_SUCCESS = "PERFORM_SAVE_SUCCESS";
export const PERFORM_SAVE_FAILURE = "PERFORM_SAVE_FAILURE";

interface PerformSaveAction {
  type: typeof PERFORM_SAVE;
}

interface PerformSaveSuccessAction {
  type: typeof PERFORM_SAVE_SUCCESS;
}

interface PerformSaveFailureAction {
  type: typeof PERFORM_SAVE_FAILURE;
}

export type RestoreActionTypes = PerformSaveAction | PerformSaveSuccessAction | PerformSaveFailureAction;
