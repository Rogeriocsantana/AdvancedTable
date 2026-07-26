# AdvanceTable

Visual de tabela avançada para Power BI, criado para oferecer mais controle sobre navegação, pesquisa, filtros, seleção, formatação condicional, totais e exportação de dados.

O nome exibido no Power BI é **AdvanceTable**. Os pacotes distribuídos utilizam o nome **AdvancedTable**.

> Versão atual: `0.5.11`  
> API de visuais do Power BI: `5.11`

## Recursos

### Tabela e navegação

- exibição de campos e medidas na ordem definida no painel de dados;
- ordenação por coluna;
- paginação configurável acima ou abaixo da tabela;
- escolha da quantidade de registros por página;
- indicador do intervalo e da quantidade de registros;
- menu de contexto do Power BI;
- tooltip padrão e suporte a páginas de tooltip;
- hover, destaque e seleção de linhas.

### Pesquisa e filtros

- uma ou duas caixas de pesquisa;
- escolha dos campos utilizados em cada pesquisa;
- pesquisa apenas no visual ou aplicada como filtro no relatório;
- filtros individuais nos cabeçalhos;
- pesquisa e seleção de valores dentro do filtro;
- limpeza individual dos filtros;
- barra opcional mostrando os filtros ativos.

### Seleção

- seleção única ou múltipla;
- seleção por clique ou por controles visuais;
- indicadores em formato de checkbox, círculo ou quadrado;
- seleção padrão do Power BI ou aplicação como filtro no relatório;
- seleção de todos os registros da página ou de todos os resultados filtrados;
- preservação opcional da seleção durante a paginação.

### Formatação

- tamanho do texto, altura das linhas, alinhamento e espaçamento;
- cores globais de texto e fundo;
- formatação específica por coluna, com prioridade sobre a configuração global;
- personalização de cabeçalhos, bordas, títulos e subtítulos;
- contador de registros;
- larguras e alinhamentos específicos por coluna;
- cores de hover e seleção.

### Formatação condicional avançada

O editor próprio de formatação condicional é aberto pelo botão de função exibido no modo de edição do Power BI Desktop.

- regras independentes por coluna;
- modos **Etiqueta**, **Barra** e **Ícone**;
- regras automáticas, positivas e negativas, personalizadas ou baseadas no valor de um campo;
- operadores de igualdade, diferença, maior, menor, intervalos, números e percentuais;
- regras baseadas na própria coluna ou em outro campo;
- campos e medidas auxiliares usados somente nas regras;
- preview em tempo real e simulador de valores;
- opção para remover ou restaurar a formatação de uma coluna.

#### Etiquetas

- marcador opcional antes do texto;
- formatos de marcador como círculo, quadrado, losango e triângulo;
- fundo configurável por regra;
- texto acompanhando a cor do fundo ou respeitando a cor da coluna/tabela.

#### Barras

- barra ao lado do valor ou preenchimento proporcional da célula;
- barra antes, depois ou sem exibir o valor;
- mínimo, máximo, cor da barra e cor do trilho configuráveis;
- regras personalizadas ou baseadas em campos e medidas.

#### Ícones

- biblioteca de ícones nativos;
- ícone antes, depois ou no lugar do texto;
- tamanhos pequeno, médio e grande;
- cor fixa ou dinâmica, quando o ícone permitir;
- busca, visualização compacta ou expandida e reordenação;
- ocultação e restauração de ícones nativos;
- importação de ícones personalizados em PNG e SVG;
- gerenciamento da biblioteca, lixeira e proteção de ícones em uso.

### Totais e agregações

- linha de total opcional;
- cálculo fixo ou selecionável diretamente no visual;
- contagem, valores únicos, soma, média, máximo e mínimo;
- agregação e alinhamento configuráveis por coluna;
- personalização da linha e do menu de totais.

### Download

- exportação em Excel (`.xlsx`) e CSV;
- escopos de resultados filtrados, todos os registros, página atual ou selecionados;
- uso da API oficial do Power BI, quando permitida pelo administrador;
- download por página externa como alternativa;
- GitHub Pages como opção padrão;
- servidor HTTPS próprio como alternativa;
- endereço editável sem necessidade de recompilar o visual.

O endereço padrão da página de download é:

```text
https://rogeriocsantana.github.io/AdvancedTable/download-page/
```

Quem utilizar outro GitHub Pages pode substituir esse endereço nas configurações do visual. A opção **Servidor próprio** possui um endereço separado e orientações próprias.

No primeiro uso de uma página externa, o Power BI pode solicitar autorização para abrir o endereço.

## Capturas de tela

As capturas de tela serão adicionadas posteriormente, utilizando um relatório demonstrativo sem dados reais.

## Instalação

1. Baixe o arquivo `.pbiviz` mais recente na pasta [`dist`](dist) ou na área de releases do repositório.
2. Abra o relatório no Power BI Desktop.
3. No painel **Visualizações**, selecione **Obter mais visuais**.
4. Escolha **Importar um visual de um arquivo**.
5. Selecione `AdvancedTable.<versão>.pbiviz`.
6. Adicione o visual à página e arraste campos ou medidas para **Linhas**.

Para atualizar uma instalação existente, importe o pacote mais recente sobre a versão anterior. O GUID interno é preservado para que o Power BI reconheça a atualização como sendo do mesmo visual.

## Download no Power BI Service

A pasta [`download-page`](download-page) contém a página estática preparada para publicação no GitHub Pages.

Para usar a página padrão:

1. publique o conteúdo do repositório no GitHub Pages;
2. no visual, abra **Download > Comportamento**;
3. selecione **GitHub Pages**;
4. confirme ou altere o endereço apresentado;
5. autorize o acesso externo quando o Power BI solicitar.

Para usar outro servidor:

1. selecione **Servidor próprio**;
2. informe uma URL HTTPS;
3. inclua o domínio em `WebAccess`, no arquivo `capabilities.json`;
4. gere um novo pacote do visual.

O arquivo é enviado no fragmento (`#`) da URL, que não é encaminhado ao servidor HTTP. Existe um limite preventivo de 1.000.000 de caracteres para evitar URLs excessivamente grandes.

## Desenvolvimento

### Requisitos

- Node.js;
- npm;
- Power BI Visuals Tools, instalado pelas dependências do projeto.

### Instalar dependências

```powershell
npm.cmd install
```

### Executar em modo de desenvolvimento

```powershell
npm.cmd start
```

### Validar o projeto

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
```

### Gerar o pacote

```powershell
npm.cmd run package
```

O pacote será criado no formato:

```text
dist/AdvancedTable.<versão>.pbiviz
```

## Estrutura do projeto

```text
AdvancedTable/
├── assets/             Ícone e recursos do visual
├── dist/               Pacotes compilados
├── docs/               Documentação e futuras imagens
├── download-bridge/    Projeto-fonte da página ponte
├── download-page/      Página estática para GitHub Pages
├── scripts/            Scripts de empacotamento
├── src/
│   ├── data/           Leitura, transformação e tipos dos dados
│   ├── rendering/      Renderização e interações da tabela
│   ├── rules/          Editor e mecanismo de regras
│   ├── utils/          Formatação e exportação
│   ├── settings.ts     Modelo do painel de formatação
│   └── visual.ts       Integração com o Power BI
├── style/              Estilos LESS
├── capabilities.json   Campos, propriedades e permissões
├── package.json        Scripts e dependências
└── pbiviz.json         Identidade e versão do visual
```

## Identidade e compatibilidade

O projeto foi renomeado de `AdvancedTableRoger` para `AdvancedTable`, mas preserva o GUID histórico:

```text
advancedTableRogerC40D05D8D12144689810E97FF8C695C8
```

Esse valor não deve ser alterado. Um GUID diferente faria o Power BI tratar o pacote como um novo visual, impedindo a atualização direta das instalações existentes.

## Segurança e privacidade

- o visual processa os dados recebidos pelo Power BI;
- a página externa de download recebe o arquivo pelo fragmento da URL;
- o fragmento não é enviado ao servidor HTTP;
- não publique relatórios, planilhas ou capturas contendo informações confidenciais;
- revise as políticas da organização antes de habilitar exportações.

## Licença

Distribuído sob a licença MIT, conforme definido no arquivo [`package.json`](package.json).
