export interface RestoreState {
  loadingOptions: boolean;
  options: string[];

  restoring: boolean;
}

// Describing the different ACTION NAMES available
export const FETCH_RESTORE_OPTIONS = "FETCH_RESTORE_OPTIONS";
export const PERFORM_RESTORE = "PERFORM_RESTORE";
export const PERFORM_RESTORE_SUCCESS = "PERFORM_RESTORE_SUCCESS";
export const PERFORM_RESTORE_FAILURE = "PERFORM_RESTORE_FAILURE";

interface FetchRestoreOptionsAction {
  type: typeof FETCH_RESTORE_OPTIONS;
  payload: string[];
}

interface PerformRestoreAction {
  type: typeof PERFORM_RESTORE;
}

interface PerformRestoreSuccessAction {
  type: typeof PERFORM_RESTORE_SUCCESS;
}

interface PerformRestoreFailureAction {
  type: typeof PERFORM_RESTORE_FAILURE;
}

export type RestoreActionTypes = FetchRestoreOptionsAction | PerformRestoreAction | PerformRestoreSuccessAction | PerformRestoreFailureAction;
