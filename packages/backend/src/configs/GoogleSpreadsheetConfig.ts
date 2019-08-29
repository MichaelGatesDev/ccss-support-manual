import { ConfigBase } from "cardboard-config";

export abstract class GoogleSpreadsheetConfig extends ConfigBase {
    public docID: string;
    public sheetPath: string;

    public constructor(configPath: string, docID: string, sheetPath: string) {
        super(configPath);
        this.docID = docID;
        this.sheetPath = sheetPath;
    }
}