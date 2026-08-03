import { TableModel, TableRow } from "../data/dataTypes";
import {
    ColumnRuleSet,
    CustomIconAsset,
    IconPreferences,
    ResolvedRuleStyle,
    RuleOperator,
    VisualRule
} from "./ruleTypes";

export function parseRuleSets(json: string | undefined): ColumnRuleSet[] {
    if (!json) {
        return [];
    }
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed)
            ? parsed.map((ruleSet: ColumnRuleSet) => ({
                ...ruleSet,
                enabled: ruleSet.enabled !== false,
                iconSize: ruleSet.iconSize || "medium",
                labelMarker: ruleSet.labelMarker || "circle",
                barStyle: ruleSet.barStyle || "adjacent",
                barPosition: ruleSet.barPosition || "before"
            }))
            : [];
    } catch {
        return [];
    }
}

export function serializeRuleSets(rules: ColumnRuleSet[]): string {
    return JSON.stringify(rules);
}

export function parseCustomIcons(json: string | undefined): CustomIconAsset[] {
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed)
            ? parsed.filter((asset): asset is CustomIconAsset =>
                Boolean(asset?.id && asset?.name && asset?.dataUrl) &&
                (asset.format === "png" || asset.format === "svg")
            )
            : [];
    } catch {
        return [];
    }
}

export function serializeCustomIcons(icons: CustomIconAsset[]): string {
    return JSON.stringify(icons);
}

export function parseIconPreferences(
    json: string | undefined
): IconPreferences {
    const fallback: IconPreferences = {
        hiddenNativeIcons: [],
        pickerSize: "expanded",
        pickerIconSize: "normal",
        nativeIconOrder: []
    };
    if (!json) return fallback;
    try {
        const parsed = JSON.parse(json);
        return {
            hiddenNativeIcons: Array.isArray(parsed?.hiddenNativeIcons)
                ? parsed.hiddenNativeIcons.filter(
                    (value: unknown): value is string =>
                        typeof value === "string"
                )
                : [],
            pickerSize: parsed?.pickerSize === "compact"
                ? "compact"
                : "expanded",
            pickerIconSize: parsed?.pickerIconSize === "large"
                ? "large"
                : "normal",
            nativeIconOrder: Array.isArray(parsed?.nativeIconOrder)
                ? parsed.nativeIconOrder.filter(
                    (value: unknown): value is string =>
                        typeof value === "string"
                )
                : []
        };
    } catch {
        return fallback;
    }
}

export function serializeIconPreferences(
    preferences: IconPreferences
): string {
    return JSON.stringify(preferences);
}

function compare(
    rawValue: unknown,
    formattedValue: string,
    operator: RuleOperator,
    compareValue: string,
    compareValue2: string | undefined,
    locale: string
): boolean {
    let rawNumber = typeof rawValue === "number"
        ? rawValue
        : Number(String(rawValue ?? "").replace(",", ".").replace("%", ""));
    const comparisonNumber = Number(
        compareValue.replace(",", ".").replace("%", "")
    );
    const comparisonNumber2 = Number(
        String(compareValue2 || "").replace(",", ".").replace("%", "")
    );
    const numeric =
        Number.isFinite(rawNumber) && Number.isFinite(comparisonNumber);
    if (numeric && compareValue.includes("%") && Math.abs(rawNumber) <= 1) {
        rawNumber *= 100;
    }
    const left = numeric
        ? rawNumber
        : formattedValue.trim().toLocaleLowerCase(locale);
    const right = numeric
        ? comparisonNumber
        : compareValue.trim().toLocaleLowerCase(locale);
    const right2 = numeric && Number.isFinite(comparisonNumber2)
        ? comparisonNumber2
        : String(compareValue2 || "").trim().toLocaleLowerCase(locale);
    switch (operator) {
        case "between":
            return left >= right && left <= right2;
        case "notBetween":
            return left < right || left > right2;
        case "neq":
            return left !== right;
        case "gt":
            return left > right;
        case "gte":
            return left >= right;
        case "lt":
            return left < right;
        case "lte":
            return left <= right;
        default:
            return left === right;
    }
}

function matchingRule(
    ruleSet: ColumnRuleSet,
    rule: VisualRule,
    row: TableRow,
    model: TableModel,
    locale: string
): boolean {
    const sourceIndex = model.columns.findIndex(
        (column) =>
            column.queryName ===
            (rule.sourceQueryName || ruleSet.targetQueryName)
    );
    if (sourceIndex >= 0) {
        return compare(
            row.values[sourceIndex],
            row.formattedValues[sourceIndex],
            rule.operator,
            rule.compareValue,
            rule.compareValue2,
            locale
        );
    }
    const auxiliaryIndex = model.ruleColumns.findIndex(
        (column) =>
            column.queryName ===
            (rule.sourceQueryName || ruleSet.targetQueryName)
    );
    if (auxiliaryIndex < 0) {
        return false;
    }
    return compare(
        row.ruleValues[auxiliaryIndex],
        row.formattedRuleValues[auxiliaryIndex],
        rule.operator,
        rule.compareValue,
        rule.compareValue2,
        locale
    );
}

export function resolveRuleStyle(
    ruleSets: ColumnRuleSet[],
    targetQueryName: string | undefined,
    row: TableRow,
    model: TableModel,
    locale: string
): ResolvedRuleStyle | undefined {
    if (!targetQueryName) {
        return undefined;
    }
    const ruleSet = ruleSets.find(
        (candidate) => candidate.targetQueryName === targetQueryName
    );
    if (!ruleSet) {
        return undefined;
    }
    if (ruleSet.enabled === false) {
        return undefined;
    }
    const targetIndex = model.columns.findIndex(
        (column) => column.queryName === targetQueryName
    );
    if (targetIndex < 0) {
        return undefined;
    }
    if (ruleSet.strategy === "automatic") {
        const text = row.formattedValues[targetIndex] || "";
        let hash = 0;
        for (let index = 0; index < text.length; index += 1) {
            hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
        }
        const hue = Math.abs(hash) % 360;
        return {
            mode: ruleSet.mode,
            backgroundColor: `hsl(${hue}, 72%, 90%)`,
            followBackground: true,
            labelMarker: ruleSet.labelMarker
        };
    }
    if (ruleSet.strategy === "fieldValue") {
        const firstRule = ruleSet.rules[0] || ruleSet.defaultRule;
        const sourceIndex = model.columns.findIndex(
            (column) =>
                column.queryName ===
                (firstRule?.sourceQueryName || targetQueryName)
        );
        const auxiliaryIndex = model.ruleColumns.findIndex(
            (column) =>
                column.queryName ===
                (firstRule?.sourceQueryName || targetQueryName)
        );
        const color = sourceIndex >= 0
            ? String(row.values[sourceIndex] ?? "")
            : auxiliaryIndex >= 0
                ? String(row.ruleValues[auxiliaryIndex] ?? "")
                : "";
        return {
            mode: ruleSet.mode,
            backgroundColor: color,
            textColor: firstRule?.followBackground
                ? firstRule.textColor
                : undefined,
            followBackground: firstRule?.followBackground,
            icon: firstRule?.icon,
            iconColor: color,
            iconPosition: ruleSet.iconPosition || firstRule?.iconPosition,
            iconSize: ruleSet.iconSize,
            labelMarker: ruleSet.labelMarker,
            barStyle: ruleSet.barStyle,
            barPosition: ruleSet.barPosition,
            barColor: color,
            barTrackColor: ruleSet.barTrackColor,
            barMinimum: ruleSet.barMinimum,
            barMaximum: ruleSet.barMaximum
        };
    }
    if (ruleSet.strategy === "positiveNegative") {
        const sourceQueryName =
            ruleSet.rules[0]?.sourceQueryName ||
            ruleSet.defaultRule?.sourceQueryName ||
            targetQueryName;
        const sourceIndex = model.columns.findIndex(
            (column) => column.queryName === sourceQueryName
        );
        const auxiliaryIndex = model.ruleColumns.findIndex(
            (column) => column.queryName === sourceQueryName
        );
        const rawValue = sourceIndex >= 0
            ? row.values[sourceIndex]
            : auxiliaryIndex >= 0
                ? row.ruleValues[auxiliaryIndex]
                : row.values[targetIndex];
        const numeric = Number(rawValue);
        const color = Number.isFinite(numeric) && numeric < 0
            ? ruleSet.negativeColor
            : ruleSet.positiveColor;
        return {
            mode: ruleSet.mode,
            backgroundColor: color,
            barColor: color,
            iconColor: color,
            barTrackColor: ruleSet.barTrackColor,
            barMinimum: ruleSet.barMinimum,
            barMaximum: ruleSet.barMaximum,
            labelMarker: ruleSet.labelMarker,
            barStyle: ruleSet.barStyle,
            barPosition: ruleSet.barPosition
        };
    }
    const rule = ruleSet.rules.find((candidate) =>
        matchingRule(ruleSet, candidate, row, model, locale)
    );
    const resolvedRule = rule || ruleSet.defaultRule;
    if (!resolvedRule) {
        return { mode: ruleSet.mode };
    }
    return {
        mode: ruleSet.mode,
        backgroundColor: resolvedRule.backgroundColor,
        textColor: resolvedRule.followBackground
            ? resolvedRule.textColor
            : undefined,
        followBackground: resolvedRule.followBackground,
        icon: resolvedRule.icon,
        iconColor: resolvedRule.iconColor,
        iconPosition: ruleSet.iconPosition || resolvedRule.iconPosition,
        iconSize: ruleSet.iconSize,
        labelMarker: ruleSet.labelMarker,
        barStyle: ruleSet.barStyle,
        barPosition: ruleSet.barPosition,
        barColor: resolvedRule.barColor,
        barTrackColor: ruleSet.barTrackColor,
        barMinimum: ruleSet.barMinimum,
        barMaximum: ruleSet.barMaximum
    };
}
