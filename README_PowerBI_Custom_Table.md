# Power BI Custom Table — Especificação do Projeto

## 1. Objetivo

Criar um visual customizado para Power BI que funcione como uma evolução da tabela nativa.

A proposta não é criar um componente com comportamento de aplicativo independente nem substituir o Power BI como plataforma. O visual deve preservar ao máximo a experiência e a lógica da tabela nativa, adicionando recursos visuais e de interação que hoje fazem falta.

O visual deve ser simples de usar para quem já conhece a tabela nativa do Power BI.

A prioridade é:

- integração real com o modelo do Power BI;
- seleção e interação com outros visuais;
- compatibilidade com tooltips;
- formatação condicional avançada;
- aparência moderna;
- configuração pelo painel de formatação do Power BI;
- interface em português;
- bom desempenho com tabelas grandes.

---

# 2. Princípio de design

O visual deve partir da seguinte ideia:

> "Tabela nativa do Power BI, mas com uma experiência visual mais moderna e novas opções de formatação e interação."

Não criar uma interface paralela complexa.

Não transformar o visual em um sistema completo de gerenciamento de dados.

Não exigir configuração externa para funções básicas.

Sempre que possível, seguir os padrões nativos do Power BI.

---

# 3. Referências visuais

O projeto deve combinar características de três referências:

## Tabela nativa do Power BI

Manter como referência para:

- campos e medidas;
- ordenação;
- seleção;
- interação com outros visuais;
- filtros;
- tooltips;
- formatação condicional;
- subtotal e total;
- comportamento esperado dentro de um relatório.

## Advanced Table / Elwara

Usar como inspiração para:

- aparência mais moderna;
- badges para categorias;
- barras de dados;
- campo de pesquisa;
- cabeçalho compacto;
- linhas mais agradáveis visualmente;
- indicadores visuais dentro das células.

Não copiar a identidade visual ou código do produto.

## Interfaces modernas de aplicações

Usar como inspiração para:

- hover suave;
- linha selecionada;
- coluna destacada;
- bordas discretas;
- espaçamento;
- cabeçalho fixo;
- menu contextual de coluna;
- scroll elegante;
- controles compactos.

---

# 4. Tecnologias

O projeto deve utilizar o SDK oficial de Power BI Custom Visuals.

Tecnologias sugeridas:

- TypeScript;
- Power BI Visuals API;
- Power BI Visuals Tools / pbiviz;
- HTML;
- CSS ou LESS;
- SVG para ícones quando necessário.

Inicialmente, evitar frameworks de interface pesados.

Preferir implementação em TypeScript puro, salvo se houver justificativa técnica clara para adicionar uma biblioteca.

Toda dependência externa deve ser avaliada quanto a:

- tamanho;
- segurança;
- licença;
- manutenção;
- compatibilidade com o ambiente sandbox dos custom visuals do Power BI.

---

# 5. Arquitetura esperada

Manter o projeto modular.

Estrutura sugerida:

```text
src/
├── visual.ts
├── settings.ts
├── data/
│   ├── dataParser.ts
│   ├── dataTypes.ts
│   └── sorting.ts
├── rendering/
│   ├── tableRenderer.ts
│   ├── cellRenderer.ts
│   ├── headerRenderer.ts
│   └── totalRenderer.ts
├── interaction/
│   ├── selectionManager.ts
│   ├── searchManager.ts
│   ├── tooltipManager.ts
│   └── keyboardManager.ts
├── formatting/
│   ├── conditionalFormatting.ts
│   ├── columnFormatting.ts
│   └── formattingModel.ts
├── utils/
│   ├── locale.ts
│   ├── formatters.ts
│   └── helpers.ts
└── constants.ts

style/
└── visual.less
```

A estrutura pode ser adaptada pelo Codex caso exista uma organização melhor, mas deve evitar concentrar toda a lógica em `visual.ts`.

---

# 6. Campos do visual

O visual deve aceitar múltiplos campos e medidas.

A experiência de configuração deve ser semelhante à tabela nativa.

O usuário deve poder adicionar:

- colunas categóricas;
- texto;
- número inteiro;
- decimal;
- moeda;
- porcentagem;
- data;
- hora;
- medidas DAX.

Os tipos devem ser identificados automaticamente quando possível.

---

# 7. Renderização básica da tabela

A tabela deve possuir:

- cabeçalho;
- linhas de dados;
- total opcional;
- scroll vertical;
- scroll horizontal;
- alinhamento configurável;
- tamanho da fonte configurável;
- altura da linha configurável;
- largura das colunas configurável;
- quebra de texto opcional;
- bordas configuráveis.

O cabeçalho deve permanecer visível durante o scroll vertical.

Implementar `sticky header`.

---

# 8. Seleção de linha

Ao clicar em uma linha:

- destacar visualmente a linha;
- criar uma seleção real usando a Selection API do Power BI;
- permitir que a seleção interaja com outros visuais do relatório.

O comportamento deve seguir o padrão do Power BI.

## Seleção simples

Clique em uma linha:

- seleciona a linha;
- destaca a linha;
- atualiza a seleção no Power BI.

## Limpar seleção

Clique em uma área vazia:

- limpa a seleção.

## Seleção múltipla

Quando suportado:

- Ctrl + clique;
- permitir selecionar múltiplas linhas.

O visual deve respeitar o comportamento esperado do Power BI.

---

# 9. Destaque visual da linha selecionada

A linha selecionada deve possuir configuração visual.

Opções:

- cor de fundo;
- cor do texto;
- borda lateral;
- borda completa;
- intensidade do destaque.

Padrão recomendado:

- fundo suave;
- pequena barra vertical na lateral esquerda;
- sem alterar drasticamente a legibilidade da célula.

---

# 10. Hover

Ao passar o mouse sobre uma linha:

- alterar suavemente o fundo;
- manter legibilidade;
- não interferir na formatação condicional.

O hover deve ser configurável:

- ativado/desativado;
- cor;
- intensidade.

---

# 11. Destaque de coluna

Ao clicar no cabeçalho ou interagir com uma coluna, o visual pode destacar visualmente essa coluna.

Esse destaque é apenas visual e não deve aplicar filtro ao modelo automaticamente.

Deve existir configuração para:

- ativar/desativar;
- cor do destaque;
- intensidade.

---

# 12. Ordenação

Permitir ordenar pela coluna.

Comportamento esperado:

```text
Clique 1 → crescente
Clique 2 → decrescente
Clique 3 → padrão/original, quando aplicável
```

Exibir indicador visual:

```text
▲
▼
```

ou ícone SVG equivalente.

Quando possível, utilizar os mecanismos oficiais de ordenação fornecidos pela API do Power BI.

---

# 13. Busca

Adicionar um campo de pesquisa no topo do visual.

Exemplo:

```text
🔍 Pesquisar...
```

A busca deve ser rápida e instantânea.

## Modo 1 — Pesquisa local

Filtra apenas as linhas exibidas dentro do visual.

Não altera outros visuais.

## Modo 2 — Pesquisa como filtro

Quando tecnicamente possível e configurado pelo usuário:

- a pesquisa deve gerar um filtro real;
- outros visuais devem receber o contexto de filtro.

Deve existir uma opção no painel de formatação:

```text
Comportamento da pesquisa

○ Somente tabela
○ Aplicar ao relatório
```

Caso o modo "Aplicar ao relatório" tenha limitações impostas pela API do Power BI, documentar claramente essas limitações.

---

# 14. Tooltips

O visual deve suportar tooltips do Power BI.

Prioridades:

1. Tooltip padrão do Power BI.
2. Suporte a campos adicionados como tooltip.
3. Avaliar suporte a Report Page Tooltip.
4. Não bloquear tooltips configurados pelo usuário.

A experiência deve ser o mais próxima possível da tabela nativa.

Não criar tooltip próprio em HTML como substituto quando o tooltip oficial puder ser utilizado.

---

# 15. Tipos de célula

Cada coluna poderá utilizar diferentes modos de renderização.

Tipos planejados:

- Auto;
- Texto;
- Número;
- Porcentagem;
- Badge;
- Barra de dados;
- Ícone;
- Ícone + valor;
- Barra + valor;
- Link;
- Data;
- Data e hora.

O modo `Auto` deve usar o tipo detectado no modelo.

---

# 16. Números inteiros

Números inteiros devem aparecer como números por padrão.

Exemplo:

```text
295
43
21
```

Não adicionar automaticamente barras de dados.

Barra de dados para números inteiros deve ser uma escolha explícita do usuário.

---

# 17. Porcentagens

Para porcentagens, permitir:

- apenas valor;
- barra de progresso;
- barra + valor;
- ícone + valor;
- cor condicional.

Exemplo:

```text
██████████████░░ 94,92%
```

A barra deve respeitar o intervalo esperado.

Por padrão:

```text
0% → 0
100% → 1
```

Permitir mínimo e máximo personalizados futuramente.

---

# 18. Barras de dados

Implementar Data Bars.

Configurações:

- mostrar somente barra;
- mostrar barra + valor;
- cor fixa;
- cor por medida;
- mínimo;
- máximo;
- eixo zero para valores positivos/negativos, em versão futura;
- cantos arredondados;
- espessura.

A barra não deve prejudicar a leitura do texto.

---

# 19. Badges

Colunas categóricas podem ser exibidas como badges.

Exemplo:

```text
● INTRAVASCULARES
● PRECAUÇÕES
● TOT
● VESICAL
```

Configurações:

- cor do fundo;
- cor do texto;
- borda;
- ponto indicador;
- arredondamento;
- tamanho;
- padding.

A cor poderá ser:

- fixa;
- baseada no valor;
- baseada em regras;
- baseada em campo ou medida.

---

# 20. Formatação condicional

Esse é um dos recursos principais do projeto.

O visual deve permitir formatação condicional para:

- cor de fundo;
- cor do texto;
- ícone;
- barra de dados;
- badge;
- borda, futuramente.

A formatação pode ser baseada em:

1. valor da própria coluna;
2. outra coluna;
3. medida;
4. regras definidas pelo usuário;
5. código de cor hexadecimal retornado por uma medida.

---

# 21. Formatação por valor de campo

Permitir utilizar uma medida DAX que retorne uma cor.

Exemplo:

```DAX
Cor Não Conformidade =
SWITCH(
    TRUE(),
    [% Não Conformidade] <= 0.05, "#DCFCE7",
    [% Não Conformidade] <= 0.15, "#FEF3C7",
    "#FEE2E2"
)
```

O visual deve usar o resultado para:

- fundo;
- fonte;
- badge;
- barra;
- ícone, quando aplicável.

---

# 22. Formatação por regras

Permitir regras como:

```text
Valor <= 5%       Verde
Valor > 5% <=15%  Amarelo
Valor > 15%       Vermelho
```

Os operadores desejados:

- igual;
- diferente;
- maior;
- maior ou igual;
- menor;
- menor ou igual;
- entre;
- contém, para texto;
- começa com, futuramente.

---

# 23. Ícones condicionais

Permitir ícones baseados em regras.

Exemplos:

```text
✅
⚠️
❌
```

Preferir SVG ou biblioteca própria de ícones para manter consistência visual.

Modos:

- somente ícone;
- ícone à esquerda;
- ícone à direita;
- ícone + valor.

Configuração de:

- tamanho;
- cor;
- alinhamento.

---

# 24. Compatibilidade com medidas auxiliares

Uma coluna visível poderá ser formatada com base em uma medida que não precisa aparecer visualmente na tabela.

Exemplo:

```text
Coluna visível:
Não Conformidade (%)

Medida auxiliar:
[Cor Não Conformidade]
```

A medida auxiliar controla a cor da coluna.

Essa funcionalidade é prioritária.

---

# 25. Formatação por coluna

Cada coluna deve possuir configurações próprias.

Configurações desejadas:

- título;
- título personalizado;
- visibilidade;
- largura;
- alinhamento;
- formato;
- tipo de célula;
- cor do texto;
- cor do fundo;
- formatação condicional;
- ícone;
- barra;
- badge;
- tooltip.

---

# 26. Cabeçalho

Configurações:

- mostrar/ocultar;
- fundo;
- cor do texto;
- tamanho da fonte;
- negrito;
- altura;
- alinhamento;
- borda inferior;
- ícone de ordenação.

O cabeçalho deve ter aparência limpa e moderna.

---

# 27. Menu da coluna

Versão futura ou segunda fase.

Ao clicar em um menu no cabeçalho:

```text
Ordenar crescente
Ordenar decrescente
Limpar ordenação
Fixar coluna
Ocultar coluna
```

Filtros diretamente pelo menu podem ser avaliados futuramente.

---

# 28. Coluna fixa

Permitir fixar a primeira coluna.

Futuramente permitir múltiplas colunas fixas.

Exemplo:

```text
Pergunta | Tipo | Avaliações | ...
   ↑
 permanece visível no scroll horizontal
```

---

# 29. Redimensionamento de coluna

Permitir arrastar a borda do cabeçalho para alterar largura.

Avaliar persistência da largura usando propriedades do visual.

A experiência deve ser fluida.

---

# 30. Totais

Suportar linha de total quando os dados fornecidos pelo Power BI permitirem.

Configurações:

- mostrar/ocultar;
- posição;
- fundo;
- fonte;
- negrito;
- borda superior.

Não calcular totais manualmente quando o Power BI já fornecer o contexto correto da medida.

---

# 31. Interface e idioma

O idioma principal inicial será Português do Brasil.

Textos:

```text
Pesquisar
Limpar
Contém
Ordenar crescente
Ordenar decrescente
Nenhum resultado encontrado
Total
Linhas
```

Preparar arquitetura para localização futura.

Idiomas planejados:

- pt-BR;
- en-US.

O visual deve usar a localidade fornecida pelo host para formatação de:

- número;
- decimal;
- moeda;
- porcentagem;
- data.

---

# 32. Painel de formatação

Organizar o painel de forma clara.

Sugestão:

```text
Tabela
├── Linhas
├── Cabeçalho
├── Totais
├── Grade
└── Scroll

Colunas
├── Selecionar coluna
├── Tipo de célula
├── Alinhamento
├── Formatação
├── Barra de dados
├── Badge
└── Ícone

Formatação condicional
├── Fundo
├── Texto
├── Ícone
└── Barra

Interação
├── Seleção
├── Hover
├── Destaque da coluna
└── Pesquisa

Pesquisa
├── Mostrar pesquisa
├── Placeholder
└── Comportamento

Tooltip
└── Ativar/desativar
```

---

# 33. Aparência padrão

O padrão visual deve ser neutro e moderno.

Características:

- fundo claro;
- bordas muito suaves;
- cabeçalho levemente destacado;
- pouco espaçamento vertical;
- cantos discretos;
- hover suave;
- seleção visível sem ser agressiva;
- tipografia compatível com Power BI.

Evitar excesso de sombras.

Evitar visual excessivamente colorido.

As cores fortes devem vir principalmente da formatação condicional definida pelo usuário.

---

# 34. Temas do Power BI

Quando possível:

- respeitar tema ativo do relatório;
- herdar cores padrão;
- permitir sobrescrever pelo painel de formatação.

Preparar para suporte futuro a modo escuro.

---

# 35. Desempenho

O visual deve ser projetado para lidar com muitas linhas.

Prioridades:

- evitar recriar todo o DOM sem necessidade;
- reduzir listeners individuais;
- utilizar event delegation quando adequado;
- considerar virtualização de linhas;
- evitar cálculos repetidos;
- cachear formatação quando possível.

Para tabelas grandes, implementar ou avaliar virtual scrolling.

---

# 36. Acessibilidade

Planejar suporte a:

- navegação por teclado;
- foco visível;
- `aria-label`;
- contraste adequado;
- leitura por screen reader quando possível.

Primeira fase:

- Tab;
- Enter;
- setas, quando aplicável;
- foco na linha.

---

# 37. Segurança

Não utilizar:

- `eval`;
- scripts externos em runtime;
- carregamento arbitrário de JavaScript remoto;
- execução de HTML não sanitizado.

Todo conteúdo vindo dos dados deve ser tratado como texto por padrão.

Links devem ser validados antes de abrir.

---

# 38. Compatibilidade

O visual deve funcionar prioritariamente em:

- Power BI Desktop;
- Power BI Service.

Avaliar posteriormente:

- publicação organizacional;
- AppSource;
- exportação PDF;
- exportação PowerPoint;
- mobile.

---

# 39. Experiência inicial desejada

Ao adicionar o visual:

1. usuário arrasta campos para o visual;
2. tabela é exibida imediatamente;
3. tipos são detectados automaticamente;
4. números usam formato do modelo;
5. percentuais usam formato do modelo;
6. clique seleciona linha;
7. outros visuais respondem à seleção;
8. tooltip funciona;
9. cabeçalho permite ordenação;
10. pesquisa funciona sem configuração adicional.

Recursos avançados ficam disponíveis no painel de formatação.

---

# 40. MVP — Versão 0.1

Implementar primeiro:

- renderização de tabela;
- múltiplas colunas;
- texto;
- números;
- porcentagens;
- formato do modelo;
- cabeçalho;
- scroll;
- cabeçalho fixo;
- seleção de linha;
- cross-filter/cross-highlight quando suportado;
- hover;
- ordenação;
- tooltip;
- busca local;
- interface em pt-BR.

Não implementar tudo de uma vez.

Primeiro garantir estabilidade e integração com o Power BI.

---

# 41. Versão 0.2

Adicionar:

- formatação individual por coluna;
- alinhamento;
- largura;
- tipos de célula;
- badges;
- barras de dados;
- ícones.

---

# 42. Versão 0.3

Adicionar formatação condicional:

- regras;
- fundo;
- texto;
- ícones;
- medida auxiliar;
- código hexadecimal retornado por medida.

---

# 43. Versão 0.4

Adicionar:

- pesquisa aplicada ao relatório, se viável;
- seleção múltipla;
- coluna fixa;
- resize;
- destaque de coluna.

---

# 44. Versão 0.5

Adicionar:

- virtualização;
- melhorias de desempenho;
- acessibilidade;
- teclado;
- refinamento do painel de formatação.

---

# 45. Critérios de aceitação do MVP

O MVP será considerado funcional quando:

- puder ser empacotado com `pbiviz package`;
- gerar arquivo `.pbiviz`;
- puder ser importado no Power BI Desktop;
- aceitar dimensões e medidas;
- exibir os valores com formatação correta;
- selecionar uma linha;
- interagir com outro visual;
- ordenar por coluna;
- pesquisar registros;
- exibir tooltip;
- não apresentar erros no console em uso normal;
- funcionar com atualização dos filtros do relatório.

---

# 46. Regras para o Codex durante o desenvolvimento

Antes de implementar uma nova funcionalidade:

1. verificar se existe API oficial do Power BI para o recurso;
2. preferir a API oficial;
3. não simular recursos nativos quando existir integração oficial;
4. documentar limitações;
5. manter TypeScript com tipagem forte;
6. evitar `any`;
7. manter responsabilidades separadas;
8. não colocar toda a implementação em `visual.ts`;
9. preservar funcionalidades existentes ao adicionar novas;
10. executar build após alterações importantes.

Sempre que possível:

```bash
npm run lint
```

ou comando equivalente.

Antes de entregar versão testável:

```bash
pbiviz package
```

Corrigir erros de compilação antes de considerar a tarefa concluída.

---

# 47. Orientação importante sobre arquitetura

Este projeto é um **Power BI Custom Visual**.

Não deve ser estruturado como:

- aplicação web tradicional;
- dashboard independente;
- SPA;
- sistema CRUD;
- backend Node.js;
- API REST;
- banco de dados próprio.

A fonte dos dados é o próprio Power BI.

O visual deve trabalhar com:

```text
Power BI Model
      ↓
DataView
      ↓
Custom Visual
      ↓
Renderização
      ↓
Selection / Tooltip / Filter APIs
      ↓
Power BI Host
```

---

# 48. Sobre reutilização de Project-Starter-Kit

Não importar o Project-Starter-Kit inteiro para este projeto.

Ele foi criado como fundação para desenvolvimento de aplicações e possui uma finalidade arquitetural diferente.

Este visual deve nascer diretamente a partir do template oficial do `pbiviz`.

Aproveitar do Project-Starter-Kit apenas conceitos genéricos que sejam úteis, como:

- organização de código;
- padrões de nomenclatura;
- helpers TypeScript;
- componentes realmente independentes;
- documentação;
- padrões de qualidade.

Não trazer automaticamente:

- roteamento;
- autenticação;
- estrutura de páginas;
- backend;
- API;
- banco de dados;
- gerenciamento de estado de aplicação;
- bibliotecas de UI pesadas.

Qualquer código reutilizado deve ser copiado seletivamente e adaptado ao ambiente de Power BI Custom Visual.

---

# 49. Nome temporário do projeto

Sugestão inicial:

```text
PowerTable
```

Outras possibilidades:

```text
Smart Table
Modern Table
Enhanced Table
BI Table
Advanced Native Table
```

O nome definitivo pode ser escolhido posteriormente.

---

# 50. Visão final

O objetivo de longo prazo é chegar a uma experiência semelhante a:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Título                                              🔍 Pesquisar...    ⋮   │
├────────────────────────────────────────────────────────────────────────────┤
│ Pergunta               Tipo             Avaliações  Conform.    Não Conf. │
├────────────────────────────────────────────────────────────────────────────┤
│ Pergunta A             ● Categoria A          295     99,32% ✅      0,68% │
│ Pergunta B             ● Categoria A          295     96,95% ✅      3,05% │
│ Pergunta C             ● Categoria B           43     79,07% ❌     20,93% │
│ Pergunta D             ● Categoria C           21     85,71% ⚠️     14,29% │
└────────────────────────────────────────────────────────────────────────────┘
```

Com:

- aparência moderna;
- comportamento familiar;
- seleção real;
- filtros reais;
- tooltips;
- integração com outros visuais;
- formatação condicional avançada;
- badges;
- barras;
- ícones;
- experiência em português.

A prioridade deve ser sempre:

> integração com Power BI primeiro, aparência depois.
