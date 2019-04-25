import { PrimarySpreadsheetConfig, SecondarySpreadsheetConfig } from "./models/Config";

class ConfigManager {

    private primarySpreadsheetConfig: PrimarySpreadsheetConfig;
    private secondarySpreadsheetConfig: SecondarySpreadsheetConfig;

    constructor(primarySpreadsheetConfig: PrimarySpreadsheetConfig, secondarySpreadsheetConfig: SecondarySpreadsheetConfig) {
        this.primarySpreadsheetConfig = primarySpreadsheetConfig;
        this.secondarySpreadsheetConfig = secondarySpreadsheetConfig;
    }

    public getPrimarySpreadsheetConfig() {
        return this.primarySpreadsheetConfig;
    }

    public getSecondarySpreadsheetConfig() {
        return this.secondarySpreadsheetConfig;
    }
}

export {
    ConfigManager
}