export interface UploadState {
  uploading: boolean;
}

// Describing the different ACTION NAMES available
export const UPLOAD_SPREADSHEET_TO_IMPORT = "UPLOAD_SPREADSHEET_TO_IMPORT";

interface UploadSpreadsheetToImportAction {
  type: typeof UPLOAD_SPREADSHEET_TO_IMPORT;
}

export type UploadActionTypes = UploadSpreadsheetToImportAction;
