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

function parseColorValue(value: unknown, fallback: string): string {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed && trimmed !== "transparent") {
            return trimmed;
        }
        return fallback;
    }
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const solidColor = (obj.solid as { color?: string } | undefined)?.color;
        if (typeof solidColor === "string" && solidColor.trim()) {
            return solidColor.trim();
        }
        const fillSolidColor = ((obj.fill as { solid?: { color?: string } } | undefined)?.solid)?.color;
        if (typeof fillSolidColor === "string" && fillSolidColor.trim()) {
            return fillSolidColor.trim();
        }
        if (typeof obj.color === "string" && obj.color.trim()) {
            return obj.color.trim();
        }
        if (typeof obj.value === "string" && obj.value.trim()) {
            return obj.value.trim();
        }
        for (const key of Object.keys(obj)) {
            const child = obj[key];
            if (typeof child === "string") {
                const c = child.trim();
                if (c.startsWith("#") || c.startsWith("rgb") || c.startsWith("hsl")) {
                    return c;
                }
            } else if (child && typeof child === "object") {
                const found = parseColorValue(child, "");
                if (found && found !== "transparent") {
                    return found;
                }
            }
        }
    }
    return fallback;
}

function objectColor(
    object: powerbi.DataViewObject | undefined,
    property: string,
    fallback: string
): string {
    if (!object) return fallback;
    return parseColorValue(object[property], fallback);
}

function extractColor(
    object: powerbi.DataViewObject | undefined,
    properties: string[],
    fallback: string
): string {
    if (!object) return fallback;
    for (const prop of properties) {
        if (hasObjectProperty(object, prop)) {
            const color = parseColorValue(object[prop], "");
            if (color && color !== "transparent") return color;
        }
    }
    return fallback;
}

function hasColorProperty(
    object: powerbi.DataViewObject | undefined,
    properties: string[]
): boolean {
    if (!object) return false;
    for (const prop of properties) {
        if (hasObjectProperty(object, prop)) {
            const color = parseColorValue(object[prop], "");
            if (color && color !== "transparent") return true;
        }
    }
    return false;
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
        textColor: extractColor(
            object,
            ["textColor", "fontColor", "color"],
            fallback?.textColor || "#242424"
        ),
        backgroundColor: extractColor(
            object,
            ["backgroundColor", "fill", "backColor"],
            fallback?.backgroundColor || "rgba(0,0,0,0)"
        ),
        allowWidthReduction: objectBoolean(
            object,
            "allowWidthReduction",
            fallback?.allowWidthReduction ?? false
        ),
        reducedWidth: Math.max(
            0,
            Number(object?.reducedWidth ?? fallback?.reducedWidth ?? 140)
        ),
        filterVisibility: objectString(
            object,
            "filterVisibility",
            fallback?.filterVisibility || "inherit"
        ),
        customTextColor:
            hasColorProperty(object, ["textColor", "fontColor", "color"]) ||
            fallback?.customTextColor ||
            false,
        customBackgroundColor:
            hasColorProperty(object, ["backgroundColor", "fill", "backColor"]) ||
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
        const colorFromField = (
            queryName: string,
            fallback: string
        ): string => {
            if (!queryName) {
                return fallback;
            }
            const visibleIndex = columns.findIndex(
                (candidate) => candidate.queryName === queryName
            );
            const ruleIndex = ruleColumns.findIndex(
                (candidate) => candidate.queryName === queryName
            );
            const raw = visibleIndex >= 0
                ? values[visibleIndex]
                : ruleIndex >= 0
                    ? ruleValues[ruleIndex]
                    : undefined;
            const color = typeof raw === "string" ? raw.trim() : "";
            return color || fallback;
        };
        const cellStyles = columns.map((column) => {
            const rawCellObjects = sourceValues.objects?.[column.sourceIndex];
            const columnStyleObj = rawCellObjects?.columnStyle as
                | powerbi.DataViewObject
                | undefined;
            const cellElementsObj = rawCellObjects?.cellElements as
                | powerbi.DataViewObject
                | undefined;
            const directObj = rawCellObjects as
                | powerbi.DataViewObject
                | undefined;

            const rowObject = columnStyleObj || directObj;
            const style = parseColumnStyle(rowObject, column.style);

            const rowTextColor =
                extractColor(columnStyleObj, ["textColor", "fontColor", "color"], "") ||
                extractColor(cellElementsObj, ["fontColor", "textColor", "color"], "") ||
                extractColor(directObj, ["textColor", "fontColor", "color"], "");

            if (rowTextColor) {
                style.textColor = rowTextColor;
                style.customTextColor = true;
                style.hasRowTextColor = true;
            } else {
                style.hasRowTextColor =
                    hasColorProperty(columnStyleObj, ["textColor", "fontColor", "color"]) ||
                    hasColorProperty(directObj, ["textColor", "fontColor", "color"]);
            }

            const rowBgColor =
                extractColor(columnStyleObj, ["backgroundColor", "fill", "backColor"], "") ||
                extractColor(cellElementsObj, ["backgroundColor", "fill", "backColor"], "") ||
                extractColor(directObj, ["backgroundColor", "fill", "backColor"], "");

            if (rowBgColor) {
                style.backgroundColor = rowBgColor;
                style.customBackgroundColor = true;
                style.hasRowBackgroundColor = true;
            } else {
                style.hasRowBackgroundColor =
                    hasColorProperty(columnStyleObj, ["backgroundColor", "fill", "backColor"]) ||
                    hasColorProperty(directObj, ["backgroundColor", "fill", "backColor"]);
            }

            const rowPillFuncColor =
                extractColor(columnStyleObj, ["pillFunctionColor"], "") ||
                extractColor(directObj, ["pillFunctionColor"], "");
            if (rowPillFuncColor) {
                style.pillFunctionColor = rowPillFuncColor;
                style.hasRowPillFunctionColor = true;
            } else {
                style.hasRowPillFunctionColor =
                    hasObjectProperty(rowObject, "pillFunctionColor");
            }

            const elementBase = table.columns[column.sourceIndex]
                .objects?.cellElements;
            const elementRow = cellElementsObj || directObj;

            const backgroundEnabled =
                objectBoolean(elementBase, "backgroundEnabled") ||
                Boolean(rowBgColor) ||
                hasColorProperty(elementRow, ["backgroundColor", "fill", "backColor"]);

            const fontEnabled =
                objectBoolean(elementBase, "fontEnabled") ||
                Boolean(rowTextColor) ||
                hasColorProperty(elementRow, ["fontColor", "textColor", "color"]);

            const iconsEnabled =
                objectBoolean(elementBase, "iconsEnabled") ||
                hasObjectProperty(elementRow, "iconColor");

            if (backgroundEnabled) {
                const bg = extractColor(
                    elementRow,
                    ["backgroundColor", "fill", "backColor"],
                    extractColor(elementBase, ["backgroundColor"], style.backgroundColor)
                );
                if (bg) {
                    style.backgroundColor = bg;
                    style.customBackgroundColor = true;
                    style.hasRowBackgroundColor = true;
                }
                style.backgroundColor = colorFromField(
                    objectString(elementBase, "backgroundColorField", ""),
                    style.backgroundColor
                );
            }

            if (fontEnabled) {
                const font = extractColor(
                    elementRow,
                    ["fontColor", "textColor", "color"],
                    extractColor(elementBase, ["fontColor", "textColor"], style.textColor)
                );
                if (font) {
                    style.textColor = font;
                    style.customTextColor = true;
                    style.hasRowTextColor = true;
                }
                style.textColor = colorFromField(
                    objectString(elementBase, "fontColorField", ""),
                    style.textColor
                );
            }
            if (iconsEnabled) {
                style.iconColor = objectColor(
                    elementRow,
                    "iconColor",
                    objectColor(elementBase, "iconColor", style.iconColor)
                );
                style.iconColor = colorFromField(
                    objectString(elementBase, "iconColorField", ""),
                    style.iconColor
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
