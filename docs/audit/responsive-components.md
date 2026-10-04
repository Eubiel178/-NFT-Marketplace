# Auditoria de Componentes Responsivos

## 1. Escopo e método

Esta auditoria cobre a relação entre as árvores Desktop e Mobile do marketplace, incluindo shell, navegação, Home, detalhe de NFT, carrinho, checkout, confirmação de pedido, autenticação e conta.

Foram usados como fonte de requisitos `AGENTS.md`, `README.md`, `docs/figma/` e os documentos existentes em `docs/audit/`. A implementação foi confrontada com `src/app`, `src/components`, `src/features` e `src/styles.css`.

Esta é uma auditoria estrutural. Nenhum JSX, CSS, token, asset, rota, comportamento ou componente de aplicação foi alterado para produzir este relatório.

## 2. Critério de classificação

| Classe | Significado | Decisão de refatoração |
| --- | --- | --- |
| **A** | Duplicação visual/estrutural com o mesmo comportamento e sem diferença semântica relevante | Pode compartilhar uma árvore e variar somente estilo/dados, preservando a fidelidade visual |
| **B** | Mesma responsabilidade com comportamento responsivo relevante | Compartilhar lógica, estado e subpartes estáveis; manter variantes de layout explícitas |
| **C** | Estrutura, conteúdo, interação ou semântica genuinamente diferente | Manter versões separadas; compartilhar somente primitives ou dados realmente comuns |

As classificações são sobre a relação entre as versões, não uma ordem de prioridade. Uma classificação A ou B não autoriza uma refatoração automática.

## 3. Resumo executivo

- O shell Desktop/Mobile é **C**: `DesktopLayout` possui header/footer e `MobileLayout` possui TabBar.
- O conteúdo da Home é **B** como seção, mas o Hero, promoções, blog e featured são **C** por conteúdo e composição.
- `NftCard.Desktop` e `NftCard.Mobile` são **A**: repetem a mesma hierarquia e regras de conteúdo; a diferença é visual.
- O detalhe de NFT é **B**: gallery, summary, description e related compartilham domínio, mas possuem controles e composição responsivos.
- Carrinho, checkout, pedido, autenticação e conta são **B** no nível da página: têm controlador/estado compartilhado e variações de apresentação relevantes.
- Há duas faixas de decisão diferentes: `useLayoutMode` troca o shell em `1024px`, enquanto diversas árvores de conteúdo trocam em `640px`. O intervalo `640px`–`1023px` usa MobileLayout com partes de conteúdo desktop.

## 4. Infraestrutura responsiva

### R-RESP-01 — Shell global — C

- **Arquivos:** `src/app/layout.tsx:17-65`, `src/components/layout/desktop-layout/index.tsx:9-18`, `src/components/layout/mobile-layout/index.tsx:8-16`.
- **Desktop:** `DesktopLayout` renderiza header, `main` e footer.
- **Mobile:** `MobileLayout` renderiza `main` e, quando aplicável, a TabBar.
- **Diferença:** não é apenas uma mudança de grid; a navegação periférica e os elementos do shell são diferentes.
- **Decisão:** manter dois shells. Compartilhar somente `main`, classes de container e regras de acessibilidade.

### R-RESP-02 — Breakpoints do shell e do conteúdo — B, com risco de integração

- **Arquivos:** `src/components/layout/use-layout-mode/index.ts:3-23`, `src/styles.css:1181-1189`, `src/styles.css:3218-3223`.
- `useLayoutMode` considera Desktop somente em `min-width: 1024px`.
- Home e várias árvores visuais consideram Desktop em `min-width: 640px`.
- Entre `640px` e `1023px`, o shell é Mobile, mas a Home exibe `home-hero-desktop` e `home-products-desktop`.
- **Decisão:** a política deve continuar explícita e ser tratada como uma relação B entre shell e conteúdo. Não substituir os dois critérios por uma flag única sem validar os frames tablet e a navegação.

### R-RESP-03 — Header Desktop e TabBar Mobile — C

- **Arquivos:** `src/components/layout/marketplace-header/index.tsx:6-66`, `src/components/ui/tab-bar/index.tsx:15-35`.
- O header Desktop oferece logo, navegação textual, busca, carrinho e login.
- A TabBar Mobile oferece cinco posições, ação central e estado ativo por rota.
- **Diferença:** hierarquia, quantidade de ações, affordances e posição são diferentes.
- **Decisão:** manter componentes separados. Reutilizar apenas ícones, links e regras de rota quando houver uma necessidade concreta.

### R-RESP-04 — Footer Desktop ausente no Mobile — C

- **Arquivos:** `src/components/layout/marketplace-footer/index.tsx:3-12`, `src/styles.css:4194-4336`.
- O footer é um bloco editorial Desktop com feature row, contatos, links, newsletter e copyright.
- Não há equivalente Mobile no shell.
- **Decisão:** manter Desktop-only. Não criar um footer Mobile artificial sem frame correspondente.

## 5. Home

### R-RESP-05 — HomePage e catálogo Desktop/Mobile — B

- **Arquivos:** `src/features/catalog/home/home-page/index.tsx:47-177`, `src/styles.css:2892-3016`, `src/styles.css:3218-3538`.
- O mesmo controlador mantém search params, debounce, query, filtros, ordenação e paginação.
- A árvore Desktop exibe sidebar, featured, toolbar, nove cards e paginação.
- A árvore Mobile exibe busca, Sheet de filtros, tabs e duas colunas com seleção/densidade diferentes de itens.
- **Decisão:** compartilhar dados, URL, callbacks, estados de loading/erro/vazio e `HomeProductCard`; manter as duas composições de catálogo explícitas.
- **Risco:** o Mobile não é apenas uma versão menor: ele escolhe quatro itens e não renderiza a mesma paginação/estrutura da árvore Desktop.

### R-RESP-06 — HomeHero — C

- **Arquivo:** `src/features/catalog/home/home-hero/index.tsx:11-45`.
- Desktop tem copy longa, imagem principal 450px, CTA em botão e selo.
- Mobile tem máscara, copy reduzida, duas imagens, link textual e pontos de carousel.
- **Decisão:** manter as árvores separadas. Compartilhar somente `artwork` e a navegação do link.

### R-RESP-07 — NftCard Desktop/Mobile — A

- **Arquivos:** `src/features/catalog/home/nft-card/nft-card-desktop/index.tsx:7-59`, `src/features/catalog/home/nft-card/nft-card-mobile/index.tsx:7-60`, `src/features/catalog/home/home-product-card/index.tsx:15-31`.
- As duas versões têm a mesma sequência semântica: `article`, imagem, badge opcional, nome e preço promocional.
- Não existe comportamento de interação diferente dentro do card; o link fica no wrapper `HomeProductCard`.
- **Decisão:** este é o principal candidato a uma árvore compartilhada com variantes de estilo, desde que se preserve proporção, radius, padding, tipografia, loading e prioridade de imagem.
- **Não fazer:** não adicionar novas flags de layout ao card universal nem alterar o wrapper de navegação.

### R-RESP-08 — HomeFilters Desktop/Sheet Mobile — B

- **Arquivos:** `src/features/catalog/home/home-filters/index.tsx:16-51`, `src/features/catalog/home/home-page/index.tsx:118-122`, `src/features/catalog/home/home-page/index.tsx:171-173`.
- O mesmo `HomeFilters` é usado no sidebar Desktop e dentro do `Sheet` Mobile.
- A responsabilidade, estado de preço, seleção de coleção/rede e callbacks são compartilhados; o container e a forma de abertura são diferentes.
- **Decisão:** manter `HomeFilters` compartilhado e preservar os hosts Desktop/Sheet separados.

### R-RESP-09 — Featured, promoções e blog — C

- **Arquivos:** `src/features/catalog/home/home-page/index.tsx:120-121`, `src/features/catalog/home/home-page/index.tsx:160-169`, `src/styles.css:3142-3200`, `src/styles.css:3378-3473`.
- `HomeFeatured`, promoções e blog são renderizados somente na árvore Desktop.
- O Mobile não contém uma adaptação equivalente no código atual.
- **Decisão:** manter Desktop-only. Não rebaixar a classificação para B sem referência Mobile ou requisito explícito.

## 6. Detalhe de NFT

### R-RESP-10 — NFT Detail Root — B

- **Arquivos:** `src/features/catalog/nft-detail/nft-detail-root/index.tsx:24-65`, `src/styles.css:3584-4192`.
- O domínio, favoritos, loading/erro de relacionados, descrição e resumo são compartilhados.
- O produto muda de grid Desktop para composição vertical Mobile, com sobreposição do summary e buy bar fixa.
- **Decisão:** compartilhar controlador e partes de domínio; preservar as variações de layout no nível das partes.

### R-RESP-11 — Gallery — B

- **Arquivo:** `src/features/catalog/nft-detail/nft-detail-gallery/index.tsx:17-48`.
- Desktop mostra thumbnails verticais, zoom e imagem principal.
- Mobile mostra controles de voltar/favorito e oculta thumbnails/zoom.
- **Decisão:** compartilhar imagem selecionada, favoritos e modal; manter controles Mobile e Desktop como regiões responsivas distintas.

### R-RESP-12 — Summary, ações e Buy Bar — B

- **Arquivos:** `src/features/catalog/nft-detail/nft-detail-summary/index.tsx:21-90`, `src/styles.css:3701-3861`, `src/styles.css:4007-4192`.
- Nome, preço, edições, quantidade, favoritos, disponibilidade e mutation de carrinho são comuns.
- Desktop usa stepper e grupo de ações no summary; Mobile oculta essas ações e renderiza uma buy bar fixa com quantidade e dois CTAs.
- **Decisão:** manter estado e regra no summary, com regiões de ação separadas.
- **Risco:** a quantidade aparece em dois controles que precisam continuar sincronizados; não extrair ou unificar sem preservar loading, indisponibilidade e destino (`/cart` versus `/checkout`).

### R-RESP-13 — Description — A / já compartilhado

- **Arquivo:** `src/features/catalog/nft-detail/nft-detail-description/index.tsx:7-19`.
- A mesma árvore é renderizada nos dois modos e apenas recebe ajustes de largura, overflow e tipografia por CSS.
- **Decisão:** manter uma única árvore.

### R-RESP-14 — Related — B

- **Arquivos:** `src/features/catalog/nft-detail/nft-detail-related/index.tsx:11-21`, `src/styles.css:3908-3972`, `src/styles.css:4189-4191`.
- Os links e dados dos cards são os mesmos; Desktop usa cinco colunas e Mobile usa duas colunas com dots.
- **Decisão:** compartilhar dados e card link; manter o grid/dots responsivos.

## 7. Carrinho, checkout e pedido

### R-RESP-15 — CartPage — B

- **Arquivos:** `src/features/cart/cart-page/index.tsx:19-145`, `src/styles.css:1501-1760`, `src/styles.css:2494-2618`.
- Query, mutations, cache otimista, cupom, cotação, realtime, linhas e resumo são compartilhados.
- Desktop usa tabela/grid e recomendações; Mobile usa cards empilhados, resumo em painel arredondado e oculta recomendações.
- **Decisão:** compartilhar controlador e dados; manter a composição de linha, resumo e recomendações responsiva.
- **Risco:** a linha Mobile reorganiza preço, total, stepper e remoção por posicionamento; mudanças devem ser avaliadas em ambos os modos.

### R-RESP-16 — Cart related — C no estado atual

- **Arquivos:** `src/features/cart/cart-page/index.tsx:133-141`, `src/styles.css:1719-1760`, `src/styles.css:2547-2549`.
- O bloco “Colecionadores também viram” existe no Desktop e é ocultado integralmente no Mobile.
- **Decisão:** tratar como Desktop-only até existir uma composição Mobile desenhada. Não forçar a grade de cinco cards dentro do Mobile.

### R-RESP-17 — CheckoutPage — B, com subpartes C

- **Arquivos:** `src/features/checkout/checkout-page/index.tsx:28-150`, `src/styles.css:1762-1983`, `src/styles.css:2619-2695`.
- A cotação, sessão, carteiras, realtime, idempotência, consentimento e submissão são compartilhados.
- Desktop mostra formulário completo à esquerda e resumo à direita.
- Mobile oculta `checkout-form`, reordena elementos do summary, reduz totais e empilha métodos de pagamento.
- **Decisão:** compartilhar controlador e estados; manter formulário Desktop e summary Mobile como subestruturas explícitas.
- **Risco:** o Mobile oculta campos do formulário inteiro. Qualquer ajuste deve validar que os dados necessários continuam vindo da sessão/estado e que o botão permanece acessível e submetível.

### R-RESP-18 — OrderPage — B

- **Arquivos:** `src/features/orders/order-page/index.tsx:16-204`, `src/styles.css:1985-2127`, `src/styles.css:2697-2719`.
- Loading, erro, pending, declined, realtime e confirmação são comuns.
- Desktop usa modal estreito sobre scrim; Mobile amplia o modal, aplica radius e reorganiza metadados em duas colunas.
- **Decisão:** compartilhar estados e recibo; manter apenas as regras de layout responsivo existentes.

## 8. Autenticação e conta

### R-RESP-19 — AuthPage Login/Register — B

- **Arquivos:** `src/features/auth/auth-page/index.tsx:15-82`, `src/styles.css:1285-1499`.
- Estado de login/registro, validações, mutation e navegação são compartilhados.
- Desktop usa card/modal sobre background do marketplace, tabs e botão de fechamento.
- Mobile usa tela sem card, logo própria, sem tabs/close e campos/botões maiores.
- **Decisão:** manter `AuthPage` e suas regras compartilhadas; preservar as variantes visuais de shell, tabs e logo.
- **Não fazer:** não transformar login e registro em uma árvore única cheia de condicionais além do modo já existente.

### R-RESP-20 — AccountShell e Sidebar — B

- **Arquivos:** `src/features/account/account-shell/index.tsx:23-28`, `src/features/account/account-sidebar/index.tsx:14-25`, `src/styles.css:2321-2492`, `src/styles.css:2720-2743`.
- Desktop usa duas colunas com sidebar de `310px`; Mobile usa coluna única e navegação em duas colunas.
- O conteúdo de perfil/carteiras entra por `children`, e logout/session permanecem compartilhados.
- **Decisão:** compartilhar shell e children; preservar o reflow da sidebar sem criar outra implementação de conta.

### R-RESP-21 — Profile e Wallets — B / já compartilhados estruturalmente

- **Arquivos:** `src/features/account/profile-page/index.tsx:12-58`, `src/features/account/wallets-page/index.tsx:41-93`, `src/styles.css:2390-2743`.
- As páginas usam as mesmas árvores em ambos os modos; grids de campos passam de duas colunas para uma.
- **Decisão:** manter uma árvore e CSS responsivo. `WalletFields` já é a parte comum correta entre carteira principal/secundária.

## 9. Matriz consolidada

| Área | Desktop | Mobile | Classe | Decisão |
| --- | --- | --- | --- | --- |
| Shell | `DesktopLayout` com header/footer | `MobileLayout` com TabBar | C | Manter shells separados |
| Header/navegação | `MarketplaceHeader` | `TabBar` | C | Manter implementações distintas |
| Footer | Footer editorial completo | Ausente | C | Desktop-only |
| Home catálogo | Sidebar, toolbar, 9 cards, paginação | Busca, Sheet, tabs, 4 cards em colunas | B | Compartilhar dados/lógica, manter views |
| Home Hero | Copy longa, imagem, botão | Copy curta, máscara, imagens, dots | C | Manter views |
| NFT Card | Card visual | Card visual | A | Candidato a árvore compartilhada com skin |
| Home filtros | Sidebar | Sheet | B | Compartilhar `HomeFilters` |
| Featured/promos/blog | Presente | Ausente | C | Não criar equivalente sem referência |
| NFT Detail | Grid gallery + summary | Stack, overlay, buy bar | B | Compartilhar domínio, manter partes |
| Gallery | Thumbnails/zoom | Controls mobile | B | Compartilhar estado, separar controles |
| Summary/Buy Bar | Ações no summary | Buy bar fixa | B | Compartilhar estado, manter regiões |
| Description | Mesma árvore | Mesma árvore | A | Manter compartilhado |
| Related | 5 colunas | 2 colunas + dots | B | Compartilhar cards/dados |
| Cart | Tabela + recomendações | Cards + resumo; sem related | B/C | Página B; related C no estado atual |
| Checkout | Formulário + resumo lateral | Summary reordenado, form oculto | B/C | Página B; subárvores distintas |
| Order | Modal sobre scrim | Modal adaptado | B | Compartilhar estado/recibo |
| Auth | Card/modal, tabs | Tela inteira, logo | B | Compartilhar controlador, preservar skin |
| Account | Sidebar + conteúdo | Sidebar refluída + conteúdo | B | Manter shell compartilhado |
| Profile/Wallets | Form grids | Form single-column | B | Uma árvore com CSS responsivo |

## 10. Recomendações sem execução

1. Priorizar qualquer refatoração futura em `NftCard`, que é o único caso A claro entre árvores Desktop/Mobile.
2. Não unificar `HomeHero`, shells, header/TabBar, footer ou regiões de compra do detalhe; são casos C ou B com diferença estrutural real.
3. Se `HomePage`, `CartPage` ou `CheckoutPage` crescerem, extrair controladores/partes privadas sem apagar as views responsivas.
4. Validar o intervalo `640px`–`1023px` separadamente: ele combina shell Mobile com algumas views de conteúdo Desktop.
5. Usar os frames Figma como critério para qualquer decisão de mover um bloco Desktop-only para Mobile.

## 11. Validação

- Nenhum arquivo de aplicação foi alterado nesta auditoria.
- A validação solicitada é `git diff --check`; não foram executados testes, typecheck, lint, build ou Playwright nesta etapa.
