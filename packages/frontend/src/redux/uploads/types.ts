export interface UploadState {
  uploading: boolean;
}

// Describing the different ACTION NAMES available
export const UPLOAD_SPREADSHEET_TO_IMPORT = "UPLOAD_SPREADSHEET_TO_IMPORT";
export const UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS = "UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS";
export const UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE = "UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE";

interface UploadSpreadsheetToImportAction {
  type: typeof UPLOAD_SPREADSHEET_TO_IMPORT;
}

interface UploadSpreadsheetToImportSuccessAction {
  type: typeof UPLOAD_SPREADSHEET_TO_IMPORT_SUCCESS;
}

interface UploadSpreadsheetToImportFailureAction {
  type: typeof UPLOAD_SPREADSHEET_TO_IMPORT_FAILURE;
}

export type UploadActionTypes = UploadSpreadsheetToImportAction | UploadSpreadsheetToImportSuccessAction | UploadSpreadsheetToImportFailureAction;
