export interface BackupState {
  backingUp: boolean;
  error?: string;
}

// Describing the different ACTION NAMES available
export const PERFORM_BACKUP = "PERFORM_BACKUP";
export const PERFORM_BACKUP_SUCCESS = "PERFORM_BACKUP_SUCCESS";
export const PERFORM_BACKUP_FAILURE = "PERFORM_BACKUP_FAILURE";

interface PerformBackupAction {
  type: typeof PERFORM_BACKUP;
}

interface PerformBackupActionSuccess {
  type: typeof PERFORM_BACKUP_SUCCESS;
}
interface PerformBackupActionFailure {
  type: typeof PERFORM_BACKUP_FAILURE;
  payload: string;
}

export type BackupActionTypes = PerformBackupAction | PerformBackupActionSuccess | PerformBackupActionFailure;
