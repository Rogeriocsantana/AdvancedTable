import powerbi from "powerbi-visuals-api";
import { formatValue } from "../utils/formatters";
import { ColumnStyle, TableColumn, TableModel, TableRow } from "./dataTypes";

import IVisualHost = powerbi.extensibility.visual.IVisualHost;

function objectString(
    object: powerbi.DataViewObject | undefined,
    property: string,
    fallback: string
): string {
    const value = object?.[property];
    return typeof value === "string" ? value : fallback;
}

function objectColor(
    object: powerbi.DataViewObject | undefined,
    property: string,
    fallback: string
): string {
    const value = object?.[property] as
        | string
        | {
            solid?: { color?: string };
            color?: string;
            value?: string;
        }
        | undefined;
    if (typeof value === "string") {
        return value;
    }
    return value?.solid?.color || value?.color || value?.value || fallback;
}

function objectBoolean(
    object: powerbi.DataViewObject | undefined,
    property: string,
    fallback = false
): boolean {
    const value = object?.[property];
    return typeof value === "boolean" ? value : fallback;
}

function hasObjectProperty(
    object: powerbi.DataViewObject | undefined,
    property: string
): boolean {
    return Boolean(object) &&
        Object.prototype.hasOwnProperty.call(object, property) &&
        object?.[property] !== undefined &&
        object?.[property] !== null;
}

function parseColumnStyle(
    object: powerbi.DataViewObject | undefined,
    fallback?: ColumnStyle
): ColumnStyle {
    return {
        cellMode: objectString(object, "cellMode", fallback?.cellMode || "value"),
        textColor: objectColor(
            object,
            "textColor",
            fallback?.textColor || "#242424"
        ),
        backgroundColor: objectColor(
            object,
            "backgroundColor",
            fallback?.backgroundColor || "rgba(0,0,0,0)"
        ),
        allowWidthReduction: objectBoolean(
            object,
            "allowWidthReduction",
            fallback?.allowWidthReduction ?? false
        ),
        reducedWidth: Math.max(
            60,
            Number(object?.reducedWidth ?? fallback?.reducedWidth ?? 140)
        ),
        customTextColor:
            hasObjectProperty(object, "textColor") ||
            fallback?.customTextColor ||
            false,
        customBackgroundColor:
            hasObjectProperty(object, "backgroundColor") ||
            fallback?.customBackgroundColor ||
            false,
        hasRowTextColor: fallback?.hasRowTextColor ?? false,
        hasRowBackgroundColor: fallback?.hasRowBackgroundColor ?? false,
        hasRowPillFunctionColor:
            fallback?.hasRowPillFunctionColor ?? false,
        alignment: objectString(
            object,
            "alignment",
            fallback?.alignment || "auto"
        ),
        iconStyle: objectString(
            object,
            "iconStyle",
            fallback?.iconStyle || "status"
        ),
        iconColor: objectColor(
            object,
            "iconColor",
            fallback?.iconColor || "#118DFF"
        ),
        iconLayout: objectString(
            object,
            "iconLayout",
            fallback?.iconLayout || "left"
        ),
        cellPadding: Number(object?.cellPadding ?? fallback?.cellPadding ?? 12),
        headerPadding: Number(object?.headerPadding ?? fallback?.headerPadding ?? 12),
        headerFontSize: Number(object?.headerFontSize ?? fallback?.headerFontSize ?? 12),
        headerTextColor: objectColor(
            object,
            "headerTextColor",
            fallback?.headerTextColor || "#323130"
        ),
        headerBackgroundColor: objectColor(
            object,
            "headerBackgroundColor",
            fallback?.headerBackgroundColor || "#F5F5F5"
        ),
        headerAlignment: objectString(
            object,
            "headerAlignment",
            fallback?.headerAlignment || "auto"
        ),
        customCellPadding:
            object?.cellPadding !== undefined || Boolean(fallback?.customCellPadding),
        customHeaderPadding:
            object?.headerPadding !== undefined || Boolean(fallback?.customHeaderPadding),
        customHeaderFontSize:
            object?.headerFontSize !== undefined ||
            Boolean(fallback?.customHeaderFontSize),
        customHeaderTextColor:
            object?.headerTextColor !== undefined ||
            Boolean(fallback?.customHeaderTextColor),
        customHeaderBackgroundColor:
            object?.headerBackgroundColor !== undefined ||
            Boolean(fallback?.customHeaderBackgroundColor),
        customHeaderAlignment:
            object?.headerAlignment !== undefined ||
            Boolean(fallback?.customHeaderAlignment),
        pillRadius: Number(object?.pillRadius ?? fallback?.pillRadius ?? 8),
        pillRandomColors: objectBoolean(
            object,
            "pillRandomColors",
            fallback?.pillRandomColors ?? true
        ),
        pillPositiveNegative: objectBoolean(
            object,
            "pillPositiveNegative",
            fallback?.pillPositiveNegative ?? false
        ),
        pillNegativeColor: objectColor(
            object,
            "pillNegativeColor",
            fallback?.pillNegativeColor || "#FEE2E2"
        ),
        pillPositiveColor: objectColor(
            object,
            "pillPositiveColor",
            fallback?.pillPositiveColor || "#DCFCE7"
        ),
        pillTextFollowsBackground: objectBoolean(
            object,
            "pillTextFollowsBackground",
            fallback?.pillTextFollowsBackground ?? true
        ),
        pillColorMode: objectString(
            object,
            "pillColorMode",
            fallback?.pillColorMode || "random"
        ),
        pillFunctionColor: objectColor(
            object,
            "pillFunctionColor",
            fallback?.pillFunctionColor || "#DCFCE7"
        ),
        pillValues: [1, 2, 3, 4].map((index) =>
            objectString(
                object,
                `pillValue${index}`,
                fallback?.pillValues?.[index - 1] || ""
            )
        ),
        pillColors: [1, 2, 3, 4].map((index) =>
            objectColor(
                object,
                `pillColor${index}`,
                fallback?.pillColors?.[index - 1] ||
                    ["#DCFCE7", "#FEF3C7", "#DBEAFE", "#FEE2E2"][index - 1]
            )
        ),
        pillTextColors: [1, 2, 3, 4].map((index) =>
            objectColor(
                object,
                `pillTextColor${index}`,
                fallback?.pillTextColors?.[index - 1] || "#242424"
            )
        ),
        barMinimum: Number(object?.barMinimum ?? fallback?.barMinimum ?? 0),
        barMaximum: Number(object?.barMaximum ?? fallback?.barMaximum ?? 100),
        barThreshold: Number(object?.barThreshold ?? fallback?.barThreshold ?? 50),
        barLowColor: objectColor(
            object,
            "barLowColor",
            fallback?.barLowColor || "#F04444"
        ),
        barHighColor: objectColor(
            object,
            "barHighColor",
            fallback?.barHighColor || "#20BF6B"
        ),
        barTrackColor: objectColor(
            object,
            "barTrackColor",
            fallback?.barTrackColor || "#E2E8F0"
        ),
        barWidth: Number(object?.barWidth ?? fallback?.barWidth ?? 56),
        barHeight: Number(object?.barHeight ?? fallback?.barHeight ?? 7),
        totalAggregation: objectString(
            object,
            "totalAggregation",
            fallback?.totalAggregation || "none"
        ),
        showColumnTotal: objectBoolean(
            object,
            "showColumnTotal",
            fallback?.showColumnTotal ?? true
        ),
        totalAlignment: objectString(
            object,
            "totalAlignment",
            fallback?.totalAlignment || "auto"
        ),
        totalFontSize: Number(
            object?.totalFontSize ?? fallback?.totalFontSize ?? 0
        ),
        svgBackgroundColor: objectColor(
            object,
            "svgBackgroundColor",
            fallback?.svgBackgroundColor || "#E8F1FF"
        ),
        svgTextColor: objectColor(
            object,
            "svgTextColor",
            fallback?.svgTextColor || "#2457C5"
        ),
        svgBorderColor: objectColor(
            object,
            "svgBorderColor",
            fallback?.svgBorderColor || "#B4C7E7"
        ),
        svgRadius: Number(object?.svgRadius ?? fallback?.svgRadius ?? 8)
    };
}

function normalizedColumnName(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLocaleLowerCase("pt-BR");
}

function applyDefaultColumnProfile(
    displayName: string,
    object: powerbi.DataViewObject | undefined,
    style: ColumnStyle
): ColumnStyle {
    const name = normalizedColumnName(displayName);
    const reducedWidths: Record<string, number> = {
        paciente: 255,
        "medico atendimento": 225,
        "medico protocolo": 195,
        "classificacao final": 195
    };
    const centeredColumns = new Set([
        "elegivel",
        "fin",
        "re-int",
        "lab",
        "gaso"
    ]);
    const reducedWidth = reducedWidths[name];
    if (reducedWidth !== undefined &&
        !hasObjectProperty(object, "allowWidthReduction")) {
        style.allowWidthReduction = true;
        style.reducedWidth = reducedWidth;
    }
    if ((name === "paciente" || centeredColumns.has(name)) &&
        !hasObjectProperty(object, "alignment")) {
        style.alignment = name === "paciente" ? "left" : "center";
    }
    if (name === "paciente" &&
        !hasObjectProperty(object, "headerAlignment")) {
        style.headerAlignment = "left";
    }
    return style;
}

function findFilterTarget(
    expr: powerbi.data.ISQExpr | undefined,
    queryName: string | undefined
): { table: string; column: string } | undefined {
    const visit = (value: unknown): { table: string; column: string } | undefined => {
        if (!value || typeof value !== "object") {
            return undefined;
        }
        const node = value as Record<string, unknown>;
        const ref = typeof node.ref === "string" ? node.ref : undefined;
        const source = node.source as Record<string, unknown> | undefined;
        const entity = typeof source?.entity === "string"
            ? source.entity
            : typeof node.entity === "string"
                ? node.entity
                : undefined;
        if (ref && entity) {
            return { table: entity, column: ref };
        }
        for (const child of Object.values(node)) {
            const found = visit(child);
            if (found) {
                return found;
            }
        }
        return undefined;
    };
    const fromExpression = visit(expr);
    if (fromExpression) {
        return fromExpression;
    }
    if (!queryName) {
        return undefined;
    }
    const bracketMatch = queryName.match(/^'?(.+?)'?\[([^\]]+)\]$/);
    if (bracketMatch) {
        return { table: bracketMatch[1], column: bracketMatch[2] };
    }
    const separator = queryName.lastIndexOf(".");
    return separator > 0
        ? {
            table: queryName.slice(0, separator).replace(/^'|'$/g, ""),
            column: queryName.slice(separator + 1).replace(/^'|'$/g, "")
        }
        : undefined;
}

function normalizeColumnValue(
    value: powerbi.PrimitiveValue,
    isDateTime: boolean
): powerbi.PrimitiveValue {
    if (!isDateTime || value instanceof Date || typeof value !== "string") {
        return value;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
}

export function parseTable(
    dataView: powerbi.DataView | undefined,
    host: IVisualHost,
    locale: string
): TableModel | null {
    const table = dataView?.table;
    if (!table || table.columns.length === 0) {
        return null;
    }

    const metadataOrder = new Map(
        (dataView?.metadata.columns || []).map((column, index) => [
            column.queryName || "",
            index
        ])
    );
    const visibleIndexes = table.columns
        .map((column, index) => column.roles?.columns ? index : -1)
        .filter((index) => index >= 0)
        .sort((left, right) => {
            const leftColumn = table.columns[left];
            const rightColumn = table.columns[right];
            type RoleIndexedColumn = powerbi.DataViewMetadataColumn & {
                rolesIndex?: { columns?: number[] };
            };
            const leftRoleIndex =
                (leftColumn as RoleIndexedColumn).rolesIndex?.columns?.[0];
            const rightRoleIndex =
                (rightColumn as RoleIndexedColumn).rolesIndex?.columns?.[0];
            return (
                (leftRoleIndex ??
                    leftColumn.index ??
                    metadataOrder.get(leftColumn.queryName || "") ??
                    left) -
                (rightRoleIndex ??
                    rightColumn.index ??
                    metadataOrder.get(rightColumn.queryName || "") ??
                    right)
            );
        });
    const ruleIndexes = table.columns
        .map((column, index) => column.roles?.ruleFields ? index : -1)
        .filter((index) => index >= 0);
    const toTableColumn = (sourceIndex: number): TableColumn => {
        const column = table.columns[sourceIndex];
        const styleObject = column.objects?.columnStyle;
        const style = applyDefaultColumnProfile(
            column.displayName,
            styleObject,
            parseColumnStyle(styleObject)
        );
        return {
            displayName: column.displayName,
            queryName: column.queryName,
            isNumeric: Boolean(column.type?.numeric || column.type?.integer),
            isDateTime: Boolean(column.type?.dateTime),
            format: column.format,
            sourceIndex,
            explicitOrder: Number(styleObject?.columnOrder ?? -1),
            filterTarget: findFilterTarget(column.expr, column.queryName),
            style
        };
    };
    const columns: TableColumn[] = visibleIndexes.map((sourceIndex) => {
        return toTableColumn(sourceIndex);
    });
    const ruleColumns = ruleIndexes.map(toTableColumn);
    const rows: TableRow[] = table.rows.map((sourceValues, sourceIndex) => {
        const values = columns.map((column) =>
            normalizeColumnValue(
                sourceValues[column.sourceIndex],
                column.isDateTime
            )
        );
        const ruleValues = ruleColumns.map((column) =>
            normalizeColumnValue(
                sourceValues[column.sourceIndex],
                column.isDateTime
            )
        );
        const formattedRuleValues = ruleColumns.map((column, columnIndex) =>
            formatValue(
                ruleValues[columnIndex],
                column.format,
                locale,
                column.isDateTime
            )
        );
        const formattedValues = columns.map((column, columnIndex) =>
            formatValue(
                values[columnIndex],
                column.format,
                locale,
                column.isDateTime
            )
        );
        const searchTexts = formattedValues.map((value) =>
            value.toLocaleLowerCase(locale)
        );
        const cellStyles = columns.map((column) => {
            const cellObjects = sourceValues.objects?.[column.sourceIndex];
            const rowObject =
                cellObjects?.columnStyle ||
                (cellObjects as unknown as powerbi.DataViewObject | undefined);
            const style = parseColumnStyle(rowObject, column.style);
            style.hasRowTextColor = hasObjectProperty(rowObject, "textColor");
            style.hasRowBackgroundColor =
                hasObjectProperty(rowObject, "backgroundColor");
            style.hasRowPillFunctionColor =
                hasObjectProperty(rowObject, "pillFunctionColor");
            const elementBase = table.columns[column.sourceIndex]
                .objects?.cellElements;
            const elementRow = sourceValues.objects?.[column.sourceIndex]
                ?.cellElements;
            if (objectBoolean(elementBase, "backgroundEnabled")) {
                style.backgroundColor = objectColor(
                    elementRow,
                    "backgroundColor",
                    objectColor(elementBase, "backgroundColor", style.backgroundColor)
                );
                style.customBackgroundColor = true;
            }
            if (objectBoolean(elementBase, "fontEnabled")) {
                style.textColor = objectColor(
                    elementRow,
                    "fontColor",
                    objectColor(elementBase, "fontColor", style.textColor)
                );
                style.customTextColor = true;
            }
            if (objectBoolean(elementBase, "iconsEnabled")) {
                style.iconColor = objectColor(
                    elementRow,
                    "iconColor",
                    objectColor(elementBase, "iconColor", style.iconColor)
                );
                style.iconStyle = objectString(
                    elementBase,
                    "iconStyle",
                    style.iconStyle
                );
                style.iconLayout = objectString(
                    elementBase,
                    "iconLayout",
                    "left"
                );
                style.cellMode = style.iconLayout === "only"
                    ? "icon"
                    : "iconValue";
                if (objectBoolean(elementBase, "iconRuleEnabled")) {
                    const ruleQueryName = objectString(
                        elementBase,
                        "iconRuleField",
                        column.queryName || ""
                    );
                    const ruleColumn = columns.find(
                        (candidate) => candidate.queryName === ruleQueryName
                    ) || column;
                    const rawRuleValue = Number(
                        sourceValues[ruleColumn.sourceIndex]
                    );
                    const threshold = Number(elementBase?.iconThreshold ?? 50);
                    const comparableValue =
                        Number.isFinite(rawRuleValue) &&
                        Math.abs(rawRuleValue) <= 1 &&
                        Math.abs(threshold) > 1
                            ? rawRuleValue * 100
                            : rawRuleValue;
                    const above = Number.isFinite(comparableValue) &&
                        comparableValue >= threshold;
                    style.iconStyle = objectString(
                        elementBase,
                        above ? "iconAboveStyle" : "iconBelowStyle",
                        "circle"
                    );
                    style.iconColor = objectColor(
                        elementBase,
                        above ? "iconAboveColor" : "iconBelowColor",
                        above ? "#21A366" : "#E53935"
                    );
                }
            }
            return style;
        });

        return {
            sourceIndex,
            values,
            formattedValues,
            ruleValues,
            formattedRuleValues,
            searchText: formattedValues.join(" ").toLocaleLowerCase(locale),
            searchTexts,
            cellStyles,
            selectionId: host.createSelectionIdBuilder()
                .withTable(table, sourceIndex)
                .createSelectionId()
        };
    });

    return { columns, ruleColumns, rows, source: table };
}
