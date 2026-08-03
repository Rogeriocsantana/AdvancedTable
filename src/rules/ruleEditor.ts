import { TableModel, TableRow } from "../data/dataTypes";
import { resolveRuleStyle } from "./ruleEngine";
import {
    ColumnRuleSet,
    CustomIconAsset,
    IconPreferences,
    ResolvedRuleStyle,
    RuleOperator,
    VisualRule
} from "./ruleTypes";

const ICONS: string[][] = [
    ["none", "Sem ícone"],
    ["check", "✓ Aprovação"],
    ["close", "× Reprovação"],
    ["circleSymbolHigh", "Aprovação circular nativa"],
    ["circleSymbolLow", "Reprovação circular nativa"],
    ["flagLow", "Bandeira baixa nativa"],
    ["trendDownColor", "Tendência baixa"],
    ["trendFlatColor", "Tendência estável"],
    ["trendUpColor", "Tendência alta"],
    ["warning", "⚠ Alerta"],
    ["info", "ⓘ Informação"],
    ["star", "★ Estrela"],
    ["heart", "♥ Favorito"],
    ["circle", "● Círculo"],
    ["diamond", "◆ Losango"],
    ["square", "■ Quadrado"],
    ["triangle", "▲ Triângulo"],
    ["up", "↑ Seta para cima"],
    ["down", "↓ Seta para baixo"],
    ["right", "→ Seta para direita"],
    ["trendUp", "↗ Tendência de alta"],
    ["trendDown", "↘ Tendência de queda"],
    ["money", "$ Financeiro"],
    ["percent", "% Percentual"],
    ["play", "▶ Executar"],
    ["emojiSmile", "😊 Feliz"],
    ["emojiNeutral", "😐 Neutro"],
    ["emojiSad", "😟 Preocupado"],
    ["emojiCelebrate", "🎉 Celebração"],
    ["emojiFire", "🔥 Destaque"],
    ["emojiThumbUp", "👍 Positivo"],
    ["emojiThumbDown", "👎 Negativo"],
    ["emojiRocket", "🚀 Lançamento"],
    ["emojiTrophy", "🏆 Conquista"],
    ["emojiIdea", "💡 Ideia"],
    ["circleOutline", "○ Círculo com contorno"],
    ["circleHalfLeft", "◐ Meio círculo esquerdo"],
    ["circleHalfRight", "◑ Meio círculo direito"],
    ["circleHalfBottom", "◒ Meio círculo inferior"],
    ["circleHalfTop", "◓ Meio círculo superior"],
    ["diamondOutline", "◇ Losango com contorno"],
    ["squareOutline", "□ Quadrado com contorno"],
    ["triangleDown", "▼ Triângulo para baixo"],
    ["triangleLeft", "◀ Triângulo para esquerda"],
    ["triangleRight", "▶ Triângulo para direita"],
    ["left", "← Seta para esquerda"],
    ["upRight", "↗ Seta diagonal superior"],
    ["downRight", "↘ Seta diagonal inferior"],
    ["upLeft", "↖ Seta diagonal superior esquerda"],
    ["downLeft", "↙ Seta diagonal inferior esquerda"],
    ["doubleUp", "⇈ Dupla seta para cima"],
    ["doubleDown", "⇊ Dupla seta para baixo"],
    ["starOutline", "☆ Estrela com contorno"],
    ["flagOutline", "⚐ Bandeira com contorno"]
];

const OPERATOR_OPTIONS: string[][] = [
    ["eq", "É igual a"],
    ["neq", "Não é igual a"],
    ["gt", "É maior que"],
    ["gte", "É maior ou igual a"],
    ["lt", "É menor que"],
    ["lte", "É menor ou igual a"],
    ["between", "Está entre"],
    ["notBetween", "Não está entre"]
];

const ICON_GLYPHS: Record<string, string> = {
    check: "✓",
    close: "×",
    circleSymbolHigh: "✓",
    circleSymbolLow: "×",
    flagLow: "⚑",
    warning: "⚠",
    info: "ⓘ",
    star: "★",
    heart: "♥",
    flag: "⚑",
    circle: "●",
    diamond: "◆",
    square: "■",
    triangle: "▲",
    up: "↑",
    down: "↓",
    right: "→",
    trendUp: "↗",
    trendDown: "↘",
    money: "$",
    percent: "%",
    clock: "◷",
    calendar: "▣",
    user: "●",
    team: "●",
    mail: "✉",
    phone: "☎",
    location: "⌖",
    bolt: "ϟ",
    target: "◎",
    tag: "◇",
    play: "▶",
    pause: "Ⅱ",
    stop: "■",
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
    emojiEyes: "👀",
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
    checkCircle: "✓",
    closeCircle: "×",
    exclamationCircle: "!",
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
    plusCircle: "⊕",
    arrowCircleUp: "⮝",
    arrowCircleDown: "⮟"
};

function newId(): string {
    return globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${String(performance.now()).replace(".", "")}`;
}

function createRule(targetQueryName: string, compareValue = ""): VisualRule {
    return {
        id: newId(),
        sourceQueryName: targetQueryName,
        operator: "eq",
        compareValue,
        compareValue2: "",
        backgroundColor: "#D5E3FF",
        textColor: "#004786",
        followBackground: true,
        icon: "check",
        iconColor: "#005CAC",
        iconPosition: "before",
        barColor: "#005CAC"
    };
}

function createRuleSet(targetQueryName: string): ColumnRuleSet {
    const fallback = createRule(targetQueryName);
    return {
        targetQueryName,
        enabled: true,
        mode: "pill",
        strategy: "custom",
        rules: [],
        defaultRule: fallback,
        negativeColor: "#BA1A1A",
        positiveColor: "#0F7B3E",
        barTrackColor: "#DCE9FF",
        barMinimum: 0,
        barMaximum: 100,
        iconSize: "medium",
        iconPosition: "before",
        labelMarker: "circle",
        barStyle: "adjacent",
        barPosition: "before"
    };
}

export class RuleEditor {
    private readonly overlay: HTMLDivElement;
    private readonly panel: HTMLDivElement;
    private readonly content: HTMLDivElement;
    private readonly enabledInput: HTMLInputElement;
    private readonly removeFormattingButton: HTMLButtonElement;
    private readonly configurationFeedback: HTMLSpanElement;
    private model: TableModel | null = null;
    private ruleSets: ColumnRuleSet[] = [];
    private customIcons: CustomIconAsset[] = [];
    private iconPreferences: IconPreferences = {
        hiddenNativeIcons: [],
        pickerSize: "expanded",
        pickerIconSize: "normal",
        nativeIconOrder: []
    };
    private persistedTargets = new Set<string>();
    private activeRuleSet: ColumnRuleSet | null = null;
    private previewHost: HTMLDivElement | null = null;

    constructor(
        target: HTMLElement,
        private readonly onSave: (rules: ColumnRuleSet[]) => void,
        private readonly onSaveIcons: (icons: CustomIconAsset[]) => void,
        private readonly onSaveIconPreferences:
            (preferences: IconPreferences) => void,
        private readonly onExportConfiguration: () => Promise<string>,
        private readonly onImportConfiguration:
            (contents: string) => Promise<string>
    ) {
        this.overlay = document.createElement("div");
        this.overlay.className = "power-table__rule-overlay";
        this.overlay.hidden = true;
        this.panel = document.createElement("div");
        this.panel.className = "power-table__rule-panel";

        const header = document.createElement("header");
        const heading = document.createElement("div");
        heading.className = "power-table__rule-heading";
        const titleLine = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = "Configuração de Formatação Condicional";
        const status = document.createElement("span");
        status.className = "power-table__rule-status";
        status.textContent = "ATIVO";
        titleLine.append(title, status);
        const subtitle = document.createElement("span");
        subtitle.textContent =
            "Defina regras visuais para destacar métricas, categorias e tendências.";
        heading.append(titleLine, subtitle);

        const headerActions = document.createElement("div");
        headerActions.className = "power-table__rule-header-actions";
        const configurationActions = document.createElement("div");
        configurationActions.className =
            "power-table__configuration-actions";
        const exportConfiguration = document.createElement("button");
        exportConfiguration.type = "button";
        exportConfiguration.textContent = "Exportar configuração";
        exportConfiguration.title =
            "Baixar todas as configurações do AdvanceTable em JSON";
        exportConfiguration.addEventListener("click", async () => {
            this.configurationFeedback.classList.remove("is-error");
            exportConfiguration.disabled = true;
            try {
                this.configurationFeedback.textContent =
                    "Preparando configuração...";
                this.configurationFeedback.textContent =
                    await this.onExportConfiguration();
            } catch (error) {
                this.configurationFeedback.textContent =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível exportar a configuração.";
                this.configurationFeedback.classList.add("is-error");
            } finally {
                exportConfiguration.disabled = false;
            }
        });
        const importConfiguration = document.createElement("button");
        importConfiguration.type = "button";
        importConfiguration.textContent = "Importar configuração";
        importConfiguration.title =
            "Carregar uma configuração do AdvanceTable em JSON";
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,application/json";
        fileInput.hidden = true;
        importConfiguration.addEventListener("click", () => {
            fileInput.value = "";
            fileInput.click();
        });
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            importConfiguration.disabled = true;
            this.configurationFeedback.textContent =
                "Importando configuração...";
            this.configurationFeedback.classList.remove("is-error");
            try {
                const message = await this.onImportConfiguration(
                    await file.text()
                );
                this.configurationFeedback.textContent = message;
                window.setTimeout(() => this.close(), 900);
            } catch (error) {
                this.configurationFeedback.textContent =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível importar a configuração.";
                this.configurationFeedback.classList.add("is-error");
            } finally {
                importConfiguration.disabled = false;
            }
        });
        this.configurationFeedback = document.createElement("span");
        this.configurationFeedback.className =
            "power-table__configuration-feedback";
        configurationActions.append(
            exportConfiguration,
            importConfiguration,
            fileInput,
            this.configurationFeedback
        );
        const enabledLabel = document.createElement("label");
        enabledLabel.className = "power-table__rule-switch";
        this.enabledInput = document.createElement("input");
        this.enabledInput.type = "checkbox";
        this.enabledInput.addEventListener("change", () => {
            if (this.activeRuleSet) {
                this.activeRuleSet.enabled = this.enabledInput.checked;
                this.render();
            }
        });
        const switchTrack = document.createElement("span");
        const switchText = document.createElement("b");
        switchText.textContent = "Habilitar formatação";
        enabledLabel.append(this.enabledInput, switchTrack, switchText);
        const close = document.createElement("button");
        close.type = "button";
        close.className = "power-table__rule-close";
        close.textContent = "×";
        close.setAttribute("aria-label", "Fechar editor");
        close.addEventListener("click", () => this.close());
        headerActions.append(configurationActions, enabledLabel, close);
        header.append(heading, headerActions);

        this.content = document.createElement("div");
        this.content.className = "power-table__rule-content";
        const footer = document.createElement("footer");
        this.removeFormattingButton = document.createElement("button");
        this.removeFormattingButton.type = "button";
        this.removeFormattingButton.className = "is-danger";
        this.removeFormattingButton.textContent = "Remover formatação";
        this.removeFormattingButton.addEventListener("click", () => {
            if (!this.activeRuleSet) return;
            const queryName = this.activeRuleSet.targetQueryName;
            const remainingRuleSets = this.ruleSets.filter(
                (ruleSet) => ruleSet.targetQueryName !== queryName
            );
            this.onSave(remainingRuleSets);
            this.close();
        });
        const reset = document.createElement("button");
        reset.type = "button";
        reset.className = "is-ghost";
        reset.textContent = "Restaurar coluna";
        reset.addEventListener("click", () => {
            if (!this.activeRuleSet) return;
            const queryName = this.activeRuleSet.targetQueryName;
            const index = this.ruleSets.indexOf(this.activeRuleSet);
            const replacement = createRuleSet(queryName);
            this.ruleSets.splice(index, 1, replacement);
            this.activeRuleSet = replacement;
            this.render();
        });
        const footerActions = document.createElement("div");
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancelar";
        cancel.addEventListener("click", () => this.close());
        const apply = document.createElement("button");
        apply.type = "button";
        apply.className = "is-primary";
        apply.textContent = "Aplicar";
        apply.addEventListener("click", () => {
            this.onSave(this.ruleSets);
            this.close();
        });
        footerActions.append(cancel, apply);
        const footerColumnActions = document.createElement("div");
        footerColumnActions.className = "power-table__rule-column-actions";
        footerColumnActions.append(this.removeFormattingButton, reset);
        footer.append(footerColumnActions, footerActions);
        this.panel.append(header, this.content, footer);
        this.overlay.appendChild(this.panel);
        this.overlay.addEventListener("click", (event) => {
            if (event.target === this.overlay) this.close();
        });
        this.panel.addEventListener("click", (event) => {
            const targetElement = event.target as Element;
            if (!targetElement.closest(".power-table__icon-picker")) {
                this.panel.querySelectorAll<HTMLElement>(
                    ".power-table__icon-palette"
                ).forEach((palette) => { palette.hidden = true; });
            }
        });
        target.appendChild(this.overlay);
    }

    public open(
        model: TableModel,
        rules: ColumnRuleSet[],
        customIcons: CustomIconAsset[],
        iconPreferences: IconPreferences
    ): void {
        this.model = model;
        this.ruleSets = JSON.parse(JSON.stringify(rules));
        this.customIcons = JSON.parse(JSON.stringify(customIcons));
        this.iconPreferences = JSON.parse(JSON.stringify(iconPreferences));
        this.persistedTargets = new Set(
            rules.map((ruleSet) => ruleSet.targetQueryName)
        );
        const firstQueryName = model.columns[0]?.queryName || "";
        this.activeRuleSet = this.ruleSets.find(
            (ruleSet) => ruleSet.targetQueryName === firstQueryName
        ) || createRuleSet(firstQueryName);
        this.normalizeRuleSet(this.activeRuleSet);
        this.render();
        this.overlay.hidden = false;
    }

    private close(): void {
        this.overlay.hidden = true;
    }

    private normalizeRuleSet(ruleSet: ColumnRuleSet): void {
        ruleSet.enabled = ruleSet.enabled !== false;
        ruleSet.iconSize = ruleSet.iconSize || "medium";
        ruleSet.iconPosition =
            ruleSet.iconPosition ||
            ruleSet.defaultRule?.iconPosition ||
            ruleSet.rules[0]?.iconPosition ||
            "before";
        ruleSet.labelMarker = ruleSet.labelMarker || "circle";
        ruleSet.barStyle = ruleSet.barStyle || "adjacent";
        ruleSet.barPosition = ruleSet.barPosition || "before";
        if (ruleSet.mode === "value") ruleSet.mode = "pill";
        ruleSet.defaultRule ||= createRule(ruleSet.targetQueryName);
        ruleSet.defaultRule.iconPosition = ruleSet.iconPosition;
        ruleSet.rules.forEach((rule) => {
            rule.compareValue2 ||= "";
            rule.sourceQueryName ||= ruleSet.targetQueryName;
            rule.iconPosition = ruleSet.iconPosition || "before";
        });
    }

    private render(): void {
        if (!this.model || !this.activeRuleSet) return;
        this.normalizeRuleSet(this.activeRuleSet);
        const configured = this.isActiveConfigured();
        this.removeFormattingButton.hidden = !this.persistedTargets.has(
            this.activeRuleSet.targetQueryName
        );
        this.enabledInput.disabled = !configured;
        this.enabledInput.checked =
            configured && this.activeRuleSet.enabled !== false;
        const status = this.panel.querySelector<HTMLElement>(
            ".power-table__rule-status"
        );
        if (status) {
            status.textContent = !configured
                ? "SEM FORMATAÇÃO"
                : this.activeRuleSet.enabled === false
                    ? "INATIVO"
                    : "ATIVO";
            status.classList.toggle(
                "is-inactive",
                !configured || this.activeRuleSet.enabled === false
            );
        }
        this.panel.classList.toggle(
            "is-formatting-disabled",
            configured && this.activeRuleSet.enabled === false
        );
        this.panel.classList.toggle("is-no-formatting", !configured);
        this.content.replaceChildren();

        const layout = document.createElement("div");
        layout.className = "power-table__rule-layout";
        const main = document.createElement("main");
        main.className = "power-table__rule-main";
        const sidebar = document.createElement("aside");
        sidebar.className = "power-table__rule-sidebar";
        main.append(this.renderConfiguration(), this.renderLogic());
        sidebar.appendChild(this.renderPreview());
        layout.append(main, sidebar);
        this.content.appendChild(layout);
    }

    private renderConfiguration(): HTMLElement {
        const card = document.createElement("section");
        card.className = "power-table__rule-config-card";
        card.classList.toggle(
            "is-unconfigured",
            !this.isActiveConfigured()
        );
        const sourceQueryName = this.ruleSourceQueryName();
        const targetField = this.createSelect(
                "APLICAR À COLUNA",
                this.model?.columns.map((column) => [
                    column.queryName || "",
                    column.displayName
                ]) || [],
                this.activeRuleSet?.targetQueryName || "",
                (value) => this.selectTarget(value)
            );
        targetField.classList.add("is-always-enabled");
        const sourceField = this.createSelect(
                "BASEAR NO CAMPO",
                this.sourceOptions(),
                sourceQueryName,
                (value) => {
                    this.activeRuleSet?.rules.forEach(
                        (rule) => { rule.sourceQueryName = value; }
                    );
                    if (this.activeRuleSet?.defaultRule) {
                        this.activeRuleSet.defaultRule.sourceQueryName = value;
                    }
                    this.updatePreview();
                }
            );
        const modeField = this.createModeSelector();
        modeField.classList.add("is-always-enabled");
        const strategyField = this.createSelect(
                "TIPO DE REGRA",
                this.strategyOptions(),
                this.activeRuleSet?.strategy || "custom",
                (value) => {
                    if (!this.activeRuleSet) return;
                    this.activeRuleSet.strategy =
                        value as ColumnRuleSet["strategy"];
                    this.render();
                }
            );
        card.append(
            targetField,
            sourceField,
            modeField,
            strategyField
        );

        if (this.activeRuleSet?.mode === "pill") {
            card.append(
                this.createSelect(
                    "MARCADOR DA ETIQUETA",
                    [
                        ["none", "Sem marcador"],
                        ["circle", "● Bolinha"],
                        ["square", "■ Quadrado"],
                        ["diamond", "◆ Losango"],
                        ["triangle", "▲ Triângulo"]
                    ],
                    this.activeRuleSet.labelMarker || "circle",
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.labelMarker =
                            value as ColumnRuleSet["labelMarker"];
                        this.updatePreview();
                    }
                )
            );
        } else if (this.activeRuleSet?.mode === "icon") {
            card.append(
                this.createSelect(
                    "TAMANHO",
                    [
                        ["small", "Pequeno"],
                        ["medium", "Médio"],
                        ["large", "Grande"]
                    ],
                    this.activeRuleSet.iconSize || "medium",
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.iconSize =
                            value as ColumnRuleSet["iconSize"];
                        this.updatePreview();
                    }
                ),
                this.createSelect(
                    "POSIÇÃO",
                    [
                        ["before", "Antes do valor"],
                        ["after", "Depois do valor"],
                        ["only", "Somente ícone"]
                    ],
                    this.activeRuleSet.iconPosition || "before",
                    (value) => {
                        if (!this.activeRuleSet) return;
                        const position = value as VisualRule["iconPosition"];
                        this.activeRuleSet.iconPosition = position;
                        this.activeRuleSet.rules.forEach(
                            (rule) => { rule.iconPosition = position; }
                        );
                        if (this.activeRuleSet.defaultRule) {
                            this.activeRuleSet.defaultRule.iconPosition = position;
                        }
                        this.updatePreview();
                    }
                )
            );
        } else if (this.activeRuleSet?.mode === "bar") {
            card.append(
                this.createSelect(
                    "ESTILO DA BARRA",
                    [
                        ["adjacent", "Barra ao lado do valor"],
                        ["cellFill", "Preenchimento do fundo"]
                    ],
                    this.activeRuleSet.barStyle || "adjacent",
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.barStyle =
                            value as ColumnRuleSet["barStyle"];
                        this.updatePreview();
                    }
                ),
                this.createSelect(
                    "POSIÇÃO",
                    [
                        ["before", "Antes do número"],
                        ["after", "Depois do número"],
                        ["only", "Somente a barra"]
                    ],
                    this.activeRuleSet.barPosition || "before",
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.barPosition =
                            value as ColumnRuleSet["barPosition"];
                        this.updatePreview();
                    }
                ),
                this.createInputField(
                    "VALOR MÍNIMO",
                    String(this.activeRuleSet.barMinimum),
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.barMinimum =
                            Number(value.replace(",", ".")) || 0;
                        this.updatePreview();
                    }
                ),
                this.createInputField(
                    "VALOR MÁXIMO",
                    String(this.activeRuleSet.barMaximum),
                    (value) => {
                        if (!this.activeRuleSet) return;
                        this.activeRuleSet.barMaximum =
                            Number(value.replace(",", ".")) || 100;
                        this.updatePreview();
                    }
                )
            );
        }
        return card;
    }

    private createModeSelector(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.className = "power-table__rule-field";
        const label = document.createElement("span");
        label.textContent = "TIPO DE FORMATAÇÃO";
        const group = document.createElement("div");
        group.className = "power-table__rule-segments";
        [
            ["pill", "Etiqueta"],
            ["bar", "Barra"],
            ["icon", "Ícone"]
        ].forEach(([value, text]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.classList.toggle(
                "is-active",
                this.isActiveConfigured() &&
                this.activeRuleSet?.mode === value
            );
            button.textContent = text;
            button.addEventListener("click", () => {
                if (!this.activeRuleSet) return;
                if (!this.ruleSets.includes(this.activeRuleSet)) {
                    this.ruleSets.push(this.activeRuleSet);
                }
                this.activeRuleSet.mode = value as ColumnRuleSet["mode"];
                if (value === "icon" &&
                    (this.activeRuleSet.strategy === "automatic" ||
                        this.activeRuleSet.strategy === "positiveNegative")) {
                    this.activeRuleSet.strategy = "custom";
                }
                if (value === "bar" &&
                    this.activeRuleSet.strategy === "automatic") {
                    this.activeRuleSet.strategy = "custom";
                }
                this.render();
            });
            group.appendChild(button);
        });
        wrapper.append(label, group);
        return wrapper;
    }

    private renderLogic(): HTMLElement {
        const section = document.createElement("section");
        section.className = "power-table__rule-logic";
        const header = document.createElement("div");
        header.className = "power-table__rule-logic-heading";
        const title = document.createElement("h3");
        title.textContent = "Regras de Lógica";
        const add = document.createElement("button");
        add.type = "button";
        add.textContent = "＋ Adicionar regra";
        add.disabled = this.activeRuleSet?.strategy !== "custom";
        add.addEventListener("click", () => {
            if (!this.activeRuleSet) return;
            this.activeRuleSet.rules.push(
                createRule(this.ruleSourceQueryName())
            );
            this.render();
        });
        header.append(title, add);
        section.appendChild(header);

        if (this.activeRuleSet?.strategy === "automatic") {
            section.classList.add("is-automatic");
            const disabledRules = document.createElement("div");
            disabledRules.className = "power-table__rule-disabled";
            disabledRules.textContent =
                "As regras manuais estão desabilitadas no modo Automático. Elas serão preservadas se você voltar para Personalizada.";
            section.append(disabledRules, this.renderDefaultRule(true));
            return section;
        }
        if (this.activeRuleSet?.strategy === "positiveNegative") {
            const sign = document.createElement("div");
            sign.className = "power-table__rule-sign-grid";
            sign.append(
                this.createColor(
                    "COR NEGATIVA",
                    this.activeRuleSet.negativeColor,
                    (value) => {
                        if (this.activeRuleSet) {
                            this.activeRuleSet.negativeColor = value;
                            this.updatePreview();
                        }
                    }
                ),
                this.createColor(
                    "COR POSITIVA",
                    this.activeRuleSet.positiveColor,
                    (value) => {
                        if (this.activeRuleSet) {
                            this.activeRuleSet.positiveColor = value;
                            this.updatePreview();
                        }
                    }
                )
            );
            section.appendChild(sign);
        } else if (this.activeRuleSet?.strategy === "fieldValue") {
            const note = document.createElement("div");
            note.className = "power-table__rule-disabled";
            note.textContent =
                "O campo selecionado em “Basear no campo” deve retornar uma cor válida, como #EF4444.";
            section.appendChild(note);
        } else {
            if (this.activeRuleSet?.rules.length === 0) {
                const empty = document.createElement("div");
                empty.className = "power-table__rule-empty";
                empty.textContent =
                    "Adicione uma regra ou carregue os valores disponíveis no campo.";
                const discover = document.createElement("button");
                discover.type = "button";
                discover.textContent = "Usar valores atuais";
                discover.addEventListener("click", () => this.discoverValues());
                empty.appendChild(discover);
                section.appendChild(empty);
            } else {
                const list = document.createElement("div");
                list.className = "power-table__rule-list";
                this.activeRuleSet?.rules.forEach((rule, index) => {
                    list.appendChild(this.createRuleRow(rule, index));
                });
                section.appendChild(list);
            }
            section.appendChild(this.renderDefaultRule(false));
        }
        return section;
    }

    private createRuleRow(rule: VisualRule, index: number): HTMLElement {
        const row = document.createElement("article");
        row.className = "power-table__rule-row";
        row.style.setProperty(
            "--rule-accent",
            this.resultColor(rule)
        );
        const ifLabel = document.createElement("span");
        ifLabel.className = "power-table__rule-keyword";
        ifLabel.textContent = "SE";
        const operator = this.createBareSelect(
            OPERATOR_OPTIONS,
            rule.operator,
            (value) => {
                rule.operator = value as RuleOperator;
                this.render();
            }
        );
        const value1 = this.createBareInput(rule.compareValue, (value) => {
            rule.compareValue = value;
            this.updatePreview();
        });
        row.append(ifLabel, operator, value1);
        if (rule.operator === "between" || rule.operator === "notBetween") {
            const and = document.createElement("span");
            and.textContent = "e";
            row.append(
                and,
                this.createBareInput(rule.compareValue2 || "", (value) => {
                    rule.compareValue2 = value;
                    this.updatePreview();
                })
            );
        }
        const then = document.createElement("span");
        then.className = "power-table__rule-keyword";
        then.textContent = "ENTÃO";
        row.append(then, this.createResultEditor(rule));
        const actions = document.createElement("div");
        actions.className = "power-table__rule-row-actions";
        const duplicate = document.createElement("button");
        duplicate.type = "button";
        duplicate.title = "Duplicar";
        duplicate.textContent = "⧉";
        duplicate.addEventListener("click", () => {
            if (!this.activeRuleSet) return;
            const copy = { ...rule, id: newId() };
            this.activeRuleSet.rules.splice(index + 1, 0, copy);
            this.render();
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.title = "Excluir";
        remove.textContent = "⌫";
        remove.addEventListener("click", () => {
            this.activeRuleSet?.rules.splice(index, 1);
            this.render();
        });
        actions.append(duplicate, remove);
        row.appendChild(actions);
        return row;
    }

    private createResultEditor(rule: VisualRule): HTMLElement {
        const result = document.createElement("div");
        result.className = "power-table__rule-result";
        if (this.activeRuleSet?.mode === "icon") {
            result.append(
                this.createIconPicker(rule.icon, (value) => {
                    rule.icon = value;
                    this.render();
                }),
                this.createBareColor(rule.iconColor, (value) => {
                    rule.iconColor = value;
                    this.updatePreview();
                }, !this.iconSupportsRuleColor(rule.icon))
            );
        } else if (this.activeRuleSet?.mode === "bar") {
            result.appendChild(
                this.createBareColor(rule.barColor, (value) => {
                    rule.barColor = value;
                    this.updatePreview();
                })
            );
        } else {
            result.append(
                this.createBareColor(rule.backgroundColor, (value) => {
                    rule.backgroundColor = value;
                    this.updatePreview();
                }),
                this.createFollowToggle(rule)
            );
        }
        return result;
    }

    private createIconPicker(
        value: string,
        onChange: (value: string) => void
    ): HTMLElement {
        const picker = document.createElement("div");
        picker.className = "power-table__icon-picker";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "power-table__icon-picker-trigger";
        trigger.title = "Escolher ícone";
        let selectedGlyph = this.createIconPickerGlyph(value);
        trigger.appendChild(selectedGlyph);
        const arrow = document.createElement("span");
        arrow.className = "power-table__icon-picker-arrow";
        arrow.textContent = "⌄";
        trigger.appendChild(arrow);

        const palette = document.createElement("div");
        palette.className = "power-table__icon-palette";
        palette.hidden = true;
        palette.classList.add(
            this.iconPreferences.pickerSize === "compact"
                ? "is-compact"
                : "is-expanded"
        );
        const toolbar = document.createElement("div");
        toolbar.className = "power-table__icon-palette-toolbar";
        const search = document.createElement("input");
        search.type = "search";
        search.placeholder = "Buscar ícone…";
        const scope = document.createElement("select");
        [["all", "Todos"], ["native", "Nativos"], ["custom", "Meus ícones"]]
            .forEach(([scopeValue, label]) => {
                const option = document.createElement("option");
                option.value = scopeValue;
                option.textContent = label;
                scope.appendChild(option);
            });
        const resize = document.createElement("button");
        resize.type = "button";
        resize.className = "is-palette-resize";
        const iconScale = document.createElement("button");
        iconScale.type = "button";
        iconScale.className = "is-palette-icon-scale";
        const closePalette = document.createElement("button");
        closePalette.type = "button";
        closePalette.className = "is-palette-close";
        closePalette.title = "Fechar";
        closePalette.textContent = "×";
        toolbar.append(search, scope, resize, iconScale, closePalette);
        const iconGrid = document.createElement("div");
        iconGrid.className = "power-table__icon-palette-grid";
        palette.append(toolbar, iconGrid);
        palette.classList.toggle(
            "has-large-icons",
            this.iconPreferences.pickerIconSize === "large"
        );

        const updateResizeButton = (): void => {
            const compact = this.iconPreferences.pickerSize === "compact";
            resize.textContent = compact ? "⛶" : "⊡";
            resize.title = compact ? "Expandir seletor" : "Reduzir seletor";
            iconScale.hidden = compact;
        };
        const updateIconScaleButton = (): void => {
            const large = this.iconPreferences.pickerIconSize === "large";
            iconScale.textContent = large ? "▦" : "▣";
            iconScale.title = large
                ? "Usar ícones no tamanho normal"
                : "Exibir ícones grandes";
        };
        const chooseIcon = (iconValue: string): void => {
            const nextGlyph = this.createIconPickerGlyph(iconValue);
            selectedGlyph.replaceWith(nextGlyph);
            selectedGlyph = nextGlyph;
            palette.hidden = true;
            onChange(iconValue);
        };
        const renderOptions = (): void => {
            iconGrid.replaceChildren();
            const manage = document.createElement("button");
            manage.type = "button";
            manage.className = "is-manage-icons";
            manage.title = "Adicionar ou gerenciar ícones";
            manage.textContent = "＋";
            manage.addEventListener("click", (event) => {
                event.stopPropagation();
                palette.hidden = true;
                this.openIconManager();
            });
            iconGrid.appendChild(manage);
            const term = search.value.trim().toLocaleLowerCase("pt-BR");
            if (scope.value !== "custom") {
                this.orderedNativeIcons().filter(([iconValue, iconLabel]) =>
                    !this.iconPreferences.hiddenNativeIcons.includes(
                        iconValue
                    ) &&
                    (!term ||
                        `${iconValue} ${iconLabel}`
                            .toLocaleLowerCase("pt-BR")
                            .includes(term))
                ).forEach(([iconValue, iconLabel]) => {
                    const option = document.createElement("button");
                    option.type = "button";
                    option.appendChild(this.createIconPickerGlyph(iconValue));
                    option.title = iconLabel.replace(/^[^\s]+\s*/, "");
                    option.classList.toggle("is-selected", iconValue === value);
                    option.addEventListener("click", (event) => {
                        event.stopPropagation();
                        chooseIcon(iconValue);
                    });
                    iconGrid.appendChild(option);
                });
            }
            if (scope.value !== "native") {
                this.customIcons
                    .filter((asset) =>
                        !asset.deleted &&
                        (!term || asset.name
                            .toLocaleLowerCase("pt-BR")
                            .includes(term))
                    )
                    .forEach((asset) => {
                        const iconValue = `custom:${asset.id}`;
                        const option = document.createElement("button");
                        option.type = "button";
                        option.appendChild(
                            this.createIconPickerGlyph(iconValue)
                        );
                        option.title = asset.name;
                        option.classList.toggle(
                            "is-selected",
                            iconValue === value
                        );
                        option.addEventListener("click", (event) => {
                            event.stopPropagation();
                            chooseIcon(iconValue);
                        });
                        iconGrid.appendChild(option);
                    });
            }
        };
        search.addEventListener("input", renderOptions);
        scope.addEventListener("change", renderOptions);
        resize.addEventListener("click", (event) => {
            event.stopPropagation();
            this.iconPreferences.pickerSize =
                this.iconPreferences.pickerSize === "compact"
                    ? "expanded"
                    : "compact";
            palette.classList.toggle(
                "is-compact",
                this.iconPreferences.pickerSize === "compact"
            );
            palette.classList.toggle(
                "is-expanded",
                this.iconPreferences.pickerSize === "expanded"
            );
            updateResizeButton();
            this.onSaveIconPreferences(this.iconPreferences);
        });
        iconScale.addEventListener("click", (event) => {
            event.stopPropagation();
            this.iconPreferences.pickerIconSize =
                this.iconPreferences.pickerIconSize === "normal"
                    ? "large"
                    : "normal";
            palette.classList.toggle(
                "has-large-icons",
                this.iconPreferences.pickerIconSize === "large"
            );
            updateIconScaleButton();
            this.onSaveIconPreferences(this.iconPreferences);
        });
        closePalette.addEventListener("click", (event) => {
            event.stopPropagation();
            palette.hidden = true;
        });
        updateResizeButton();
        updateIconScaleButton();
        renderOptions();
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            this.panel.querySelectorAll<HTMLElement>(
                ".power-table__icon-palette"
            ).forEach((candidate) => {
                if (candidate !== palette) candidate.hidden = true;
            });
            palette.hidden = !palette.hidden;
            if (!palette.hidden) {
                window.setTimeout(() => search.focus(), 0);
            }
        });
        picker.append(trigger, palette);
        return picker;
    }

    private openIconManager(): void {
        let draft: CustomIconAsset[] = JSON.parse(
            JSON.stringify(this.customIcons)
        );
        const draftPreferences: IconPreferences = JSON.parse(
            JSON.stringify(this.iconPreferences)
        );
        let selectedId = draft.find((asset) => !asset.deleted)?.id || "";
        let managerSection: "library" | "native" | "hidden" | "trash" =
            "library";
        let selectedNativeId =
            this.orderedNativeIcons(draftPreferences)[0]?.[0] || "";
        let draggedCustomId = "";
        let draggedNativeId = "";

        const overlay = document.createElement("div");
        overlay.className = "power-table__icon-manager-overlay";
        const dialog = document.createElement("section");
        dialog.className = "power-table__icon-manager";
        const header = document.createElement("header");
        const heading = document.createElement("div");
        const headingTitle = document.createElement("strong");
        headingTitle.textContent = "Gerenciamento de Ícones";
        const headingSubtitle = document.createElement("span");
        headingSubtitle.textContent = "Biblioteca de imagens usadas nas regras";
        heading.append(headingTitle, headingSubtitle);
        const importButton = document.createElement("button");
        importButton.type = "button";
        importButton.className = "is-primary";
        importButton.textContent = "＋ Adicionar ícone";
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".png,.svg,image/png,image/svg+xml";
        fileInput.hidden = true;
        importButton.addEventListener("click", () => fileInput.click());
        header.append(heading, importButton, fileInput);

        const body = document.createElement("div");
        const library = document.createElement("main");
        const tabs = document.createElement("nav");
        const libraryTab = document.createElement("button");
        const nativeTab = document.createElement("button");
        const hiddenTab = document.createElement("button");
        const trashTab = document.createElement("button");
        libraryTab.type = nativeTab.type = hiddenTab.type =
            trashTab.type = "button";
        libraryTab.textContent = "Meus ícones";
        nativeTab.textContent = "Nativos";
        hiddenTab.textContent = "Ocultos";
        trashTab.textContent = "Lixeira";
        tabs.append(libraryTab, nativeTab, hiddenTab, trashTab);
        const grid = document.createElement("div");
        grid.className = "power-table__icon-library-grid";
        library.append(tabs, grid);
        const detail = document.createElement("aside");
        body.append(library, detail);

        const footer = document.createElement("footer");
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancelar";
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = "is-primary";
        confirm.textContent = "Confirmar alterações";
        footer.append(cancel, confirm);
        dialog.append(header, body, footer);
        overlay.appendChild(dialog);
        this.panel.appendChild(overlay);

        const assetUsage = (id: string): number =>
            this.ruleSets.reduce((total, ruleSet) => {
                const rules = [
                    ...ruleSet.rules,
                    ...(ruleSet.defaultRule ? [ruleSet.defaultRule] : [])
                ];
                return total + rules.filter(
                    (rule) => rule.icon === `custom:${id}`
                ).length;
            }, 0);

        const assetPreview = (
            asset: CustomIconAsset,
            size: number
        ): HTMLElement => {
            const preview = document.createElement("span");
            preview.className = "power-table__managed-icon-preview";
            preview.style.width = `${size}px`;
            preview.style.height = `${size}px`;
            const iconUrl = asset.autoCrop
                ? asset.dataUrl
                : asset.originalDataUrl || asset.dataUrl;
            if (asset.colorMode === "rule") {
                preview.style.maskImage = `url("${iconUrl}")`;
                preview.style.webkitMaskImage = `url("${iconUrl}")`;
                preview.classList.add("is-rule-colored");
            } else {
                preview.style.backgroundImage = `url("${iconUrl}")`;
            }
            if (asset.safetyMargin) {
                preview.style.backgroundSize = "calc(100% - 4px)";
                preview.style.maskSize = "calc(100% - 4px)";
                preview.style.webkitMaskSize = "calc(100% - 4px)";
            }
            return preview;
        };

        const renderDetail = (): void => {
            detail.replaceChildren();
            if (
                managerSection === "native" ||
                managerSection === "hidden"
            ) {
                const nativeEntry = this.orderedNativeIcons(
                    draftPreferences
                ).find(
                    ([iconValue]) => iconValue === selectedNativeId
                );
                if (!nativeEntry) {
                    const empty = document.createElement("p");
                    empty.className = "power-table__icon-manager-empty";
                    empty.textContent = managerSection === "hidden"
                        ? "Nenhum ícone nativo está oculto."
                        : "Nenhum ícone disponível.";
                    detail.appendChild(empty);
                    return;
                }
                const title = document.createElement("span");
                title.className = "power-table__icon-manager-label";
                title.textContent = "VISUALIZAÇÃO DETALHADA";
                const stage = document.createElement("div");
                stage.className =
                    "power-table__icon-preview-stage is-grid";
                const nativePreview = document.createElement("span");
                nativePreview.className =
                    "power-table__native-manager-preview";
                nativePreview.appendChild(
                    this.createIconPickerGlyph(nativeEntry[0])
                );
                stage.appendChild(nativePreview);
                const name = document.createElement("strong");
                name.className = "power-table__native-manager-name";
                name.textContent = nativeEntry[1]
                    .replace(/^[^\s]+\s*/, "");
                const help = document.createElement("p");
                help.textContent = managerSection === "hidden"
                    ? "Este ícone está oculto no seletor, mas continua " +
                        "funcionando nas regras existentes."
                    : "Ícone incluído no AdvanceTable. Você pode ocultá-lo " +
                        "sem removê-lo do pacote.";
                detail.append(title, stage, name, help);
                return;
            }
            const asset = draft.find((candidate) =>
                candidate.id === selectedId
            );
            if (!asset) {
                const empty = document.createElement("p");
                empty.className = "power-table__icon-manager-empty";
                empty.textContent = managerSection === "trash"
                    ? "A lixeira está vazia."
                    : "Adicione ou selecione um ícone.";
                detail.appendChild(empty);
                return;
            }
            const title = document.createElement("span");
            title.className = "power-table__icon-manager-label";
            title.textContent = "VISUALIZAÇÃO DETALHADA";
            const stage = document.createElement("div");
            stage.className = "power-table__icon-preview-stage is-grid";
            stage.appendChild(assetPreview(asset, 96));

            const nameLabel = document.createElement("label");
            nameLabel.textContent = "NOME DO ÍCONE";
            const name = document.createElement("input");
            name.value = asset.name;
            name.maxLength = 40;
            name.addEventListener("input", () => {
                asset.name = name.value.trimStart();
                renderGrid();
            });
            nameLabel.appendChild(name);

            const sizesLabel = document.createElement("span");
            sizesLabel.className = "power-table__icon-manager-label";
            sizesLabel.textContent = "ESCALABILIDADE";
            const sizes = document.createElement("div");
            sizes.className = "power-table__icon-size-preview";
            [32, 24, 16].forEach((size) => {
                const sample = document.createElement("div");
                sample.append(assetPreview(asset, size));
                const caption = document.createElement("small");
                caption.textContent = `${size}px`;
                sample.appendChild(caption);
                sizes.appendChild(sample);
            });

            const crop = this.createManagerToggle(
                "Recorte automático",
                asset.autoCrop,
                (checked) => {
                    asset.autoCrop = checked;
                    renderDetail();
                    renderGrid();
                }
            );
            const margin = this.createManagerToggle(
                "Margem de segurança (2px)",
                asset.safetyMargin,
                (checked) => {
                    asset.safetyMargin = checked;
                    renderDetail();
                }
            );
            const colorsLabel = document.createElement("span");
            colorsLabel.className = "power-table__icon-manager-label";
            colorsLabel.textContent = "LÓGICA DE COLORAÇÃO";
            const colors = document.createElement("div");
            colors.className = "power-table__icon-color-options";
            ([
                ["original", "Manter cores originais"],
                ["rule", "Aplicar cor da regra dinâmica"]
            ] as const).forEach(([mode, label]) => {
                const option = document.createElement("label");
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `icon-color-${asset.id}`;
                radio.checked = asset.colorMode === mode;
                radio.addEventListener("change", () => {
                    asset.colorMode = mode;
                    renderDetail();
                    renderGrid();
                });
                option.append(radio, document.createTextNode(label));
                colors.appendChild(option);
            });
            detail.append(
                title,
                stage,
                nameLabel,
                sizesLabel,
                sizes,
                crop,
                margin,
                colorsLabel,
                colors
            );
        };

        const renderGrid = (): void => {
            libraryTab.classList.toggle(
                "is-active",
                managerSection === "library"
            );
            nativeTab.classList.toggle(
                "is-active",
                managerSection === "native"
            );
            hiddenTab.classList.toggle(
                "is-active",
                managerSection === "hidden"
            );
            trashTab.classList.toggle(
                "is-active",
                managerSection === "trash"
            );
            grid.replaceChildren();
            if (
                managerSection === "native" ||
                managerSection === "hidden"
            ) {
                const hidden = new Set(
                    draftPreferences.hiddenNativeIcons
                );
                const nativeIcons = this.orderedNativeIcons(
                    draftPreferences
                ).filter(([iconValue]) =>
                    managerSection === "hidden"
                        ? hidden.has(iconValue)
                        : !hidden.has(iconValue)
                );
                if (!nativeIcons.some(
                    ([iconValue]) => iconValue === selectedNativeId
                )) {
                    selectedNativeId = nativeIcons[0]?.[0] || "";
                }
                nativeIcons.forEach(([iconValue, iconLabel]) => {
                    const card = document.createElement("button");
                    card.type = "button";
                    card.draggable = true;
                    card.className =
                        "power-table__icon-asset-card is-native-asset";
                    card.classList.toggle(
                        "is-selected",
                        iconValue === selectedNativeId
                    );
                    const preview = document.createElement("span");
                    preview.appendChild(
                        this.createIconPickerGlyph(iconValue)
                    );
                    const badge = document.createElement("em");
                    badge.textContent = "NATIVO";
                    preview.appendChild(badge);
                    const label = document.createElement("span");
                    label.textContent = iconLabel
                        .replace(/^[^\s]+\s*/, "");
                    const action = document.createElement("i");
                    action.textContent = managerSection === "hidden"
                        ? "↶"
                        : "◉";
                    action.title = managerSection === "hidden"
                        ? "Mostrar novamente"
                        : "Ocultar do seletor";
                    action.addEventListener("click", (event) => {
                        event.stopPropagation();
                        if (managerSection === "hidden") {
                            draftPreferences.hiddenNativeIcons =
                                draftPreferences.hiddenNativeIcons.filter(
                                    (candidate) => candidate !== iconValue
                                );
                        } else if (!hidden.has(iconValue)) {
                            draftPreferences.hiddenNativeIcons.push(
                                iconValue
                            );
                        }
                        renderGrid();
                    });
                    card.addEventListener("click", () => {
                        selectedNativeId = iconValue;
                        renderGrid();
                        renderDetail();
                    });
                    card.addEventListener("dragstart", () => {
                        draggedNativeId = iconValue;
                        card.classList.add("is-dragging");
                    });
                    card.addEventListener("dragend", () => {
                        draggedNativeId = "";
                        card.classList.remove("is-dragging");
                    });
                    card.addEventListener("dragover", (event) => {
                        if (draggedNativeId) event.preventDefault();
                    });
                    card.addEventListener("drop", (event) => {
                        event.preventDefault();
                        if (
                            !draggedNativeId ||
                            draggedNativeId === iconValue
                        ) return;
                        const order = this.orderedNativeIcons(
                            draftPreferences
                        ).map(([nativeValue]) => nativeValue);
                        const from = order.indexOf(draggedNativeId);
                        const to = order.indexOf(iconValue);
                        if (from < 0 || to < 0) return;
                        const [moved] = order.splice(from, 1);
                        order.splice(to, 0, moved);
                        draftPreferences.nativeIconOrder = order;
                        draggedNativeId = "";
                        renderGrid();
                    });
                    card.append(preview, label, action);
                    grid.appendChild(card);
                });
                renderDetail();
                return;
            }
            const showTrash = managerSection === "trash";
            const visible = draft.filter(
                (asset) => Boolean(asset.deleted) === showTrash
            );
            if (!visible.some((asset) => asset.id === selectedId)) {
                selectedId = visible[0]?.id || "";
            }
            visible.forEach((asset) => {
                const card = document.createElement("button");
                card.type = "button";
                card.draggable = true;
                card.className = "power-table__icon-asset-card";
                card.classList.toggle("is-selected", asset.id === selectedId);
                const preview = document.createElement("span");
                preview.appendChild(assetPreview(asset, 58));
                const format = document.createElement("em");
                format.textContent = asset.format.toUpperCase();
                preview.appendChild(format);
                const usage = assetUsage(asset.id);
                if (usage > 0) {
                    const inUse = document.createElement("b");
                    inUse.textContent = "EM USO";
                    preview.appendChild(inUse);
                }
                const label = document.createElement("span");
                label.textContent = asset.name || "Sem nome";
                const action = document.createElement("i");
                action.textContent = showTrash ? "↶" : "⌫";
                action.title = showTrash ? "Restaurar" : "Mover para a lixeira";
                action.addEventListener("click", (event) => {
                    event.stopPropagation();
                    asset.deleted = !showTrash;
                    renderGrid();
                    renderDetail();
                });
                card.addEventListener("click", () => {
                    selectedId = asset.id;
                    renderGrid();
                    renderDetail();
                });
                card.addEventListener("dragstart", () => {
                    draggedCustomId = asset.id;
                    card.classList.add("is-dragging");
                });
                card.addEventListener("dragend", () => {
                    draggedCustomId = "";
                    card.classList.remove("is-dragging");
                });
                card.addEventListener("dragover", (event) => {
                    if (draggedCustomId) event.preventDefault();
                });
                card.addEventListener("drop", (event) => {
                    event.preventDefault();
                    if (
                        !draggedCustomId ||
                        draggedCustomId === asset.id
                    ) return;
                    const from = draft.findIndex(
                        (candidate) => candidate.id === draggedCustomId
                    );
                    const to = draft.findIndex(
                        (candidate) => candidate.id === asset.id
                    );
                    if (from < 0 || to < 0) return;
                    const [moved] = draft.splice(from, 1);
                    draft.splice(to, 0, moved);
                    draggedCustomId = "";
                    renderGrid();
                });
                card.append(preview, label, action);
                if (showTrash) {
                    const permanent = document.createElement("u");
                    permanent.textContent = "×";
                    permanent.title = usage > 0
                        ? `Em uso por ${usage} regra(s)`
                        : "Excluir definitivamente";
                    permanent.classList.toggle("is-disabled", usage > 0);
                    permanent.addEventListener("click", (event) => {
                        event.stopPropagation();
                        if (usage > 0) return;
                        draft = draft.filter(
                            (candidate) => candidate.id !== asset.id
                        );
                        renderGrid();
                    });
                    card.appendChild(permanent);
                }
                grid.appendChild(card);
            });
            renderDetail();
        };

        libraryTab.addEventListener("click", () => {
            managerSection = "library";
            renderGrid();
        });
        nativeTab.addEventListener("click", () => {
            managerSection = "native";
            renderGrid();
        });
        hiddenTab.addEventListener("click", () => {
            managerSection = "hidden";
            renderGrid();
        });
        trashTab.addEventListener("click", () => {
            managerSection = "trash";
            renderGrid();
        });
        cancel.addEventListener("click", () => overlay.remove());
        confirm.addEventListener("click", () => {
            draft = draft.filter((asset) => asset.name.trim());
            this.customIcons = draft;
            this.iconPreferences = draftPreferences;
            this.onSaveIcons(this.customIcons);
            this.onSaveIconPreferences(this.iconPreferences);
            overlay.remove();
            this.render();
        });
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            const activeCount = draft.filter((asset) => !asset.deleted).length;
            if (activeCount >= 20) {
                window.alert("A biblioteca aceita até 20 ícones ativos.");
                return;
            }
            const format = file.name.toLocaleLowerCase().endsWith(".svg")
                ? "svg"
                : "png";
            const limit = format === "svg" ? 50_000 : 100_000;
            if (file.size > limit) {
                window.alert(
                    `O arquivo excede o limite de ${limit / 1000} KB.`
                );
                return;
            }
            try {
                const imported = await this.readIconFile(file, format);
                const asset: CustomIconAsset = {
                    id: newId(),
                    name: file.name.replace(/\.[^.]+$/, "").slice(0, 40),
                    format,
                    dataUrl: imported.dataUrl,
                    originalDataUrl: imported.originalDataUrl,
                    colorMode: "original",
                    autoCrop: true,
                    safetyMargin: false
                };
                draft.push(asset);
                selectedId = asset.id;
                managerSection = "library";
                renderGrid();
            } catch {
                window.alert("Não foi possível importar esse ícone.");
            } finally {
                fileInput.value = "";
            }
        });
        renderGrid();
    }

    private orderedNativeIcons(
        preferences: IconPreferences = this.iconPreferences
    ): string[][] {
        const positions = new Map(
            preferences.nativeIconOrder.map((value, index) => [value, index])
        );
        return [...ICONS].sort((left, right) => {
            const leftPosition = positions.get(left[0]);
            const rightPosition = positions.get(right[0]);
            if (leftPosition === undefined && rightPosition === undefined) {
                return 0;
            }
            if (leftPosition === undefined) return 1;
            if (rightPosition === undefined) return -1;
            return leftPosition - rightPosition;
        });
    }

    private createManagerToggle(
        label: string,
        checked: boolean,
        onChange: (checked: boolean) => void
    ): HTMLLabelElement {
        const control = document.createElement("label");
        control.className = "power-table__icon-manager-toggle";
        const text = document.createElement("span");
        text.textContent = label;
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checked;
        input.addEventListener("change", () => onChange(input.checked));
        control.append(text, input);
        return control;
    }

    private readIconFile(
        file: File,
        format: "png" | "svg"
    ): Promise<{ dataUrl: string; originalDataUrl?: string }> {
        if (format === "png") {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(reader.error);
                reader.onload = () => resolve(String(reader.result || ""));
                reader.readAsDataURL(file);
            }).then(async (originalDataUrl) => ({
                dataUrl: await this.trimTransparentPng(originalDataUrl),
                originalDataUrl
            }));
        }
        return file.text().then((source) => {
            const parser = new DOMParser();
            const documentNode = parser.parseFromString(
                source,
                "image/svg+xml"
            );
            if (documentNode.querySelector("parsererror")) {
                throw new Error("SVG inválido");
            }
            documentNode.querySelectorAll(
                "script, foreignObject, iframe, object, embed"
            ).forEach((node) => node.remove());
            documentNode.querySelectorAll("*").forEach((node) => {
                Array.from(node.attributes).forEach((attribute) => {
                    const name = attribute.name.toLocaleLowerCase();
                    const value = attribute.value.trim().toLocaleLowerCase();
                    if (
                        name.startsWith("on") ||
                        ((name === "href" || name === "xlink:href") &&
                            !value.startsWith("#"))
                    ) {
                        node.removeAttribute(attribute.name);
                    }
                });
            });
            const svg = documentNode.documentElement;
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            const sanitized = new XMLSerializer().serializeToString(svg);
            return {
                dataUrl: `data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(sanitized))
                )}`
            };
        });
    }

    private trimTransparentPng(dataUrl: string): Promise<string> {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const source = document.createElement("canvas");
                source.width = image.naturalWidth;
                source.height = image.naturalHeight;
                const context = source.getContext("2d", {
                    willReadFrequently: true
                });
                if (!context || !source.width || !source.height) {
                    resolve(dataUrl);
                    return;
                }
                context.drawImage(image, 0, 0);
                const pixels = context.getImageData(
                    0,
                    0,
                    source.width,
                    source.height
                ).data;
                let left = source.width;
                let top = source.height;
                let right = -1;
                let bottom = -1;
                for (let y = 0; y < source.height; y += 1) {
                    for (let x = 0; x < source.width; x += 1) {
                        if (pixels[(y * source.width + x) * 4 + 3] > 8) {
                            left = Math.min(left, x);
                            top = Math.min(top, y);
                            right = Math.max(right, x);
                            bottom = Math.max(bottom, y);
                        }
                    }
                }
                if (right < left || bottom < top) {
                    resolve(dataUrl);
                    return;
                }
                const width = right - left + 1;
                const height = bottom - top + 1;
                const trimmed = document.createElement("canvas");
                trimmed.width = width;
                trimmed.height = height;
                trimmed.getContext("2d")?.drawImage(
                    source,
                    left,
                    top,
                    width,
                    height,
                    0,
                    0,
                    width,
                    height
                );
                resolve(trimmed.toDataURL("image/png"));
            };
            image.onerror = () => resolve(dataUrl);
            image.src = dataUrl;
        });
    }

    private createIconPickerGlyph(iconValue: string): Element {
        if (iconValue === "none") {
            const empty = document.createElement("span");
            empty.className = "power-table__icon-picker-glyph is-empty";
            empty.textContent = "∅";
            empty.title = "Sem ícone";
            return empty;
        }
        if (iconValue.startsWith("custom:")) {
            const asset = this.customIcons.find(
                (candidate) =>
                    candidate.id === iconValue.slice("custom:".length)
            );
            const custom = document.createElement("span");
            custom.className = "power-table__custom-icon-glyph";
            if (asset) {
                const iconUrl = asset.autoCrop
                    ? asset.dataUrl
                    : asset.originalDataUrl || asset.dataUrl;
                if (asset.colorMode === "rule") {
                    custom.style.maskImage = `url("${iconUrl}")`;
                    custom.style.webkitMaskImage = `url("${iconUrl}")`;
                    custom.classList.add("is-rule-colored");
                } else {
                    custom.style.backgroundImage = `url("${iconUrl}")`;
                }
                custom.title = asset.name;
            }
            return custom;
        }
        if (iconValue === "circleSymbolHigh" ||
            iconValue === "circleSymbolLow" ||
            iconValue === "flagLow" ||
            iconValue === "flag" ||
            iconValue === "trendDownColor" ||
            iconValue === "trendFlatColor" ||
            iconValue === "trendUpColor") {
            return this.createNativeReferenceIcon(iconValue);
        }
        const glyph = document.createElement("span");
        glyph.className = "power-table__icon-picker-glyph";
        const circular: Record<string, string> = {
            checkCircle: "✓",
            closeCircle: "×",
            exclamationCircle: "!",
            arrowCircleUp: "↑",
            arrowCircleDown: "↓",
            circleSymbolHigh: "✓",
            circleSymbolLow: "×"
        };
        if (circular[iconValue]) {
            glyph.classList.add("is-compound-circle");
            if (iconValue === "circleSymbolHigh") {
                glyph.classList.add("is-native-high");
            } else if (iconValue === "circleSymbolLow") {
                glyph.classList.add("is-native-low");
            }
            const background = document.createElement("i");
            background.textContent = "●";
            const foreground = document.createElement("b");
            foreground.textContent = circular[iconValue];
            glyph.append(background, foreground);
        } else {
            glyph.textContent = ICON_GLYPHS[iconValue] || "●";
        }
        return glyph;
    }

    private createNativeReferenceIcon(iconValue: string): SVGSVGElement {
        const namespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(namespace, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("power-table__native-icon-preview");
        if (iconValue === "trendDownColor" ||
            iconValue === "trendFlatColor" ||
            iconValue === "trendUpColor") {
            const path = document.createElementNS(namespace, "path");
            const down = iconValue === "trendDownColor";
            const flat = iconValue === "trendFlatColor";
            path.setAttribute(
                "d",
                flat
                    ? "M4 9h16v6H4Z"
                    : down
                        ? "M3 5h18L12 20Z"
                        : "M12 4 21 19H3Z"
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
        if (iconValue === "flagLow" || iconValue === "flag") {
            const pole = document.createElementNS(namespace, "rect");
            pole.setAttribute("x", "4");
            pole.setAttribute("y", "3");
            pole.setAttribute("width", "1.5");
            pole.setAttribute("height", "18");
            pole.setAttribute("rx", ".5");
            pole.setAttribute("fill", "#333333");
            const front = document.createElementNS(namespace, "rect");
            front.setAttribute("x", "5.5");
            front.setAttribute("y", "4");
            front.setAttribute("width", "6");
            front.setAttribute("height", "8.05");
            front.setAttribute("fill", "#FF4D26");
            front.setAttribute("stroke", "#B2351A");
            front.setAttribute("stroke-width", "1.2");
            const rear = document.createElementNS(namespace, "rect");
            rear.setAttribute("x", "11.5");
            rear.setAttribute("y", "6");
            rear.setAttribute("width", "6");
            rear.setAttribute("height", "8.05");
            rear.setAttribute("fill", "#FF4D26");
            rear.setAttribute("stroke", "#B2351A");
            rear.setAttribute("stroke-width", "1.2");
            svg.append(pole, front, rear);
            return svg;
        }
        const high = iconValue === "circleSymbolHigh";
        const circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "10");
        circle.setAttribute("fill", high ? "#43A047" : "#E53935");
        circle.setAttribute("stroke", high ? "#1B5E20" : "#B71C1C");
        circle.setAttribute("stroke-width", "2");
        const symbol = document.createElementNS(namespace, "path");
        symbol.setAttribute(
            "d",
            high ? "M5 12L10 17L19 8" : "M7 7L17 17M17 7L7 17"
        );
        symbol.setAttribute("fill", "none");
        symbol.setAttribute("stroke", "#fff");
        symbol.setAttribute("stroke-width", "2.5");
        symbol.setAttribute("stroke-linecap", "round");
        symbol.setAttribute("stroke-linejoin", "round");
        svg.append(circle, symbol);
        return svg;
    }

    private createFollowToggle(rule: VisualRule): HTMLElement {
        const label = document.createElement("label");
        label.className = "power-table__rule-follow";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "power-table__rule-follow-checkbox";
        input.checked = rule.followBackground;
        input.addEventListener("change", () => {
            rule.followBackground = input.checked;
            this.updatePreview();
        });
        label.title = "Texto acompanha a cor do fundo";
        label.append(input, document.createTextNode("Texto acompanha"));
        return label;
    }

    private renderDefaultRule(disabled: boolean): HTMLElement {
        const rule = this.activeRuleSet?.defaultRule ||
            createRule(this.activeRuleSet?.targetQueryName || "");
        if (this.activeRuleSet && !this.activeRuleSet.defaultRule) {
            this.activeRuleSet.defaultRule = rule;
        }
        const row = document.createElement("article");
        row.className = "power-table__rule-default";
        row.classList.toggle("is-disabled", disabled);
        const label = document.createElement("strong");
        label.textContent = "REGRA PADRÃO";
        const line = document.createElement("span");
        const description = document.createElement("span");
        description.textContent = "SE NADA SE APLICA";
        row.append(label, line, description, this.createResultEditor(rule));
        return row;
    }

    private renderPreview(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.className = "power-table__rule-preview";
        this.previewHost = wrapper;
        this.updatePreview();
        return wrapper;
    }

    private updatePreview(): void {
        if (!this.previewHost || !this.model || !this.activeRuleSet) return;
        this.previewHost.replaceChildren();
        const titleRow = document.createElement("div");
        titleRow.className = "power-table__rule-preview-heading";
        const title = document.createElement("h3");
        title.textContent = "Preview em Tempo Real";
        const refresh = document.createElement("button");
        refresh.type = "button";
        refresh.textContent = "↻ Atualizar";
        refresh.addEventListener("click", () => this.updatePreview());
        titleRow.append(title, refresh);
        const table = document.createElement("table");
        const head = document.createElement("thead");
        const headingRow = document.createElement("tr");
        const targetColumn = this.model.columns.find(
            (column) => column.queryName === this.activeRuleSet?.targetQueryName
        );
        ["REGISTRO", targetColumn?.displayName || "VALOR"].forEach((text) => {
            const cell = document.createElement("th");
            cell.textContent = text;
            headingRow.appendChild(cell);
        });
        head.appendChild(headingRow);
        const body = document.createElement("tbody");
        this.model.rows.slice(0, 3).forEach((row, index) => {
            const targetIndex = this.model?.columns.findIndex(
                (column) =>
                    column.queryName === this.activeRuleSet?.targetQueryName
            ) ?? -1;
            const tableRow = document.createElement("tr");
            const name = document.createElement("td");
            name.textContent = `Linha ${index + 1}`;
            const value = document.createElement("td");
            const text = targetIndex >= 0
                ? row.formattedValues[targetIndex]
                : "";
            this.renderPreviewValue(
                value,
                text,
                resolveRuleStyle(
                    this.ruleSets,
                    this.activeRuleSet?.targetQueryName,
                    row,
                    this.model as TableModel,
                    "pt-BR"
                )
            );
            tableRow.append(name, value);
            body.appendChild(tableRow);
        });
        table.append(head, body);

        const simulator = document.createElement("div");
        simulator.className = "power-table__rule-simulator";
        const simulatorLabel = document.createElement("strong");
        simulatorLabel.textContent = "SIMULADOR DE VALOR";
        const controls = document.createElement("div");
        const input = document.createElement("input");
        input.placeholder = "Valor...";
        const test = document.createElement("button");
        test.type = "button";
        test.textContent = "Testar";
        const result = document.createElement("div");
        result.className = "power-table__rule-simulation-result";
        result.textContent = "Insira um valor para ver a regra.";
        test.addEventListener("click", () => {
            const simulated = this.simulatedRow(input.value);
            if (!simulated || !this.model || !this.activeRuleSet) return;
            result.replaceChildren();
            this.renderPreviewValue(
                result,
                input.value,
                resolveRuleStyle(
                    this.ruleSets,
                    this.activeRuleSet.targetQueryName,
                    simulated,
                    this.model,
                    "pt-BR"
                )
            );
        });
        controls.append(input, test);
        simulator.append(simulatorLabel, controls, result);

        const summary = document.createElement("div");
        summary.className = "power-table__rule-summary";
        const mode = document.createElement("strong");
        mode.textContent = this.modeLabel();
        const column = document.createElement("strong");
        column.textContent = targetColumn?.displayName || "";
        summary.append(
            document.createTextNode("ⓘ Aplicando "),
            mode,
            document.createTextNode(" na coluna "),
            column,
            document.createTextNode(".")
        );
        this.previewHost.append(titleRow, table, simulator, summary);
    }

    private renderPreviewValue(
        target: HTMLElement,
        text: string,
        style: ResolvedRuleStyle | undefined
    ): void {
        const element = document.createElement("span");
        element.className = `is-preview-${style?.mode || "value"}`;
        element.title = text;
        const color = style?.backgroundColor || style?.barColor ||
            style?.iconColor || "#005CAC";
        if (style?.mode === "pill") {
            element.style.backgroundColor = color;
            element.style.color = style.followBackground
                ? this.strongColor(color)
                : (style.textColor || "#0B1C30");
            const markerGlyphs: Record<string, string> = {
                circle: "●",
                square: "■",
                diamond: "◆",
                triangle: "▲"
            };
            const marker = markerGlyphs[style.labelMarker || "circle"];
            element.textContent = marker ? `${marker} ${text}` : text;
        } else if (style?.mode === "bar") {
            element.style.setProperty("--preview-color", color);
            const numeric = Number(
                text.replace(",", ".").replace("%", "").trim()
            );
            const normalized = Number.isFinite(numeric) &&
                Math.abs(numeric) <= 1 &&
                (style.barMaximum ?? 100) > 1
                ? numeric * 100
                : numeric;
            const minimum = style.barMinimum ?? 0;
            const maximum = style.barMaximum ?? 100;
            const ratio = Number.isFinite(normalized)
                ? Math.max(
                    0,
                    Math.min(1, (normalized - minimum) /
                        Math.max(.0001, maximum - minimum))
                )
                : .7;
            element.style.setProperty(
                "--preview-ratio",
                `${ratio * 100}%`
            );
            element.classList.toggle(
                "is-cell-fill",
                style.barStyle === "cellFill"
            );
            const bar = document.createElement("i");
            bar.style.width = `${Math.max(2, ratio * 40)}px`;
            const label = document.createElement("b");
            label.textContent = text;
            if (style.barPosition === "only") {
                element.appendChild(bar);
            } else if (style.barPosition === "after") {
                element.append(label, bar);
            } else {
                element.append(bar, label);
            }
        } else if (style?.mode === "icon") {
            element.style.color = style.iconColor || "#005CAC";
            const icon = document.createElement("i");
            icon.className = "power-table__preview-icon-glyph";
            icon.style.fontSize = style.iconSize === "small"
                ? "15px"
                : style.iconSize === "large"
                    ? "32px"
                    : "22px";
            const hasIcon = style.icon !== "none";
            if (hasIcon) {
                icon.appendChild(
                    this.createIconPickerGlyph(style.icon || "check")
                );
            }
            const label = document.createElement("b");
            label.textContent = text;
            if (style.iconPosition === "only") {
                if (hasIcon) {
                    element.appendChild(icon);
                }
            } else if (style.iconPosition === "after") {
                element.appendChild(label);
                if (hasIcon) {
                    element.appendChild(icon);
                }
            } else {
                if (hasIcon) {
                    element.appendChild(icon);
                }
                element.appendChild(label);
            }
        } else {
            element.textContent = text;
        }
        target.appendChild(element);
    }

    private simulatedRow(value: string): TableRow | null {
        if (!this.model || !this.activeRuleSet) return null;
        const template = this.model.rows[0];
        if (!template) return null;
        const row = JSON.parse(JSON.stringify(template)) as TableRow;
        const parsed = Number(value.replace(",", ".").replace("%", ""));
        const rawValue = Number.isFinite(parsed) ? parsed : value;
        const targetQueryName = this.activeRuleSet.targetQueryName;
        const sourceQueryName = this.ruleSourceQueryName();
        [targetQueryName, sourceQueryName].forEach((queryName) => {
            const visibleIndex = this.model?.columns.findIndex(
                (column) => column.queryName === queryName
            ) ?? -1;
            if (visibleIndex >= 0) {
                row.values[visibleIndex] = rawValue;
                row.formattedValues[visibleIndex] = value;
            }
            const auxiliaryIndex = this.model?.ruleColumns.findIndex(
                (column) => column.queryName === queryName
            ) ?? -1;
            if (auxiliaryIndex >= 0) {
                row.ruleValues[auxiliaryIndex] = rawValue;
                row.formattedRuleValues[auxiliaryIndex] = value;
            }
        });
        return row;
    }

    private sourceOptions(): string[][] {
        if (!this.model) return [];
        const visible = this.model.columns.map((column) => [
            column.queryName || "",
            column.displayName
        ]);
        const formatting = this.model.ruleColumns.map((column) => [
            column.queryName || "",
            `${column.displayName} · Campos para formatação`
        ]);
        return [...visible, ...formatting];
    }

    private ruleSourceQueryName(): string {
        return this.activeRuleSet?.rules[0]?.sourceQueryName ||
            this.activeRuleSet?.defaultRule?.sourceQueryName ||
            this.activeRuleSet?.targetQueryName ||
            "";
    }

    private strategyOptions(): string[][] {
        if (this.activeRuleSet?.mode === "icon") {
            return [
                ["custom", "Personalizada"],
                ["fieldValue", "Valor do campo"]
            ];
        }
        const common = [
            ["custom", "Personalizada"],
            ["positiveNegative", "Negativo e positivo"],
            ["fieldValue", "Valor do campo"]
        ];
        return this.activeRuleSet?.mode === "pill"
            ? [["automatic", "Automático"], ...common]
            : common;
    }

    private selectTarget(queryName: string): void {
        if (!this.model) return;
        this.activeRuleSet = this.ruleSets.find(
            (ruleSet) => ruleSet.targetQueryName === queryName
        ) || createRuleSet(queryName);
        this.normalizeRuleSet(this.activeRuleSet);
        this.render();
    }

    private isActiveConfigured(): boolean {
        return Boolean(
            this.activeRuleSet &&
            this.ruleSets.includes(this.activeRuleSet)
        );
    }

    private discoverValues(): void {
        if (!this.model || !this.activeRuleSet) return;
        const sourceQueryName = this.ruleSourceQueryName();
        const visibleIndex = this.model.columns.findIndex(
            (column) => column.queryName === sourceQueryName
        );
        const auxiliaryIndex = this.model.ruleColumns.findIndex(
            (column) => column.queryName === sourceQueryName
        );
        const values = this.model.rows.map((row) =>
            visibleIndex >= 0
                ? row.formattedValues[visibleIndex]
                : auxiliaryIndex >= 0
                    ? row.formattedRuleValues[auxiliaryIndex]
                    : ""
        );
        const existing = new Set(
            this.activeRuleSet.rules.map((rule) =>
                rule.compareValue.toLocaleLowerCase()
            )
        );
        Array.from(new Set(values)).filter(Boolean)
            .sort((left, right) => left.localeCompare(right, "pt-BR"))
            .forEach((value) => {
                if (!existing.has(value.toLocaleLowerCase())) {
                    this.activeRuleSet?.rules.push(
                        createRule(sourceQueryName, value)
                    );
                }
            });
        this.render();
    }

    private createSelect(
        label: string,
        options: string[][],
        value: string,
        onChange: (value: string) => void
    ): HTMLElement {
        const wrapper = document.createElement("label");
        wrapper.className = "power-table__rule-field";
        const text = document.createElement("span");
        text.textContent = label;
        wrapper.append(text, this.createBareSelect(options, value, onChange));
        return wrapper;
    }

    private createColor(
        label: string,
        value: string,
        onInput: (value: string) => void
    ): HTMLElement {
        const wrapper = document.createElement("label");
        wrapper.className = "power-table__rule-field";
        const text = document.createElement("span");
        text.textContent = label;
        wrapper.append(text, this.createBareColor(value, onInput));
        return wrapper;
    }

    private createInputField(
        label: string,
        value: string,
        onInput: (value: string) => void
    ): HTMLElement {
        const wrapper = document.createElement("label");
        wrapper.className = "power-table__rule-field";
        const text = document.createElement("span");
        text.textContent = label;
        wrapper.append(text, this.createBareInput(value, onInput));
        return wrapper;
    }

    private createBareSelect(
        options: string[][],
        value: string,
        onChange: (value: string) => void
    ): HTMLSelectElement {
        const select = document.createElement("select");
        options.forEach(([optionValue, optionLabel]) => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionLabel;
            option.selected = optionValue === value;
            select.appendChild(option);
        });
        select.addEventListener("change", () => onChange(select.value));
        return select;
    }

    private createBareInput(
        value: string,
        onInput: (value: string) => void
    ): HTMLInputElement {
        const input = document.createElement("input");
        input.value = value;
        input.addEventListener("input", () => onInput(input.value));
        return input;
    }

    private createBareColor(
        value: string,
        onInput: (value: string) => void,
        disabled = false
    ): HTMLInputElement {
        const input = document.createElement("input");
        input.type = "color";
        input.value = /^#[0-9a-f]{6}$/i.test(value) ? value : "#005CAC";
        input.disabled = disabled;
        if (disabled) {
            input.title = "Este ícone utiliza cores próprias";
        }
        input.addEventListener("input", () => onInput(input.value));
        return input;
    }

    private iconSupportsRuleColor(iconValue: string): boolean {
        if (iconValue.startsWith("custom:")) {
            const asset = this.customIcons.find(
                (candidate) =>
                    candidate.id === iconValue.slice("custom:".length)
            );
            return asset?.colorMode === "rule";
        }
        return !iconValue.startsWith("emoji") &&
            ![
                "circleSymbolHigh",
                "circleSymbolLow",
                "flagLow",
                "flag",
                "trendDownColor",
                "trendFlatColor",
                "trendUpColor"
            ]
                .includes(iconValue);
    }

    private resultColor(rule: VisualRule): string {
        if (this.activeRuleSet?.mode === "icon") return rule.iconColor;
        if (this.activeRuleSet?.mode === "bar") return rule.barColor;
        return rule.backgroundColor;
    }

    private modeLabel(): string {
        if (this.activeRuleSet?.mode === "icon") return "Ícone";
        if (this.activeRuleSet?.mode === "bar") return "Barra";
        return "Etiqueta";
    }

    private strongColor(color: string): string {
        const hex = color.match(/^#([0-9a-f]{6})$/i);
        if (!hex) return "#0B1C30";
        const value = Number.parseInt(hex[1], 16);
        const red = (value >> 16) & 255;
        const green = (value >> 8) & 255;
        const blue = value & 255;
        const factor = 0.48;
        return `rgb(${Math.round(red * factor)}, ${Math.round(
            green * factor
        )}, ${Math.round(blue * factor)})`;
    }
}
