import Excel from "exceljs";
import { StringUtils } from "@michaelgatesdev/common";

export class ExcelJSUtils {

    public static generateColumnHeaders(sheet: Excel.Worksheet, headerRowIndex: number): void {
        let row = sheet.getRow(headerRowIndex);
        if (row === null || !row.values || !row.values.length) return;

        let headers: string[] = [];
        for (let i = 1; i < row.values.length; i++) {
            let cell = row.getCell(i);
            headers.push(cell.text);
        }

        const numCols = sheet.actualColumnCount;
        for (let i = 0; i < numCols; i++) {
            sheet.getColumn(i + 1).key = headers[i].toLocaleLowerCase();
            // console.debug(`Column ${i + 1} key is ${headers[i]}`);
        }
    }


    public static loadSingleColumnValues(sheet: Excel.Worksheet): string[] {
        let values: string[] = [];
        sheet.eachRow({ includeEmpty: false }, (row: Excel.Row): void => {
            let type = row.getCell(1).text;
            if (type && !StringUtils.isBlank(type) && !values.includes(type)) {
                values.push(type);
            }
        });
        return values;
    }
}