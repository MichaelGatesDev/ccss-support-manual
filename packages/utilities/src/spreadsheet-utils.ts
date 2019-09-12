import { ClassroomChecksSpreadsheetVersion, SpreadsheetType, TroubleshootingSpreadsheetVersion } from "@ccss-support-manual/models";
import { EnumUtils } from "@michaelgatesdev/common";

export class SpreadsheetUtils {

    private static ClassroomChecksSpreadsheetVersionPattern = /((Summer|Winter)\s20[0-9]{2})/gi;



    public static matchVersion(type: SpreadsheetType, str: string): ClassroomChecksSpreadsheetVersion | TroubleshootingSpreadsheetVersion {
        switch (type) {
            case SpreadsheetType.ClassroomChecks:
                return this.matchClassroomChecksVersion(str);
            case SpreadsheetType.Troubleshooting:
                return this.matchTroubleshootingVersion(str);
        }
    }

    public static matchClassroomChecksVersion(str: string): ClassroomChecksSpreadsheetVersion {
        const matches = str.match(this.ClassroomChecksSpreadsheetVersionPattern);
        if (matches === null || matches.length !== 1) throw new Error("No version match found for spreadsheet");
        const version = EnumUtils.parse(ClassroomChecksSpreadsheetVersion, matches[0]);
        if (version === undefined) throw new Error(`No classroom checks spreadsheet version match found in ${str}`);
        return version;
    }

    public static matchTroubleshootingVersion(_str: string): TroubleshootingSpreadsheetVersion {
        return TroubleshootingSpreadsheetVersion.Summer2019; //TODO update
    }

}