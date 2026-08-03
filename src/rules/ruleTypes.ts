import powerbi from "powerbi-visuals-api";

export type RuleDisplayMode = "value" | "pill" | "bar" | "icon";
export type RuleOperator =
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "notBetween";
export type RuleStrategy =
    | "custom"
    | "automatic"
    | "positiveNegative"
    | "fieldValue";
export type IconPosition = "before" | "after" | "only";
export type LabelMarker = "none" | "circle" | "square" | "diamond" | "triangle";
export type BarStyle = "adjacent" | "cellFill";
export type BarPosition = "before" | "after" | "only";

export interface CustomIconAsset {
    id: string;
    name: string;
    format: "png" | "svg";
    dataUrl: string;
    originalDataUrl?: string;
    colorMode: "original" | "rule";
    autoCrop: boolean;
    safetyMargin: boolean;
    deleted?: boolean;
}

export interface IconPreferences {
    hiddenNativeIcons: string[];
    pickerSize: "compact" | "expanded";
    pickerIconSize: "normal" | "large";
    nativeIconOrder: string[];
}

export interface VisualRule {
    id: string;
    sourceQueryName: string;
    operator: RuleOperator;
    compareValue: string;
    compareValue2?: string;
    backgroundColor: string;
    textColor: string;
    followBackground: boolean;
    icon: string;
    iconColor: string;
    iconPosition: IconPosition;
    barColor: string;
}

export interface ColumnRuleSet {
    targetQueryName: string;
    enabled?: boolean;
    mode: RuleDisplayMode;
    strategy: RuleStrategy;
    rules: VisualRule[];
    defaultRule?: VisualRule;
    negativeColor: string;
    positiveColor: string;
    barTrackColor: string;
    barMinimum: number;
    barMaximum: number;
    iconSize?: "small" | "medium" | "large";
    iconPosition?: IconPosition;
    labelMarker?: LabelMarker;
    barStyle?: BarStyle;
    barPosition?: BarPosition;
}

export interface ResolvedRuleStyle {
    mode: RuleDisplayMode;
    backgroundColor?: string;
    textColor?: string;
    followBackground?: boolean;
    icon?: string;
    iconColor?: string;
    iconPosition?: IconPosition;
    iconSize?: "small" | "medium" | "large";
    labelMarker?: LabelMarker;
    barStyle?: BarStyle;
    barPosition?: BarPosition;
    barColor?: string;
    barTrackColor?: string;
    barMinimum?: number;
    barMaximum?: number;
}

export interface RuleColumn {
    queryName: string;
    displayName: string;
}

export interface RuleRow {
    values: powerbi.PrimitiveValue[];
    formattedValues: string[];
}
