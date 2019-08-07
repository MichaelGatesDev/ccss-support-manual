import { GoogleSpreadsheetConfig } from "./GoogleSpreadsheetConfig";

export class ClassroomChecksSpreadsheetConfig extends GoogleSpreadsheetConfig {

    public buildingsSheetName: string = "Buildings";
    public buildingsSheetHeaderRow: number = 1;
    public buildingsOfficialNameHeader: string = "Official Name";
    public buildingsNicknamesHeader: string = "Nicknames";

    public roomsSheetName: string = "Rooms";
    public roomsSheetHeaderRow: number = 1;

    public roomsTimestampHeader: string = "Timestamp";
    // lookup would be in this row but it's useless outside of the spreadsheet
    public roomsBuildingHeader: string = "Building";
    public roomsNumberHeader: string = "Number";
    public roomsNameHeader: string = "Name";
    public roomsTypeHeader: string = "Type";
    public roomsLockTypeHeader: string = "Lock Type";
    public roomsCapacityHeader: string = "Capacity";

    public roomsPhoneStatusHeader: string = "Phone Status";
    public roomsPhoneExtensionHeader: string = "Phone Extension";
    public roomsPhoneDisplayStatusHeader: string = "Phone Display";
    public roomsPhoneSpeakerStatusHeader: string = "Phone Speaker";

    public roomsVideoOutputStatusHeader: string = "Video Output Status";
    public roomsVideoOutputTypeHeader: string = "Video Output Type";

    public roomsAudioStatusHeader: string = "Audio Status";
    public roomsAudioRequiresSystemHeader: string = "Audio Requires System";
    public roomsAudioSpeakersTypeHeader: string = "Audio Speakers Type";

    public roomsScreenStatusHeader: string = "Screen Status";

    public roomsTeachingStationTypeHeader: string = "Teaching Station Type";
    public roomsTeachingStationComputerStatusHeader: string = "Teaching Station Computer Status";
    public roomsTeachingStationComputerTypeHeader: string = "Teaching Station Computer Type";
    public roomsTeachingStationComputerOperatingSystemHeader: string = "Teaching Station Computer Operating System";
    public roomsTeachingStationComputerCameraStatusHeader: string = "Teaching Station Computer Camera ";

    public roomsDocumentCameraStatusHeader: string = "Document Camera Status";

    public roomsDVDPlayerStatusHeader: string = "DVD Player Status";
    public roomsDVDPlayerTypeHeader: string = "DVD Player Type";

    public roomsPrinterStatusHeader: string = "Printer Status";
    public roomsPrinterSymquestNumberHeader: string = "Printer SymQuest Number";
    public roomsPrinterCartridgeTypeHeader: string = "Printer Cartridge Type";

    public roomsFurnitureTypeHeader: string = "Furniture Type";
    public roomsDeskCountHeader: string = "Desk Count";
    public roomsTableCountHeader: string = "Table Count";
    public roomsChairCountHeader: string = "Chair Count";

    public roomsNotesHeader: string = "Misc Notes";
}