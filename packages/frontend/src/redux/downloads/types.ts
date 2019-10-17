export interface DownloadState {
  downloading: boolean;
}

// Describing the different ACTION NAMES available
export const DOWNLOAD_SPREADSHEET_TO_IMPORT = "DOWNLOAD_SPREADSHEET_TO_IMPORT";

interface DownloadSpreadsheetToImportAction {
  type: typeof DOWNLOAD_SPREADSHEET_TO_IMPORT;
}

export type DownloadActionTypes = DownloadSpreadsheetToImportAction;
