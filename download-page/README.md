# Página de download do AdvanceTable

Esta pasta contém uma página estática independente. Ela pode ser publicada no
GitHub Pages, Azure Static Web Apps, Cloudflare Pages ou qualquer servidor HTTPS.

## GitHub Pages

1. Copie a pasta `download-page` para o repositório que será publicado.
2. No GitHub, abra **Settings > Pages**.
3. Escolha a branch e a pasta que contém `index.html`.
4. Para este repositório, mantenha a página disponível em:
   `https://rogeriocsantana.github.io/AdvancedTable/download-page/`.
5. No Power BI, abra **Download > Comportamento** e selecione
   **GitHub Pages (padrão)**.
6. Se utilizar outro repositório, altere **Endereço da página de download**.
7. Antes do primeiro download, autorize o acesso externo quando o Power BI solicitar.

O arquivo é enviado no fragmento `#` do endereço. O navegador não envia essa
parte ao servidor. A página remove o fragmento do endereço após reconstruir o
arquivo.

## Permissão do visual

O domínio que hospeda a página precisa estar liberado no privilégio `WebAccess`
do `capabilities.json`. O pacote padrão autoriza `https://*.github.io`, permitindo
trocar o usuário e o repositório do GitHub Pages sem recompilar. Para usar outro
servidor, inclua seu domínio em `parameters` e gere novamente o pacote `.pbiviz`.
