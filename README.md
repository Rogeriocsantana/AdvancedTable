# AdvanceTable

Visual customizado para Power BI que amplia a experiência da tabela nativa com pesquisa, filtros por coluna, seleção, paginação, totais, formatação avançada e exportação.

O nome exibido no Power BI é **AdvanceTable**. Os pacotes compilados são publicados em `dist` com o nome **AdvancedTable**.

> Versão atual: `0.4.8`  
> API de visuais do Power BI: `5.11`

## Principais recursos

### Dados, navegação e interação

- múltiplos campos e medidas, respeitando a ordem definida no painel de campos;
- ordenação pelas colunas;
- paginação configurável, acima ou abaixo da tabela;
- quantidade de registros por página e indicador de intervalo;
- menu de contexto nativo do Power BI;
- tooltip padrão e suporte a página de tooltip;
- estados de hover e destaque visual de linhas e colunas.

### Pesquisa e filtros

- uma ou duas caixas de pesquisa configuráveis;
- pesquisa somente no visual ou aplicada ao relatório;
- escolha da coluna pesquisada;
- filtros individuais no cabeçalho de cada coluna;
- seleção de valores, pesquisa dentro do filtro e limpeza dos filtros ativos;
- barra opcional com os filtros aplicados.

### Seleção

- seleção única ou múltipla;
- seleção por clique ou por controles visuais;
- estilos de checkbox, círculo ou quadrado;
- modo de seleção padrão do Power BI;
- modo que aplica a seleção como filtro no relatório;
- opção para selecionar todos os registros visíveis.

### Formatação

- cores, fontes, tamanhos, alinhamentos, espaçamentos e bordas;
- configurações globais e substituições por coluna;
- título, subtítulo e contador de registros;
- cabeçalho e linhas com aparência configurável;
- larguras e alinhamentos específicos por coluna;
- etiquetas para valores categóricos;
- ícones e marcadores de status;
- barras de progresso para valores numéricos;
- editor próprio de regras aberto pelo botão `ƒx`;
- regras ilimitadas por coluna com operadores de texto, número e percentual;
- exibição como valor, etiqueta, barra ou ícone;
- regras baseadas na própria coluna ou em outro campo carregado no visual;
- área **Campos auxiliares de regra** para medidas usadas somente na formatação;
- preenchimento por valor do campo, positivo/negativo ou regras personalizadas;
- biblioteca com mais de 30 ícones e posicionamento antes, depois ou sem texto;
- formatação numérica e de texto compatível com os metadados do Power BI.

### Totais e agregações

- linha de totais opcional;
- agregação fixa ou selecionável diretamente no visual;
- contagem, valores únicos, soma, média, máximo e mínimo;
- configuração de agregação e alinhamento por coluna;
- personalização visual da linha e do menu de totais.

### Download

- exportação em Excel (`.xlsx`) e CSV;
- escopos: resultados filtrados, todos os registros, página atual ou selecionados;
- GitHub Pages como método padrão;
- servidor HTTPS próprio como alternativa;
- formato padrão e aparência do menu configuráveis.

No Power BI Service, o download utiliza uma página ponte para reconstruir o arquivo no navegador. Ao selecionar **GitHub Pages**, aparece um campo próprio, preenchido com `https://rogeriocsantana.github.io/AdvancedTable/download-page/`, que pode ser substituído por qualquer endereço `https://*.github.io` sem recompilação. Ao selecionar **Servidor próprio**, aparece outro campo, vazio e independente, para uma URL HTTPS cujo domínio tenha sido incluído em `WebAccess`.

## Capturas de tela

As imagens reais devem ser capturadas no Power BI Desktop ou Service, usando um relatório de demonstração sem informações confidenciais. A estrutura sugerida está em [`docs/images`](docs/images/README.md).

Quando as capturas estiverem disponíveis, esta seção pode apresentar:

1. visão geral da tabela;
2. pesquisa e filtros por coluna;
3. seleção de registros;
4. etiquetas, ícones e barras;
5. totais e agregações;
6. menu de download.

## Instalação no Power BI

1. Baixe o arquivo `.pbiviz` mais recente da pasta `dist` ou da área de releases do repositório.
2. No Power BI Desktop, abra o painel **Visualizações**.
3. Selecione **Obter mais visuais** e depois **Importar um visual de um arquivo**.
4. Escolha o pacote `AdvancedTable.<versão>.pbiviz`.
5. Adicione o visual à página e arraste colunas ou medidas para **Linhas**.

Para atualizar uma instalação existente, importe a versão mais recente sobre a anterior. O GUID histórico do visual é mantido para preservar essa compatibilidade.

## Desenvolvimento

### Requisitos

- Node.js;
- npm;
- Power BI Visuals Tools, instalado pelas dependências do projeto.

### Preparação

```powershell
npm.cmd install
```

### Servidor de desenvolvimento

```powershell
npm.cmd start
```

### Verificações

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
```

### Gerar o pacote

```powershell
npm.cmd run package
```

O comando executa o empacotador oficial e renomeia automaticamente o resultado para:

```text
dist/AdvancedTable.<versão>.pbiviz
```

O identificador interno e o GUID continuam com os valores históricos. Somente o nome do arquivo entregue em `dist` é padronizado como `AdvancedTable`.

## Estrutura do projeto

```text
AdvancedTable/
├── assets/                 ícone do visual
├── dist/                   pacotes .pbiviz compilados
├── docs/images/            capturas usadas na documentação
├── download-bridge/        projeto-fonte da página ponte
├── download-page/          página estática para GitHub Pages
├── scripts/                automações de empacotamento
├── src/
│   ├── data/               leitura e tipos dos dados
│   ├── rendering/          construção e interação da tabela
│   ├── utils/              formatação e exportação
│   ├── settings.ts         modelo de configurações
│   └── visual.ts           integração com o host do Power BI
├── style/                  estilos LESS
├── capabilities.json       campos, formatação e permissões
├── package.json            scripts e dependências
└── pbiviz.json             identidade e versão do visual
```

## Página de download para o Power BI Service

A pasta [`download-page`](download-page/README.md) contém uma página estática que pode ser publicada no GitHub Pages. Depois da publicação:

1. publique o repositório no GitHub Pages;
2. mantenha `https://*.github.io` autorizado em `WebAccess`;
3. selecione **GitHub Pages (padrão)** em **Download > Comportamento**;
4. altere **Endereço da página de download** se utilizar outro GitHub Pages;
5. autorize o acesso externo quando o Power BI solicitar.

Para utilizar outro servidor, selecione **Servidor próprio**, informe sua URL HTTPS, adicione o domínio em `WebAccess` no `capabilities.json` e gere um novo pacote.

O conteúdo do arquivo é enviado no fragmento (`#`) da URL, que não é encaminhado ao servidor HTTP. Há um limite preventivo de 1.000.000 de caracteres para evitar URLs excessivamente grandes.

## Identidade e compatibilidade

O projeto foi renomeado de `AdvancedTableRoger` para `AdvancedTable`, mas mantém o GUID:

```text
advancedTableRogerC40D05D8D12144689810E97FF8C695C8
```

Não altere esse valor em novas versões. A troca do GUID faria o Power BI tratar o pacote como outro visual e impediria a atualização direta das instalações existentes.

## Licença

MIT, conforme definido no `package.json`.
