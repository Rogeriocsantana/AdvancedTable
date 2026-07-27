"use strict";

import powerbi from "powerbi-visuals-api";
import { BasicFilter } from "powerbi-models";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { dataViewWildcard } from "powerbi-visuals-utils-dataviewutils";
import "./../style/visual.less";

import { parseTable } from "./data/dataParser";
import { TableColumn, TableModel, TableRow } from "./data/dataTypes";
import { TableRenderer } from "./rendering/tableRenderer";
import { VisualFormattingSettingsModel } from "./settings";
import { createCsv, createXlsxBase64 } from "./utils/tableExporter";
import {
    parseCustomIcons,
    parseIconPreferences,
    parseRuleSets,
    serializeCustomIcons,
    serializeIconPreferences,
    serializeRuleSets
} from "./rules/ruleEngine";
import {
    ColumnRuleSet,
    CustomIconAsset,
    IconPreferences
} from "./rules/ruleTypes";

import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ITooltipService = powerbi.extensibility.ITooltipService;
import IDownloadService = powerbi.extensibility.IDownloadService;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

interface AdvanceTableConfigurationColumn {
    queryName: string;
    displayName: string;
    objects: Record<string, Record<string, unknown>>;
}

interface AdvanceTableConfiguration {
    format: "AdvanceTableConfiguration";
    schemaVersion: 1;
    visualGuid: string;
    visualVersion: string;
    exportedAt: string;
    objects: Record<string, Record<string, unknown>>;
    columns: AdvanceTableConfigurationColumn[];
}

const CONFIGURATION_OBJECTS = new Set([
    "table",
    "titleBar",
    "search",
    "download",
    "topLayout",
    "ruleEditor",
    "header",
    "selection",
    "columnStyle"
]);

export class Visual implements IVisual {
    private readonly host: IVisualHost;
    private readonly events: IVisualEventService;
    private readonly selectionManager: ISelectionManager;
    private readonly tooltipService: ITooltipService;
    private readonly downloadService: IDownloadService;
    private readonly renderer: TableRenderer;
    private readonly formattingService = new FormattingSettingsService();
    private formattingSettings = new VisualFormattingSettingsModel();
    private currentDataView?: powerbi.DataView;
    private model: TableModel | null = null;
    private filteredRows: TableRow[] = [];
    private sortQueryName?: string;
    private sortDirection?: "asc" | "desc";
    private selectedKeys = new Set<string>();
    private searchTimer?: number;
    private searchSelectionActive = false;
    private readonly columnFilters = new Map<string, Set<string>>();
    private currentPage = 1;
    private ruleSets: ColumnRuleSet[] = [];
    private customIcons: CustomIconAsset[] = [];
    private iconPreferences: IconPreferences = {
        hiddenNativeIcons: [],
        pickerSize: "expanded",
        pickerIconSize: "normal",
        nativeIconOrder: []
    };

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.events = options.host.eventService;
        this.selectionManager = options.host.createSelectionManager();
        this.tooltipService = options.host.tooltipService;
        this.downloadService = options.host.downloadService;
        this.renderer = new TableRenderer(options.element);
        this.renderer.setCallbacks({
            onSearch: (index, value) => this.applySearchInput(index, value),
            onRowClick: (row, multiSelect) => this.selectRow(row, multiSelect),
            onCheckboxClick: (row) => this.toggleRow(row),
            onSelectAll: (rows, select) => this.selectAll(rows, select),
            onRowEnter: (event, row) => this.showTooltip(event, row),
            onRowMove: (event, row) => this.moveTooltip(event, row),
            onRowLeave: () => this.hideTooltip(),
            onSort: (column, direction) => this.sortBy(column, direction),
            onColumnFilter: (column, values) =>
                this.applyColumnFilter(column, values),
            onClearColumnFilter: (queryName) =>
                this.clearColumnFilter(queryName),
            onClearSelection: () => this.clearSelection(),
            onPageChange: (page) => this.changePage(page),
            onDownload: (scope, format, fileName) =>
                this.downloadTable(scope, format, fileName),
            onSaveRules: (rules) => this.saveRules(rules),
            onSaveCustomIcons: (icons) => this.saveCustomIcons(icons),
            onSaveIconPreferences: (preferences) =>
                this.saveIconPreferences(preferences),
            onExportConfiguration: () => this.exportConfiguration(),
            onImportConfiguration: (contents) =>
                this.importConfiguration(contents),
            onOpenRuleEditor: () => {
                this.host.switchFocusModeState(true);
                window.setTimeout(() => this.renderer.openRuleEditor(), 120);
            }
        });
    }

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        try {
            const dataView = options.dataViews?.[0];
            this.currentDataView = dataView;
            this.formattingSettings = this.formattingService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                dataView
            );
            this.model = parseTable(dataView, this.host, this.host.locale || "pt-BR");
            this.ruleSets = parseRuleSets(
                this.readObjectString(
                    dataView?.metadata.objects?.ruleEditor,
                    "rulesJson"
                )
            );
            this.customIcons = parseCustomIcons(
                this.readObjectString(
                    dataView?.metadata.objects?.ruleEditor,
                    "iconsJson"
                )
            );
            this.iconPreferences = parseIconPreferences(
                this.readObjectString(
                    dataView?.metadata.objects?.ruleEditor,
                    "iconPreferencesJson"
                )
            );
            const searchObjects = dataView?.metadata.objects?.search;
            const columnStyleObjects = dataView?.metadata.objects?.columnStyle;
            const cellElementObjects = dataView?.metadata.objects?.cellElements;
            this.configureSearchFields(
                this.readObjectString(searchObjects, "field1"),
                this.readObjectString(searchObjects, "field2")
            );
            this.configureColumnSettings(
                this.readObjectString(columnStyleObjects, "selectedColumn")
            );
            this.configureCellElementSettings(
                this.readObjectString(cellElementObjects, "selectedSeries")
            );
            this.applySearch(this.renderer.getSearchTexts(), false);
            this.events.renderingFinished(options);
        } catch (error) {
            this.events.renderingFailed(options, String(error));
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingService.buildFormattingModel(this.formattingSettings);
    }

    private applySearchInput(index: number, value: string): void {
        const searchValues = this.renderer.getSearchTexts();
        searchValues[index] = value;
        this.currentPage = 1;
        this.applySearch(searchValues, true, index);
    }

    private applySearch(
        values: string[],
        publishFilter = true,
        _changedIndex?: number
    ): void {
        const terms = values.map((value) =>
            value.trim().toLocaleLowerCase(this.host.locale || "pt-BR")
        );
        const columnIndexes = [
            this.getSearchColumnIndex(0),
            this.getSearchColumnIndex(1)
        ];
        this.filteredRows = this.model
            ? this.model.rows.filter((row) => {
                const matchesSearch = terms.every((term, index) => {
                    if (!term || (index === 1 &&
                        !this.formattingSettings.search.showSecondSearch.value)) {
                        return true;
                    }
                    const columnIndex = columnIndexes[index];
                    return columnIndex >= 0
                        ? row.searchTexts[columnIndex]?.includes(term)
                        : row.searchText.includes(term);
                });
                const matchesColumns = this.model?.columns.every(
                    (column, columnIndex) => {
                        const filter = column.queryName
                            ? this.columnFilters.get(column.queryName)
                            : undefined;
                        return !filter ||
                            filter.has(row.formattedValues[columnIndex]);
                    }
                ) ?? true;
                return matchesSearch && matchesColumns;
            })
            : [];
        this.render();
        if (publishFilter && this.formattingSettings.search.mode.value === "report") {
            window.clearTimeout(this.searchTimer);
            this.searchTimer = window.setTimeout(
                () => this.applySearchSelection(values),
                300
            );
        } else if (publishFilter && this.searchSelectionActive) {
            this.clearSearchSelection();
        }
    }

    private render(): void {
        const paginationEnabled =
            this.formattingSettings.pagination.enabled.value;
        const pageSize = Math.max(
            1,
            Math.floor(this.formattingSettings.pagination.pageSize.value || 10)
        );
        const totalPages = Math.max(
            1,
            Math.ceil(this.filteredRows.length / pageSize)
        );
        this.currentPage = paginationEnabled
            ? Math.min(Math.max(1, this.currentPage), totalPages)
            : 1;
        const pageStartIndex = paginationEnabled
            ? (this.currentPage - 1) * pageSize
            : 0;
        const pageRows = paginationEnabled
            ? this.filteredRows.slice(pageStartIndex, pageStartIndex + pageSize)
            : this.filteredRows;
        this.renderer.render(
            this.model,
            pageRows,
            this.filteredRows,
            {
                locale: this.host.locale || "pt-BR",
                fontSize: this.formattingSettings.table.fontSize.value,
                rowHeight: this.formattingSettings.table.rowHeight.value,
                textColor:
                    this.formattingSettings.table.textColor.value.value,
                backgroundColor:
                    this.formattingSettings.table.backgroundColor.value.value,
                valueAlignment:
                    String(this.formattingSettings.table.valueAlignment.value),
                hoverBackground:
                    this.formattingSettings.table.hoverBackgroundColor.value.value,
                hoverRadius:
                    this.formattingSettings.table.hoverRadius.value,
                showTotals: this.formattingSettings.table.showTotals.value,
                totalLabel: this.formattingSettings.table.totalLabel.value,
                totalBackground:
                    this.formattingSettings.table.totalBackgroundColor.value.value,
                totalTextColor:
                    this.formattingSettings.table.totalTextColor.value.value,
                totalAlignment:
                    String(this.formattingSettings.table.totalAlignment.value),
                totalFontSize:
                    this.formattingSettings.table.totalFontSize.value,
                totalBorderRadius:
                    this.formattingSettings.table.totalBorderRadius.value,
                totalsMode:
                    String(this.formattingSettings.table.totalsMode.value),
                totalMenuBackground:
                    this.formattingSettings.table
                        .totalMenuBackgroundColor.value.value,
                totalMenuBorderColor:
                    this.formattingSettings.table
                        .totalMenuBorderColor.value.value,
                totalMenuFontSize:
                    this.formattingSettings.table.totalMenuFontSize.value,
                totalMenuRadius:
                    this.formattingSettings.table.totalMenuRadius.value,
                showTitle: this.formattingSettings.titleBar.showTitle.value,
                titleText: this.formattingSettings.titleBar.titleText.value,
                titleFontSize: this.formattingSettings.titleBar.titleFontSize.value,
                titleColor: this.formattingSettings.titleBar.titleColor.value.value,
                showSubtitle:
                    this.formattingSettings.titleBar.showSubtitle.value,
                subtitleText:
                    this.formattingSettings.titleBar.subtitleText.value,
                subtitleFontSize:
                    this.formattingSettings.titleBar.subtitleFontSize.value,
                subtitleColor:
                    this.formattingSettings.titleBar.subtitleColor.value.value,
                titleBarBackground:
                    this.formattingSettings.titleBar.backgroundColor.value.value,
                titleBarHeight: this.formattingSettings.titleBar.height.value,
                showRecordCount:
                    this.formattingSettings.titleBar.showRecordCount.value,
                recordCountTextColor:
                    this.formattingSettings.titleBar.recordCountTextColor.value.value,
                recordCountBackground:
                    this.formattingSettings.titleBar.recordCountBackground.value.value,
                recordCountFontSize:
                    this.formattingSettings.titleBar.recordCountFontSize.value,
                recordCountRadius:
                    this.formattingSettings.titleBar.recordCountRadius.value,
                recordCountHeight:
                    this.formattingSettings.titleBar.recordCountHeight.value,
                recordCountWidth:
                    this.formattingSettings.titleBar.recordCountWidth.value,
                recordCountHorizontalPadding:
                    this.formattingSettings.titleBar
                        .recordCountHorizontalPadding.value,
                recordCountAlignment:
                    this.toFlexAlignment(
                        String(this.formattingSettings.titleBar
                            .recordCountAlignment.value)
                    ),
                showSearch: this.formattingSettings.search.showSearch.value,
                searchPlaceholder: this.formattingSettings.search.placeholder.value,
                showSecondSearch:
                    this.formattingSettings.search.showSecondSearch.value,
                searchPlaceholder2:
                    this.formattingSettings.search.placeholder2.value,
                searchPosition: String(this.formattingSettings.search.position.value),
                searchWidth: this.formattingSettings.search.width.value,
                showSearchIcon: this.formattingSettings.search.showIcon.value,
                searchIconSize: this.formattingSettings.search.iconSize.value,
                searchIconColor:
                    this.formattingSettings.search.iconColor.value.value,
                searchActionIconSize:
                    this.formattingSettings.search.actionIconSize.value,
                searchArrowIconColor:
                    this.formattingSettings.search.arrowIconColor.value.value,
                searchClearIconColor:
                    this.formattingSettings.search.clearIconColor.value.value,
                searchHorizontalMargin:
                    this.formattingSettings.search.horizontalMargin.value,
                searchBackground:
                    this.formattingSettings.search.backgroundColor.value.value,
                searchBorderColor:
                    this.formattingSettings.search.borderColor.value.value,
                searchBorderWidth:
                    this.formattingSettings.search.borderWidth.value,
                searchBorderRadius:
                    this.formattingSettings.search.borderRadius.value,
                searchHeight: this.formattingSettings.search.inputHeight.value,
                searchFontSize: this.formattingSettings.search.fontSize.value,
                headerBackground:
                    this.formattingSettings.header.backgroundColor.value.value,
                headerTextColor: this.formattingSettings.header.textColor.value.value,
                headerBorderColor:
                    this.formattingSettings.header.borderColor.value.value,
                headerBorderMode:
                    String(this.formattingSettings.header.borderMode.value),
                headerBorderWidth:
                    this.formattingSettings.header.borderWidth.value,
                headerBorderTopWidth:
                    this.formattingSettings.header.borderTopWidth.value,
                headerBorderRightWidth:
                    this.formattingSettings.header.borderRightWidth.value,
                headerBorderBottomWidth:
                    this.formattingSettings.header.borderBottomWidth.value,
                headerBorderLeftWidth:
                    this.formattingSettings.header.borderLeftWidth.value,
                headerBorderRadius:
                    this.formattingSettings.header.borderRadius.value,
                headerFontSize: this.formattingSettings.header.fontSize.value,
                headerFontFamily:
                    this.formattingSettings.header.fontFamily.value,
                headerAlignment:
                    String(this.formattingSettings.header.alignment.value),
                headerHeight: this.formattingSettings.header.height.value,
                headerPadding: this.formattingSettings.header.horizontalPadding.value,
                showCheckboxes:
                    this.formattingSettings.selection.showCheckboxes.value,
                showSelectAll:
                    this.formattingSettings.selection.showSelectAll.value,
                selectionMode:
                    String(this.formattingSettings.selection.selectionMode.value),
                selectionIndicatorStyle:
                    String(this.formattingSettings.selection.indicatorStyle.value),
                selectionIndicatorSize:
                    this.formattingSettings.selection.indicatorSize.value,
                selectionColumnWidth:
                    this.formattingSettings.selection.columnWidth.value,
                selectionHorizontalAlignment:
                    String(this.formattingSettings.selection
                        .horizontalAlignment.value),
                selectionBorderMode:
                    String(this.formattingSettings.selection.borderMode.value),
                selectionBackground:
                    this.formattingSettings.selection.backgroundColor.value.value,
                selectionTextColor:
                    this.formattingSettings.selection.textColor.value.value,
                selectionBorderColor:
                    this.formattingSettings.selection.borderColor.value.value,
                selectionBorderWidth:
                    this.formattingSettings.selection.borderWidth.value,
                selectionBorderRadius:
                    this.formattingSettings.selection.borderRadius.value,
                dimUnselected:
                    this.formattingSettings.selection.dimUnselected.value,
                unselectedOpacity:
                    this.formattingSettings.selection.unselectedOpacity.value,
                columnFilters: Array.from(this.columnFilters.entries()).map(
                    ([queryName, filterValues]) => ({
                        queryName,
                        label: this.model?.columns.find(
                            (column) => column.queryName === queryName
                        )?.displayName || queryName,
                        values: Array.from(filterValues)
                    })
                ),
                filterBarBackground:
                    this.formattingSettings.filterBar.backgroundColor.value.value,
                filterBarTextColor:
                    this.formattingSettings.filterBar.textColor.value.value,
                filterBarChipBackground:
                    this.formattingSettings.filterBar
                        .chipBackgroundColor.value.value,
                filterBarBorderColor:
                    this.formattingSettings.filterBar.borderColor.value.value,
                filterBarTopBorderWidth:
                    this.formattingSettings.filterBar.topBorderWidth.value,
                filterBarBottomSpacing:
                    this.formattingSettings.filterBar.bottomSpacing.value,
                filterBarFontSize:
                    this.formattingSettings.filterBar.fontSize.value,
                filterBarHeight:
                    this.formattingSettings.filterBar.height.value,
                filterBarHorizontalPadding:
                    this.formattingSettings.filterBar.horizontalPadding.value,
                filterBarBorderRadius:
                    this.formattingSettings.filterBar.borderRadius.value,
                paginationEnabled,
                paginationPosition:
                    String(this.formattingSettings.pagination.position.value),
                paginationShowPageNumbers:
                    this.formattingSettings.pagination.showPageNumbers.value,
                paginationShowRange:
                    this.formattingSettings.pagination.showRange.value,
                paginationBackground:
                    this.formattingSettings.pagination.backgroundColor.value.value,
                paginationTextColor:
                    this.formattingSettings.pagination.textColor.value.value,
                paginationActiveBackground:
                    this.formattingSettings.pagination
                        .activeBackgroundColor.value.value,
                paginationActiveTextColor:
                    this.formattingSettings.pagination.activeTextColor.value.value,
                paginationBorderColor:
                    this.formattingSettings.pagination.borderColor.value.value,
                paginationFontSize:
                    this.formattingSettings.pagination.fontSize.value,
                paginationButtonSize:
                    this.formattingSettings.pagination.buttonSize.value,
                paginationSpacing:
                    this.formattingSettings.pagination.spacing.value,
                paginationHorizontalPadding:
                    this.formattingSettings.pagination.horizontalPadding.value,
                paginationBorderRadius:
                    this.formattingSettings.pagination.borderRadius.value,
                topLayoutMode:
                    String(this.formattingSettings.topLayout.mode.value),
                topLayoutTitleRow:
                    String(this.formattingSettings.topLayout.titleRow.value),
                topLayoutTitlePosition:
                    this.formattingSettings.topLayout.titlePosition.value,
                topLayoutTitleAutomaticAlignment:
                    String(this.formattingSettings.topLayout
                        .titleAutomaticAlignment.value),
                topLayoutTitleAutomaticSpacing:
                    this.formattingSettings.topLayout.titleAutomaticSpacing.value,
                topLayoutSearchRow:
                    String(this.formattingSettings.topLayout.searchRow.value),
                topLayoutSearchPosition:
                    this.formattingSettings.topLayout.searchPosition.value,
                topLayoutSearchAutomaticAlignment:
                    String(this.formattingSettings.topLayout
                        .searchAutomaticAlignment.value),
                topLayoutSearchAutomaticSpacing:
                    this.formattingSettings.topLayout.searchAutomaticSpacing.value,
                topLayoutDownloadRow:
                    String(this.formattingSettings.topLayout.downloadRow.value),
                topLayoutDownloadPosition:
                    this.formattingSettings.topLayout.downloadPosition.value,
                topLayoutDownloadAutomaticAlignment:
                    String(this.formattingSettings.topLayout
                        .downloadAutomaticAlignment.value),
                topLayoutDownloadAutomaticSpacing:
                    this.formattingSettings.topLayout.downloadAutomaticSpacing.value,
                topLayoutPaginationRow:
                    String(this.formattingSettings.topLayout.paginationRow.value),
                topLayoutPaginationPosition:
                    this.formattingSettings.topLayout.paginationPosition.value,
                topLayoutPaginationAutomaticAlignment:
                    String(this.formattingSettings.topLayout
                        .paginationAutomaticAlignment.value),
                topLayoutPaginationAutomaticSpacing:
                    this.formattingSettings.topLayout
                        .paginationAutomaticSpacing.value,
                topLayoutRowGap:
                    this.formattingSettings.topLayout.rowGap.value,
                currentPage: this.currentPage,
                totalPages,
                filteredRecordCount: this.filteredRows.length,
                pageStart: this.filteredRows.length === 0
                    ? 0
                    : pageStartIndex + 1,
                pageEnd: paginationEnabled
                    ? Math.min(pageStartIndex + pageSize, this.filteredRows.length)
                    : this.filteredRows.length,
                downloadEnabled:
                    this.formattingSettings.download.enabled.value,
                downloadButtonText:
                    this.formattingSettings.download.buttonText.value,
                downloadFileName:
                    this.formattingSettings.download.fileName.value,
                downloadDefaultFormat:
                    String(this.formattingSettings.download.defaultFormat.value),
                downloadDefaultScope:
                    String(this.formattingSettings.download.defaultScope.value),
                downloadShowMenu:
                    this.formattingSettings.download.showMenu.value,
                downloadShowText:
                    this.formattingSettings.download.showText.value,
                downloadIconSize:
                    this.formattingSettings.download.iconSize.value,
                downloadFontSize:
                    this.formattingSettings.download.fontSize.value,
                downloadWidth:
                    this.formattingSettings.download.width.value,
                downloadHeight:
                    this.formattingSettings.download.height.value,
                downloadBackground:
                    this.formattingSettings.download.backgroundColor.value.value,
                downloadTextColor:
                    this.formattingSettings.download.textColor.value.value,
                downloadBorderColor:
                    this.formattingSettings.download.borderColor.value.value,
                downloadBorderWidth:
                    this.formattingSettings.download.borderWidth.value,
                downloadBorderRadius:
                    this.formattingSettings.download.borderRadius.value,
                downloadMenuBackground:
                    this.formattingSettings.download.menuBackgroundColor.value.value,
                downloadMenuTextColor:
                    this.formattingSettings.download.menuTextColor.value.value,
                downloadFormatBackground:
                    this.formattingSettings.download.formatBackgroundColor.value.value,
                downloadFormatSelected:
                    this.formattingSettings.download.formatSelectedColor.value.value,
                downloadFormatSelectedText:
                    this.formattingSettings.download.formatSelectedTextColor.value.value,
                showRuleEditorButton:
                    this.host.hostEnv === powerbi.common.CustomVisualHostEnv.Desktop,
                ruleSets: this.ruleSets
                ,customIcons: this.customIcons
                ,iconPreferences: this.iconPreferences
            },
            this.selectedKeys,
            this.sortQueryName,
            this.sortDirection
        );
    }

    private saveRules(rules: ColumnRuleSet[]): void {
        this.ruleSets = rules;
        this.host.persistProperties({
            merge: [{
                objectName: "ruleEditor",
                selector: null,
                properties: {
                    rulesJson: serializeRuleSets(rules)
                }
            }]
        });
    }

    private saveCustomIcons(icons: CustomIconAsset[]): void {
        this.customIcons = icons;
        this.host.persistProperties({
            merge: [{
                objectName: "ruleEditor",
                selector: null,
                properties: {
                    iconsJson: serializeCustomIcons(icons)
                }
            }]
        });
    }

    private saveIconPreferences(preferences: IconPreferences): void {
        this.iconPreferences = preferences;
        this.host.persistProperties({
            merge: [{
                objectName: "ruleEditor",
                selector: null,
                properties: {
                    iconPreferencesJson:
                        serializeIconPreferences(preferences)
                }
            }]
        });
    }

    private cloneConfigurationValue<T>(value: T): T {
        return JSON.parse(JSON.stringify(value)) as T;
    }

    private stripAppliedIconProperties(
        objectName: string,
        properties: Record<string, unknown>
    ): Record<string, unknown> {
        const result = { ...properties };
        if (objectName === "ruleEditor") {
            delete result.rulesJson;
        }
        if (objectName === "columnStyle") {
            Object.keys(result)
                .filter((property) =>
                    property === "cellMode" ||
                    property.startsWith("icon") ||
                    property.startsWith("pill") ||
                    property.startsWith("bar") ||
                    property.startsWith("svg")
                )
                .forEach((property) => delete result[property]);
        }
        return result;
    }

    private configurationObjects(
        source: powerbi.DataViewObjects | undefined
    ): Record<string, Record<string, unknown>> {
        const result: Record<string, Record<string, unknown>> = {};
        Object.entries(source || {}).forEach(([objectName, properties]) => {
            if (!CONFIGURATION_OBJECTS.has(objectName) ||
                objectName === "general" ||
                !properties) {
                return;
            }
            result[objectName] = this.stripAppliedIconProperties(
                objectName,
                this.cloneConfigurationValue(
                    properties as unknown as Record<string, unknown>
                )
            );
        });
        return result;
    }

    private async exportConfiguration(): Promise<string> {
        const metadata = this.currentDataView?.metadata;
        if (!metadata) {
            throw new Error("Não há dados disponíveis para exportar.");
        }
        const objects = this.configurationObjects(metadata.objects);
        objects.ruleEditor = {
            ...(objects.ruleEditor || {}),
            iconsJson: serializeCustomIcons(
                this.customIcons.filter((icon) => !icon.deleted)
            ),
            iconPreferencesJson:
                serializeIconPreferences(this.iconPreferences)
        };
        const configuration: AdvanceTableConfiguration = {
            format: "AdvanceTableConfiguration",
            schemaVersion: 1,
            visualGuid:
                "advancedTableRogerC40D05D8D12144689810E97FF8C695C8",
            visualVersion: "0.5.22.0",
            exportedAt: new Date().toISOString(),
            objects,
            columns: metadata.columns
                .filter((column) => Boolean(column.queryName))
                .map((column) => ({
                    queryName: column.queryName || "",
                    displayName: column.displayName,
                    objects: this.configurationObjects(column.objects)
                }))
        };
        const contents = JSON.stringify(configuration, null, 2);
        const fileName =
            `AdvanceTable-config-${new Date().toISOString().slice(0, 10)}.json`;
        const legacyBridgeUrl =
            this.formattingSettings.download.bridgeUrl.value.trim();
        const bridgeUrl =
            this.formattingSettings.download.githubUrl.value.trim() ||
            legacyBridgeUrl ||
            "https://rogeriocsantana.github.io/AdvancedTable/download-page/";
        const content = this.bytesToBase64Url(
            new TextEncoder().encode(contents)
        );
        const params = new URLSearchParams({
            v: "1",
            n: fileName,
            t: "application/json;charset=utf-8",
            d: content
        });
        const target = `${bridgeUrl.replace(/#.*$/, "")}#${params.toString()}`;
        if (target.length > 1_000_000) {
            throw new Error(
                "A configuração excedeu o limite do download pela página."
            );
        }
        this.host.launchUrl(target);
        return "Configuração preparada na página de download.";
    }

    private remapConfigurationValue(
        value: unknown,
        queryMap: Map<string, string>
    ): unknown {
        if (typeof value === "string") {
            return queryMap.get(value) || value;
        }
        if (Array.isArray(value)) {
            return value.map((item) =>
                this.remapConfigurationValue(item, queryMap)
            );
        }
        if (value && typeof value === "object") {
            return Object.fromEntries(
                Object.entries(value).map(([key, child]) => [
                    key,
                    this.remapConfigurationValue(child, queryMap)
                ])
            );
        }
        return value;
    }

    private parseConfiguration(contents: string): AdvanceTableConfiguration {
        if (contents.length > 12_000_000) {
            throw new Error("O arquivo excede o limite de 12 MB.");
        }
        let value: unknown;
        try {
            value = JSON.parse(contents);
        } catch {
            throw new Error("O arquivo não contém um JSON válido.");
        }
        const configuration = value as Partial<AdvanceTableConfiguration>;
        if (configuration.format !== "AdvanceTableConfiguration" ||
            configuration.schemaVersion !== 1 ||
            configuration.visualGuid !==
                "advancedTableRogerC40D05D8D12144689810E97FF8C695C8" ||
            !configuration.objects ||
            !Array.isArray(configuration.columns)) {
            throw new Error(
                "Este arquivo não é uma configuração válida do AdvanceTable."
            );
        }
        return configuration as AdvanceTableConfiguration;
    }

    private async importConfiguration(contents: string): Promise<string> {
        const configuration = this.parseConfiguration(contents);
        const currentColumns = this.model?.columns || [];
        const queryMap = new Map<string, string>();
        const matchedColumns = new Map<
            AdvanceTableConfigurationColumn,
            TableColumn
        >();
        configuration.columns.forEach((sourceColumn) => {
            const targetColumn = currentColumns.find(
                (column) => column.queryName === sourceColumn.queryName
            ) || currentColumns.find(
                (column) =>
                    column.displayName.trim().toLocaleLowerCase() ===
                    sourceColumn.displayName.trim().toLocaleLowerCase()
            );
            if (targetColumn?.queryName) {
                queryMap.set(sourceColumn.queryName, targetColumn.queryName);
                matchedColumns.set(sourceColumn, targetColumn);
            }
        });
        const merge: powerbi.VisualObjectInstance[] = [];
        Object.entries(configuration.objects).forEach(
            ([objectName, sourceProperties]) => {
                if (!CONFIGURATION_OBJECTS.has(objectName) ||
                    objectName === "general") {
                    return;
                }
                let properties = this.stripAppliedIconProperties(
                    objectName,
                    this.cloneConfigurationValue(sourceProperties)
                );
                properties = this.remapConfigurationValue(
                    properties,
                    queryMap
                ) as Record<string, unknown>;
                merge.push({
                    objectName,
                    selector: null,
                    properties: properties as powerbi.DataViewObject
                });
            }
        );
        matchedColumns.forEach((targetColumn, sourceColumn) => {
            Object.entries(sourceColumn.objects).forEach(
                ([objectName, sourceProperties]) => {
                    if (!CONFIGURATION_OBJECTS.has(objectName)) return;
                    const properties = this.remapConfigurationValue(
                        this.stripAppliedIconProperties(
                            objectName,
                            this.cloneConfigurationValue(sourceProperties)
                        ),
                        queryMap
                    ) as Record<string, unknown>;
                    if (Object.keys(properties).length === 0) return;
                    merge.push({
                        objectName,
                        selector: { metadata: targetColumn.queryName || "" },
                        properties: properties as powerbi.DataViewObject
                    });
                }
            );
        });
        if (merge.length === 0) {
            throw new Error("O arquivo não possui configurações aplicáveis.");
        }
        this.host.persistProperties({ merge });
        return matchedColumns.size === configuration.columns.length
            ? "Configuração importada com sucesso."
            : `Configuração importada. ${matchedColumns.size} de ` +
                `${configuration.columns.length} colunas foram associadas.`;
    }

    private configureSearchFields(savedField1?: string, savedField2?: string): void {
        const items: powerbi.IEnumMember[] = (this.model?.columns || [])
            .filter((column) => Boolean(column.queryName))
            .map((column) => ({
                displayName: column.displayName,
                value: column.queryName || ""
            }));
        this.formattingSettings.search.field1.items = items;
        this.formattingSettings.search.field2.items = items;
        this.formattingSettings.search.field1.value = this.resolveSearchField(
            savedField1 || this.formattingSettings.search.field1.value,
            items,
            0
        );
        this.formattingSettings.search.field2.value = this.resolveSearchField(
            savedField2 || this.formattingSettings.search.field2.value,
            items,
            Math.min(1, Math.max(0, items.length - 1))
        );
    }

    private configureColumnSettings(savedColumn?: string): void {
        const items: powerbi.IEnumMember[] = (this.model?.columns || [])
            .filter((column) => Boolean(column.queryName))
            .map((column) => ({
                displayName: column.displayName,
                value: column.queryName || ""
            }));
        const settings = this.formattingSettings.columnStyle;
        const columnTotalGroup = settings.groups.find(
            (group) => group.name === "columnTotal"
        );
        if (columnTotalGroup) {
            columnTotalGroup.visible =
                this.formattingSettings.table.showTotals.value;
        }
        settings.selectedColumn.items = items;
        settings.selectedColumn.value = this.resolveSearchField(
            savedColumn || settings.selectedColumn.value,
            items,
            0
        );
        const queryName = String(settings.selectedColumn.value?.value || "");
        const column = this.model?.columns.find(
            (item) => item.queryName === queryName
        );
        if (!column || !queryName) {
            settings.cellMode.visible = false;
            settings.textColor.visible = false;
            settings.backgroundColor.visible = false;
            settings.alignment.visible = false;
            settings.allowWidthReduction.visible = false;
            settings.reducedWidth.visible = false;
            settings.iconStyle.visible = false;
            settings.iconColor.visible = false;
            settings.cellPadding.visible = false;
            settings.headerPadding.visible = false;
            settings.headerFontSize.visible = false;
            settings.headerTextColor.visible = false;
            settings.headerBackgroundColor.visible = false;
            settings.headerAlignment.visible = false;
            settings.showColumnTotal.visible = false;
            settings.totalAggregation.visible = false;
            settings.totalAlignment.visible = false;
            settings.totalFontSize.visible = false;
            return;
        }
        settings.cellMode.visible = true;
        settings.textColor.visible = true;
        settings.backgroundColor.visible = true;
        settings.alignment.visible = true;
        settings.allowWidthReduction.visible = true;
        settings.reducedWidth.visible = column.style.allowWidthReduction;
        settings.iconStyle.visible = false;
        settings.iconColor.visible = false;
        settings.cellPadding.visible = true;
        settings.headerPadding.visible = true;
        settings.headerFontSize.visible = true;
        settings.headerTextColor.visible = true;
        settings.headerBackgroundColor.visible = true;
        settings.headerAlignment.visible = true;
        settings.showColumnTotal.visible =
            this.formattingSettings.table.showTotals.value;
        settings.totalAggregation.visible =
            this.formattingSettings.table.showTotals.value &&
            column.style.showColumnTotal;
        settings.totalAlignment.visible =
            this.formattingSettings.table.showTotals.value &&
            column.style.showColumnTotal;
        settings.totalFontSize.visible =
            this.formattingSettings.table.showTotals.value &&
            column.style.showColumnTotal;
        settings.cellMode.value =
            column.style.cellMode === "icon" ||
            column.style.cellMode === "iconValue"
                ? "value"
                : column.style.cellMode === "svgText"
                    ? "pill"
                    : column.style.cellMode;
        settings.columnOrder.value = column.explicitOrder;
        settings.showColumnTotal.value = column.style.showColumnTotal;
        settings.totalAggregation.value = column.style.totalAggregation;
        settings.totalAlignment.value = column.style.totalAlignment;
        settings.totalFontSize.value = column.style.totalFontSize;
        settings.textColor.value = { value: column.style.textColor };
        settings.backgroundColor.value = { value: column.style.backgroundColor };
        settings.alignment.value = column.style.alignment;
        settings.allowWidthReduction.value =
            column.style.allowWidthReduction;
        settings.reducedWidth.value = column.style.reducedWidth;
        settings.iconStyle.value = column.style.iconStyle;
        settings.iconColor.value = { value: column.style.iconColor };
        settings.cellPadding.value = column.style.cellPadding;
        settings.headerPadding.value = column.style.headerPadding;
        settings.headerFontSize.value = column.style.headerFontSize;
        settings.headerTextColor.value = { value: column.style.headerTextColor };
        settings.headerBackgroundColor.value = {
            value: column.style.headerBackgroundColor
        };
        settings.headerAlignment.value = column.style.headerAlignment;
        settings.pillRadius.value = column.style.pillRadius;
        settings.pillRandomColors.value = column.style.pillRandomColors;
        settings.pillPositiveNegative.value =
            column.style.pillPositiveNegative;
        settings.pillNegativeColor.value = {
            value: column.style.pillNegativeColor
        };
        settings.pillPositiveColor.value = {
            value: column.style.pillPositiveColor
        };
        settings.pillTextFollowsBackground.value =
            column.style.pillTextFollowsBackground;
        settings.pillFunctionColor.value = {
            value: column.style.pillFunctionColor
        };
        settings.pillValue1.value = column.style.pillValues[0];
        settings.pillValue2.value = column.style.pillValues[1];
        settings.pillValue3.value = column.style.pillValues[2];
        settings.pillValue4.value = column.style.pillValues[3];
        settings.pillColor1.value = { value: column.style.pillColors[0] };
        settings.pillColor2.value = { value: column.style.pillColors[1] };
        settings.pillColor3.value = { value: column.style.pillColors[2] };
        settings.pillColor4.value = { value: column.style.pillColors[3] };
        settings.pillTextColor1.value = {
            value: column.style.pillTextColors[0]
        };
        settings.pillTextColor2.value = {
            value: column.style.pillTextColors[1]
        };
        settings.pillTextColor3.value = {
            value: column.style.pillTextColors[2]
        };
        settings.pillTextColor4.value = {
            value: column.style.pillTextColors[3]
        };
        settings.barMinimum.value = column.style.barMinimum;
        settings.barMaximum.value = column.style.barMaximum;
        settings.barThreshold.value = column.style.barThreshold;
        settings.barLowColor.value = { value: column.style.barLowColor };
        settings.barHighColor.value = { value: column.style.barHighColor };
        settings.barTrackColor.value = { value: column.style.barTrackColor };
        settings.barWidth.value = column.style.barWidth;
        settings.barHeight.value = column.style.barHeight;
        settings.svgBackgroundColor.value = {
            value: column.style.svgBackgroundColor
        };
        settings.svgTextColor.value = { value: column.style.svgTextColor };
        settings.svgBorderColor.value = { value: column.style.svgBorderColor };
        settings.svgRadius.value = column.style.svgRadius;

        const constantSelector: powerbi.data.Selector = { metadata: queryName };
        const wildcardSelector: powerbi.data.Selector = {
            ...dataViewWildcard.createDataViewWildcardSelector(
                dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
            ),
            metadata: queryName
        };
        [
            settings.cellMode,
            settings.columnOrder,
            settings.showColumnTotal,
            settings.totalAggregation,
            settings.totalAlignment,
            settings.totalFontSize,
            settings.alignment,
            settings.allowWidthReduction,
            settings.reducedWidth,
            settings.iconStyle,
            settings.cellPadding,
            settings.headerPadding,
            settings.headerFontSize,
            settings.headerAlignment,
            settings.pillRadius,
            settings.pillRandomColors,
            settings.pillPositiveNegative,
            settings.pillNegativeColor,
            settings.pillPositiveColor,
            settings.pillTextFollowsBackground,
            settings.pillValue1,
            settings.pillColor1,
            settings.pillValue2,
            settings.pillColor2,
            settings.pillValue3,
            settings.pillColor3,
            settings.pillValue4,
            settings.pillColor4,
            settings.pillTextColor1,
            settings.pillTextColor2,
            settings.pillTextColor3,
            settings.pillTextColor4,
            settings.barMinimum,
            settings.barMaximum,
            settings.barThreshold,
            settings.barLowColor,
            settings.barHighColor,
            settings.barTrackColor,
            settings.barWidth,
            settings.barHeight
            ,settings.svgBackgroundColor
            ,settings.svgTextColor
            ,settings.svgBorderColor
            ,settings.svgRadius
        ].forEach((slice) => {
            slice.selector = constantSelector;
        });
        [
            settings.iconColor,
            settings.headerTextColor,
            settings.headerBackgroundColor
        ].forEach((slice) => {
            slice.selector = wildcardSelector;
            slice.altConstantSelector = constantSelector;
            slice.instanceKind =
                powerbi.VisualEnumerationInstanceKinds.ConstantOrRule;
        });
        [
            settings.textColor,
            settings.backgroundColor,
            settings.pillFunctionColor
        ].forEach((slice) => {
            slice.selector = constantSelector;
            slice.altConstantSelector = undefined;
            slice.instanceKind =
                powerbi.VisualEnumerationInstanceKinds.Constant;
        });
    }

    private configureCellElementSettings(savedColumn?: string): void {
        const items: powerbi.IEnumMember[] = (this.model?.columns || [])
            .filter((column) => Boolean(column.queryName))
            .map((column) => ({
                displayName: column.displayName,
                value: column.queryName || ""
            }));
        const settings = this.formattingSettings.cellElements;
        settings.selectedSeries.items = items;
        settings.iconRuleField.items = items;
        settings.selectedSeries.value = this.resolveSearchField(
            savedColumn || settings.selectedSeries.value,
            items,
            0
        );
        const queryName = String(settings.selectedSeries.value?.value || "");
        const column = this.model?.columns.find(
            (item) => item.queryName === queryName
        );
        const sourceColumn = column
            ? this.model?.source.columns[column.sourceIndex]
            : undefined;
        const object = sourceColumn?.objects?.cellElements;
        const configurable = [
            settings.backgroundEnabled,
            settings.backgroundColor,
            settings.fontEnabled,
            settings.fontColor,
            settings.iconsEnabled,
            settings.iconColor,
            settings.iconStyle,
            settings.iconLayout,
            settings.iconRuleEnabled,
            settings.iconRuleField,
            settings.iconThreshold,
            settings.iconBelowStyle,
            settings.iconBelowColor,
            settings.iconAboveStyle,
            settings.iconAboveColor
        ];
        if (!column || !queryName) {
            configurable.forEach((slice) => {
                slice.visible = false;
            });
            return;
        }
        configurable.forEach((slice) => {
            slice.visible = true;
        });
        settings.backgroundEnabled.value =
            typeof object?.backgroundEnabled === "boolean"
                ? object.backgroundEnabled
                : false;
        settings.fontEnabled.value =
            typeof object?.fontEnabled === "boolean" ? object.fontEnabled : false;
        settings.iconsEnabled.value =
            typeof object?.iconsEnabled === "boolean" ? object.iconsEnabled : false;
        settings.backgroundColor.value = {
            value: this.readObjectColor(object, "backgroundColor", "#FFFFFF")
        };
        settings.fontColor.value = {
            value: this.readObjectColor(object, "fontColor", "#242424")
        };
        settings.iconColor.value = {
            value: this.readObjectColor(object, "iconColor", "#118DFF")
        };
        settings.iconStyle.value =
            this.readObjectString(object, "iconStyle") || "status";
        settings.iconLayout.value =
            this.readObjectString(object, "iconLayout") || "left";
        settings.iconRuleEnabled.value =
            typeof object?.iconRuleEnabled === "boolean"
                ? object.iconRuleEnabled
                : false;
        settings.iconRuleField.value = this.resolveSearchField(
            this.readObjectString(object, "iconRuleField") || queryName,
            items,
            Math.max(0, items.findIndex((item) => item.value === queryName))
        );
        settings.iconThreshold.value =
            typeof object?.iconThreshold === "number" ? object.iconThreshold : 50;
        settings.iconBelowStyle.value =
            this.readObjectString(object, "iconBelowStyle") || "circle";
        settings.iconBelowColor.value = {
            value: this.readObjectColor(object, "iconBelowColor", "#E53935")
        };
        settings.iconAboveStyle.value =
            this.readObjectString(object, "iconAboveStyle") || "circle";
        settings.iconAboveColor.value = {
            value: this.readObjectColor(object, "iconAboveColor", "#21A366")
        };

        const constantSelector: powerbi.data.Selector = { metadata: queryName };
        const wildcardSelector: powerbi.data.Selector = {
            ...dataViewWildcard.createDataViewWildcardSelector(
                dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
            ),
            metadata: queryName
        };
        [
            settings.backgroundEnabled,
            settings.fontEnabled,
            settings.iconsEnabled,
            settings.iconStyle,
            settings.iconLayout,
            settings.iconRuleEnabled,
            settings.iconRuleField,
            settings.iconThreshold,
            settings.iconBelowStyle,
            settings.iconBelowColor,
            settings.iconAboveStyle,
            settings.iconAboveColor
        ].forEach((slice) => {
            slice.selector = constantSelector;
        });
        [
            settings.backgroundColor,
            settings.fontColor,
            settings.iconColor
        ].forEach((slice) => {
            slice.selector = wildcardSelector;
            slice.altConstantSelector = constantSelector;
            slice.instanceKind =
                powerbi.VisualEnumerationInstanceKinds.ConstantOrRule;
        });
    }

    private resolveSearchField(
        current: powerbi.IEnumMember | string,
        items: powerbi.IEnumMember[],
        fallbackIndex: number
    ): powerbi.IEnumMember {
        const currentValue = typeof current === "string" ? current : current?.value;
        const match = items.find((item) => item.value === currentValue);
        return match || items[fallbackIndex] || {
            displayName: "Nenhum campo disponível",
            value: ""
        };
    }

    private toFlexAlignment(value: string): string {
        return value === "left"
            ? "flex-start"
            : value === "right"
                ? "flex-end"
                : "center";
    }

    private readObjectString(
        object: powerbi.DataViewObject | undefined,
        property: string
    ): string | undefined {
        const value = object?.[property];
        return typeof value === "string" ? value : undefined;
    }

    private readObjectColor(
        object: powerbi.DataViewObject | undefined,
        property: string,
        fallback: string
    ): string {
        const value = object?.[property] as
            | { solid?: { color?: string } }
            | undefined;
        return value?.solid?.color || fallback;
    }

    private getSearchColumnIndex(searchIndex: number): number {
        const selected = searchIndex === 0
            ? this.formattingSettings.search.field1.value
            : this.formattingSettings.search.field2.value;
        return this.model?.columns.findIndex(
            (column) => column.queryName === String(selected?.value || "")
        ) ?? -1;
    }

    private selectRow(row: TableRow, multiSelect: boolean): void {
        this.selectionManager.select(row.selectionId, multiSelect).then((ids) => {
            this.selectedKeys = ids.length > 0
                ? multiSelect
                    ? this.toggleKey(this.selectedKeys, row.selectionId.getKey())
                    : new Set([row.selectionId.getKey()])
                : new Set<string>();
            this.renderer.setSelected(this.selectedKeys);
            this.publishSelectionFilter();
        });
    }

    private toggleRow(row: TableRow): void {
        const allowMultiple =
            this.formattingSettings.selection.selectionMode.value === "multiple";
        const key = row.selectionId.getKey();
        const nextKeys = this.toggleKey(this.selectedKeys, key);
        this.selectionManager.select(row.selectionId, allowMultiple).then((ids) => {
            this.selectedKeys = ids.length === 0
                ? new Set<string>()
                : allowMultiple
                    ? nextKeys
                    : new Set([key]);
            this.renderer.setSelected(this.selectedKeys);
            this.publishSelectionFilter();
        });
    }

    private clearSelection(): void {
        this.selectionManager.clear().then(() => {
            this.selectedKeys = new Set();
            this.searchSelectionActive = false;
            this.renderer.setSelected(this.selectedKeys);
            this.host.applyJsonFilter(
                null as unknown as powerbi.IFilter,
                "general",
                "filter",
                powerbi.FilterAction.merge
            );
        });
    }

    private selectAll(rows: TableRow[], select: boolean): void {
        if (!select || rows.length === 0) {
            this.clearSelection();
            return;
        }
        const targetRows =
            this.formattingSettings.pagination.enabled.value &&
            this.formattingSettings.pagination.selectAllScope.value === "filtered"
                ? this.filteredRows
                : rows;
        const selectionIds = targetRows.map((row) => row.selectionId);
        this.selectionManager.select(selectionIds, false).then(() => {
            this.selectedKeys = new Set(
                selectionIds.map((selectionId) => selectionId.getKey())
            );
            this.renderer.setSelected(this.selectedKeys);
            this.publishSelectionFilter();
        });
    }

    private publishSelectionFilter(): void {
        if (this.formattingSettings.selection.behavior.value !== "filter") {
            this.host.applyJsonFilter(
                null as unknown as powerbi.IFilter,
                "general",
                "filter",
                powerbi.FilterAction.merge
            );
            return;
        }
        const columnIndex = this.model?.columns.findIndex((column) =>
            Boolean(column.filterTarget) && !column.isNumeric
        ) ?? -1;
        const column = columnIndex >= 0 ? this.model?.columns[columnIndex] : undefined;
        if (!column?.filterTarget || this.selectedKeys.size === 0) {
            this.host.applyJsonFilter(
                null as unknown as powerbi.IFilter,
                "general",
                "filter",
                powerbi.FilterAction.merge
            );
            return;
        }
        const values = (this.model?.rows || [])
            .filter((row) => this.selectedKeys.has(row.selectionId.getKey()))
            .map((row) => row.values[columnIndex])
            .filter((value): value is string | number | boolean =>
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            );
        const filter = new BasicFilter(
            column.filterTarget,
            "In",
            Array.from(new Set(values))
        );
        this.host.applyJsonFilter(
            filter.toJSON() as powerbi.IFilter,
            "general",
            "filter",
            powerbi.FilterAction.merge
        );
    }

    private toggleKey(keys: Set<string>, key: string): Set<string> {
        const nextKeys = new Set(keys);
        if (nextKeys.has(key)) {
            nextKeys.delete(key);
        } else {
            nextKeys.add(key);
        }
        return nextKeys;
    }

    private applySearchSelection(values: string[]): void {
        const hasSearch = values.some((value, index) =>
            Boolean(value.trim()) &&
            (index === 0 || this.formattingSettings.search.showSecondSearch.value)
        );
        if (!hasSearch) {
            this.clearSearchSelection();
            return;
        }
        const selectionIds = this.filteredRows.map((row) => row.selectionId);
        if (selectionIds.length === 0) {
            this.clearSearchSelection();
            return;
        }
        this.selectionManager.select(selectionIds, false).then(() => {
            this.searchSelectionActive = true;
            this.publishSearchFilters(values);
        });
    }

    private clearSearchSelection(): void {
        if (!this.searchSelectionActive) {
            return;
        }
        this.selectionManager.clear().then(() => {
            this.searchSelectionActive = false;
            this.clearSearchFilters();
        });
    }

    private publishSearchFilters(values: string[]): void {
        const filters: powerbi.IFilter[] = [];
        [0, 1].forEach((index) => {
            const enabled = index === 0 ||
                this.formattingSettings.search.showSecondSearch.value;
            const term = values[index]?.trim();
            const columnIndex = this.getSearchColumnIndex(index);
            const column = columnIndex >= 0
                ? this.model?.columns[columnIndex]
                : undefined;
            if (!enabled || !term || !column?.filterTarget) {
                return;
            }
            const normalized = term.toLocaleLowerCase(this.host.locale || "pt-BR");
            const matches = (this.model?.rows || [])
                .filter((row) => row.searchTexts[columnIndex]?.includes(normalized))
                .map((row) => row.values[columnIndex])
                .filter((value): value is string | number | boolean =>
                    typeof value === "string" ||
                    typeof value === "number" ||
                    typeof value === "boolean"
                );
            const filter = new BasicFilter(
                column.filterTarget,
                "In",
                Array.from(new Set(matches))
            );
            filters.push(filter.toJSON() as powerbi.IFilter);
        });
        this.host.applyJsonFilter(
            filters.length > 0 ? filters : null as unknown as powerbi.IFilter,
            "general",
            "filter",
            powerbi.FilterAction.merge
        );
    }

    private clearSearchFilters(): void {
        this.host.applyJsonFilter(
            null as unknown as powerbi.IFilter,
            "general",
            "filter",
            powerbi.FilterAction.merge
        );
    }

    private applyColumnFilter(
        column: TableColumn,
        values: string[]
    ): void {
        if (!column.queryName || !this.model) {
            return;
        }
        const columnIndex = this.model.columns.indexOf(column);
        const allValues = new Set(
            this.model.rows.map((row) => row.formattedValues[columnIndex])
        );
        if (values.length === allValues.size &&
            values.every((value) => allValues.has(value))) {
            this.columnFilters.delete(column.queryName);
        } else {
            this.columnFilters.set(column.queryName, new Set(values));
        }
        this.currentPage = 1;
        this.applySearch(this.renderer.getSearchTexts(), false);
    }

    private clearColumnFilter(queryName: string): void {
        this.columnFilters.delete(queryName);
        this.currentPage = 1;
        this.applySearch(this.renderer.getSearchTexts(), false);
    }

    private changePage(page: number): void {
        if (page === this.currentPage || page < 1) {
            return;
        }
        this.currentPage = page;
        if (!this.formattingSettings.pagination.preserveSelection.value) {
            this.selectionManager.clear().then(() => {
                this.selectedKeys = new Set();
                this.publishSelectionFilter();
                this.render();
            });
            return;
        }
        this.render();
    }

    private sortBy(
        column: TableColumn,
        requestedDirection?: "asc" | "desc"
    ): void {
        if (!column.queryName) {
            return;
        }
        this.sortDirection = requestedDirection || (
            this.sortQueryName === column.queryName && this.sortDirection === "asc"
                ? "desc"
                : "asc"
        );
        this.sortQueryName = column.queryName;
        this.currentPage = 1;
        this.render();
        this.host.applyCustomSort({
            sortDescriptors: [{
                queryName: column.queryName,
                sortDirection: this.sortDirection === "asc"
                    ? powerbi.SortDirection.Ascending
                    : powerbi.SortDirection.Descending
            }]
        });
    }

    private async downloadTable(
        scope: string,
        format: string,
        requestedFileName: string
    ): Promise<void> {
        if (!this.model) {
            return;
        }
        const pageSize = Math.max(
            1,
            Math.floor(this.formattingSettings.pagination.pageSize.value || 10)
        );
        const pageStart = this.formattingSettings.pagination.enabled.value
            ? (this.currentPage - 1) * pageSize
            : 0;
        let rows: TableRow[];
        switch (scope) {
            case "all":
                rows = this.model.rows;
                break;
            case "page":
                rows = this.formattingSettings.pagination.enabled.value
                    ? this.filteredRows.slice(pageStart, pageStart + pageSize)
                    : this.filteredRows;
                break;
            case "selected":
                rows = this.model.rows.filter((row) =>
                    this.selectedKeys.has(row.selectionId.getKey())
                );
                break;
            default:
                rows = this.filteredRows;
                break;
        }
        if (rows.length === 0) {
            return;
        }
        const baseName = (requestedFileName || "AdvanceTable")
            .replace(/[<>:"/\\|?*]/g, "_")
            .replace(/\.(xlsx|csv)$/i, "")
            .trim() || "AdvanceTable";
        const method = String(this.formattingSettings.download.method.value);
        if (method === "official") {
            await this.downloadThroughOfficialApi(format, baseName, rows);
            return;
        }
        await this.downloadThroughBrowser(format, baseName, rows);
    }

    private async downloadThroughOfficialApi(
        format: string,
        baseName: string,
        rows: TableRow[]
    ): Promise<void> {
        if (!this.model) return;
        try {
            const status = await this.downloadService.exportStatus();
            if (status !== powerbi.PrivilegeStatus.Allowed) {
                this.renderer.showDownloadNotice(
                    "A API oficial está bloqueada neste tenant. Em Download > Comportamento, use GitHub Pages ou peça ao administrador para habilitar downloads de visuais personalizados."
                );
                return;
            }
            let content: string;
            let fileName: string;
            let fileType: string;
            if (format === "csv") {
                content = createCsv(this.model.columns, rows);
                fileName = `${baseName}.csv`;
                fileType = "text/csv";
            } else {
                content = await createXlsxBase64(
                    this.model.columns,
                    rows,
                    this.formattingSettings.titleBar.titleText.value || "Dados"
                );
                fileName = `${baseName}.xlsx`;
                fileType = "base64";
            }
            const result = await this.downloadService.exportVisualsContentExtended(
                content,
                fileName,
                fileType,
                "Arquivo exportado pelo visual AdvanceTable"
            );
            if (!result.downloadCompleted) {
                this.renderer.showDownloadNotice(
                    "O Power BI não concluiu o download. Tente novamente ou selecione GitHub Pages."
                );
            }
        } catch {
            this.renderer.showDownloadNotice(
                "A API oficial não está disponível. Selecione GitHub Pages ou servidor próprio em Download > Comportamento."
            );
        }
    }

    private async downloadThroughBrowser(
        format: string,
        baseName: string,
        rows: TableRow[]
    ): Promise<void> {
        if (!this.model) {
            return;
        }
        const method = String(this.formattingSettings.download.method.value);
        const legacyBridgeUrl =
            this.formattingSettings.download.bridgeUrl.value.trim();
        const bridgeUrl = method === "custom"
            ? this.formattingSettings.download.customUrl.value.trim()
            : this.formattingSettings.download.githubUrl.value.trim() ||
                legacyBridgeUrl ||
                "https://rogeriocsantana.github.io/AdvancedTable/download-page/";
        if (!/^https:\/\//i.test(bridgeUrl)) {
            this.renderer.showDownloadNotice(
                "Informe um endereço HTTPS para a página de download."
            );
            return;
        }
        try {
            let content: string;
            let fileName: string;
            let mimeType: string;
            if (format === "csv") {
                content = this.bytesToBase64Url(
                    new TextEncoder().encode(createCsv(this.model.columns, rows))
                );
                fileName = `${baseName}.csv`;
                mimeType = "text/csv;charset=utf-8";
            } else {
                const base64 = await createXlsxBase64(
                    this.model.columns,
                    rows,
                    this.formattingSettings.titleBar.titleText.value || "Dados"
                );
                content = base64
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_")
                    .replace(/=+$/g, "");
                fileName = `${baseName}.xlsx`;
                mimeType =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            const params = new URLSearchParams({
                v: "1",
                n: fileName,
                t: mimeType,
                d: content
            });
            const target = `${bridgeUrl.replace(/#.*$/, "")}#${params.toString()}`;
            if (target.length > 1_000_000) {
                this.renderer.showDownloadNotice(
                    "O arquivo excedeu o limite do download por página. Reduza os registros antes de tentar novamente."
                );
                return;
            }
            this.host.launchUrl(target);
        } catch {
            this.renderer.showDownloadNotice(
                "Não foi possível preparar o arquivo para a página de download."
            );
        }
    }

    private bytesToBase64Url(bytes: Uint8Array): string {
        let binary = "";
        const chunkSize = 0x8000;
        for (let offset = 0; offset < bytes.length; offset += chunkSize) {
            const chunk = bytes.subarray(offset, offset + chunkSize);
            binary += String.fromCharCode(...chunk);
        }
        return window.btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
    }

    private tooltipItems(row: TableRow): powerbi.extensibility.VisualTooltipDataItem[] {
        void row;
        return [];
    }

    private showTooltip(event: MouseEvent, row: TableRow): void {
        if (!this.tooltipService.enabled()) {
            return;
        }
        this.tooltipService.show({
            coordinates: [event.clientX, event.clientY],
            isTouchEvent: false,
            dataItems: this.tooltipItems(row),
            identities: [row.selectionId]
        });
    }

    private moveTooltip(event: MouseEvent, row: TableRow): void {
        if (!this.tooltipService.enabled()) {
            return;
        }
        this.tooltipService.move({
            coordinates: [event.clientX, event.clientY],
            isTouchEvent: false,
            dataItems: this.tooltipItems(row),
            identities: [row.selectionId]
        });
    }

    private hideTooltip(): void {
        this.tooltipService.hide({ isTouchEvent: false, immediately: false });
    }
}
