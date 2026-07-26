import powerbi from "powerbi-visuals-api";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

export function formatValue(
    value: powerbi.PrimitiveValue,
    format: string | undefined,
    locale: string,
    isDateTime = false
): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (isDateTime && value instanceof Date) {
        const dateFormat = (format || "").trim();
        if (/^(d|short date)$/i.test(dateFormat)) {
            return new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }).format(value);
        }
        if (/^(g|general date|short date\/time)$/i.test(dateFormat)) {
            return new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }).format(value);
        }
        const paddedFormat = dateFormat
            .replace(/(?<![A-Za-z])M(?![A-Za-z])/g, "MM")
            .replace(/(?<![A-Za-z])d(?![A-Za-z])/g, "dd");
        return valueFormatter.format(
            value,
            paddedFormat || format,
            true,
            locale
        );
    }

    return valueFormatter.format(value, format, true, locale);
}
