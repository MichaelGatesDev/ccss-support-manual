export interface BackupState {
  backingUp: boolean;
  data: any | undefined,
  error: string | undefined;
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
  data: any;
}

interface PerformBackupActionFailure {
  type: typeof PERFORM_BACKUP_FAILURE;
  error: string;
}

export type BackupActionTypes = PerformBackupAction | PerformBackupActionSuccess | PerformBackupActionFailure;
