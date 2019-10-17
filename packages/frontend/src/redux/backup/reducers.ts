import {
  BackupActionTypes, BackupState, PERFORM_BACKUP, PERFORM_BACKUP_SUCCESS, PERFORM_BACKUP_FAILURE,
} from "./types";

const initialState: BackupState = {
  backingUp: false,
};

export function backupReducer(state = initialState, action: BackupActionTypes): BackupState {
  switch (action.type) {
    case PERFORM_BACKUP:
      return {
        ...state,
        backingUp: true,
      };
    case PERFORM_BACKUP_SUCCESS:
      return {
        ...state,
        backingUp: false,
      };
    case PERFORM_BACKUP_FAILURE:
      return {
        ...state,
        backingUp: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
