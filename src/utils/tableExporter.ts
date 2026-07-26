import * as JSZip from "jszip";

import { TableColumn, TableRow } from "../data/dataTypes";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function columnName(index: number): string {
    let result = "";
    let value = index + 1;
    while (value > 0) {
        value -= 1;
        result = String.fromCharCode(65 + value % 26) + result;
        value = Math.floor(value / 26);
    }
    return result;
}

function xlsxCell(
    value: string | number | boolean | Date | null | undefined,
    formattedValue: string,
    reference: string,
    header = false
): string {
    if (!header && typeof value === "number" && Number.isFinite(value)) {
        return `<c r="${reference}" s="0"><v>${value}</v></c>`;
    }
    const text = header ? formattedValue : formattedValue || String(value ?? "");
    return `<c r="${reference}" t="inlineStr" s="${header ? 1 : 0}">` +
        `<is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

export function createCsv(
    columns: TableColumn[],
    rows: TableRow[]
): string {
    const escapeCsv = (value: string): string =>
        `"${value.replace(/"/g, "\"\"")}"`;
    const lines = [
        columns.map((column) => escapeCsv(column.displayName)).join(";"),
        ...rows.map((row) =>
            row.formattedValues.map((value) => escapeCsv(value)).join(";")
        )
    ];
    return `\uFEFF${lines.join("\r\n")}`;
}

export async function createXlsxBase64(
    columns: TableColumn[],
    rows: TableRow[],
    sheetName: string
): Promise<string> {
    const zip = new JSZip();
    const safeSheetName = (sheetName || "Dados")
        .replace(/[\\/*?:[\]]/g, " ")
        .slice(0, 31) || "Dados";
    const sheetRows: string[] = [];
    const headerCells = columns.map((column, index) =>
        xlsxCell(
            column.displayName,
            column.displayName,
            `${columnName(index)}1`,
            true
        )
    ).join("");
    sheetRows.push(`<row r="1">${headerCells}</row>`);
    rows.forEach((row, rowIndex) => {
        const cells = columns.map((_, columnIndex) =>
            xlsxCell(
                row.values[columnIndex],
                row.formattedValues[columnIndex],
                `${columnName(columnIndex)}${rowIndex + 2}`
            )
        ).join("");
        sheetRows.push(`<row r="${rowIndex + 2}">${cells}</row>`);
    });
    const lastColumn = columnName(Math.max(0, columns.length - 1));
    const lastRow = Math.max(1, rows.length + 1);

    zip.file("[Content_Types].xml",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>');
    zip.folder("_rels")?.file(".rels",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>');
    zip.folder("xl")?.file("workbook.xml",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        `<sheets><sheet name="${escapeXml(safeSheetName)}" sheetId="1" r:id="rId1"/></sheets>` +
        '</workbook>');
    zip.folder("xl")?.folder("_rels")?.file("workbook.xml.rels",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '</Relationships>');
    zip.folder("xl")?.file("styles.xml",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>' +
        '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
        '<fills count="2"><fill><patternFill patternType="none"/></fill>' +
        '<fill><patternFill patternType="gray125"/></fill></fills>' +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
        '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
        '</styleSheet>');
    zip.folder("xl")?.folder("worksheets")?.file("sheet1.xml",
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        `<dimension ref="A1:${lastColumn}${lastRow}"/>` +
        `<sheetData>${sheetRows.join("")}</sheetData>` +
        `<autoFilter ref="A1:${lastColumn}${lastRow}"/>` +
        '</worksheet>');

    return zip.generateAsync({
        type: "base64",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
    });
}
