import powerbi from "powerbi-visuals-api";

export interface TableColumn {
    displayName: string;
    queryName?: string;
    isNumeric: boolean;
    isDateTime: boolean;
    format?: string;
    sourceIndex: number;
    filterTarget?: { table: string; column: string };
    explicitOrder: number;
    style: ColumnStyle;
}

export interface ColumnStyle {
    cellMode: string;
    textColor: string;
    backgroundColor: string;
    customTextColor: boolean;
    customBackgroundColor: boolean;
    hasRowTextColor: boolean;
    hasRowBackgroundColor: boolean;
    hasRowPillFunctionColor: boolean;
    alignment: string;
    iconStyle: string;
    iconColor: string;
    iconLayout: string;
    cellPadding: number;
    headerPadding: number;
    headerFontSize: number;
    headerTextColor: string;
    headerBackgroundColor: string;
    headerAlignment: string;
    customCellPadding: boolean;
    customHeaderPadding: boolean;
    customHeaderFontSize: boolean;
    customHeaderTextColor: boolean;
    customHeaderBackgroundColor: boolean;
    customHeaderAlignment: boolean;
    pillRadius: number;
    pillRandomColors: boolean;
    pillPositiveNegative: boolean;
    pillNegativeColor: string;
    pillPositiveColor: string;
    pillTextFollowsBackground: boolean;
    pillColorMode: string;
    pillFunctionColor: string;
    pillValues: string[];
    pillColors: string[];
    pillTextColors: string[];
    barMinimum: number;
    barMaximum: number;
    barThreshold: number;
    barLowColor: string;
    barHighColor: string;
    barTrackColor: string;
    barWidth: number;
    barHeight: number;
    totalAggregation: string;
    showColumnTotal: boolean;
    totalAlignment: string;
    totalFontSize: number;
    svgBackgroundColor: string;
    svgTextColor: string;
    svgBorderColor: string;
    svgRadius: number;
}

export interface TableRow {
    sourceIndex: number;
    values: powerbi.PrimitiveValue[];
    formattedValues: string[];
    ruleValues: powerbi.PrimitiveValue[];
    formattedRuleValues: string[];
    searchText: string;
    searchTexts: string[];
    cellStyles: ColumnStyle[];
    selectionId: powerbi.visuals.ISelectionId;
}

export interface TableModel {
    columns: TableColumn[];
    ruleColumns: TableColumn[];
    rows: TableRow[];
    source: powerbi.DataViewTable;
}
