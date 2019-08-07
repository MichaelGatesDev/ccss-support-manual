import { GoogleSpreadsheetConfig } from "./GoogleSpreadsheetConfig";

export class TroubleshootingSpreadsheetConfig extends GoogleSpreadsheetConfig {
    public troubleshootingSheetName: string = "Troubleshooting";
    public troubleshootingSheetHeaderRow: number = 1;
    public troubleshootingTitleHeader: string = "Incident";
    public troubleshootingDescriptionHeader: string = "Description";
    public troubleshootingSolutionHeader: string = "Solution";
    public troubleshootingTypesHeader: string = "Types";
    public troubleshootingTagsHeader: string = "Tags";
    public troubleshootingWhitelistedRoomsHeader: string = "Whitelisted Rooms";
    public troubleshootingBlacklistedRoomsHeader: string = "Blacklisted Rooms";
}