export interface ImportState {
  importing: boolean;
  data: any | undefined,
  error: string | undefined;
}

// Describing the different ACTION NAMES available
export const IMPORT_SPREADSHEET = "IMPORT_SPREADSHEET";
export const IMPORT_SPREADSHEET_SUCCESS = "IMPORT_SPREADSHEET_SUCCESS";
export const IMPORT_SPREADSHEET_FAILURE = "IMPORT_SPREADSHEET_FAILURE";

interface ImportSpreadsheetAction {
  type: typeof IMPORT_SPREADSHEET;
}

interface ImportSpreadsheetSuccessAction {
  type: typeof IMPORT_SPREADSHEET_SUCCESS;
  data: any;
}

interface ImportSpreadsheetFailureAction {
  type: typeof IMPORT_SPREADSHEET_FAILURE;
  error: string;
}

export type ImportActionTypes = ImportSpreadsheetAction | ImportSpreadsheetSuccessAction | ImportSpreadsheetFailureAction;
