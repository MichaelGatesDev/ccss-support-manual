import Excel from "exceljs";

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

}