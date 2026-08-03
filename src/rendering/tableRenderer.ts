import { TableColumn, TableModel, TableRow } from "../data/dataTypes";
import { formatValue } from "../utils/formatters";
import { resolveRuleStyle } from "../rules/ruleEngine";
import { RuleEditor } from "../rules/ruleEditor";
import {
    ColumnRuleSet,
    CustomIconAsset,
    IconPreferences
} from "../rules/ruleTypes";

export interface RenderSettings {
    locale: string;
    fontSize: number;
    rowHeight: number;
    textColor: string;
    backgroundColor: string;
    valueAlignment: string;
    hoverBackground: string;
    hoverRadius: number;
    showRowDividers: boolean;
    rowDividerColor: string;
    rowDividerWidth: number;
    showTotals: boolean;
    totalLabel: string;
    totalBackground: string;
    totalTextColor: string;
    totalAlignment: string;
    totalFontSize: number;
    totalBorderRadius: number;
    totalsMode: string;
    totalMenuBackground: string;
    totalMenuBorderColor: string;
    totalMenuFontSize: number;
    totalMenuRadius: number;
    showTitle: boolean;
    titleText: string;
    titleFontSize: number;
    titleColor: string;
    showSubtitle: boolean;
    subtitleText: string;
    subtitleFontSize: number;
    subtitleColor: string;
    titleBarBackground: string;
    titleBarHeight: number;
    showRecordCount: boolean;
    recordCountTextColor: string;
    recordCountBackground: string;
    recordCountFontSize: number;
    recordCountRadius: number;
    recordCountHeight: number;
    recordCountWidth: number;
    recordCountHorizontalPadding: number;
    recordCountAlignment: string;
    showSearch: boolean;
    searchPlaceholder: string;
    searchPosition: string;
    searchWidth: number;
    showSearchIcon: boolean;
    searchIconSize: number;
    searchIconColor: string;
    searchActionIconSize: number;
    searchArrowIconColor: string;
    searchClearIconColor: string;
    showSecondSearch: boolean;
    searchPlaceholder2: string;
    searchHorizontalMargin: number;
    searchBackground: string;
    searchBorderColor: string;
    searchBorderWidth: number;
    searchBorderRadius: number;
    searchHeight: number;
    searchFontSize: number;
    headerBackground: string;
    headerTextColor: string;
    headerBorderColor: string;
    headerBorderMode: string;
    headerBorderWidth: number;
    headerBorderTopWidth: number;
    headerBorderRightWidth: number;
    headerBorderBottomWidth: number;
    headerBorderLeftWidth: number;
    headerBorderRadius: number;
    headerFontSize: number;
    headerFontFamily: string;
    headerAlignment: string;
    headerHeight: number;
    headerPadding: number;
    showColumnFilters: boolean;
    showCheckboxes: boolean;
    showSelectAll: boolean;
    selectionMode: string;
    selectionIndicatorStyle: string;
    selectionIndicatorSize: number;
    selectionColumnWidth: number;
    selectionHorizontalAlignment: string;
    selectionBorderMode: string;
    selectionBackground: string;
    selectionTextColor: string;
    selectionBorderColor: string;
    selectionBorderWidth: number;
    selectionBorderRadius: number;
    dimUnselected: boolean;
    unselectedOpacity: number;
    columnFilters: Array<{
        queryName: string;
        label: string;
        values: string[];
    }>;
    filterBarBackground: string;
    filterBarTextColor: string;
    filterBarChipBackground: string;
    filterBarBorderColor: string;
    filterBarTopBorderWidth: number;
    filterBarBottomSpacing: number;
    filterBarFontSize: number;
    filterBarHeight: number;
    filterBarHorizontalPadding: number;
    filterBarBorderRadius: number;
    paginationEnabled: boolean;
    paginationPosition: string;
    paginationShowPageNumbers: boolean;
    paginationShowRange: boolean;
    paginationBackground: string;
    paginationTextColor: string;
    paginationActiveBackground: string;
    paginationActiveTextColor: string;
    paginationBorderColor: string;
    paginationFontSize: number;
    paginationButtonSize: number;
    paginationSpacing: number;
    paginationHorizontalPadding: number;
    paginationBorderRadius: number;
    topLayoutMode: string;
    topLayoutTitleRow: string;
    topLayoutTitlePosition: number;
    topLayoutTitleAutomaticAlignment: string;
    topLayoutTitleAutomaticSpacing: number;
    topLayoutSearchRow: string;
    topLayoutSearchPosition: number;
    topLayoutSearchAutomaticAlignment: string;
    topLayoutSearchAutomaticSpacing: number;
    topLayoutDownloadRow: string;
    topLayoutDownloadPosition: number;
    topLayoutDownloadAutomaticAlignment: string;
    topLayoutDownloadAutomaticSpacing: number;
    topLayoutPaginationRow: string;
    topLayoutPaginationPosition: number;
    topLayoutPaginationAutomaticAlignment: string;
    topLayoutPaginationAutomaticSpacing: number;
    topLayoutRowGap: number;
    currentPage: number;
    totalPages: number;
    filteredRecordCount: number;
    pageStart: number;
    pageEnd: number;
    downloadEnabled: boolean;
    downloadButtonText: string;
    downloadFileName: string;
    downloadDefaultFormat: string;
    downloadDefaultScope: string;
    downloadShowMenu: boolean;
    downloadShowText: boolean;
    downloadIconSize: number;
    downloadFontSize: number;
    downloadWidth: number;
    downloadHeight: number;
    downloadBackground: string;
    downloadTextColor: string;
    downloadBorderColor: string;
    downloadBorderWidth: number;
    downloadBorderRadius: number;
    downloadMenuBackground: string;
    downloadMenuTextColor: string;
    downloadFormatBackground: string;
    downloadFormatSelected: string;
    downloadFormatSelectedText: string;
    showRuleEditorButton: boolean;
    ruleSets: ColumnRuleSet[];
    customIcons: CustomIconAsset[];
    iconPreferences: IconPreferences;
}

export interface TableRendererCallbacks {
    onSearch(index: number, value: string): void;
    onRowClick(row: TableRow, multiSelect: boolean): void;
    onCheckboxClick(row: TableRow): void;
    onSelectAll(rows: TableRow[], select: boolean): void;
    onRowEnter(event: MouseEvent, row: TableRow): void;
    onRowMove(event: MouseEvent, row: TableRow): void;
    onRowLeave(): void;
    onSort(column: TableColumn, direction?: "asc" | "desc"): void;
    onColumnFilter(column: TableColumn, values: string[]): void;
    onClearColumnFilter(queryName: string): void;
    onColumnResize(column: TableColumn, width: number): void;
    onClearSelection(): void;
    onPageChange(page: number): void;
    onDownload(scope: string, format: string, fileName: string): void;
    onSaveRules(rules: ColumnRuleSet[]): void;
    onSaveCustomIcons(icons: CustomIconAsset[]): void;
    onSaveIconPreferences(preferences: IconPreferences): void;
    onExportConfiguration(): Promise<string>;
    onImportConfiguration(contents: string): Promise<string>;
    onOpenRuleEditor(): void;
}

export class TableRenderer {
    private readonly totalOverrides = new Map<string, string>();
    private readonly root: HTMLElement;
    private readonly ruleConfigBar: HTMLDivElement;
    private readonly toolbar: HTMLDivElement;
    private readonly topRow1: HTMLDivElement;
    private readonly topRow2: HTMLDivElement;
    private readonly title: HTMLDivElement;
    private readonly titleCopy: HTMLDivElement;
    private readonly titleText: HTMLSpanElement;
    private readonly subtitle: HTMLSpanElement;
    private readonly recordCount: HTMLSpanElement;
    private readonly recordCountLabel: HTMLSpanElement;
    private readonly searchGroup: HTMLDivElement;
    private readonly searchShell: HTMLDivElement;
    private readonly searchShell2: HTMLDivElement;
    private readonly searchIcon: HTMLSpanElement;
    private readonly searchInput: HTMLInputElement;
    private readonly searchInput2: HTMLInputElement;
    private readonly searchAction: HTMLButtonElement;
    private readonly searchAction2: HTMLButtonElement;
    private readonly downloadWrapper: HTMLDivElement;
    private readonly downloadButton: HTMLButtonElement;
    private readonly downloadText: HTMLSpanElement;
    private readonly downloadMenu: HTMLDivElement;
    private readonly downloadFormat: HTMLDivElement;
    private readonly downloadNotice: HTMLDivElement;
    private readonly ruleButton: HTMLButtonElement;
    private readonly ruleEditor: RuleEditor;
    private readonly viewport: HTMLDivElement;
    private readonly filterRegion: HTMLDivElement;
    private readonly filterBar: HTMLDivElement;
    private readonly pagination: HTMLDivElement;
    private readonly table: HTMLTableElement;
    private readonly head: HTMLTableSectionElement;
    private readonly body: HTMLTableSectionElement;
    private readonly foot: HTMLTableSectionElement;
    private readonly emptyState: HTMLDivElement;
    private callbacks: TableRendererCallbacks | null = null;
    private downloadShowMenu = true;
    private downloadDefaultScope = "filtered";
    private downloadFileName = "AdvanceTable";
    private downloadSelectedFormat = "xlsx";
    private currentModel: TableModel | null = null;
    private currentRuleSets: ColumnRuleSet[] = [];
    private currentCustomIcons: CustomIconAsset[] = [];
    private currentIconPreferences: IconPreferences = {
        hiddenNativeIcons: [],
        pickerSize: "expanded",
        pickerIconSize: "normal",
        nativeIconOrder: []
    };
    private readonly automaticSlotAssignments = new Map<string, string>();
    private readonly automaticEntryOrder = new Map<string, number>();
    private automaticEntrySequence = 0;

    constructor(target: HTMLElement) {
        this.root = document.createElement("div");
        this.root.className = "power-table";

        this.toolbar = document.createElement("div");
        this.toolbar.className = "power-table__toolbar";
        this.topRow1 = document.createElement("div");
        this.topRow1.className = "power-table__top-row";
        this.topRow1.dataset.row = "1";
        this.topRow2 = document.createElement("div");
        this.topRow2.className = "power-table__top-row";
        this.topRow2.dataset.row = "2";
        this.title = document.createElement("div");
        this.title.className = "power-table__title";
        this.titleCopy = document.createElement("div");
        this.titleCopy.className = "power-table__title-copy";
        this.titleText = document.createElement("span");
        this.titleText.className = "power-table__title-text";
        this.subtitle = document.createElement("span");
        this.subtitle.className = "power-table__subtitle";
        this.titleCopy.append(this.titleText, this.subtitle);
        this.recordCount = document.createElement("span");
        this.recordCount.className = "power-table__record-count";
        this.recordCountLabel = document.createElement("span");
        this.recordCountLabel.className = "power-table__record-count-label";
        this.recordCount.appendChild(this.recordCountLabel);
        this.title.append(this.titleCopy, this.recordCount);

        this.searchGroup = document.createElement("div");
        this.searchGroup.className = "power-table__search-group";
        this.searchShell = document.createElement("div");
        this.searchShell.className = "power-table__search-shell";
        this.searchIcon = document.createElement("span");
        this.searchIcon.className = "power-table__search-icon";
        this.searchIcon.setAttribute("aria-hidden", "true");
        const svgNamespace = "http://www.w3.org/2000/svg";
        const searchSvg = document.createElementNS(svgNamespace, "svg");
        searchSvg.setAttribute("viewBox", "0 0 24 24");
        searchSvg.setAttribute("focusable", "false");
        const searchPath = document.createElementNS(svgNamespace, "path");
        searchPath.setAttribute(
            "d",
            "m20.7 19.3-4.2-4.2a7.5 7.5 0 1 0-1.4 1.4l4.2 4.2a1 1 0 0 0 1.4-1.4ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"
        );
        searchSvg.appendChild(searchPath);
        this.searchIcon.appendChild(searchSvg);
        this.searchInput = document.createElement("input");
        this.searchInput.className = "power-table__search";
        this.searchInput.type = "text";
        this.searchInput.setAttribute("aria-label", "Pesquisar na tabela");
        this.searchAction = document.createElement("button");
        this.searchAction.className = "power-table__search-action";
        this.searchAction.type = "button";
        this.searchShell.append(this.searchIcon, this.searchInput, this.searchAction);

        this.searchShell2 = document.createElement("div");
        this.searchShell2.className = "power-table__search-shell";
        const searchIcon2 = this.searchIcon.cloneNode(true) as HTMLSpanElement;
        searchIcon2.className = "power-table__search-icon";
        this.searchInput2 = document.createElement("input");
        this.searchInput2.className = "power-table__search";
        this.searchInput2.type = "text";
        this.searchInput2.setAttribute("aria-label", "Segunda pesquisa na tabela");
        this.searchAction2 = document.createElement("button");
        this.searchAction2.className = "power-table__search-action";
        this.searchAction2.type = "button";
        this.searchShell2.append(searchIcon2, this.searchInput2, this.searchAction2);
        this.searchGroup.append(this.searchShell, this.searchShell2);
        this.downloadWrapper = document.createElement("div");
        this.downloadWrapper.className = "power-table__download-wrapper";
        this.downloadButton = document.createElement("button");
        this.downloadButton.type = "button";
        this.downloadButton.className = "power-table__download-button";
        this.downloadButton.setAttribute("aria-label", "Baixar tabela");
        const downloadIcon = document.createElementNS(svgNamespace, "svg");
        downloadIcon.setAttribute("viewBox", "0 0 24 24");
        downloadIcon.setAttribute("aria-hidden", "true");
        const downloadPath = document.createElementNS(svgNamespace, "path");
        downloadPath.setAttribute(
            "d",
            "M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6V3ZM5 19h14v2H5v-2Z"
        );
        downloadIcon.appendChild(downloadPath);
        this.downloadText = document.createElement("span");
        this.downloadButton.append(downloadIcon, this.downloadText);
        this.downloadMenu = document.createElement("div");
        this.downloadMenu.className = "power-table__download-menu";
        this.downloadMenu.hidden = true;
        const formatLabel = document.createElement("span");
        formatLabel.className = "power-table__download-format-label";
        formatLabel.textContent = "Formato";
        this.downloadFormat = document.createElement("div");
        this.downloadFormat.className = "power-table__download-formats";
        [
            ["xlsx", "Excel (.xlsx)"],
            ["csv", "CSV"]
        ].forEach(([value, label]) => {
            const option = document.createElement("button");
            option.type = "button";
            option.dataset.format = value;
            option.textContent = label;
            option.addEventListener("click", (event) => {
                event.stopPropagation();
                this.setDownloadFormat(value);
            });
            this.downloadFormat.appendChild(option);
        });
        this.downloadNotice = document.createElement("div");
        this.downloadNotice.className = "power-table__download-notice";
        this.downloadNotice.hidden = true;
        this.downloadMenu.append(formatLabel, this.downloadFormat, this.downloadNotice);
        [
            ["filtered", "Resultados filtrados"],
            ["all", "Todos os registros"],
            ["page", "Página atual"],
            ["selected", "Somente selecionados"]
        ].forEach(([scope, label]) => {
            const option = document.createElement("button");
            option.type = "button";
            option.dataset.scope = scope;
            option.textContent = label;
            option.addEventListener("click", (event) => {
                event.stopPropagation();
                this.downloadMenu.hidden = true;
                this.callbacks?.onDownload(
                    scope,
                    this.downloadSelectedFormat,
                    this.downloadFileName
                );
            });
            this.downloadMenu.appendChild(option);
        });
        this.downloadButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.downloadNotice.hidden = true;
            if (!this.downloadShowMenu) {
                this.callbacks?.onDownload(
                    this.downloadDefaultScope,
                    this.downloadSelectedFormat,
                    this.downloadFileName
                );
                return;
            }
            this.downloadMenu.hidden = !this.downloadMenu.hidden;
        });
        this.downloadMenu.addEventListener(
            "click",
            (event) => event.stopPropagation()
        );
        this.downloadWrapper.append(this.downloadButton, this.downloadMenu);
        this.ruleButton = document.createElement("button");
        this.ruleButton.type = "button";
        this.ruleButton.className = "power-table__rule-button";
        this.ruleButton.textContent = "ƒx";
        this.ruleButton.title = "Abrir editor de regras";
        this.ruleButton.setAttribute("aria-label", "Abrir editor de regras");
        this.ruleButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (this.currentModel) this.callbacks?.onOpenRuleEditor();
        });
        this.ruleConfigBar = document.createElement("div");
        this.ruleConfigBar.className = "power-table__rule-config-bar";
        this.ruleConfigBar.appendChild(this.ruleButton);
        this.toolbar.append(this.topRow1, this.topRow2);

        this.viewport = document.createElement("div");
        this.viewport.className = "power-table__viewport";
        this.table = document.createElement("table");
        this.table.className = "power-table__table";
        this.head = document.createElement("thead");
        this.body = document.createElement("tbody");
        this.foot = document.createElement("tfoot");
        this.table.append(this.head, this.body, this.foot);
        this.viewport.appendChild(this.table);

        this.emptyState = document.createElement("div");
        this.emptyState.className = "power-table__empty";

        this.filterBar = document.createElement("div");
        this.filterBar.className = "power-table__filter-bar";
        this.filterRegion = document.createElement("div");
        this.filterRegion.className = "power-table__filter-region";
        this.filterRegion.appendChild(this.filterBar);
        this.pagination = document.createElement("div");
        this.pagination.className = "power-table__pagination";
        this.root.append(
            this.ruleConfigBar,
            this.toolbar,
            this.filterRegion,
            this.viewport,
            this.pagination,
            this.emptyState
        );
        target.replaceChildren(this.root);
        this.ruleEditor = new RuleEditor(
            this.root,
            (rules) => {
                this.currentRuleSets = rules;
                this.callbacks?.onSaveRules(rules);
            },
            (icons) => {
                this.currentCustomIcons = icons;
                this.callbacks?.onSaveCustomIcons(icons);
            },
            (preferences) => {
                this.currentIconPreferences = preferences;
                this.callbacks?.onSaveIconPreferences(preferences);
            },
            () =>
                this.callbacks?.onExportConfiguration() ||
                Promise.reject(new Error("Exportação indisponível.")),
            (contents) =>
                this.callbacks?.onImportConfiguration(contents) ||
                Promise.reject(new Error("Importação indisponível."))
        );

        this.searchInput.addEventListener("input", () => {
            this.updateSearchAction(this.searchInput, this.searchAction);
            this.callbacks?.onSearch(0, this.searchInput.value);
        });
        this.searchInput2.addEventListener("input", () => {
            this.updateSearchAction(this.searchInput2, this.searchAction2);
            this.callbacks?.onSearch(1, this.searchInput2.value);
        });
        this.searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.callbacks?.onSearch(0, this.searchInput.value);
            }
        });
        this.searchInput2.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.callbacks?.onSearch(1, this.searchInput2.value);
            }
        });
        this.searchAction.addEventListener("click", () =>
            this.handleSearchAction(0, this.searchInput, this.searchAction)
        );
        this.searchAction2.addEventListener("click", () =>
            this.handleSearchAction(1, this.searchInput2, this.searchAction2)
        );
        this.updateSearchAction(this.searchInput, this.searchAction);
        this.updateSearchAction(this.searchInput2, this.searchAction2);
        this.root.addEventListener("click", (event) => {
            if (event.target === this.root || event.target === this.viewport) {
                this.callbacks?.onClearSelection();
            }
        });
    }

    public setCallbacks(callbacks: TableRendererCallbacks): void {
        this.callbacks = callbacks;
    }

    public showDownloadNotice(message: string): void {
        this.downloadNotice.textContent = message;
        this.downloadNotice.hidden = false;
        this.downloadMenu.hidden = false;
    }

    public openRuleEditor(): void {
        if (this.currentModel) {
            this.ruleEditor.open(
                this.currentModel,
                this.currentRuleSets,
                this.currentCustomIcons,
                this.currentIconPreferences
            );
        }
    }

    private setDownloadFormat(format: string): void {
        this.downloadSelectedFormat = format;
        this.downloadFormat
            .querySelectorAll<HTMLButtonElement>("button[data-format]")
            .forEach((button) => {
                button.classList.toggle(
                    "is-selected",
                    button.dataset.format === format
                );
            });
    }

    public render(
        model: TableModel | null,
        rows: TableRow[],
        aggregateRows: TableRow[],
        settings: RenderSettings,
        selectedKeys: Set<string>,
        sortQueryName?: string,
        sortDirection?: "asc" | "desc"
    ): void {
        this.applySettings(settings);
        this.currentModel = model;
        this.currentRuleSets = settings.ruleSets;
        this.currentCustomIcons = settings.customIcons;
        this.currentIconPreferences = settings.iconPreferences;
        this.ruleButton.disabled = model === null;
        this.ruleButton.hidden = !settings.showRuleEditorButton;
        this.ruleConfigBar.hidden = !settings.showRuleEditorButton;
        this.root.classList.toggle("has-selection", selectedKeys.size > 0);
        this.downloadMenu.querySelectorAll<HTMLButtonElement>(
            'button[data-scope="selected"]'
        ).forEach((button) => {
            button.disabled = selectedKeys.size === 0;
        });
        this.root.dataset.totalRecords = String(model?.rows.length || 0);
        this.root.dataset.visibleRecords = String(settings.filteredRecordCount);
        this.updateRecordCount(selectedKeys);
        this.searchInput.disabled = model === null;
        this.searchInput2.disabled = model === null;
        this.head.replaceChildren();
        this.body.replaceChildren();
        this.foot.replaceChildren();
        this.renderFilterChips(settings.columnFilters);
        this.renderPagination(settings);
        this.applyTopLayout(settings);
        this.filterRegion.hidden = this.filterBar.hidden;

        if (!model || model.columns.length === 0) {
            this.table.hidden = true;
            this.emptyState.hidden = false;
            this.emptyState.textContent = "Adicione campos em Colunas para exibir a tabela.";
            return;
        }

        const headerRow = document.createElement("tr");
        if (settings.showCheckboxes) {
            const selectorHeader = document.createElement("th");
            selectorHeader.className = "power-table__selection-column";
            if (settings.showSelectAll) {
                const selectorContent = document.createElement("div");
                selectorContent.className = "power-table__selection-content";
                const selectAll = document.createElement("input");
                selectAll.type = "checkbox";
                selectAll.className = "power-table__selection-indicator is-checkbox";
                const selectedCount = rows.filter((row) =>
                    selectedKeys.has(row.selectionId.getKey())
                ).length;
                selectAll.checked = rows.length > 0 && selectedCount === rows.length;
                selectAll.indeterminate =
                    selectedCount > 0 && selectedCount < rows.length;
                selectAll.setAttribute("aria-label", "Selecionar todas as linhas");
                selectorHeader.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.callbacks?.onSelectAll(rows, !selectAll.checked);
                });
                selectorContent.appendChild(selectAll);
                selectorHeader.appendChild(selectorContent);
            }
            selectorHeader.setAttribute("aria-label", "Seleção");
            headerRow.appendChild(selectorHeader);
        }
        model.columns.forEach((column) => {
            const header = document.createElement("th");
            header.classList.add("power-table__header-cell");
            if (column.style.allowWidthReduction) {
                const reducedWidth = Math.max(0, column.style.reducedWidth);
                header.classList.add("is-width-reducible");
                header.classList.toggle("is-hidden-column", reducedWidth === 0);
                header.style.width = `${reducedWidth === 0 ? 7 : reducedWidth}px`;
                header.style.minWidth =
                    `${reducedWidth === 0 ? 7 : reducedWidth}px`;
                header.style.maxWidth =
                    `${reducedWidth === 0 ? 7 : reducedWidth}px`;
            }
            const button = document.createElement("button");
            button.type = "button";
            button.className = "power-table__sort";
            button.textContent = column.displayName;
            button.title = column.displayName;
            if (column.style.customHeaderPadding) {
                button.style.paddingLeft = `${column.style.headerPadding}px`;
                button.style.paddingRight = `${column.style.headerPadding}px`;
            }
            if (column.style.customHeaderFontSize) {
                button.style.fontSize = `${column.style.headerFontSize}px`;
            }
            if (column.style.customHeaderTextColor) {
                button.style.color = column.style.headerTextColor;
            }
            if (column.style.customHeaderAlignment &&
                column.style.headerAlignment !== "auto") {
                button.style.textAlign = column.style.headerAlignment;
            }
            if (column.style.customHeaderBackgroundColor) {
                header.style.backgroundColor = column.style.headerBackgroundColor;
            }
            if (column.queryName === sortQueryName) {
                const indicator = document.createElement("span");
                indicator.className = "power-table__sort-indicator";
                indicator.textContent = sortDirection === "desc" ? "▼" : "▲";
                indicator.setAttribute("aria-hidden", "true");
                button.appendChild(indicator);
                button.setAttribute(
                    "aria-sort",
                    sortDirection === "desc" ? "descending" : "ascending"
                );
            }
            const filterButton = document.createElement("button");
            filterButton.type = "button";
            filterButton.className = "power-table__column-filter";
            const showColumnFilter =
                column.style.filterVisibility === "show"
                    ? true
                    : column.style.filterVisibility === "hide"
                        ? false
                        : Boolean(settings.showColumnFilters);
            filterButton.hidden = !showColumnFilter;
            const activeFilter = settings.columnFilters.find(
                (filter) => filter.queryName === column.queryName
            );
            filterButton.classList.toggle("is-active", Boolean(activeFilter));
            filterButton.setAttribute(
                "aria-label",
                `Filtrar ${column.displayName}`
            );
            const filterIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            filterIcon.setAttribute("viewBox", "0 0 16 16");
            filterIcon.setAttribute("aria-hidden", "true");
            const filterPath = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            filterPath.setAttribute(
                "d",
                "M2 3h12L9.2 8.4v4.1l-2.4 1V8.4L2 3Zm2.2 1 3.6 4v4l.4-.2V8l3.6-4H4.2Z"
            );
            filterIcon.appendChild(filterPath);
            filterButton.appendChild(filterIcon);
            filterButton.addEventListener("click", (event) => {
                event.stopPropagation();
                this.openColumnFilterMenu(
                    header,
                    column,
                    model.rows,
                    model.columns.indexOf(column),
                    activeFilter?.values
                );
            });
            header.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.openColumnFilterMenu(
                    header,
                    column,
                    model.rows,
                    model.columns.indexOf(column),
                    activeFilter?.values
                );
            });
            const headerContent = document.createElement("div");
            headerContent.className = "power-table__header-content";
            headerContent.hidden =
                column.style.allowWidthReduction &&
                column.style.reducedWidth <= 0;
            headerContent.appendChild(button);
            if (showColumnFilter) {
                headerContent.appendChild(filterButton);
            }
            header.appendChild(headerContent);
            const resizeHandle = document.createElement("span");
            resizeHandle.className = "power-table__column-resizer";
            resizeHandle.title = "Arraste para redimensionar a coluna";
            resizeHandle.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const startX = event.clientX;
                const startWidth = header.getBoundingClientRect().width;
                resizeHandle.setPointerCapture(event.pointerId);
                const move = (moveEvent: PointerEvent): void => {
                    const rawWidth = Math.round(
                        startWidth + moveEvent.clientX - startX
                    );
                    const width = rawWidth <= 12 ? 0 : rawWidth;
                    header.classList.add("is-width-reducible");
                    header.classList.toggle("is-hidden-column", width === 0);
                    headerContent.hidden = width === 0;
                    header.style.width = `${width === 0 ? 7 : width}px`;
                    header.style.minWidth = `${width === 0 ? 7 : width}px`;
                    header.style.maxWidth = `${width === 0 ? 7 : width}px`;
                    resizeHandle.dataset.width = String(width);
                };
                const finish = (finishEvent: PointerEvent): void => {
                    resizeHandle.removeEventListener("pointermove", move);
                    resizeHandle.removeEventListener("pointerup", finish);
                    resizeHandle.removeEventListener("pointercancel", finish);
                    const width = Number(
                        resizeHandle.dataset.width || Math.round(startWidth)
                    );
                    resizeHandle.releasePointerCapture(finishEvent.pointerId);
                    this.callbacks?.onColumnResize(column, width);
                };
                resizeHandle.addEventListener("pointermove", move);
                resizeHandle.addEventListener("pointerup", finish);
                resizeHandle.addEventListener("pointercancel", finish);
            });
            resizeHandle.addEventListener("dblclick", (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.callbacks?.onColumnResize(column, -1);
            });
            header.appendChild(resizeHandle);
            headerRow.appendChild(header);
        });
        this.head.appendChild(headerRow);

        rows.forEach((row) => {
            const tableRow = document.createElement("tr");
            const rowKey = row.selectionId.getKey();
            const isSelected = selectedKeys.has(rowKey);
            tableRow.tabIndex = 0;
            tableRow.dataset.selectionKey = rowKey;
            tableRow.classList.toggle("is-selected", isSelected);
            tableRow.addEventListener("click", (event) =>
                this.callbacks?.onRowClick(row, event.ctrlKey || event.metaKey)
            );
            tableRow.addEventListener("mouseenter", (event) =>
                this.callbacks?.onRowEnter(event, row)
            );
            tableRow.addEventListener("mousemove", (event) =>
                this.callbacks?.onRowMove(event, row)
            );
            tableRow.addEventListener("mouseleave", () => this.callbacks?.onRowLeave());
            tableRow.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    this.callbacks?.onRowClick(row, event.ctrlKey || event.metaKey);
                }
            });

            if (settings.showCheckboxes) {
                const selectorCell = document.createElement("td");
                selectorCell.className = "power-table__selection-column";
                const checkbox = document.createElement("input");
                checkbox.type = settings.selectionIndicatorStyle === "radio"
                    ? "radio"
                    : "checkbox";
                checkbox.className =
                    `power-table__selection-indicator is-${settings.selectionIndicatorStyle}`;
                checkbox.checked = isSelected;
                checkbox.setAttribute("aria-label", "Selecionar linha");
                selectorCell.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.callbacks?.onCheckboxClick(row);
                });
                const selectorContent = document.createElement("div");
                selectorContent.className = "power-table__selection-content";
                selectorContent.appendChild(checkbox);
                selectorCell.appendChild(selectorContent);
                tableRow.appendChild(selectorCell);
            }

            row.formattedValues.forEach((value, columnIndex) => {
                const cell = document.createElement("td");
                const column = model.columns[columnIndex];
                const cellStyle = row.cellStyles[columnIndex] || column.style;
                if (column.style.allowWidthReduction) {
                    const reducedWidth = Math.max(
                        0,
                        column.style.reducedWidth
                    );
                    if (reducedWidth === 0) {
                        cell.hidden = true;
                    }
                    cell.classList.add("is-width-reducible");
                    cell.style.width = `${reducedWidth}px`;
                    cell.style.minWidth = `${reducedWidth}px`;
                    cell.style.maxWidth = `${reducedWidth}px`;
                    cell.title = value;
                }
                const resolvedRule = resolveRuleStyle(
                    settings.ruleSets,
                    column.queryName,
                    row,
                    model,
                    settings.locale
                );
                const displayMode = resolvedRule?.mode || "value";
                const normalizedValue = value.trim().toLocaleLowerCase(
                    settings.locale
                );
                const colorRuleIndex = cellStyle.pillValues.findIndex(
                    (ruleValue) =>
                        Boolean(ruleValue.trim()) &&
                        ruleValue.trim().toLocaleLowerCase(settings.locale) ===
                            normalizedValue
                );
                const ruleBackground = colorRuleIndex >= 0
                    ? cellStyle.pillColors[colorRuleIndex]
                    : undefined;
                const ruleTextColor = colorRuleIndex >= 0
                    ? cellStyle.pillTextColors[colorRuleIndex]
                    : undefined;
                const baseTextColor =
                    cellStyle.customTextColor || cellStyle.hasRowTextColor
                        ? cellStyle.textColor
                        : settings.textColor;
                const baseBackgroundColor =
                    cellStyle.customBackgroundColor ||
                    cellStyle.hasRowBackgroundColor
                        ? cellStyle.backgroundColor
                        : settings.backgroundColor;
                if (cellStyle.customCellPadding) {
                    cell.style.paddingLeft = `${cellStyle.cellPadding}px`;
                    cell.style.paddingRight = `${cellStyle.cellPadding}px`;
                }
                const resolvedTextColor =
                    resolvedRule?.followBackground &&
                    resolvedRule.backgroundColor
                        ? this.darkenColor(resolvedRule.backgroundColor)
                        : resolvedRule?.textColor;
                cell.style.color = displayMode === "pill"
                    ? baseTextColor
                    : resolvedTextColor ||
                        ruleTextColor ||
                        baseTextColor;
                cell.style.backgroundColor =
                    displayMode === "pill" ||
                    displayMode === "bar" ||
                    displayMode === "icon"
                    ? baseBackgroundColor
                    : resolvedRule?.backgroundColor ||
                        ruleBackground ||
                        baseBackgroundColor;
                const resolvedCellAlignment = this.resolveCellAlignment(
                    column.style.alignment,
                    settings.valueAlignment,
                    column.isNumeric
                );
                cell.style.textAlign = resolvedCellAlignment;
                cell.classList.add(`is-align-${resolvedCellAlignment}`);
                if (displayMode === "pill") {
                    const pill = document.createElement("span");
                    pill.className = "power-table__pill";
                    const uniqueValues = Array.from(new Set(
                        rows.map((candidate) =>
                            candidate.formattedValues[columnIndex]
                        )
                    ));
                    const valueIndex = Math.max(0, uniqueValues.indexOf(value));
                    const primaryColors = [
                        "#DBEAFE",
                        "#FEE2E2",
                        "#FEF3C7",
                        "#DCFCE7"
                    ];
                    const automaticColor = valueIndex < primaryColors.length
                        ? primaryColors[valueIndex]
                        : `hsl(${(valueIndex * 137.508) % 360}, 72%, 90%)`;
                    const numericValue = Number(row.values[columnIndex]);
                    const signColor = Number.isFinite(numericValue) &&
                        numericValue < 0
                        ? cellStyle.pillNegativeColor
                        : cellStyle.pillPositiveColor;
                    const configuredPillColor = cellStyle.pillRandomColors
                        ? automaticColor
                        : cellStyle.pillPositiveNegative
                            ? signColor
                            : cellStyle.pillFunctionColor;
                    const hasValueBackground =
                        baseBackgroundColor !== "rgba(0,0,0,0)" &&
                        baseBackgroundColor !== "transparent";
                    const pillColor = resolvedRule?.backgroundColor ||
                        ruleBackground ||
                        (cellStyle.hasRowPillFunctionColor
                        ? cellStyle.pillFunctionColor
                        : cellStyle.hasRowBackgroundColor || hasValueBackground
                            ? baseBackgroundColor
                            : configuredPillColor);
                    const pillTextColor = resolvedRule
                        ? resolvedRule.followBackground
                            ? this.darkenColor(pillColor)
                            : resolvedRule.textColor ||
                                baseTextColor
                        : ruleTextColor ||
                            (cellStyle.hasRowTextColor
                            ? baseTextColor
                            : cellStyle.pillTextFollowsBackground
                                ? this.darkenColor(pillColor)
                                : baseTextColor);
                    pill.style.backgroundColor = pillColor;
                    pill.style.borderColor = pillColor;
                    pill.style.color = pillTextColor;
                    pill.style.borderRadius = `${cellStyle.pillRadius}px`;
                    const label = document.createElement("span");
                    label.textContent = value;
                    const markerType =
                        resolvedRule?.labelMarker || "circle";
                    if (markerType !== "none") {
                        const marker = document.createElement("span");
                        marker.className =
                            `power-table__pill-dot is-${markerType}`;
                        marker.style.backgroundColor = pillTextColor;
                        pill.appendChild(marker);
                    }
                    pill.appendChild(label);
                    cell.appendChild(pill);
                } else if (displayMode === "bar") {
                    const content = document.createElement("span");
                    content.className = "power-table__bar-content";
                    const barStyle =
                        resolvedRule?.barStyle || "adjacent";
                    const barPosition =
                        resolvedRule?.barPosition || "before";
                    content.classList.toggle(
                        "is-cell-fill",
                        barStyle === "cellFill"
                    );
                    const maxLabelLength = Math.max(
                        1,
                        ...rows.map((candidate) =>
                            candidate.formattedValues[columnIndex]?.length || 0
                        )
                    );
                    const labelWidth = Math.max(
                        40,
                        Math.ceil(maxLabelLength * settings.fontSize * 0.62)
                    );
                    content.style.width = barStyle === "cellFill"
                        ? "100%"
                        : barPosition === "only"
                            ? `${cellStyle.barWidth}px`
                            : `${cellStyle.barWidth + 8 + labelWidth}px`;
                    const resolvedAlignment =
                        cellStyle.alignment !== "auto"
                            ? cellStyle.alignment
                            : settings.valueAlignment !== "auto"
                                ? settings.valueAlignment
                                : column.isNumeric ? "right" : "left";
                    content.classList.add(`is-${resolvedAlignment}`);
                    const track = document.createElement("span");
                    track.className = "power-table__bar-track";
                    track.style.width = barStyle === "cellFill"
                        ? "100%"
                        : `${cellStyle.barWidth}px`;
                    track.style.height = barStyle === "cellFill"
                        ? "100%"
                        : `${cellStyle.barHeight}px`;
                    track.style.backgroundColor =
                        resolvedRule?.barTrackColor ||
                        cellStyle.barTrackColor;
                    const fill = document.createElement("span");
                    fill.className = "power-table__bar-fill";
                    const activeRuleSet = settings.ruleSets.find(
                        (ruleSet) =>
                            ruleSet.targetQueryName === column.queryName
                    );
                    const sourceQueryName =
                        activeRuleSet?.rules[0]?.sourceQueryName ||
                        activeRuleSet?.defaultRule?.sourceQueryName ||
                        column.queryName;
                    const visibleSourceIndex = model.columns.findIndex(
                        (candidate) =>
                            candidate.queryName === sourceQueryName
                    );
                    const auxiliarySourceIndex = model.ruleColumns.findIndex(
                        (candidate) =>
                            candidate.queryName === sourceQueryName
                    );
                    const barRawValue = visibleSourceIndex >= 0
                        ? row.values[visibleSourceIndex]
                        : auxiliarySourceIndex >= 0
                            ? row.ruleValues[auxiliarySourceIndex]
                            : row.values[columnIndex];
                    const numeric = Number(barRawValue);
                    const normalizedValue =
                        Number.isFinite(numeric) &&
                        Math.abs(numeric) <= 1 &&
                        cellStyle.barMaximum > 1
                            ? numeric * 100
                            : numeric;
                    const minimum =
                        resolvedRule?.barMinimum ?? cellStyle.barMinimum;
                    const maximum =
                        resolvedRule?.barMaximum ?? cellStyle.barMaximum;
                    const range = Math.max(
                        0.0001,
                        maximum - minimum
                    );
                    const ratio = Math.max(
                        0,
                        Math.min(
                            1,
                            (normalizedValue - minimum) / range
                        )
                    );
                    fill.style.width = `${ratio * 100}%`;
                    fill.style.backgroundColor =
                        resolvedRule?.barColor ||
                        (normalizedValue < cellStyle.barThreshold
                            ? cellStyle.barLowColor
                            : cellStyle.barHighColor);
                    track.appendChild(fill);
                    const label = document.createElement("span");
                    label.className = "power-table__bar-value";
                    label.style.width = `${labelWidth}px`;
                    label.textContent = value;
                    if (barPosition === "only") {
                        content.appendChild(track);
                    } else if (barPosition === "after") {
                        content.append(label, track);
                    } else {
                        content.append(track, label);
                    }
                    cell.appendChild(content);
                } else if (displayMode === "icon") {
                    const content = document.createElement("span");
                    content.className = "power-table__cell-content";
                    content.style.width = "100%";
                    content.style.justifyContent =
                        resolvedCellAlignment === "right"
                            ? "flex-end"
                            : resolvedCellAlignment === "center"
                                ? "center"
                                : "flex-start";
                    content.style.color =
                        resolvedRule?.iconColor || cellStyle.iconColor;
                    const icon = this.createCellIcon(
                        row.values[columnIndex],
                        resolvedRule?.icon || cellStyle.iconStyle
                    );
                    const ruleIconSize = resolvedRule?.iconSize === "small"
                        ? 15
                        : resolvedRule?.iconSize === "large"
                            ? 32
                            : 22;
                    icon.style.width = `${ruleIconSize}px`;
                    icon.style.height = `${ruleIconSize}px`;
                    icon.style.flexBasis = `${ruleIconSize}px`;
                    const iconPosition =
                        resolvedRule?.iconPosition ||
                        (cellStyle.iconLayout === "right"
                            ? "after"
                            : cellStyle.iconLayout === "only"
                                ? "only"
                                : "before");
                    if (iconPosition !== "after") {
                        content.appendChild(icon);
                    }
                    if (iconPosition !== "only") {
                        const label = document.createElement("span");
                        label.className = "power-table__cell-label";
                        label.style.color = cellStyle.textColor;
                        label.style.fontSize = `${settings.fontSize}px`;
                        label.textContent = value;
                        content.appendChild(label);
                    }
                    if (iconPosition === "after") {
                        content.appendChild(icon);
                    }
                    cell.appendChild(content);
                } else {
                    cell.textContent = value;
                }
                cell.classList.toggle("is-numeric", column.isNumeric);
                tableRow.appendChild(cell);
            });
            this.body.appendChild(tableRow);
        });

        if (settings.showTotals) {
            this.renderTotals(model, aggregateRows, settings);
        }
        this.updateSelectionGroupClasses();

        this.table.hidden = false;
        this.table.classList.toggle(
            "has-width-reducible-columns",
            model.columns.some((column) =>
                column.style.allowWidthReduction
            )
        );
        this.foot.hidden = !settings.showTotals;
        this.emptyState.hidden = rows.length > 0;
        this.emptyState.textContent = "Nenhum resultado encontrado.";
    }

    public setSelected(selectionKeys: Set<string>): void {
        this.root.classList.toggle("has-selection", selectionKeys.size > 0);
        this.downloadMenu.querySelectorAll<HTMLButtonElement>(
            'button[data-scope="selected"]'
        ).forEach((button) => {
            button.disabled = selectionKeys.size === 0;
        });
        this.body.querySelectorAll<HTMLTableRowElement>("tr").forEach((row) => {
            const selected = selectionKeys.has(row.dataset.selectionKey || "");
            row.classList.toggle("is-selected", selected);
            const checkbox = row.querySelector<HTMLInputElement>(
                ".power-table__selection-indicator"
            );
            if (checkbox) {
                checkbox.checked = selected;
            }
        });
        const selectAll = this.head.querySelector<HTMLInputElement>(
            ".power-table__selection-indicator"
        );
        if (selectAll) {
            const rows = Array.from(
                this.body.querySelectorAll<HTMLTableRowElement>("tr")
            );
            const selectedCount = rows.filter((row) =>
                selectionKeys.has(row.dataset.selectionKey || "")
            ).length;
            selectAll.checked = rows.length > 0 && selectedCount === rows.length;
            selectAll.indeterminate =
                selectedCount > 0 && selectedCount < rows.length;
        }
        this.updateRecordCount(selectionKeys);
        this.updateSelectionGroupClasses();
    }

    public getSearchTexts(): string[] {
        return [this.searchInput.value, this.searchInput2.value];
    }

    private updateRecordCount(selectionKeys: Set<string>): void {
        const total = Number(this.root.dataset.totalRecords || 0);
        const visible = Number(this.root.dataset.visibleRecords || total);
        const selected = selectionKeys.size;
        this.recordCountLabel.textContent = selected > 0
            ? `${selected} de ${total} registros`
            : visible < total
                ? `${visible} de ${total} registros`
                : `${total} registros`;
    }

    private renderFilterChips(
        filters: RenderSettings["columnFilters"]
    ): void {
        this.filterBar.replaceChildren();
        this.filterBar.hidden = filters.length === 0;
        filters.forEach((filter) => {
            const chip = document.createElement("span");
            chip.className = "power-table__filter-chip";
            const label = document.createElement("span");
            label.textContent =
                `${filter.label}: ${filter.values.length} valor(es)`;
            const clear = document.createElement("button");
            clear.type = "button";
            clear.textContent = "×";
            clear.setAttribute("aria-label", `Limpar filtro ${filter.label}`);
            clear.addEventListener("click", () =>
                this.callbacks?.onClearColumnFilter(filter.queryName)
            );
            chip.append(label, clear);
            this.filterBar.appendChild(chip);
        });
        if (filters.length > 1) {
            const clearAll = document.createElement("button");
            clearAll.type = "button";
            clearAll.className = "power-table__filter-clear-all";
            clearAll.textContent = "Limpar filtros";
            clearAll.addEventListener("click", () => filters.forEach((filter) =>
                this.callbacks?.onClearColumnFilter(filter.queryName)
            ));
            this.filterBar.appendChild(clearAll);
        }
    }

    private renderPagination(settings: RenderSettings): void {
        this.pagination.replaceChildren();
        this.pagination.hidden =
            !settings.paginationEnabled || settings.filteredRecordCount === 0;
        if (this.pagination.hidden) {
            return;
        }

        if (settings.paginationShowRange) {
            const range = document.createElement("span");
            range.className = "power-table__pagination-range";
            range.textContent =
                `${settings.pageStart}–${settings.pageEnd} de ` +
                `${settings.filteredRecordCount} registros`;
            this.pagination.appendChild(range);
        }

        const controls = document.createElement("div");
        controls.className = "power-table__pagination-controls";
        const addButton = (
            label: string,
            page: number,
            disabled: boolean,
            active = false
        ): void => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.disabled = disabled;
            button.classList.toggle("is-active", active);
            if (active) {
                button.setAttribute("aria-current", "page");
            }
            button.addEventListener("click", () =>
                this.callbacks?.onPageChange(page)
            );
            controls.appendChild(button);
        };

        addButton("‹", settings.currentPage - 1, settings.currentPage <= 1);
        if (settings.paginationShowPageNumbers) {
            const first = Math.max(
                1,
                Math.min(settings.currentPage - 2, settings.totalPages - 4)
            );
            const last = Math.min(settings.totalPages, first + 4);
            for (let page = first; page <= last; page += 1) {
                addButton(
                    String(page),
                    page,
                    false,
                    page === settings.currentPage
                );
            }
        } else {
            const pageLabel = document.createElement("span");
            pageLabel.className = "power-table__pagination-page";
            pageLabel.textContent =
                `Página ${settings.currentPage} de ${settings.totalPages}`;
            controls.appendChild(pageLabel);
        }
        addButton(
            "›",
            settings.currentPage + 1,
            settings.currentPage >= settings.totalPages
        );
        this.pagination.appendChild(controls);
    }

    private openColumnFilterMenu(
        header: HTMLTableCellElement,
        column: TableColumn,
        rows: TableRow[],
        columnIndex: number,
        currentValues?: string[]
    ): void {
        this.root.querySelectorAll(".power-table__filter-menu").forEach(
            (openMenu) => openMenu.remove()
        );
        this.root.querySelectorAll(".is-filter-open").forEach(
            (openHeader) => openHeader.classList.remove("is-filter-open")
        );
        header.classList.add("is-filter-open");
        const allValues = Array.from(new Set(
            rows.map((row) => row.formattedValues[columnIndex])
        )).sort((left, right) => left.localeCompare(right, "pt-BR"));
        const selected = new Set(currentValues || allValues);
        const menu = document.createElement("div");
        menu.className = "power-table__filter-menu";
        const closeMenu = (): void => {
            menu.remove();
            header.classList.remove("is-filter-open");
        };
        menu.addEventListener("click", (event) => event.stopPropagation());
        const title = document.createElement("strong");
        title.textContent = `Filtrar: ${column.displayName}`;
        const ascending = document.createElement("button");
        ascending.type = "button";
        ascending.textContent = "Ordenar A → Z";
        ascending.addEventListener("click", () => {
            menu.remove();
            if (this.callbacks) {
                this.callbacks.onSort(column, "asc");
            }
        });
        const descending = document.createElement("button");
        descending.type = "button";
        descending.textContent = "Ordenar Z → A";
        descending.addEventListener("click", () => {
            menu.remove();
            this.callbacks?.onSort(column, "desc");
        });
        const clear = document.createElement("button");
        clear.type = "button";
        clear.textContent = "Limpar filtro";
        clear.disabled = !currentValues;
        clear.addEventListener("click", () => {
            menu.remove();
            if (column.queryName) {
                this.callbacks?.onClearColumnFilter(column.queryName);
            }
        });
        const search = document.createElement("input");
        search.type = "text";
        search.placeholder = "Pesquisar itens...";
        const selectAllLabel = document.createElement("label");
        selectAllLabel.className = "power-table__filter-select-all";
        const selectAll = document.createElement("input");
        selectAll.type = "checkbox";
        selectAllLabel.append(
            selectAll,
            document.createTextNode("Selecionar todos exibidos")
        );
        const list = document.createElement("div");
        list.className = "power-table__filter-list";
        const renderList = (): void => {
            list.replaceChildren();
            const term = search.value.trim().toLocaleLowerCase("pt-BR");
            const displayedValues = allValues.filter((value) =>
                value.toLocaleLowerCase("pt-BR").includes(term)
            );
            selectAll.checked = displayedValues.length > 0 &&
                displayedValues.every((value) => selected.has(value));
            selectAll.indeterminate = displayedValues.some(
                (value) => selected.has(value)
            ) && !selectAll.checked;
            displayedValues.forEach((value) => {
                const option = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = selected.has(value);
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        selected.add(value);
                    } else {
                        selected.delete(value);
                    }
                });
                option.append(checkbox, document.createTextNode(value || "(vazio)"));
                list.appendChild(option);
            });
        };
        selectAll.addEventListener("change", () => {
            const term = search.value.trim().toLocaleLowerCase("pt-BR");
            allValues.filter((value) =>
                value.toLocaleLowerCase("pt-BR").includes(term)
            ).forEach((value) => {
                if (selectAll.checked) {
                    selected.add(value);
                } else {
                    selected.delete(value);
                }
            });
            renderList();
        });
        search.addEventListener("input", renderList);
        renderList();
        const actions = document.createElement("div");
        actions.className = "power-table__filter-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancelar";
        cancel.addEventListener("click", () => menu.remove());
        const apply = document.createElement("button");
        apply.type = "button";
        apply.className = "is-primary";
        apply.textContent = "Aplicar filtro";
        apply.addEventListener("click", () => {
            menu.remove();
            this.callbacks?.onColumnFilter(column, Array.from(selected));
        });
        actions.append(cancel, apply);
        menu.append(
            title,
            ascending,
            descending,
            clear,
            search,
            selectAllLabel,
            list,
            actions
        );
        this.root.appendChild(menu);

        const rootRect = this.root.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const edgeSpacing = 4;
        const menuGap = 2;
        const availableAbove = headerRect.top - rootRect.top - menuGap;
        const availableBelow = rootRect.bottom - headerRect.bottom - menuGap;
        const openUpward =
            menuRect.height > availableBelow && availableAbove > availableBelow;
        const desiredTop = openUpward
            ? headerRect.top - rootRect.top - menuRect.height - menuGap
            : headerRect.bottom - rootRect.top + menuGap;
        const maxTop = Math.max(
            edgeSpacing,
            rootRect.height - menuRect.height - edgeSpacing
        );
        const desiredLeft =
            headerRect.right - rootRect.left - menuRect.width;
        const maxLeft = Math.max(
            edgeSpacing,
            rootRect.width - menuRect.width - edgeSpacing
        );

        menu.classList.toggle("is-open-upward", openUpward);
        menu.style.top = `${Math.min(
            Math.max(edgeSpacing, desiredTop),
            maxTop
        )}px`;
        menu.style.left = `${Math.min(
            Math.max(edgeSpacing, desiredLeft),
            maxLeft
        )}px`;
        menu.style.right = "auto";
        menu.style.maxHeight = `${Math.max(
            120,
            rootRect.height - edgeSpacing * 2
        )}px`;
    }

    private renderTotals(
        model: TableModel,
        rows: TableRow[],
        settings: RenderSettings
    ): void {
        const totalRow = document.createElement("tr");
        if (settings.showCheckboxes) {
            const leadingCell = document.createElement("td");
            leadingCell.textContent = settings.totalLabel;
            totalRow.appendChild(leadingCell);
        }
        model.columns.forEach((column, columnIndex) => {
            const cell = document.createElement("td");
            if (column.style.allowWidthReduction) {
                const reducedWidth = Math.max(0, column.style.reducedWidth);
                if (reducedWidth === 0) {
                    cell.hidden = true;
                }
                cell.classList.add("is-width-reducible");
                cell.style.width = `${reducedWidth}px`;
                cell.style.minWidth = `${reducedWidth}px`;
                cell.style.maxWidth = `${reducedWidth}px`;
            }
            if (!column.style.showColumnTotal) {
                if (columnIndex === 0 && !settings.showCheckboxes) {
                    cell.textContent = settings.totalLabel;
                }
                totalRow.appendChild(cell);
                return;
            }
            if (column.style.totalAlignment !== "auto") {
                cell.style.textAlign = column.style.totalAlignment;
            }
            if (column.style.totalFontSize > 0) {
                cell.style.fontSize = `${column.style.totalFontSize}px`;
            }
            const key = column.queryName || String(columnIndex);
            const aggregation = this.totalOverrides.get(key) ||
                column.style.totalAggregation;
            if (settings.totalsMode === "selectable") {
                const picker = document.createElement("div");
                picker.className = "power-table__total-picker";
                const trigger = document.createElement("button");
                trigger.type = "button";
                trigger.className = "power-table__total-trigger";
                const options = [
                    ["none", "—"],
                    ["count", "COUNT"],
                    ...(column.isNumeric ? [
                        ["sum", "SUM"],
                        ["average", "AVG"],
                        ["max", "MAX"],
                        ["min", "MIN"]
                    ] : []),
                    ["unique", "UNIQUE"]
                ];
                const selectedLabel = options.find(
                    ([value]) => value === aggregation
                )?.[1] || "—";
                const result = aggregation !== "none"
                    ? this.aggregateColumn(
                        column, columnIndex, rows, settings, aggregation
                    )
                    : "";
                const triggerValue = document.createElement("span");
                triggerValue.className = result
                    ? "power-table__total-result"
                    : "power-table__total-placeholder";
                triggerValue.textContent = result || selectedLabel;
                trigger.appendChild(triggerValue);
                trigger.title = selectedLabel;
                const menu = document.createElement("div");
                menu.className = "power-table__total-menu";
                menu.hidden = true;
                options.forEach(([value, label]) => {
                    const item = document.createElement("button");
                    item.type = "button";
                    item.className = "power-table__total-option";
                    item.textContent = label;
                    item.classList.toggle("is-active", value === aggregation);
                    item.addEventListener("click", (event) => {
                        event.stopPropagation();
                        this.totalOverrides.set(key, value);
                        this.foot.replaceChildren();
                        this.renderTotals(model, rows, settings);
                    });
                    menu.appendChild(item);
                });
                trigger.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.foot.querySelectorAll<HTMLElement>(
                        ".power-table__total-menu"
                    ).forEach((other) => {
                        if (other !== menu) {
                            other.hidden = true;
                        }
                    });
                    menu.hidden = !menu.hidden;
                });
                picker.append(trigger, menu);
                if (columnIndex === 0 && !settings.showCheckboxes) {
                    const label = document.createElement("span");
                    label.className = "power-table__total-label";
                    label.textContent = settings.totalLabel;
                    cell.append(label, picker);
                } else {
                    cell.appendChild(picker);
                }
            } else {
                cell.textContent = this.aggregateColumn(
                    column, columnIndex, rows, settings, aggregation
                );
                if (settings.showCheckboxes &&
                    columnIndex === 0 &&
                    aggregation === "none") {
                    cell.textContent = "";
                }
            }
            totalRow.appendChild(cell);
        });
        this.foot.appendChild(totalRow);
    }

    private aggregateColumn(
        column: TableColumn,
        columnIndex: number,
        rows: TableRow[],
        settings: RenderSettings,
        aggregation: string
    ): string {
        if (aggregation === "none") {
            return columnIndex === 0 ? settings.totalLabel : "";
        }
        const rawValues = rows
            .map((row) => row.values[columnIndex])
            .filter((value) => value !== null && value !== undefined);
        if (aggregation === "count") {
            return String(rawValues.length);
        }
        if (aggregation === "unique") {
            return String(new Set(rawValues.map(String)).size);
        }
        const values = rawValues
            .map(Number)
            .filter((value) => Number.isFinite(value));
        if (values.length === 0) {
            return "";
        }
        let result: number;
        switch (aggregation) {
            case "sum":
                result = values.reduce((sum, value) => sum + value, 0);
                break;
            case "average":
                result = values.reduce((sum, value) => sum + value, 0) /
                    values.length;
                break;
            case "max":
                result = Math.max(...values);
                break;
            case "min":
                result = Math.min(...values);
                break;
            default:
                return "";
        }
        return formatValue(result, column.format, settings.locale);
    }

    private updateSelectionGroupClasses(): void {
        const rows = Array.from(
            this.body.querySelectorAll<HTMLTableRowElement>("tr")
        );
        rows.forEach((row, index) => {
            const selected = row.classList.contains("is-selected");
            row.classList.toggle(
                "selection-group-start",
                selected && !rows[index - 1]?.classList.contains("is-selected")
            );
            row.classList.toggle(
                "selection-group-end",
                selected && !rows[index + 1]?.classList.contains("is-selected")
            );
        });
    }

    private applySettings(settings: RenderSettings): void {
        const setVariable = (name: string, value: string): void =>
            this.root.style.setProperty(name, value);
        setVariable("--power-table-font-size", `${settings.fontSize}px`);
        setVariable("--power-table-row-height", `${settings.rowHeight}px`);
        setVariable(
            "--power-table-value-alignment",
            settings.valueAlignment === "auto" ? "left" : settings.valueAlignment
        );
        this.root.dataset.valueAlignment = settings.valueAlignment;
        setVariable("--power-table-hover-background", settings.hoverBackground);
        setVariable("--power-table-hover-radius", `${settings.hoverRadius}px`);
        setVariable(
            "--power-table-row-divider-color",
            settings.rowDividerColor
        );
        setVariable(
            "--power-table-row-divider-width",
            `${settings.showRowDividers
                ? Math.max(0, settings.rowDividerWidth)
                : 0}px`
        );
        setVariable("--power-table-total-background", settings.totalBackground);
        setVariable("--power-table-total-color", settings.totalTextColor);
        setVariable("--power-table-total-alignment", settings.totalAlignment);
        setVariable(
            "--power-table-total-font-size",
            `${settings.totalFontSize}px`
        );
        setVariable(
            "--power-table-total-radius",
            `${settings.totalBorderRadius}px`
        );
        setVariable(
            "--power-table-total-menu-background",
            settings.totalMenuBackground
        );
        setVariable(
            "--power-table-total-menu-border",
            settings.totalMenuBorderColor
        );
        setVariable(
            "--power-table-total-menu-size",
            `${settings.totalMenuFontSize}px`
        );
        setVariable(
            "--power-table-total-menu-radius",
            `${settings.totalMenuRadius}px`
        );
        setVariable("--power-table-toolbar-height", `${settings.titleBarHeight}px`);
        setVariable("--power-table-title-size", `${settings.titleFontSize}px`);
        setVariable("--power-table-title-color", settings.titleColor);
        setVariable("--power-table-subtitle-size", `${settings.subtitleFontSize}px`);
        setVariable("--power-table-subtitle-color", settings.subtitleColor);
        setVariable("--power-table-count-color", settings.recordCountTextColor);
        setVariable("--power-table-count-background", settings.recordCountBackground);
        setVariable("--power-table-count-size", `${settings.recordCountFontSize}px`);
        setVariable("--power-table-count-radius", `${settings.recordCountRadius}px`);
        setVariable("--power-table-count-height", `${settings.recordCountHeight}px`);
        setVariable("--power-table-count-width", `${settings.recordCountWidth}px`);
        setVariable(
            "--power-table-count-padding",
            `${settings.recordCountHorizontalPadding}px`
        );
        setVariable("--power-table-count-alignment", settings.recordCountAlignment);
        setVariable(
            "--power-table-count-text-alignment",
            settings.recordCountAlignment === "flex-start"
                ? "left"
                : settings.recordCountAlignment === "flex-end"
                    ? "right"
                    : "center"
        );
        setVariable("--power-table-toolbar-background", settings.titleBarBackground);
        setVariable("--power-table-search-width", `${settings.searchWidth}px`);
        setVariable("--power-table-search-icon-size", `${settings.searchIconSize}px`);
        setVariable("--power-table-search-icon-color", settings.searchIconColor);
        setVariable(
            "--power-table-search-action-size",
            `${settings.searchActionIconSize}px`
        );
        setVariable(
            "--power-table-search-arrow-color",
            settings.searchArrowIconColor
        );
        setVariable(
            "--power-table-search-clear-color",
            settings.searchClearIconColor
        );
        setVariable(
            "--power-table-search-margin",
            `${settings.searchHorizontalMargin}px`
        );
        setVariable("--power-table-search-background", settings.searchBackground);
        setVariable("--power-table-search-border", settings.searchBorderColor);
        setVariable(
            "--power-table-search-border-width",
            `${settings.searchBorderWidth}px`
        );
        setVariable(
            "--power-table-search-radius",
            `${settings.searchBorderRadius}px`
        );
        setVariable("--power-table-search-height", `${settings.searchHeight}px`);
        setVariable("--power-table-search-font-size", `${settings.searchFontSize}px`);
        setVariable(
            "--power-table-download-icon-size",
            `${settings.downloadIconSize}px`
        );
        setVariable(
            "--power-table-download-font-size",
            `${settings.downloadFontSize}px`
        );
        setVariable(
            "--power-table-download-height",
            `${settings.downloadHeight}px`
        );
        setVariable(
            "--power-table-download-background",
            settings.downloadBackground
        );
        setVariable(
            "--power-table-download-color",
            settings.downloadTextColor
        );
        setVariable(
            "--power-table-download-border",
            settings.downloadBorderColor
        );
        setVariable(
            "--power-table-download-border-width",
            `${settings.downloadBorderWidth}px`
        );
        setVariable(
            "--power-table-download-radius",
            `${settings.downloadBorderRadius}px`
        );
        setVariable(
            "--power-table-download-menu-background",
            settings.downloadMenuBackground
        );
        setVariable(
            "--power-table-download-menu-color",
            settings.downloadMenuTextColor
        );
        setVariable(
            "--power-table-download-format-background",
            settings.downloadFormatBackground
        );
        setVariable(
            "--power-table-download-format-selected",
            settings.downloadFormatSelected
        );
        setVariable(
            "--power-table-download-format-selected-text",
            settings.downloadFormatSelectedText
        );
        setVariable("--power-table-header-background", settings.headerBackground);
        setVariable("--power-table-header-color", settings.headerTextColor);
        setVariable("--power-table-header-border", settings.headerBorderColor);
        const allHeaderBorders = settings.headerBorderMode === "all";
        setVariable("--power-table-header-border-top", `${
            allHeaderBorders ? settings.headerBorderWidth : settings.headerBorderTopWidth
        }px`);
        setVariable("--power-table-header-border-right", `${
            allHeaderBorders ? settings.headerBorderWidth : settings.headerBorderRightWidth
        }px`);
        setVariable("--power-table-header-border-bottom", `${
            allHeaderBorders ? settings.headerBorderWidth : settings.headerBorderBottomWidth
        }px`);
        setVariable("--power-table-header-border-left", `${
            allHeaderBorders ? settings.headerBorderWidth : settings.headerBorderLeftWidth
        }px`);
        setVariable("--power-table-header-radius", `${settings.headerBorderRadius}px`);
        setVariable("--power-table-header-size", `${settings.headerFontSize}px`);
        setVariable("--power-table-header-font", settings.headerFontFamily);
        setVariable("--power-table-header-alignment", settings.headerAlignment);
        setVariable("--power-table-header-height", `${settings.headerHeight}px`);
        setVariable("--power-table-header-padding", `${settings.headerPadding}px`);
        setVariable("--power-table-selection-background", settings.selectionBackground);
        setVariable("--power-table-selection-color", settings.selectionTextColor);
        setVariable("--power-table-selection-border", settings.selectionBorderColor);
        setVariable("--power-table-selection-border-width", `${settings.selectionBorderWidth}px`);
        setVariable(
            "--power-table-selection-radius",
            `${settings.selectionBorderRadius}px`
        );
        setVariable(
            "--power-table-unselected-opacity",
            `${Math.max(0, Math.min(100, settings.unselectedOpacity)) / 100}`
        );
        this.root.dataset.dimUnselected = String(settings.dimUnselected);
        setVariable(
            "--power-table-selection-indicator-size",
            `${settings.selectionIndicatorSize}px`
        );
        setVariable(
            "--power-table-selection-column-width",
            `${settings.selectionColumnWidth}px`
        );
        setVariable(
            "--power-table-selection-alignment",
            settings.selectionHorizontalAlignment
        );
        setVariable(
            "--power-table-selection-flex-alignment",
            settings.selectionHorizontalAlignment === "left"
                ? "flex-start"
                : settings.selectionHorizontalAlignment === "right"
                    ? "flex-end"
                    : "center"
        );
        setVariable(
            "--power-table-filter-background",
            settings.filterBarBackground
        );
        setVariable("--power-table-filter-color", settings.filterBarTextColor);
        setVariable(
            "--power-table-filter-chip-background",
            settings.filterBarChipBackground
        );
        setVariable(
            "--power-table-filter-border",
            settings.filterBarBorderColor
        );
        setVariable(
            "--power-table-filter-top-border-width",
            `${settings.filterBarTopBorderWidth}px`
        );
        setVariable(
            "--power-table-filter-bottom-spacing",
            `${settings.filterBarBottomSpacing}px`
        );
        setVariable(
            "--power-table-filter-font-size",
            `${settings.filterBarFontSize}px`
        );
        setVariable(
            "--power-table-filter-height",
            `${settings.filterBarHeight}px`
        );
        setVariable(
            "--power-table-filter-padding",
            `${settings.filterBarHorizontalPadding}px`
        );
        setVariable(
            "--power-table-filter-radius",
            `${settings.filterBarBorderRadius}px`
        );
        setVariable(
            "--power-table-pagination-background",
            settings.paginationBackground
        );
        setVariable("--power-table-pagination-color", settings.paginationTextColor);
        setVariable(
            "--power-table-pagination-active-background",
            settings.paginationActiveBackground
        );
        setVariable(
            "--power-table-pagination-active-color",
            settings.paginationActiveTextColor
        );
        setVariable(
            "--power-table-pagination-border",
            settings.paginationBorderColor
        );
        setVariable(
            "--power-table-pagination-font-size",
            `${settings.paginationFontSize}px`
        );
        setVariable(
            "--power-table-pagination-button-size",
            `${settings.paginationButtonSize}px`
        );
        setVariable(
            "--power-table-pagination-spacing",
            `${settings.paginationSpacing}px`
        );
        setVariable(
            "--power-table-pagination-padding",
            `${settings.paginationHorizontalPadding}px`
        );
        setVariable(
            "--power-table-pagination-radius",
            `${settings.paginationBorderRadius}px`
        );
        if (settings.paginationPosition === "bottom") {
            this.root.insertBefore(this.pagination, this.emptyState);
        }
        this.root.dataset.selectionBorder = settings.selectionBorderMode;

        this.title.hidden = !settings.showTitle && !settings.showRecordCount;
        this.titleCopy.hidden = !settings.showTitle;
        this.titleText.textContent = settings.titleText;
        this.subtitle.textContent = settings.subtitleText;
        this.subtitle.hidden = !settings.showSubtitle;
        this.recordCount.hidden = !settings.showRecordCount;
        this.recordCount.style.width = settings.recordCountWidth > 0
            ? `${settings.recordCountWidth}px`
            : settings.recordCountAlignment === "center"
                ? "auto"
                : "120px";
        this.searchGroup.hidden = !settings.showSearch;
        this.searchShell.hidden = !settings.showSearch;
        this.searchShell2.hidden =
            !settings.showSearch || !settings.showSecondSearch;
        this.searchShell.classList.toggle("without-icon", !settings.showSearchIcon);
        this.searchShell2.classList.toggle("without-icon", !settings.showSearchIcon);
        this.searchIcon.hidden = !settings.showSearchIcon;
        const secondIcon =
            this.searchShell2.querySelector<HTMLSpanElement>(".power-table__search-icon");
        if (secondIcon) {
            secondIcon.hidden = !settings.showSearchIcon;
        }
        this.searchInput.placeholder = settings.searchPlaceholder;
        this.searchInput2.placeholder = settings.searchPlaceholder2;
        this.downloadWrapper.hidden = !settings.downloadEnabled;
        this.downloadText.textContent = settings.downloadButtonText;
        this.downloadText.hidden = !settings.downloadShowText;
        this.downloadButton.style.width = settings.downloadWidth > 0
            ? `${settings.downloadWidth}px`
            : "auto";
        this.downloadShowMenu = settings.downloadShowMenu;
        this.downloadDefaultScope = settings.downloadDefaultScope;
        this.downloadFileName = settings.downloadFileName || "AdvanceTable";
        this.setDownloadFormat(settings.downloadDefaultFormat);
        this.searchShell.style.margin = "0";
        this.searchShell2.style.margin = "0";
        this.downloadWrapper.style.margin = "0";
        this.applyTopLayout(settings);
        this.updateSearchAction(this.searchInput, this.searchAction);
        this.updateSearchAction(this.searchInput2, this.searchAction2);
        this.toolbar.dataset.searchPosition = settings.searchPosition;
        this.toolbar.hidden = false;
    }

    private applyTopLayout(settings: RenderSettings): void {
        type LayoutItem = {
            key: string;
            element: HTMLElement;
            row: string;
            position: number;
            automaticAlignment: string;
            automaticSpacing: number;
            visible: boolean;
        };
        const items: LayoutItem[] = [
            {
                key: "Título e contador",
                element: this.title,
                row: settings.topLayoutTitleRow,
                position: settings.topLayoutTitlePosition,
                automaticAlignment: settings.topLayoutTitleAutomaticAlignment,
                automaticSpacing: settings.topLayoutTitleAutomaticSpacing,
                visible: settings.showTitle || settings.showRecordCount
            },
            {
                key: "Pesquisa",
                element: this.searchGroup,
                row: settings.topLayoutSearchRow,
                position: settings.topLayoutSearchPosition,
                automaticAlignment: settings.topLayoutSearchAutomaticAlignment,
                automaticSpacing: settings.topLayoutSearchAutomaticSpacing,
                visible: settings.showSearch
            },
            {
                key: "Download",
                element: this.downloadWrapper,
                row: settings.topLayoutDownloadRow,
                position: settings.topLayoutDownloadPosition,
                automaticAlignment: settings.topLayoutDownloadAutomaticAlignment,
                automaticSpacing: settings.topLayoutDownloadAutomaticSpacing,
                visible: settings.downloadEnabled
            },
            {
                key: "Paginação",
                element: this.pagination,
                row: settings.topLayoutPaginationRow,
                position: settings.topLayoutPaginationPosition,
                automaticAlignment: settings.topLayoutPaginationAutomaticAlignment,
                automaticSpacing: settings.topLayoutPaginationAutomaticSpacing,
                visible: settings.paginationEnabled &&
                    settings.paginationPosition !== "bottom"
            }
        ];
        this.topRow1.replaceChildren();
        this.topRow2.replaceChildren();
        (["1", "2"] as const).forEach((rowNumber) => {
            const row = rowNumber === "1" ? this.topRow1 : this.topRow2;
            row.dataset.layoutMode = settings.topLayoutMode;
            const rowItems = items.filter(
                (item) => item.visible && item.row === rowNumber
            );
            if (settings.topLayoutMode === "automatic") {
                const alignments = ["left", "center", "right"];
                const groups = new Map<string, LayoutItem[]>(
                    alignments.map((alignment) => [alignment, []])
                );
                rowItems.forEach((item) => {
                    let alignment = alignments.includes(item.automaticAlignment)
                        ? item.automaticAlignment
                        : "left";
                    if ((groups.get(alignment)?.length || 0) >= 2) {
                        alignment = alignments.find(
                            (candidate) => (groups.get(candidate)?.length || 0) < 2
                        ) || alignment;
                    }
                    const assignment = `${rowNumber}:${alignment}`;
                    if (this.automaticSlotAssignments.get(item.key) !== assignment) {
                        this.automaticSlotAssignments.set(item.key, assignment);
                        this.automaticEntrySequence += 1;
                        this.automaticEntryOrder.set(
                            item.key,
                            this.automaticEntrySequence
                        );
                    }
                    groups.get(alignment)?.push(item);
                });
                alignments.forEach((alignment) => {
                    const groupItems = groups.get(alignment) || [];
                    if (groupItems.length === 0) return;
                    const group = document.createElement("div");
                    group.className = "power-table__top-auto-group";
                    group.dataset.alignment = alignment;
                    groupItems
                        .sort((a, b) =>
                            (this.automaticEntryOrder.get(a.key) || 0) -
                            (this.automaticEntryOrder.get(b.key) || 0)
                        )
                        .forEach((item) => {
                            const slot = document.createElement("div");
                            slot.className = "power-table__top-slot is-automatic";
                            slot.dataset.item = item.key;
                            if (item.key === "Pesquisa") {
                                const searchWidth = settings.searchWidth > 0
                                    ? settings.searchWidth
                                    : 390;
                                slot.style.width = `${searchWidth}px`;
                                slot.style.maxWidth = "100%";
                            }
                            const spacing = alignment === "center"
                                ? Math.max(-5, Math.min(5, item.automaticSpacing))
                                : Math.max(0, Math.min(10, item.automaticSpacing));
                            const direction = alignment === "right" ? -1 : 1;
                            slot.style.transform =
                                `translateX(${spacing * direction}px)`;
                            slot.appendChild(item.element);
                            group.appendChild(slot);
                        });
                    row.appendChild(group);
                });
            } else {
                rowItems.forEach((item) => {
                    const position = Math.max(0, Math.min(100, item.position));
                    const slot = document.createElement("div");
                    slot.className = "power-table__top-slot is-manual";
                    slot.dataset.item = item.key;
                    if (item.key === "Pesquisa") {
                        const searchWidth = settings.searchWidth > 0
                            ? settings.searchWidth
                            : 390;
                        slot.style.width =
                            `${Math.min(searchWidth, row.clientWidth)}px`;
                    }
                    slot.style.left = `${position}%`;
                    slot.style.transform = `translateX(-${position}%)`;
                    slot.appendChild(item.element);
                    row.appendChild(slot);
                });
            }
            row.hidden = row.childElementCount === 0;
            row.style.height = row.hidden
                ? "0"
                : `${Math.max(
                    1,
                    ...Array.from(row.children).map(
                        (child) => (child as HTMLElement).offsetHeight
                    )
                )}px`;
        });
        this.toolbar.style.setProperty(
            "--power-table-top-row-gap",
            `${Math.max(0, settings.topLayoutRowGap)}px`
        );
        this.toolbar.removeAttribute("title");
    }

    private createCellIcon(
        value: string | number | boolean | Date | null | undefined,
        iconStyle: string
    ): HTMLElement | SVGSVGElement {
        if (iconStyle === "none") {
            const empty = document.createElement("span");
            empty.className = "power-table__cell-icon is-empty";
            empty.hidden = true;
            return empty;
        }
        const customId = iconStyle.startsWith("custom:")
            ? iconStyle.slice("custom:".length)
            : "";
        const customIcon = this.currentCustomIcons.find(
            (asset) => asset.id === customId
        );
        if (customIcon) {
            const element = document.createElement("span");
            element.className = "power-table__cell-icon is-custom-icon";
            const iconUrl = customIcon.autoCrop
                ? customIcon.dataUrl
                : customIcon.originalDataUrl || customIcon.dataUrl;
            if (customIcon.colorMode === "rule") {
                element.style.maskImage = `url("${iconUrl}")`;
                element.style.webkitMaskImage = `url("${iconUrl}")`;
                element.classList.add("is-rule-colored");
            } else {
                element.style.backgroundImage = `url("${iconUrl}")`;
            }
            if (customIcon.safetyMargin) {
                element.style.backgroundSize = "calc(100% - 4px)";
                element.style.maskSize = "calc(100% - 4px)";
                element.style.webkitMaskSize = "calc(100% - 4px)";
            }
            element.title = customIcon.name;
            return element;
        }
        const namespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(namespace, "svg");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("power-table__cell-icon");
        if (iconStyle === "trendDownColor" ||
            iconStyle === "trendFlatColor" ||
            iconStyle === "trendUpColor") {
            const path = document.createElementNS(namespace, "path");
            const down = iconStyle === "trendDownColor";
            const flat = iconStyle === "trendFlatColor";
            path.setAttribute(
                "d",
                flat
                    ? "M3 8h14v5H3Z"
                    : down
                        ? "M2 3h16L10 18Z"
                        : "M10 2 18 17H2Z"
            );
            path.setAttribute(
                "fill",
                flat ? "#D6A700" : down ? "#D84A3A" : "#49A56B"
            );
            path.setAttribute(
                "stroke",
                flat ? "#9A7800" : down ? "#A92F24" : "#2F7D4C"
            );
            path.setAttribute("stroke-width", "1");
            svg.appendChild(path);
            return svg;
        }

        const categoryIndex = this.hashValue(String(value ?? "")) % 4;
        const numericValue = typeof value === "number" ? value : Number(value);
        const positive = typeof value === "boolean"
            ? value
            : Number.isFinite(numericValue)
                ? numericValue > 0
                : !/^(não|nao|false|erro|atrasad)/i.test(String(value ?? ""));

        const iconPaths: Record<string, string> = {
            check: "m4 10 3.5 3.5L16 5l1.5 1.5-10 10L2.5 11.5Z",
            close: "M4.5 3 10 8.5 15.5 3 17 4.5 11.5 10 17 15.5 15.5 17 10 11.5 4.5 17 3 15.5 8.5 10 3 4.5Z",
            warning: "M10 2 19 18H1Zm-1 5v6h2V7Zm0 8v2h2v-2Z",
            info: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM9 5h2v2H9Zm0 4h2v6H9Z",
            star: "m10 1.5 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8Z",
            heart: "M10 17.5 2.7 10.4C-1.5 6.3 4.7.2 8.8 4.3L10 5.5l1.2-1.2c4.1-4.1 10.3 2 6.1 6.1Z",
            flag: "M4 2h2v16H4Zm2 1h10l-2 4 2 4H6Z",
            square: "M3 3h14v14H3Z",
            triangle: "M10 2 19 18H1Z",
            up: "m10 2 6 6-1.5 1.5L11 6v12H9V6L5.5 9.5 4 8Z",
            down: "M9 2h2v12l3.5-3.5L16 12l-6 6-6-6 1.5-1.5L9 14Z",
            right: "M2 9h12L9.5 4.5 11 3l7 7-7 7-1.5-1.5L14 11H2Z",
            trendUp: "M2 15 7 10l3 3 5-6h-3V5h6v6h-2V8.5l-5.8 7L7 12.5 3.5 16Z",
            trendDown: "m2 5 5 5 3-3 5 6h-3v2h6V9h-2v2.5l-5.8-7L7 7.5 3.5 4Z",
            money: "M9 1h2v2h4v2H8.5a1.5 1.5 0 0 0 0 3H12a3.5 3.5 0 0 1 0 7H11v2H9v-2H4v-2h7.5a1.5 1.5 0 0 0 0 0-3H8a3.5 3.5 0 0 1 0-7h1Z",
            percent: "M5 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 8a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM4 16 15 4l1.5 1.3-11 12Z",
            clock: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM9 5h2v5.5l4 2-1 1.8-5-2.8Z",
            calendar: "M3 3h2V1h2v2h6V1h2v2h2v15H3Zm2 5v8h10V8Z",
            user: "M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM3 18a7 7 0 0 1 14 0Z",
            team: "M7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm6 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM1 17a6 6 0 0 1 12 0Zm10 0a6 6 0 0 1 8-5.7V17Z",
            mail: "M2 4h16v12H2Zm2 2 6 4 6-4Zm0 2.4V14h12V8.4l-6 4Z",
            phone: "m5 2 3 4-2 2c1.5 3 3 4.5 6 6l2-2 4 3-2 3C8 17 3 12 2 4Z",
            location: "M10 1.5a6 6 0 0 1 6 6c0 4.5-6 11-6 11s-6-6.5-6-11a6 6 0 0 1 6-6Zm0 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
            bolt: "m11 1-7 11h5l-1 7 8-12h-5Z",
            target: "M10 1a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7Zm0 4a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3Zm1 4h8v2h-8Z",
            play: "M5 2 17 10 5 18Z",
            pause: "M4 3h4v14H4Zm8 0h4v14h-4Z",
            stop: "M3 3h14v14H3Z"
        };
        const emojiIcons: Record<string, string> = {
            emojiSmile: "😊",
            emojiNeutral: "😐",
            emojiSad: "😟",
            emojiCelebrate: "🎉",
            emojiFire: "🔥",
            emojiThumbUp: "👍",
            emojiThumbDown: "👎",
            emojiRocket: "🚀",
            emojiTrophy: "🏆",
            emojiIdea: "💡",
            emojiEyes: "👀"
        };
        if (emojiIcons[iconStyle]) {
            const text = document.createElementNS(namespace, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "15");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "15");
            text.setAttribute(
                "font-family",
                "\"Segoe UI Emoji\", \"Apple Color Emoji\", sans-serif"
            );
            text.textContent = emojiIcons[iconStyle];
            svg.appendChild(text);
            return svg;
        }
        if (iconStyle === "circleSymbolHigh" ||
            iconStyle === "circleSymbolLow") {
            svg.setAttribute("viewBox", "0 0 24 24");
            const isHigh = iconStyle === "circleSymbolHigh";
            const circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", "12");
            circle.setAttribute("cy", "12");
            circle.setAttribute("r", "10");
            circle.setAttribute("fill", isHigh ? "#43A047" : "#E53935");
            circle.setAttribute("stroke", isHigh ? "#1B5E20" : "#B71C1C");
            circle.setAttribute("stroke-width", "2");
            const symbol = document.createElementNS(namespace, "path");
            symbol.setAttribute(
                "d",
                isHigh
                    ? "M5 12L10 17L19 8"
                    : "M7 7L17 17M17 7L7 17"
            );
            symbol.setAttribute("fill", "none");
            symbol.setAttribute("stroke", "#fff");
            symbol.setAttribute("stroke-width", "2.5");
            symbol.setAttribute("stroke-linecap", "round");
            symbol.setAttribute("stroke-linejoin", "round");
            svg.append(circle, symbol);
            return svg;
        }
        if (iconStyle === "flagLow" || iconStyle === "flag") {
            svg.setAttribute("viewBox", "0 0 24 24");
            const pole = document.createElementNS(namespace, "rect");
            pole.setAttribute("x", "4");
            pole.setAttribute("y", "3");
            pole.setAttribute("width", "1.5");
            pole.setAttribute("height", "18");
            pole.setAttribute("rx", ".5");
            pole.setAttribute("fill", "#333333");
            const frontFlag = document.createElementNS(namespace, "rect");
            frontFlag.setAttribute("x", "5.5");
            frontFlag.setAttribute("y", "4");
            frontFlag.setAttribute("width", "6");
            frontFlag.setAttribute("height", "8.05");
            frontFlag.setAttribute("fill", "#FF4D26");
            frontFlag.setAttribute("stroke", "#B2351A");
            frontFlag.setAttribute("stroke-width", "1.2");
            const rearFlag = document.createElementNS(namespace, "rect");
            rearFlag.setAttribute("x", "11.5");
            rearFlag.setAttribute("y", "6");
            rearFlag.setAttribute("width", "6");
            rearFlag.setAttribute("height", "8.05");
            rearFlag.setAttribute("fill", "#FF4D26");
            rearFlag.setAttribute("stroke", "#B2351A");
            rearFlag.setAttribute("stroke-width", "1.2");
            svg.append(pole, frontFlag, rearFlag);
            return svg;
        }
        const circularSymbols: Record<string, string> = {
            checkCircle: "✓",
            closeCircle: "×",
            exclamationCircle: "!",
            arrowCircleUp: "↑",
            arrowCircleDown: "↓"
        };
        if (circularSymbols[iconStyle]) {
            const circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", "10");
            circle.setAttribute("cy", "10");
            circle.setAttribute("r", "8");
            circle.setAttribute("fill", "currentColor");
            const text = document.createElementNS(namespace, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "14");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#fff");
            text.setAttribute("font-size", "12");
            text.setAttribute("font-family", "\"Segoe UI\", sans-serif");
            text.setAttribute("font-weight", "800");
            text.textContent = circularSymbols[iconStyle];
            svg.append(circle, text);
            return svg;
        }
        const symbolIcons: Record<string, string> = {
            circleOutline: "○",
            circleHalfLeft: "◐",
            circleHalfRight: "◑",
            circleHalfBottom: "◒",
            circleHalfTop: "◓",
            circleRing: "◉",
            diamondOutline: "◇",
            squareOutline: "□",
            triangleDown: "▼",
            triangleLeft: "◀",
            triangleRight: "▶",
            left: "←",
            upRight: "↗",
            downRight: "↘",
            upLeft: "↖",
            downLeft: "↙",
            doubleUp: "⇈",
            doubleDown: "⇊",
            flat: "▬",
            starOutline: "☆",
            flagOutline: "⚐",
            flagPennant: "▸",
            barOne: "▂",
            barTwo: "▂▄",
            barThree: "▂▄▆",
            barFour: "▂▄▆█",
            signalOne: "▁",
            signalTwo: "▁▃",
            signalThree: "▁▃▅",
            signalFour: "▁▃▅▇",
            gridOne: "▦",
            gridTwo: "▥",
            gridThree: "▤",
            gridFour: "▧",
            boxEmpty: "□",
            boxQuarter: "◩",
            boxHalf: "◧",
            boxFull: "■",
            minusCircle: "⊖",
            plusCircle: "⊕"
        };
        if (symbolIcons[iconStyle]) {
            const glyph = symbolIcons[iconStyle];
            const text = document.createElementNS(namespace, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "14.5");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "currentColor");
            text.setAttribute("font-size", glyph.length > 2 ? "8" : "15");
            text.setAttribute(
                "font-family",
                "\"Segoe UI Symbol\", \"Segoe UI\", sans-serif"
            );
            text.setAttribute("font-weight", "700");
            text.textContent = glyph;
            svg.appendChild(text);
            return svg;
        }
        if (iconPaths[iconStyle]) {
            const path = document.createElementNS(namespace, "path");
            path.setAttribute("d", iconPaths[iconStyle]);
            path.setAttribute("fill", "currentColor");
            svg.appendChild(path);
            return svg;
        }

        if (iconStyle === "circle" ||
            (iconStyle === "category" && categoryIndex === 0)) {
            const circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", "10");
            circle.setAttribute("cy", "10");
            circle.setAttribute("r", "6");
            circle.setAttribute("fill", "currentColor");
            svg.appendChild(circle);
        } else if (iconStyle === "diamond" ||
            (iconStyle === "category" && categoryIndex === 1)) {
            const path = document.createElementNS(namespace, "path");
            path.setAttribute("d", "M10 2 18 10 10 18 2 10Z");
            path.setAttribute("fill", "currentColor");
            svg.appendChild(path);
        } else if (iconStyle === "category" && categoryIndex === 2) {
            const rect = document.createElementNS(namespace, "rect");
            rect.setAttribute("x", "4");
            rect.setAttribute("y", "4");
            rect.setAttribute("width", "12");
            rect.setAttribute("height", "12");
            rect.setAttribute("rx", "2");
            rect.setAttribute("fill", "currentColor");
            svg.appendChild(rect);
        } else if (iconStyle === "category") {
            const triangle = document.createElementNS(namespace, "path");
            triangle.setAttribute("d", "M10 2 18 17H2Z");
            triangle.setAttribute("fill", "currentColor");
            svg.appendChild(triangle);
        } else {
            const path = document.createElementNS(namespace, "path");
            path.setAttribute(
                "d",
                positive
                    ? "m5 10 3 3 7-7 1.5 1.5L8 16 3.5 11.5Z"
                    : "M5.5 4 10 8.5 14.5 4 16 5.5 11.5 10 16 14.5 14.5 16 10 11.5 5.5 16 4 14.5 8.5 10 4 5.5Z"
            );
            path.setAttribute("fill", "currentColor");
            svg.appendChild(path);
        }
        return svg;
    }

    private hashValue(value: string): number {
        let hash = 0;
        for (let index = 0; index < value.length; index++) {
            hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
        }
        return Math.abs(hash);
    }

    private resolveCellAlignment(
        columnAlignment: string,
        globalAlignment: string,
        isNumeric: boolean
    ): "left" | "center" | "right" {
        const normalize = (value: string): "left" | "center" | "right" | "auto" => {
            const normalized = String(value || "auto").trim().toLowerCase();
            if (normalized === "right" || normalized === "end" ||
                normalized === "flex-end") {
                return "right";
            }
            if (normalized === "center" || normalized === "middle") {
                return "center";
            }
            if (normalized === "left" || normalized === "start" ||
                normalized === "flex-start") {
                return "left";
            }
            return "auto";
        };
        const column = normalize(columnAlignment);
        if (column !== "auto") {
            return column;
        }
        const global = normalize(globalAlignment);
        if (global !== "auto") {
            return global;
        }
        return isNumeric ? "right" : "left";
    }

    private darkenColor(color: string): string {
        const hex = color.match(/^#([0-9a-f]{6})$/i);
        if (hex) {
            const value = Number.parseInt(hex[1], 16);
            const red = ((value >> 16) & 255) / 255;
            const green = ((value >> 8) & 255) / 255;
            const blue = (value & 255) / 255;
            const maximum = Math.max(red, green, blue);
            const minimum = Math.min(red, green, blue);
            const delta = maximum - minimum;
            let hue = 0;
            if (delta > 0) {
                if (maximum === red) {
                    hue = 60 * (((green - blue) / delta) % 6);
                } else if (maximum === green) {
                    hue = 60 * ((blue - red) / delta + 2);
                } else {
                    hue = 60 * ((red - green) / delta + 4);
                }
            }
            if (hue < 0) {
                hue += 360;
            }
            const lightness = (maximum + minimum) / 2;
            const saturation = delta === 0
                ? 0
                : delta / (1 - Math.abs(2 * lightness - 1));
            return `hsl(${Math.round(hue)}, ${Math.round(
                Math.max(0.58, saturation) * 100
            )}%, 35%)`;
        }
        const hsl = color.match(
            /^hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/i
        );
        if (hsl) {
            return `hsl(${hsl[1]}, ${hsl[2]}%, ${Math.max(
                18,
                Number(hsl[3]) - 52
            )}%)`;
        }
        return "#242424";
    }

    private handleSearchAction(
        index: number,
        input: HTMLInputElement,
        action: HTMLButtonElement
    ): void {
        if (input.value) {
            input.value = "";
        }
        this.updateSearchAction(input, action);
        this.callbacks?.onSearch(index, input.value);
        input.focus();
    }

    private updateSearchAction(
        input: HTMLInputElement,
        action: HTMLButtonElement
    ): void {
        const hasValue = input.value.length > 0;
        action.replaceChildren(this.createSearchActionIcon(hasValue));
        action.dataset.action = hasValue ? "clear" : "submit";
        action.setAttribute(
            "aria-label",
            hasValue ? "Limpar pesquisa" : "Aplicar pesquisa"
        );
        action.title = hasValue ? "Limpar pesquisa" : "Aplicar pesquisa";
    }

    private createSearchActionIcon(clear: boolean): SVGSVGElement {
        const namespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(namespace, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        const path = document.createElementNS(namespace, "path");
        path.setAttribute(
            "d",
            clear
                ? "M7.05 5.64 12 10.59l4.95-4.95 1.41 1.41L13.41 12l4.95 4.95-1.41 1.41L12 13.41l-4.95 4.95-1.41-1.41L10.59 12 5.64 7.05l1.41-1.41Z"
                : "M13.3 5.3 20 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.2l-4.3-4.3 1.4-1.4Z"
        );
        path.setAttribute("fill", "currentColor");
        svg.appendChild(path);
        return svg;
    }
}
