export enum SpreadsheetImportMode {
    /**
     * Overwrites any matching data and appends any extra
     */
    OverwriteAndAppend,
    /**
     * Clears any existing data and writes data
     */
    ClearAndWrite,
    /**
     * Only adds non-matching data
     */
    Append,
}