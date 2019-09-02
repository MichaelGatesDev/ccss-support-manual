import { Logger, StringUtils, FileUtils } from '@michaelgatesdev/common';
import XLSX from "xlsx";

import { app } from "./app"

export class SpreadsheetManager {

    public async initialize(): Promise<void> {

        // if (app.configManager.appConfig !== undefined) {
        //     if (app.configManager.appConfig.checkForDataUpdates) {
        //         await this.checkForUpdates();
        //     }
        // }

        // load data from classroom checks spreadsheet
        // try {
        //     Logger.info("Loading classroom checks spreadsheet...");
        //     await this.loadClassroomChecksSpreadsheet();
        //     Logger.info("Finished loading classroom checks spreadsheet");
        // } catch (error) {
        //     Logger.error("There was an error loading the classroom checks spreadsheet");
        //     Logger.error(error);
        //     return;
        // }

        // load data from troubleshoting spreadsheet
        // try {
        //     await this.loadTroubleshootingDataSpreadsheet();
        //     Logger.info("Loaded troubleshooting data spreadsheet");
        // } catch (error) {
        //     Logger.error("There was an error loading the troubleshooting data spreadsheet");
        //     Logger.error(error);
        //     return;
        // }


        // const classroomChecksSpreadsheetPath = `${app.DATA_DIR}/classroom-checks.xlsx`;
        // if (await FileUtils.checkExists(classroomChecksSpreadsheetPath)) {
        //     if (await SpreadsheetManager.convertSpreadsheetToJson(classroomChecksSpreadsheetPath)) {
        //         Logger.info("Converted classroom checks sheet to json");
        //     }
        // }
    }

    public static async convertSpreadsheetToJson(path: string): Promise<boolean> {
        if (!await FileUtils.checkExists(path)) return false;

        const workbook = XLSX.readFile(path);
        const sheets = workbook.SheetNames;

        sheets.forEach(async (sheet: string): Promise<void> => {
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            const path = `${app.DATA_DIR}/${StringUtils.internalize(sheet.toLocaleLowerCase())}.json`;
            const writeResult = await FileUtils.writeJSON(path, json);
            if (writeResult) {
                Logger.info(`Wrote sheet '${sheet}' to file ${sheet}.json`);
            }
        });

        return false;
    }

}