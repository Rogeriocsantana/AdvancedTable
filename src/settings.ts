"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsCompositeCard = formattingSettings.CompositeCard;
import FormattingSettingsGroup = formattingSettings.Group;
import FormattingSettingsModel = formattingSettings.Model;

class TableBaseSettings extends FormattingSettingsCompositeCard {
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 16
    });

    rowHeight = new formattingSettings.NumUpDown({
        name: "rowHeight",
        displayName: "Altura da linha",
        value: 40
    });

    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor global do texto",
        value: { value: "#242424" }
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor global do fundo",
        value: { value: "rgba(0,0,0,0)" }
    });

    valueAlignment = new formattingSettings.AlignmentGroup({
        name: "valueAlignment",
        displayName: "Alinhamento global dos valores",
        value: "left",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        supportsNoSelection: true
    });

    hoverBackgroundColor = new formattingSettings.ColorPicker({
        name: "hoverBackgroundColor",
        displayName: "Cor de fundo ao passar o mouse",
        value: { value: "#E8F1FB" }
    });

    hoverRadius = new formattingSettings.NumUpDown({
        name: "hoverRadius",
        displayName: "Arredondamento do hover",
        value: 10
    });

    showRowDividers = new formattingSettings.ToggleSwitch({
        name: "showRowDividers",
        displayName: "Mostrar linhas divisórias",
        value: true
    });

    rowDividerColor = new formattingSettings.ColorPicker({
        name: "rowDividerColor",
        displayName: "Cor das linhas divisórias",
        value: { value: "#EDEDED" }
    });

    rowDividerWidth = new formattingSettings.NumUpDown({
        name: "rowDividerWidth",
        displayName: "Espessura das linhas",
        value: 1
    });

    showTotals = new formattingSettings.ToggleSwitch({
        name: "showTotals",
        displayName: "Mostrar linha de total",
        value: false
    });

    totalLabel = new formattingSettings.TextInput({
        name: "totalLabel",
        displayName: "Texto da linha de total",
        value: "Total",
        placeholder: "Total"
    });

    totalBackgroundColor = new formattingSettings.ColorPicker({
        name: "totalBackgroundColor",
        displayName: "Fundo da linha de total",
        value: { value: "#F4F7FA" }
    });

    totalTextColor = new formattingSettings.ColorPicker({
        name: "totalTextColor",
        displayName: "Cor do total",
        value: { value: "#242424" }
    });

    totalAlignment = new formattingSettings.AlignmentGroup({
        name: "totalAlignment",
        displayName: "Alinhamento do total",
        value: "right",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });

    totalFontSize = new formattingSettings.NumUpDown({
        name: "totalFontSize",
        displayName: "Tamanho do texto do total",
        value: 12
    });

    totalBorderRadius = new formattingSettings.NumUpDown({
        name: "totalBorderRadius",
        displayName: "Arredondamento do total",
        value: 0
    });

    totalsMode = new formattingSettings.AutoDropdown({
        name: "totalsMode",
        displayName: "Escolha do cálculo",
        value: "selectable"
    });

    totalMenuBackgroundColor = new formattingSettings.ColorPicker({
        name: "totalMenuBackgroundColor",
        displayName: "Fundo do menu",
        value: { value: "#FFFFFF" }
    });
    totalMenuBorderColor = new formattingSettings.ColorPicker({
        name: "totalMenuBorderColor",
        displayName: "Borda do menu",
        value: { value: "#E1E7EF" }
    });
    totalMenuFontSize = new formattingSettings.NumUpDown({
        name: "totalMenuFontSize",
        displayName: "Tamanho do texto do menu",
        value: 10
    });
    totalMenuRadius = new formattingSettings.NumUpDown({
        name: "totalMenuRadius",
        displayName: "Arredondamento do menu",
        value: 6
    });

    name = "table";
    displayName = "Tabela";
    groups = [
        new FormattingSettingsGroup({
            name: "tableValues",
            displayName: "Valores",
            collapsible: true,
            slices: [
                this.fontSize,
                this.rowHeight,
                this.textColor,
                this.backgroundColor,
                this.valueAlignment,
                this.hoverBackgroundColor,
                this.hoverRadius,
                this.showRowDividers,
                this.rowDividerColor,
                this.rowDividerWidth
            ]
        }),
        new FormattingSettingsGroup({
            name: "tableTotals",
            displayName: "Total",
            collapsible: true,
            slices: [
                this.showTotals,
                this.totalLabel,
                this.totalBackgroundColor,
                this.totalTextColor,
                this.totalAlignment,
                this.totalFontSize,
                this.totalBorderRadius,
                this.totalsMode
            ]
        }),
        new FormattingSettingsGroup({
            name: "tableTotalMenu",
            displayName: "Menu de cálculo",
            collapsible: true,
            slices: [
                this.totalMenuBackgroundColor,
                this.totalMenuBorderColor,
                this.totalMenuFontSize,
                this.totalMenuRadius
            ]
        })
    ];

    onPreProcess(): void {
        const visible = this.showTotals.value;
        const totals = this.groups.find((group) => group.name === "tableTotals");
        const menu = this.groups.find((group) => group.name === "tableTotalMenu");
        if (totals && menu) {
            const totalSlices = totals.slices || [];
            (menu.slices || []).forEach((slice) => {
                if (!totalSlices.includes(slice)) {
                    totalSlices.push(slice);
                }
            });
            totals.slices = totalSlices;
            menu.visible = false;
        }
        this.totalLabel.visible = visible;
        this.totalBackgroundColor.visible = visible;
        this.totalTextColor.visible = visible;
        this.totalAlignment.visible = visible;
        this.totalFontSize.visible = visible;
        this.totalBorderRadius.visible = visible;
        this.totalsMode.visible = visible;
        const showMenu = visible && this.totalsMode.value === "selectable";
        this.totalMenuBackgroundColor.visible = showMenu;
        this.totalMenuBorderColor.visible = showMenu;
        this.totalMenuFontSize.visible = showMenu;
        this.totalMenuRadius.visible = showMenu;
        this.rowDividerColor.visible = this.showRowDividers.value;
        this.rowDividerWidth.visible = this.showRowDividers.value;
    }
}

class TitleBarCardSettings extends FormattingSettingsCompositeCard {
    showTitle = new formattingSettings.ToggleSwitch({
        name: "showTitle",
        displayName: "Mostrar título interno",
        value: true
    });

    titleText = new formattingSettings.TextInput({
        name: "titleText",
        displayName: "Texto do título",
        value: "Atendimento em detalhes",
        placeholder: "Título"
    });

    titleFontSize = new formattingSettings.NumUpDown({
        name: "titleFontSize",
        displayName: "Tamanho do título",
        value: 30
    });

    titleColor = new formattingSettings.ColorPicker({
        name: "titleColor",
        displayName: "Cor do título",
        value: { value: "#242424" }
    });

    showSubtitle = new formattingSettings.ToggleSwitch({
        name: "showSubtitle",
        displayName: "Mostrar subtítulo",
        value: false
    });

    subtitleText = new formattingSettings.TextInput({
        name: "subtitleText",
        displayName: "Texto do subtítulo",
        value: "",
        placeholder: "Subtítulo"
    });

    subtitleFontSize = new formattingSettings.NumUpDown({
        name: "subtitleFontSize",
        displayName: "Tamanho do subtítulo",
        value: 10
    });

    subtitleColor = new formattingSettings.ColorPicker({
        name: "subtitleColor",
        displayName: "Cor do subtítulo",
        value: { value: "#605E5C" }
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "rgba(0,0,0,0)" }
    });

    height = new formattingSettings.NumUpDown({
        name: "height",
        displayName: "Altura da barra",
        value: 70
    });

    showRecordCount = new formattingSettings.ToggleSwitch({
        name: "showRecordCount",
        displayName: "Mostrar quantidade de registros",
        value: true
    });

    recordCountTextColor = new formattingSettings.ColorPicker({
        name: "recordCountTextColor",
        displayName: "Cor do contador",
        value: { value: "#2457C5" }
    });

    recordCountBackground = new formattingSettings.ColorPicker({
        name: "recordCountBackground",
        displayName: "Fundo do contador",
        value: { value: "#E8F1FF" }
    });

    recordCountFontSize = new formattingSettings.NumUpDown({
        name: "recordCountFontSize",
        displayName: "Tamanho do contador",
        value: 24
    });

    recordCountRadius = new formattingSettings.NumUpDown({
        name: "recordCountRadius",
        displayName: "Arredondamento do contador",
        value: 10
    });

    recordCountHeight = new formattingSettings.NumUpDown({
        name: "recordCountHeight",
        displayName: "Altura do contador",
        value: 40
    });

    recordCountWidth = new formattingSettings.NumUpDown({
        name: "recordCountWidth",
        displayName: "Largura mínima do contador",
        value: 0
    });

    recordCountHorizontalPadding = new formattingSettings.NumUpDown({
        name: "recordCountHorizontalPadding",
        displayName: "Espaçamento lateral do contador",
        value: 14
    });

    recordCountAlignment = new formattingSettings.AutoDropdown({
        name: "recordCountAlignment",
        displayName: "Alinhamento do texto do contador",
        value: "center"
    });

    name = "titleBar";
    displayName = "Título interno";
    groups = [
        new FormattingSettingsGroup({
            name: "titleBarTitle",
            displayName: "Título",
            collapsible: true,
            slices: [
                this.showTitle,
                this.titleText,
                this.titleFontSize,
                this.titleColor,
                this.showSubtitle,
                this.subtitleText,
                this.subtitleFontSize,
                this.subtitleColor,
                this.backgroundColor,
                this.height
            ]
        }),
        new FormattingSettingsGroup({
            name: "titleBarCounter",
            displayName: "Contador de registros",
            collapsible: true,
            slices: [
                this.showRecordCount,
                this.recordCountTextColor,
                this.recordCountBackground,
                this.recordCountFontSize,
                this.recordCountRadius,
                this.recordCountHeight,
                this.recordCountWidth,
                this.recordCountHorizontalPadding,
                this.recordCountAlignment
            ]
        })
    ];
}

class SearchCardSettings extends FormattingSettingsCompositeCard {
    showSearch = new formattingSettings.ToggleSwitch({
        name: "showSearch",
        displayName: "Mostrar pesquisa",
        value: true
    });

    placeholder = new formattingSettings.TextInput({
        name: "placeholder",
        displayName: "Texto da pesquisa",
        value: "Pesquisar...",
        placeholder: "Pesquisar..."
    });

    field1 = new formattingSettings.ItemDropdown({
        name: "field1",
        displayName: "Campo da pesquisa 1",
        items: [],
        value: { displayName: "Primeira coluna", value: "" }
    });

    showSecondSearch = new formattingSettings.ToggleSwitch({
        name: "showSecondSearch",
        displayName: "Adicionar segunda pesquisa",
        value: false
    });

    placeholder2 = new formattingSettings.TextInput({
        name: "placeholder2",
        displayName: "Texto da pesquisa 2",
        value: "Pesquisar...",
        placeholder: "Pesquisar..."
    });

    field2 = new formattingSettings.ItemDropdown({
        name: "field2",
        displayName: "Campo da pesquisa 2",
        items: [],
        value: { displayName: "Segunda coluna", value: "" }
    });

    mode = new formattingSettings.AutoDropdown({
        name: "mode",
        displayName: "Comportamento",
        value: "report"
    });

    position = new formattingSettings.AutoDropdown({
        name: "position",
        displayName: "Posição",
        value: "right"
    });

    width = new formattingSettings.NumUpDown({
        name: "width",
        displayName: "Largura total das pesquisas",
        value: 900
    });

    showIcon = new formattingSettings.ToggleSwitch({
        name: "showIcon",
        displayName: "Mostrar ícone",
        value: true
    });

    iconSize = new formattingSettings.NumUpDown({
        name: "iconSize",
        displayName: "Tamanho do ícone",
        value: 36
    });

    iconColor = new formattingSettings.ColorPicker({
        name: "iconColor",
        displayName: "Cor do ícone",
        value: { value: "#323130" }
    });

    actionIconSize = new formattingSettings.NumUpDown({
        name: "actionIconSize",
        displayName: "Tamanho da seta e do X",
        value: 36
    });

    arrowIconColor = new formattingSettings.ColorPicker({
        name: "arrowIconColor",
        displayName: "Cor da seta",
        value: { value: "#8A8886" }
    });

    clearIconColor = new formattingSettings.ColorPicker({
        name: "clearIconColor",
        displayName: "Cor do X",
        value: { value: "#323130" }
    });

    horizontalMargin = new formattingSettings.NumUpDown({
        name: "horizontalMargin",
        displayName: "Deslocamento lateral",
        value: 140
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor interna",
        value: { value: "#FFFFFF" }
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#D2D2D2" }
    });

    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Espessura da borda",
        value: 1
    });

    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento",
        value: 10
    });
    inputHeight = new formattingSettings.NumUpDown({
        name: "inputHeight",
        displayName: "Altura da pesquisa",
        value: 50
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 24
    });

    name = "search";
    displayName = "Pesquisa";
    groups = [
        new FormattingSettingsGroup({
            name: "searchFields",
            displayName: "Campos",
            collapsible: true,
            slices: [
                this.showSearch,
                this.placeholder,
                this.field1,
                this.showSecondSearch,
                this.placeholder2,
                this.field2
            ]
        }),
        new FormattingSettingsGroup({
            name: "searchLayout",
            displayName: "Posição e dimensões",
            collapsible: true,
            slices: [
                this.mode,
                this.position,
                this.width,
                this.horizontalMargin
            ]
        }),
        new FormattingSettingsGroup({
            name: "searchTextBox",
            displayName: "Caixa de pesquisa",
            collapsible: true,
            slices: [
                this.fontSize,
                this.inputHeight,
                this.backgroundColor,
                this.borderColor,
                this.borderWidth,
                this.borderRadius
            ]
        }),
        new FormattingSettingsGroup({
            name: "searchIcons",
            displayName: "Ícones",
            collapsible: true,
            slices: [
                this.showIcon,
                this.iconSize,
                this.iconColor,
                this.actionIconSize,
                this.arrowIconColor,
                this.clearIconColor
            ]
        })
    ];

    onPreProcess(): void {
        const secondVisible = this.showSecondSearch.value;
        this.placeholder2.visible = secondVisible;
        this.field2.visible = secondVisible;
    }
}

class DownloadCardSettings extends FormattingSettingsCompositeCard {
    enabled = new formattingSettings.ToggleSwitch({
        name: "enabled",
        displayName: "Mostrar botão de download",
        value: false
    });
    buttonText = new formattingSettings.TextInput({
        name: "buttonText",
        displayName: "Texto do botão",
        value: "Baixar",
        placeholder: "Baixar"
    });
    fileName = new formattingSettings.TextInput({
        name: "fileName",
        displayName: "Nome do arquivo",
        value: "AdvanceTable",
        placeholder: "AdvanceTable"
    });
    defaultFormat = new formattingSettings.AutoDropdown({
        name: "defaultFormat",
        displayName: "Formato inicial",
        value: "xlsx"
    });
    defaultScope = new formattingSettings.AutoDropdown({
        name: "defaultScope",
        displayName: "Escopo inicial",
        value: "filtered"
    });
    method = new formattingSettings.AutoDropdown({
        name: "method",
        displayName: "Método de download",
        description: "GitHub Pages é o padrão. A API oficial depende da permissão do administrador do tenant.",
        value: "github"
    });
    bridgeUrl = new formattingSettings.TextInput({
        name: "bridgeUrl",
        displayName: "Endereço anterior",
        value: "",
        placeholder: ""
    });
    githubUrl = new formattingSettings.TextInput({
        name: "githubUrl",
        displayName: "Endereço do GitHub Pages",
        description: "Informe um endereço HTTPS terminado em github.io. Ele pode ser alterado sem recompilar o visual.",
        value: "https://rogeriocsantana.github.io/AdvancedTable/download-page/",
        placeholder: "https://usuario.github.io/repositorio/..."
    });
    customUrl = new formattingSettings.TextInput({
        name: "customUrl",
        displayName: "Endereço do servidor próprio",
        description: "Use HTTPS. O domínio precisa estar autorizado em WebAccess antes de gerar o pacote.",
        value: "",
        placeholder: "https://seu-dominio/..."
    });
    showMenu = new formattingSettings.ToggleSwitch({
        name: "showMenu",
        displayName: "Mostrar menu ao clicar",
        value: true
    });
    showText = new formattingSettings.ToggleSwitch({
        name: "showText",
        displayName: "Mostrar texto",
        value: false
    });
    iconSize = new formattingSettings.NumUpDown({
        name: "iconSize",
        displayName: "Tamanho do ícone",
        value: 24
    });
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 10
    });
    width = new formattingSettings.NumUpDown({
        name: "width",
        displayName: "Largura (0 automática)",
        value: 0
    });
    height = new formattingSettings.NumUpDown({
        name: "height",
        displayName: "Altura",
        value: 50
    });
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "#118DFF" }
    });
    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto e ícone",
        value: { value: "#FFFFFF" }
    });
    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#D2D0CE" }
    });
    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Espessura da borda",
        value: 1
    });
    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento",
        value: 6
    });
    menuBackgroundColor = new formattingSettings.ColorPicker({
        name: "menuBackgroundColor",
        displayName: "Fundo do menu",
        value: { value: "#FFFFFF" }
    });
    menuTextColor = new formattingSettings.ColorPicker({
        name: "menuTextColor",
        displayName: "Texto do menu",
        value: { value: "#242424" }
    });
    formatBackgroundColor = new formattingSettings.ColorPicker({
        name: "formatBackgroundColor",
        displayName: "Fundo dos formatos",
        value: { value: "#F3F6FA" }
    });
    formatSelectedColor = new formattingSettings.ColorPicker({
        name: "formatSelectedColor",
        displayName: "Formato selecionado",
        value: { value: "#118DFF" }
    });
    formatSelectedTextColor = new formattingSettings.ColorPicker({
        name: "formatSelectedTextColor",
        displayName: "Texto selecionado",
        value: { value: "#FFFFFF" }
    });

    name = "download";
    displayName = "Download";
    groups = [
        new FormattingSettingsGroup({
            name: "downloadBehavior",
            displayName: "Comportamento",
            collapsible: true,
            slices: [
                this.enabled,
                this.fileName,
                this.defaultFormat,
                this.defaultScope,
                this.method,
                this.githubUrl,
                this.customUrl,
                this.showMenu
            ]
        }),
        new FormattingSettingsGroup({
            name: "downloadButton",
            displayName: "Botão",
            collapsible: true,
            slices: [
                this.buttonText,
                this.showText,
                this.iconSize,
                this.fontSize,
                this.width,
                this.height,
                this.backgroundColor,
                this.textColor,
                this.borderColor,
                this.borderWidth,
                this.borderRadius
            ]
        }),
        new FormattingSettingsGroup({
            name: "downloadMenu",
            displayName: "Menu e formato",
            collapsible: true,
            slices: [
                this.menuBackgroundColor,
                this.menuTextColor,
                this.formatBackgroundColor,
                this.formatSelectedColor,
                this.formatSelectedTextColor
            ]
        })
    ];

    onPreProcess(): void {
        this.groups.flatMap((group) => group.slices || []).forEach((slice) => {
            if (slice !== this.enabled) {
                slice.visible = this.enabled.value;
            }
        });
        const useCustomServer = this.method.value === "custom";
        const useOfficialApi = this.method.value === "official";
        this.bridgeUrl.visible = false;
        this.githubUrl.visible =
            this.enabled.value && !useCustomServer && !useOfficialApi;
        this.customUrl.visible = this.enabled.value && useCustomServer;
        this.method.description = useOfficialApi
            ? "A API oficial exige que o administrador habilite Permitir downloads de visuais personalizados no portal do Fabric."
            : useCustomServer
                ? "Servidor próprio exige HTTPS e autorização do domínio em WebAccess antes do empacotamento."
                : "GitHub Pages é o padrão e aceita qualquer endereço https://*.github.io sem recompilar o visual.";
    }
}

class HeaderCardSettings extends FormattingSettingsCompositeCard {
    showColumnFilters = new formattingSettings.ToggleSwitch({
        name: "showColumnFilters",
        displayName: "Mostrar filtros nas colunas",
        value: true
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "#E8F1FB" }
    });

    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto",
        value: { value: "#323130" }
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#E8F1FB" }
    });

    borderMode = new formattingSettings.AutoDropdown({
        name: "borderMode",
        displayName: "Configuração da borda",
        value: "sides"
    });

    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Espessura geral",
        value: 2
    });

    borderTopWidth = new formattingSettings.NumUpDown({
        name: "borderTopWidth",
        displayName: "Borda superior",
        value: 0
    });

    borderRightWidth = new formattingSettings.NumUpDown({
        name: "borderRightWidth",
        displayName: "Borda direita",
        value: 0
    });

    borderBottomWidth = new formattingSettings.NumUpDown({
        name: "borderBottomWidth",
        displayName: "Borda inferior",
        value: 2
    });

    borderLeftWidth = new formattingSettings.NumUpDown({
        name: "borderLeftWidth",
        displayName: "Borda esquerda",
        value: 0
    });

    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento dos cantos",
        value: 10
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 18
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Fonte",
        value: "Segoe UI"
    });

    alignment = new formattingSettings.AlignmentGroup({
        name: "alignment",
        displayName: "Alinhamento do texto",
        value: "left",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });

    height = new formattingSettings.NumUpDown({
        name: "height",
        displayName: "Altura",
        value: 50
    });

    horizontalPadding = new formattingSettings.NumUpDown({
        name: "horizontalPadding",
        displayName: "Espaçamento lateral",
        value: 10
    });

    name = "header";
    displayName = "Tabela · Cabeçalho";
    groups = [
        new FormattingSettingsGroup({
            name: "headerText",
            displayName: "Texto",
            collapsible: true,
            slices: [
                this.showColumnFilters,
                this.textColor,
                this.fontSize,
                this.fontFamily,
                this.alignment
            ]
        }),
        new FormattingSettingsGroup({
            name: "headerLayout",
            displayName: "Fundo e dimensões",
            collapsible: true,
            slices: [
                this.backgroundColor,
                this.height,
                this.horizontalPadding,
                this.borderRadius
            ]
        }),
        new FormattingSettingsGroup({
            name: "headerBorders",
            displayName: "Bordas",
            collapsible: true,
            slices: [
                this.borderColor,
                this.borderMode,
                this.borderWidth,
                this.borderTopWidth,
                this.borderRightWidth,
                this.borderBottomWidth,
                this.borderLeftWidth
            ]
        })
    ];

    onPreProcess(): void {
        const perSide = this.borderMode.value === "sides";
        this.borderWidth.visible = !perSide;
        this.borderTopWidth.visible = perSide;
        this.borderRightWidth.visible = perSide;
        this.borderBottomWidth.visible = perSide;
        this.borderLeftWidth.visible = perSide;
    }
}

class SelectionCardSettings extends FormattingSettingsCompositeCard {
    showCheckboxes = new formattingSettings.ToggleSwitch({
        name: "showCheckboxes",
        displayName: "Mostrar coluna de seleção",
        value: true
    });

    showSelectAll = new formattingSettings.ToggleSwitch({
        name: "showSelectAll",
        displayName: "Mostrar selecionar todos",
        value: true
    });

    behavior = new formattingSettings.AutoDropdown({
        name: "behavior",
        displayName: "Comportamento",
        value: "filter"
    });

    selectionMode = new formattingSettings.AutoDropdown({
        name: "selectionMode",
        displayName: "Tipo de seleção",
        value: "multiple"
    });

    indicatorStyle = new formattingSettings.AutoDropdown({
        name: "indicatorStyle",
        displayName: "Tipo do marcador",
        value: "checkbox"
    });

    indicatorSize = new formattingSettings.NumUpDown({
        name: "indicatorSize",
        displayName: "Tamanho do marcador",
        value: 18
    });

    columnWidth = new formattingSettings.NumUpDown({
        name: "columnWidth",
        displayName: "Largura da coluna de seleção",
        value: 42
    });

    horizontalAlignment = new formattingSettings.AlignmentGroup({
        name: "horizontalAlignment",
        displayName: "Alinhamento do marcador",
        value: "center",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });

    borderMode = new formattingSettings.AutoDropdown({
        name: "borderMode",
        displayName: "Posição da borda",
        value: "full"
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "#E8F1FB" }
    });

    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto",
        value: { value: "#242424" }
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#118DFF" }
    });

    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Espessura da borda",
        value: 3
    });

    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento da seleção",
        value: 3
    });

    dimUnselected = new formattingSettings.ToggleSwitch({
        name: "dimUnselected",
        displayName: "Reduzir opacidade das outras linhas",
        value: true
    });

    unselectedOpacity = new formattingSettings.NumUpDown({
        name: "unselectedOpacity",
        displayName: "Opacidade das outras linhas (%)",
        value: 50
    });

    name = "selection";
    displayName = "Tabela · Seleção";
    groups = [
        new FormattingSettingsGroup({
            name: "selectionBehavior",
            displayName: "Comportamento",
            collapsible: true,
            slices: [
                this.showCheckboxes,
                this.showSelectAll,
                this.behavior,
                this.selectionMode
            ]
        }),
        new FormattingSettingsGroup({
            name: "selectionMarker",
            displayName: "Coluna e marcador",
            collapsible: true,
            slices: [
                this.indicatorStyle,
                this.indicatorSize,
                this.columnWidth,
                this.horizontalAlignment
            ]
        }),
        new FormattingSettingsGroup({
            name: "selectionAppearance",
            displayName: "Linha selecionada",
            collapsible: true,
            slices: [
                this.borderMode,
                this.backgroundColor,
                this.textColor,
                this.borderColor,
                this.borderWidth,
                this.borderRadius,
                this.dimUnselected,
                this.unselectedOpacity
            ]
        })
    ];

}

class FilterBarCardSettings extends FormattingSettingsCompositeCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "rgba(0,0,0,0)" }
    });
    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto",
        value: { value: "#2457C5" }
    });
    chipBackgroundColor = new formattingSettings.ColorPicker({
        name: "chipBackgroundColor",
        displayName: "Fundo dos filtros",
        value: { value: "#F4F8FF" }
    });
    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#FFFFFF" }
    });
    topBorderWidth = new formattingSettings.NumUpDown({
        name: "topBorderWidth",
        displayName: "Espessura da borda superior",
        value: 0
    });
    bottomSpacing = new formattingSettings.NumUpDown({
        name: "bottomSpacing",
        displayName: "Espaço abaixo do filtro",
        value: 4
    });
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 13
    });
    height = new formattingSettings.NumUpDown({
        name: "height",
        displayName: "Altura mínima",
        value: 32
    });
    horizontalPadding = new formattingSettings.NumUpDown({
        name: "horizontalPadding",
        displayName: "Espaçamento lateral",
        value: 10
    });
    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento",
        value: 4
    });

    name = "filterBar";
    displayName = "Filtro";
    groups = [
        new FormattingSettingsGroup({
            name: "filterBarAppearance",
            displayName: "Filtro",
            collapsible: true,
            slices: [
                this.backgroundColor,
                this.textColor,
                this.chipBackgroundColor,
                this.borderColor,
                this.topBorderWidth,
                this.bottomSpacing,
                this.fontSize,
                this.height,
                this.horizontalPadding,
                this.borderRadius
            ]
        })
    ];
}

class PaginationCardSettings extends FormattingSettingsCompositeCard {
    enabled = new formattingSettings.ToggleSwitch({
        name: "enabled",
        displayName: "Ativar paginação",
        value: true
    });
    pageSize = new formattingSettings.NumUpDown({
        name: "pageSize",
        displayName: "Registros por página",
        value: 4
    });
    position = new formattingSettings.AutoDropdown({
        name: "position",
        displayName: "Posição",
        value: "top"
    });
    showPageNumbers = new formattingSettings.ToggleSwitch({
        name: "showPageNumbers",
        displayName: "Mostrar números das páginas",
        value: true
    });
    showRange = new formattingSettings.ToggleSwitch({
        name: "showRange",
        displayName: "Mostrar intervalo de registros",
        value: true
    });
    preserveSelection = new formattingSettings.ToggleSwitch({
        name: "preserveSelection",
        displayName: "Manter seleção ao trocar de página",
        value: true
    });
    selectAllScope = new formattingSettings.AutoDropdown({
        name: "selectAllScope",
        displayName: "Selecionar todos",
        value: "filtered"
    });
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "rgba(0,0,0,0)" }
    });
    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto",
        value: { value: "#323130" }
    });
    activeBackgroundColor = new formattingSettings.ColorPicker({
        name: "activeBackgroundColor",
        displayName: "Fundo da página atual",
        value: { value: "#118DFF" }
    });
    activeTextColor = new formattingSettings.ColorPicker({
        name: "activeTextColor",
        displayName: "Texto da página atual",
        value: { value: "#FFFFFF" }
    });
    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da borda",
        value: { value: "#D2D0CE" }
    });
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho do texto",
        value: 14
    });
    buttonSize = new formattingSettings.NumUpDown({
        name: "buttonSize",
        displayName: "Tamanho dos botões",
        value: 30
    });
    spacing = new formattingSettings.NumUpDown({
        name: "spacing",
        displayName: "Espaçamento",
        value: 8
    });
    horizontalPadding = new formattingSettings.NumUpDown({
        name: "horizontalPadding",
        displayName: "Espaçamento lateral",
        value: 0
    });
    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Arredondamento",
        value: 4
    });

    name = "pagination";
    displayName = "Paginação";
    groups = [
        new FormattingSettingsGroup({
            name: "paginationBehavior",
            displayName: "Comportamento",
            collapsible: true,
            slices: [
                this.enabled,
                this.pageSize,
                this.position,
                this.showPageNumbers,
                this.showRange,
                this.preserveSelection,
                this.selectAllScope
            ]
        }),
        new FormattingSettingsGroup({
            name: "paginationAppearance",
            displayName: "Aparência",
            collapsible: true,
            slices: [
                this.backgroundColor,
                this.textColor,
                this.activeBackgroundColor,
                this.activeTextColor,
                this.borderColor,
                this.fontSize,
                this.buttonSize,
                this.spacing,
                this.horizontalPadding,
                this.borderRadius
            ]
        })
    ];

    onPreProcess(): void {
        this.groups.flatMap((group) => group.slices || []).forEach((slice) => {
            if (slice !== this.enabled) {
                slice.visible = this.enabled.value;
            }
        });
    }
}

class TopLayoutCardSettings extends FormattingSettingsCompositeCard {
    mode = new formattingSettings.AutoDropdown({
        name: "mode",
        displayName: "Modo de posicionamento",
        value: "manual"
    });
    private createRow(name: string, displayName: string, value: string) {
        return new formattingSettings.AutoDropdown({ name, displayName, value });
    }
    private createAutomaticAlignment(name: string, value: string) {
        return new formattingSettings.AutoDropdown({
            name,
            displayName: "Posição automática",
            value
        });
    }
    private createAutomaticSpacing(name: string) {
        return new formattingSettings.NumUpDown({
            name,
            displayName: "Ajuste fino automático",
            description: "Esquerda/direita: 0 a 10 para dentro. Centro: -5 a 5.",
            value: 0
        });
    }
    private createManualPosition(name: string, value: number) {
        return new formattingSettings.NumUpDown({
            name,
            displayName: "Posição manual (0 a 100)",
            description: "Usa o tamanho próprio do componente. 0 encosta à esquerda e 100 à direita.",
            value
        });
    }

    titleRow = this.createRow("titleRow", "Linha", "1");
    titlePosition = this.createManualPosition("titlePosition", 0);
    titleAutomaticAlignment =
        this.createAutomaticAlignment("titleAutomaticAlignment", "left");
    titleAutomaticSpacing =
        this.createAutomaticSpacing("titleAutomaticSpacing");

    searchRow = this.createRow("searchRow", "Linha", "1");
    searchPosition = this.createManualPosition("searchPosition", 50);
    searchAutomaticAlignment =
        this.createAutomaticAlignment("searchAutomaticAlignment", "center");
    searchAutomaticSpacing =
        this.createAutomaticSpacing("searchAutomaticSpacing");

    downloadRow = this.createRow("downloadRow", "Linha", "1");
    downloadPosition = this.createManualPosition("downloadPosition", 100);
    downloadAutomaticAlignment =
        this.createAutomaticAlignment("downloadAutomaticAlignment", "right");
    downloadAutomaticSpacing =
        this.createAutomaticSpacing("downloadAutomaticSpacing");

    paginationRow = this.createRow("paginationRow", "Linha", "2");
    paginationPosition = this.createManualPosition("paginationPosition", 100);
    paginationAutomaticAlignment =
        this.createAutomaticAlignment("paginationAutomaticAlignment", "right");
    paginationAutomaticSpacing =
        this.createAutomaticSpacing("paginationAutomaticSpacing");

    rowGap = new formattingSettings.NumUpDown({
        name: "rowGap",
        displayName: "Espaço entre as linhas",
        value: 4
    });

    name = "topLayout";
    displayName = "Organizador superior";
    groups = [
        new FormattingSettingsGroup({
            name: "topLayoutGeneral",
            displayName: "Linhas",
            collapsible: true,
            slices: [this.mode, this.rowGap]
        }),
        new FormattingSettingsGroup({
            name: "topLayoutTitle",
            displayName: "Título e contador",
            collapsible: true,
            slices: [
                this.titleRow,
                this.titlePosition,
                this.titleAutomaticAlignment,
                this.titleAutomaticSpacing
            ]
        }),
        new FormattingSettingsGroup({
            name: "topLayoutSearch",
            displayName: "Pesquisa",
            collapsible: true,
            slices: [
                this.searchRow,
                this.searchPosition,
                this.searchAutomaticAlignment,
                this.searchAutomaticSpacing
            ]
        }),
        new FormattingSettingsGroup({
            name: "topLayoutDownload",
            displayName: "Download",
            collapsible: true,
            slices: [
                this.downloadRow,
                this.downloadPosition,
                this.downloadAutomaticAlignment,
                this.downloadAutomaticSpacing
            ]
        }),
        new FormattingSettingsGroup({
            name: "topLayoutPagination",
            displayName: "Paginação",
            collapsible: true,
            slices: [
                this.paginationRow,
                this.paginationPosition,
                this.paginationAutomaticAlignment,
                this.paginationAutomaticSpacing
            ]
        })
    ];

    onPreProcess(): void {
        const manual = String(this.mode.value) === "manual";
        [
            this.titlePosition,
            this.searchPosition,
            this.downloadPosition,
            this.paginationPosition
        ].forEach((slice) => {
            slice.visible = manual;
        });
        [
            this.titleAutomaticAlignment,
            this.titleAutomaticSpacing,
            this.searchAutomaticAlignment,
            this.searchAutomaticSpacing,
            this.downloadAutomaticAlignment,
            this.downloadAutomaticSpacing,
            this.paginationAutomaticAlignment,
            this.paginationAutomaticSpacing
        ].forEach((slice) => {
            slice.visible = !manual;
        });
    }
}

class TableCardSettings extends FormattingSettingsCompositeCard {
    base = new TableBaseSettings();
    header = new HeaderCardSettings();
    selection = new SelectionCardSettings();
    filterBar = new FilterBarCardSettings();
    pagination = new PaginationCardSettings();

    fontSize = this.base.fontSize;
    rowHeight = this.base.rowHeight;
    textColor = this.base.textColor;
    backgroundColor = this.base.backgroundColor;
    valueAlignment = this.base.valueAlignment;
    hoverBackgroundColor = this.base.hoverBackgroundColor;
    hoverRadius = this.base.hoverRadius;
    showRowDividers = this.base.showRowDividers;
    rowDividerColor = this.base.rowDividerColor;
    rowDividerWidth = this.base.rowDividerWidth;
    showTotals = this.base.showTotals;
    totalLabel = this.base.totalLabel;
    totalBackgroundColor = this.base.totalBackgroundColor;
    totalTextColor = this.base.totalTextColor;
    totalAlignment = this.base.totalAlignment;
    totalFontSize = this.base.totalFontSize;
    totalBorderRadius = this.base.totalBorderRadius;
    totalsMode = this.base.totalsMode;
    totalMenuBackgroundColor = this.base.totalMenuBackgroundColor;
    totalMenuBorderColor = this.base.totalMenuBorderColor;
    totalMenuFontSize = this.base.totalMenuFontSize;
    totalMenuRadius = this.base.totalMenuRadius;

    name = "table";
    displayName = "Tabela";
    groups: FormattingSettingsGroup[];

    constructor() {
        super();
        const rename = (
            prefix: string,
            slices: Array<{ name: string }>
        ): void => slices.forEach((slice) => {
            slice.name = `${prefix}${slice.name[0].toUpperCase()}${slice.name.slice(1)}`;
        });
        const headerSlices = this.header.groups.flatMap(
            (group) => group.slices || []
        );
        const selectionSlices = this.selection.groups.flatMap(
            (group) => group.slices || []
        );
        const paginationSlices = this.pagination.groups.flatMap(
            (group) => group.slices || []
        );
        const filterBarSlices = this.filterBar.groups.flatMap(
            (group) => group.slices || []
        );
        rename("header", headerSlices);
        rename("selection", selectionSlices);
        rename("filterBar", filterBarSlices);
        rename("pagination", paginationSlices);
        this.groups = [
            ...this.base.groups,
            new FormattingSettingsGroup({
                name: "tableHeader",
                displayName: "Cabeçalho",
                collapsible: true,
                slices: headerSlices
            }),
            new FormattingSettingsGroup({
                name: "tableSelection",
                displayName: "Seleção",
                collapsible: true,
                slices: selectionSlices
            }),
            new FormattingSettingsGroup({
                name: "tableFilterBar",
                displayName: "Filtro",
                collapsible: true,
                slices: filterBarSlices
            }),
            new FormattingSettingsGroup({
                name: "tablePagination",
                displayName: "Paginação",
                collapsible: true,
                slices: paginationSlices
            })
        ];
    }

    onPreProcess(): void {
        this.base.onPreProcess();
        this.header.onPreProcess();
        this.pagination.onPreProcess();
    }
}

class ColumnStyleCardSettings extends FormattingSettingsCompositeCard {
    selectedColumn = new formattingSettings.ItemDropdown({
        name: "selectedColumn",
        displayName: "Aplicar configurações para",
        items: [],
        value: { displayName: "Primeira coluna", value: "" }
    });

    cellMode = new formattingSettings.AutoDropdown({
        name: "cellMode",
        displayName: "Exibição da célula",
        value: "value"
    });

    columnOrder = new formattingSettings.NumUpDown({
        name: "columnOrder",
        displayName: "Posição da coluna (-1 automática)",
        value: -1
    });

    totalAggregation = new formattingSettings.AutoDropdown({
        name: "totalAggregation",
        displayName: "Cálculo padrão do total",
        value: "none"
    });

    showColumnTotal = new formattingSettings.ToggleSwitch({
        name: "showColumnTotal",
        displayName: "Mostrar total nesta coluna",
        value: true
    });

    totalAlignment = new formattingSettings.AlignmentGroup({
        name: "totalAlignment",
        displayName: "Alinhamento do total",
        value: "auto",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        supportsNoSelection: true
    });

    totalFontSize = new formattingSettings.NumUpDown({
        name: "totalFontSize",
        displayName: "Tamanho do texto (0 usa o geral)",
        value: 0
    });

    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Cor do texto",
        value: { value: "#242424" }
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Cor de fundo",
        value: { value: "rgba(0,0,0,0)" }
    });

    alignment = new formattingSettings.AlignmentGroup({
        name: "alignment",
        displayName: "Alinhamento",
        value: "auto",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        supportsNoSelection: true
    });

    allowWidthReduction = new formattingSettings.ToggleSwitch({
        name: "allowWidthReduction",
        displayName: "Usar largura mínima",
        description: "Também é ativada automaticamente ao arrastar a divisória da coluna.",
        value: false
    });

    filterVisibility = new formattingSettings.AutoDropdown({
        name: "filterVisibility",
        displayName: "Filtro no cabeçalho desta coluna",
        description: "Permite retirar ou mostrar o ícone de filtro especificamente nesta coluna.",
        value: "inherit"
    });

    reducedWidth = new formattingSettings.NumUpDown({
        name: "reducedWidth",
        displayName: "Largura mínima (0 oculta)",
        description: "Use zero para ocultar a coluna. Duplo clique na divisória restaura o modo automático.",
        value: 140
    });

    iconStyle = new formattingSettings.AutoDropdown({
        name: "iconStyle",
        displayName: "Estilo do ícone SVG",
        value: "status"
    });

    iconColor = new formattingSettings.ColorPicker({
        name: "iconColor",
        displayName: "Cor do ícone",
        value: { value: "#118DFF" }
    });

    cellPadding = new formattingSettings.NumUpDown({
        name: "cellPadding",
        displayName: "Espaçamento lateral dos valores",
        value: 12
    });

    headerPadding = new formattingSettings.NumUpDown({
        name: "headerPadding",
        displayName: "Espaçamento lateral do título",
        value: 12
    });

    headerFontSize = new formattingSettings.NumUpDown({
        name: "headerFontSize",
        displayName: "Tamanho do título",
        value: 12
    });

    headerTextColor = new formattingSettings.ColorPicker({
        name: "headerTextColor",
        displayName: "Cor do título",
        value: { value: "#323130" }
    });

    headerBackgroundColor = new formattingSettings.ColorPicker({
        name: "headerBackgroundColor",
        displayName: "Fundo do título",
        value: { value: "#F5F5F5" }
    });

    headerAlignment = new formattingSettings.AlignmentGroup({
        name: "headerAlignment",
        displayName: "Alinhamento do título",
        value: "auto",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        supportsNoSelection: true
    });

    pillRadius = new formattingSettings.NumUpDown({
        name: "pillRadius",
        displayName: "Arredondamento da etiqueta",
        value: 8
    });

    pillRandomColors = new formattingSettings.ToggleSwitch({
        name: "pillRandomColors",
        displayName: "Cores aleatórias",
        value: true
    });

    pillPositiveNegative = new formattingSettings.ToggleSwitch({
        name: "pillPositiveNegative",
        displayName: "Cores para negativo e positivo",
        value: false
    });

    pillNegativeColor = new formattingSettings.ColorPicker({
        name: "pillNegativeColor",
        displayName: "Cor negativa",
        value: { value: "#FEE2E2" }
    });

    pillPositiveColor = new formattingSettings.ColorPicker({
        name: "pillPositiveColor",
        displayName: "Cor positiva",
        value: { value: "#DCFCE7" }
    });

    pillTextFollowsBackground = new formattingSettings.ToggleSwitch({
        name: "pillTextFollowsBackground",
        displayName: "Texto acompanha o fundo",
        value: true
    });

    pillFunctionColor = new formattingSettings.ColorPicker({
        name: "pillFunctionColor",
        displayName: "Cor por função",
        value: { value: "#DCFCE7" }
    });

    pillValue1 = new formattingSettings.TextInput({
        name: "pillValue1",
        displayName: "Opção 1",
        value: "",
        placeholder: "Valor"
    });
    pillColor1 = new formattingSettings.ColorPicker({
        name: "pillColor1",
        displayName: "Fundo da opção 1",
        value: { value: "#DCFCE7" }
    });
    pillValue2 = new formattingSettings.TextInput({
        name: "pillValue2",
        displayName: "Opção 2",
        value: "",
        placeholder: "Valor"
    });
    pillColor2 = new formattingSettings.ColorPicker({
        name: "pillColor2",
        displayName: "Fundo da opção 2",
        value: { value: "#FEF3C7" }
    });
    pillValue3 = new formattingSettings.TextInput({
        name: "pillValue3",
        displayName: "Opção 3",
        value: "",
        placeholder: "Valor"
    });
    pillColor3 = new formattingSettings.ColorPicker({
        name: "pillColor3",
        displayName: "Fundo da opção 3",
        value: { value: "#DBEAFE" }
    });
    pillValue4 = new formattingSettings.TextInput({
        name: "pillValue4",
        displayName: "Opção 4",
        value: "",
        placeholder: "Valor"
    });
    pillColor4 = new formattingSettings.ColorPicker({
        name: "pillColor4",
        displayName: "Fundo da opção 4",
        value: { value: "#FEE2E2" }
    });
    pillTextColor1 = new formattingSettings.ColorPicker({
        name: "pillTextColor1",
        displayName: "Texto da opção 1",
        value: { value: "#242424" }
    });
    pillTextColor2 = new formattingSettings.ColorPicker({
        name: "pillTextColor2",
        displayName: "Texto da opção 2",
        value: { value: "#242424" }
    });
    pillTextColor3 = new formattingSettings.ColorPicker({
        name: "pillTextColor3",
        displayName: "Texto da opção 3",
        value: { value: "#242424" }
    });
    pillTextColor4 = new formattingSettings.ColorPicker({
        name: "pillTextColor4",
        displayName: "Texto da opção 4",
        value: { value: "#242424" }
    });

    barMinimum = new formattingSettings.NumUpDown({
        name: "barMinimum",
        displayName: "Valor mínimo",
        value: 0
    });
    barMaximum = new formattingSettings.NumUpDown({
        name: "barMaximum",
        displayName: "Valor máximo",
        value: 100
    });
    barThreshold = new formattingSettings.NumUpDown({
        name: "barThreshold",
        displayName: "Limite para trocar a cor",
        value: 50
    });
    barLowColor = new formattingSettings.ColorPicker({
        name: "barLowColor",
        displayName: "Cor abaixo do limite",
        value: { value: "#F04444" }
    });
    barHighColor = new formattingSettings.ColorPicker({
        name: "barHighColor",
        displayName: "Cor a partir do limite",
        value: { value: "#20BF6B" }
    });
    barTrackColor = new formattingSettings.ColorPicker({
        name: "barTrackColor",
        displayName: "Cor do trilho",
        value: { value: "#E2E8F0" }
    });
    barWidth = new formattingSettings.NumUpDown({
        name: "barWidth",
        displayName: "Largura da barra",
        value: 56
    });
    barHeight = new formattingSettings.NumUpDown({
        name: "barHeight",
        displayName: "Altura da barra",
        value: 7
    });

    svgBackgroundColor = new formattingSettings.ColorPicker({
        name: "svgBackgroundColor",
        displayName: "Fundo do SVG",
        value: { value: "#E8F1FF" }
    });
    svgTextColor = new formattingSettings.ColorPicker({
        name: "svgTextColor",
        displayName: "Cor do texto SVG",
        value: { value: "#2457C5" }
    });
    svgBorderColor = new formattingSettings.ColorPicker({
        name: "svgBorderColor",
        displayName: "Borda do SVG",
        value: { value: "#B4C7E7" }
    });
    svgRadius = new formattingSettings.NumUpDown({
        name: "svgRadius",
        displayName: "Arredondamento do SVG",
        value: 8
    });

    name = "columnStyle";
    displayName = "Coluna específica";
    groups = [
        new FormattingSettingsGroup({
            name: "columnTarget",
            displayName: "Coluna",
            collapsible: true,
            slices: [
                this.selectedColumn
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnTotal",
            displayName: "Total da coluna",
            collapsible: true,
            slices: [
                this.showColumnTotal,
                this.totalAggregation,
                this.totalAlignment,
                this.totalFontSize
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnValues",
            displayName: "Valores",
            collapsible: true,
            slices: [
                this.cellMode,
                this.textColor,
                this.backgroundColor,
                this.alignment,
                this.filterVisibility,
                this.allowWidthReduction,
                this.reducedWidth,
                this.cellPadding
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnPills",
            displayName: "Etiquetas",
            collapsible: true,
            slices: [
                this.pillRadius,
                this.pillRandomColors,
                this.pillPositiveNegative,
                this.pillNegativeColor,
                this.pillPositiveColor,
                this.pillTextFollowsBackground,
                this.pillFunctionColor
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnColorRules",
            displayName: "Regras de cor por valor",
            collapsible: true,
            slices: [
                this.pillValue1,
                this.pillColor1,
                this.pillTextColor1,
                this.pillValue2,
                this.pillColor2,
                this.pillTextColor2,
                this.pillValue3,
                this.pillColor3,
                this.pillTextColor3,
                this.pillValue4,
                this.pillColor4,
                this.pillTextColor4
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnBars",
            displayName: "Barras",
            collapsible: true,
            slices: [
                this.barMinimum,
                this.barMaximum,
                this.barThreshold,
                this.barLowColor,
                this.barHighColor,
                this.barTrackColor,
                this.barWidth,
                this.barHeight
            ]
        }),
        new FormattingSettingsGroup({
            name: "columnHeader",
            displayName: "Título da coluna",
            collapsible: true,
            slices: [
                this.filterVisibility,
                this.headerPadding,
                this.headerFontSize,
                this.headerTextColor,
                this.headerBackgroundColor,
                this.headerAlignment
            ]
        })
    ];

    onPreProcess(): void {
        this.cellMode.value = "value";
        this.cellMode.visible = false;
        const pill = false;
        const bar = false;
        const pillGroup = this.groups.find((group) => group.name === "columnPills");
        const barGroup = this.groups.find((group) => group.name === "columnBars");
        const legacyRulesGroup = this.groups.find(
            (group) => group.name === "columnColorRules"
        );
        if (pillGroup) {
            pillGroup.visible = pill;
        }
        if (barGroup) {
            barGroup.visible = bar;
        }
        if (legacyRulesGroup) {
            legacyRulesGroup.visible = false;
        }
        const signMode = pill &&
            !this.pillRandomColors.value &&
            this.pillPositiveNegative.value;
        this.pillPositiveNegative.visible =
            pill && !this.pillRandomColors.value;
        this.pillNegativeColor.visible = signMode;
        this.pillPositiveColor.visible = signMode;
        this.pillTextFollowsBackground.visible = pill;
        this.pillFunctionColor.visible =
            pill && !this.pillRandomColors.value && !signMode;
    }
}

class CellElementsCardSettings extends FormattingSettingsCompositeCard {
    selectedSeries = new formattingSettings.ItemDropdown({
        name: "selectedSeries",
        displayName: "Aplicar configurações para",
        items: [],
        value: { displayName: "Primeira coluna", value: "" }
    });

    backgroundEnabled = new formattingSettings.ToggleSwitch({
        name: "backgroundEnabled",
        displayName: "Cor da tela de fundo",
        value: false
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Formatação da cor de fundo",
        value: { value: "#FFFFFF" }
    });

    backgroundColorField = new formattingSettings.ItemDropdown({
        name: "backgroundColorField",
        displayName: "Campo/medida da cor de fundo",
        items: [],
        value: { displayName: "Usar cor fixa", value: "" }
    });

    fontEnabled = new formattingSettings.ToggleSwitch({
        name: "fontEnabled",
        displayName: "Cor da fonte",
        value: false
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Formatação da cor da fonte",
        value: { value: "#242424" }
    });

    fontColorField = new formattingSettings.ItemDropdown({
        name: "fontColorField",
        displayName: "Campo/medida da cor da fonte",
        items: [],
        value: { displayName: "Usar cor fixa", value: "" }
    });

    iconsEnabled = new formattingSettings.ToggleSwitch({
        name: "iconsEnabled",
        displayName: "Ícones",
        value: false
    });

    iconColor = new formattingSettings.ColorPicker({
        name: "iconColor",
        displayName: "Formatação da cor do ícone",
        value: { value: "#118DFF" }
    });

    iconColorField = new formattingSettings.ItemDropdown({
        name: "iconColorField",
        displayName: "Campo/medida da cor do ícone",
        items: [],
        value: { displayName: "Usar cor fixa", value: "" }
    });

    iconStyle = new formattingSettings.AutoDropdown({
        name: "iconStyle",
        displayName: "Estilo do ícone",
        value: "status"
    });

    iconLayout = new formattingSettings.AutoDropdown({
        name: "iconLayout",
        displayName: "Layout do ícone",
        value: "left"
    });

    iconRuleEnabled = new formattingSettings.ToggleSwitch({
        name: "iconRuleEnabled",
        displayName: "Usar regra por limite",
        value: false
    });

    iconRuleField = new formattingSettings.ItemDropdown({
        name: "iconRuleField",
        displayName: "Campo-base da regra",
        items: [],
        value: { displayName: "Mesma coluna", value: "" }
    });

    iconThreshold = new formattingSettings.NumUpDown({
        name: "iconThreshold",
        displayName: "Valor de corte",
        value: 50
    });

    iconBelowStyle = new formattingSettings.AutoDropdown({
        name: "iconBelowStyle",
        displayName: "Ícone abaixo do corte",
        value: "circle"
    });

    iconBelowColor = new formattingSettings.ColorPicker({
        name: "iconBelowColor",
        displayName: "Cor abaixo do corte",
        value: { value: "#E53935" }
    });

    iconAboveStyle = new formattingSettings.AutoDropdown({
        name: "iconAboveStyle",
        displayName: "Ícone a partir do corte",
        value: "circle"
    });

    iconAboveColor = new formattingSettings.ColorPicker({
        name: "iconAboveColor",
        displayName: "Cor a partir do corte",
        value: { value: "#21A366" }
    });

    name = "cellElements";
    displayName = "Elementos da célula";
    groups = [
        new FormattingSettingsGroup({
            name: "cellElementsAppearance",
            displayName: "Elementos da célula",
            collapsible: true,
            slices: [
                this.selectedSeries,
                this.backgroundEnabled,
                this.backgroundColor,
                this.backgroundColorField,
                this.fontEnabled,
                this.fontColor,
                this.fontColorField
            ]
        }),
        new FormattingSettingsGroup({
            name: "cellElementsIcons",
            displayName: "Ícones",
            collapsible: true,
            slices: [
                this.iconsEnabled,
                this.iconColor,
                this.iconColorField,
                this.iconStyle,
                this.iconLayout,
                this.iconRuleEnabled,
                this.iconRuleField,
                this.iconThreshold,
                this.iconBelowStyle,
                this.iconBelowColor,
                this.iconAboveStyle,
                this.iconAboveColor
            ]
        })
    ];

    onPreProcess(): void {
        this.backgroundColor.visible = this.backgroundEnabled.value;
        this.backgroundColorField.visible = this.backgroundEnabled.value;
        this.fontColor.visible = this.fontEnabled.value;
        this.fontColorField.visible = this.fontEnabled.value;
        this.iconColor.visible = this.iconsEnabled.value;
        this.iconColorField.visible = this.iconsEnabled.value;
        this.iconStyle.visible = this.iconsEnabled.value;
        this.iconLayout.visible = this.iconsEnabled.value;
        const showRule = this.iconsEnabled.value && this.iconRuleEnabled.value;
        this.iconRuleEnabled.visible = this.iconsEnabled.value;
        this.iconRuleField.visible = showRule;
        this.iconThreshold.visible = showRule;
        this.iconBelowStyle.visible = showRule;
        this.iconBelowColor.visible = showRule;
        this.iconAboveStyle.visible = showRule;
        this.iconAboveColor.visible = showRule;
    }
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    table = new TableCardSettings();
    header = this.table.header;
    selection = this.table.selection;
    filterBar = this.table.filterBar;
    pagination = this.table.pagination;
    titleBar = new TitleBarCardSettings();
    search = new SearchCardSettings();
    download = new DownloadCardSettings();
    topLayout = new TopLayoutCardSettings();
    columnStyle = new ColumnStyleCardSettings();
    cellElements = new CellElementsCardSettings();
    cards = [
        this.table,
        this.titleBar,
        this.search,
        this.download,
        this.topLayout,
        this.columnStyle,
        this.cellElements
    ];

}
