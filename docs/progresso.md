# Progresso — migração das páginas para Tailwind e fidelidade ao Figma

Ordem: preparação → Início → Detalhes do NFT → Carrinho → Pagamento → Confirmação de Pedido → Login → Cadastro → Perfil do Colecionador → Carteiras.
Ao retomar, continue da primeira etapa não concluída. Pausas obrigatórias depois de Início e de Pagamento.

Método de contagem: `wc -l src/css/styles.css` e classes distintas que aparecem em seletores (comentários removidos, regras `@` ignoradas no início do seletor).

| Etapa | Situação | Linhas antes → depois | Classes antes → depois | Commit |
| --- | --- | --- | --- | --- |
| Preparação (Badge + tipografia) | concluída | 3.574 → 3.031 | 308 → 203 | ver git log |
| Início | concluída (ressalvas restantes: preço das linhas 1 e 3, paginação) | 3.031 → 2.323 | 203 → 137 | ver git log |
| Detalhes do NFT | concluída | 2.323 → 1.709 | 137 → 97 | ver git log |
| Carrinho | concluída (visual do usuário mantido; diferenças do Figma listadas abaixo) | 1.709 → 1.328 | 97 → 68 | ver git log |
| Pagamento | concluída | 1.328 → 973 | 68 → 45 | ver git log |
| Confirmação de Pedido | pendente | | | |
| Login | pendente | | | |
| Cadastro | pendente | | | |
| Perfil do Colecionador | pendente | | | |
| Carteiras | pendente | | | |

## Preparação

- Badge: `rounded-[4px]`, `rounded-[6px]`, `rounded-[8px]` e `min-w-[68px]` viraram `rounded-4`, `rounded-6`, `rounded-8` (tokens) e `min-w-17` (4,25rem).
- 30 estilos compostos de tipografia viraram tokens de texto no `@theme` (decisão em `ARCHITECTURE.md`); 76 classes `.figma-*` sem uso removidas.
- Snapshot de estilos computados (9 telas × 1440/390): 0 diferenças.

## Início

- Lógica fora dos componentes: estado da URL e busca com debounce em `features/catalog/hooks/use-catalog-search`; padrões de busca, número de páginas e rótulo de ETH ("0,02") como funções puras em `features/catalog/lib`. A página só compõe.
- Uma versão no DOM: catálogo, abas, cards e paginação são um único grid responsivo. Só o hero (textos e composição diferentes no Figma) e a sidebar de filtros (vira drawer abaixo de `lg`) escolhem a versão por `useMediaQuery` (`shared/hooks/use-media-query`), e a outra não é renderizada.
- Filtros vêm dos facets de `GET /api/nfts` (MSW); rótulos e contagens saíram do componente.
- CSS: 61 classes `home-*` removidas, mais 4 classes que já não eram usadas antes (`catalog-filters-sidebar`, `catalog-layout`, `catalog-main`) e `.text-right` (duplicava o utilitário do Tailwind). `account-select-like` foi removida por engano pelo script e restaurada.
- Ainda restam `home-product-card-*` e `home-rare-badge`: são do card antigo usado em "Você também pode gostar" do carrinho e saem na etapa do Carrinho.
- Medidas em `docs/figma-medidas.md` (seção Início).
- Snapshot de estilos computados das outras 8 telas (1440 e 390) contra o início da sessão: carrinho, pagamento, perfil, carteiras e recibo com 0 diferenças; detalhe muda só a largura do valor "Coleção" (dado novo: "Arte digital" no lugar de "Kurio Apes"); login e cadastro mudam só dentro do fundo decorativo, que reutiliza o hero da Início (em 390 esse fundo é `display: none` antes e depois).
- Specs com `--project=chromium-desktop` e `--project=chromium-mobile` (os projetos se chamam assim no `playwright.config.ts`): `foundation`, `home-visual`, `phase7-marketplace`, `phase2-layout`, `phase12-accessibility` → 36 passaram, 2 pulados por regra do próprio teste. `visual-regression` falha em home (mudança intencional) e em detalhe, carrinho e pagamento (baselines anteriores à Fase 2); regeneração fica para a Fase 4, por decisão do usuário.
- Testes: seletores por classe trocados por papel/nome (`list` "NFTs do catálogo", `status`), e o filtro de coleção usa "Fotografia" no lugar de "Coleção 01", que deixou de existir nas fixtures. As asserções são as mesmas.

### Ressalvas

- ~~Hero desktop 8px acima e ~30px à esquerda~~ — resolvido em `fix: home caveats` (todas as linhas de tinta a ≤1px).
- Preço dos cards nas linhas 1 e 3: −3px e +3px. O Figma não é consistente (nome→preço é 28px na linha 1 e 22px nas linhas 2 e 3); 2 tentativas.
- ~~Abas no mobile +18px/−8px~~ — resolvido em `fix: home caveats`: espaço 0 entre as duas primeiras e 14px antes de "Em alta", como no frame; sublinhado na posição e largura do frame. "Novos lançamentos" fica 4px mais largo (largura do texto renderizado, mesma posição).
- Paginação: o app mostra "1 2 3 4 … 32 >" (32 páginas reais); o Figma mostra "1 2 3 4 >". Os botões medem 35×35 como no Figma; o bloco fica 13px mais largo à esquerda.
- ~~Slider 3px mais largo~~ — resolvido em `fix: home caveats` (258×21, 0px).
- Mobile: o conteúdo fica 14px acima do frame, porque o frame tem a área da barra de status do aparelho acima da busca. As medidas abaixo descontam esse deslocamento.

### fix: home caveats

- Hero desktop: +8px no topo (com −8px embaixo, para o catálogo não descer), 40px de recuo do texto como no frame e pontos em x=720. Linhas de tinta: Figma 146, 189, 259, 318, 342, 366, 416, 500; app 146, 188, 258, 318, 342, 366, 416, 500. Imagem 870,101 450×450 nas duas.
- Abas mobile e slider ajustados (medidas em `docs/figma-medidas.md`).
- Paginação: o frame mostra 9 cards por página (grade 3×3); a API já usa `pageSize: 9`, sem mudança.
- Coração: existe no frame mobile (1º card, círculo de 28px a 12px do topo e 10px da direita da moldura). Virou o botão de favorito do card no mobile, com `aria-pressed` e rótulo, usando o novo hook `useFavorite` (favorites/index.ts): atualização otimista com rollback; visitante vai para o login. Medida: 161,355 28×28 nas duas imagens.
- Specs `foundation`, `home-visual`, `phase7-marketplace`, `phase2-layout`, `phase12-accessibility` e `phase6-auth` (favoritos) em chromium-desktop e chromium-mobile: 48 passaram, 2 pulados pela regra do próprio teste.

## Detalhes do NFT

- Lógica fora dos componentes: `useNftPurchase` (edição, quantidade limitada ao estoque, envio ao carrinho), `useFavorite` (favorito otimista com rollback, compartilhado com o card da Início) e `useNftAnnouncement` (aviso ao vivo). Regras puras em `features/catalog/lib/nft-detail`: edição inicial, edição esgotada, limite de quantidade, frase do aviso e estrelas da nota.
- Uma versão no DOM: o frame mobile tem outra estrutura (barra do topo, folha sobre a imagem e barra de compra fixa), então a página escolhe `Desktop` ou `Mobile` por `useMediaQuery`; as duas usam os mesmos hooks. O preço aparece uma vez no DOM.
- Dados que estavam fixos nos componentes (edições, atributos, ID do token, nota, número de avaliações, texto longo, contrato e direitos autorais) passaram para as fixtures/MSW. `soldOutEditions` marca edições esgotadas (Cosmic Bloom #118, edição 1/1), e o MSW recusa essa edição no carrinho (409).
- Estados: skeleton com as mesmas caixas do conteúdo (shimmer, `motion-reduce:animate-none` já no `Skeleton`), NFT inexistente com título e link para o catálogo, erro de rede com "Tentar novamente", recomendações com skeleton e erro próprio. Acesso direto pela URL coberto pelo spec `foundation`.
- `nft.updated`: o socket invalida a query, o REST traz a versão nova e `useNftAnnouncement` anuncia em `role="status"` (ex.: "Emerald Ape #042: preço atualizado para 0.125 ETH."). Conferido no navegador, assim como a edição esgotada desabilitada e o rollback do favorito (`aria-pressed` false → true → false com o cenário `favorites-error`).
- Assets do Figma: estrela, lupa, LinkedIn, mensagem, Twitter, carrinho e o botão "voltar" completo (`back.svg`). Os ícones de − e + do seletor e o coração do favorito são do lucide (não há asset no export).
- CSS: 40 classes `nft-detail-*` removidas. `CarouselDots` (usado só aqui) passou a ter pontos de 12px a cada 20px, como no frame.
- Snapshot de estilos computados das outras 8 telas (1440 e 390), comparando um build de HEAD + mudanças não commitadas do usuário (worktree temporária) com o estado final: **0 diferenças**.
- Specs com `--project=chromium-desktop` e `--project=chromium-mobile`: `foundation`, `phase6-auth`, `phase7-resilience`, `phase8-details-profile`, `phase11-states`, `phase12-accessibility`, `phase13-e2e-complete` → 88 passaram. Duas falhas na primeira rodada foram corrigidas sem mexer nos testes: o botão de favorito voltou a ter `data-favorite-trigger`, e a edição esgotada saiu do `nft-2` (o teste de merge adiciona `nft-2` 1/1) para o `nft-4`.
- Testes: seletores por classe trocados por `getByTestId('nft-price')`, `getByRole('status', { name: 'Quantidade' })`, `aria-pressed` da miniatura e `heading` nível 1. As asserções são as mesmas.

### Ressalvas

- ~~Descrição mobile 24px abaixo~~ — resolvido em `fix: detail caveats`: `shortDescription` (texto do frame mobile) nas fixtures; o desktop usa `description` (texto do frame desktop). Blocos abaixo da descrição: −0…+2px.
- "Coleção: Kurio Apes" no frame; no app, "Arte digital", porque as fixtures seguem as coleções do painel da Início (decisão anterior do usuário).
- Miniatura selecionada: o frame destaca a 2ª; o app começa na 1ª (a imagem principal é a da miniatura escolhida).
- Edições no frame mobile: "1/10, 1/10, 1/50, ABERTA" (repetição no frame); o app mostra as edições do NFT ("1/1, 1/10, 1/50, ABERTA"), como no desktop.
- Seção "Detalhes do NFT" no frame: o texto de "Contrato" e o de "Direitos autorais" estão trocados entre si; o app mantém cada texto no rótulo certo.

### fix: detail caveats

- `useMediaQuery`: o app monta com `createRoot` (sem SSR/hidratação) e `useSyncExternalStore` chama `window.matchMedia` no primeiro render, então a primeira pintura já é a versão certa. Conferido no navegador com um `MutationObserver` desde o primeiro nó do DOM: a versão errada (trilha do desktop em 390; botão "voltar" do mobile em 1440) apareceu 0 vezes.
- CLS: a medição mostrou 0,16 em 1440, vindo do footer, que aparecia no meio da tela durante o skeleton e era empurrado quando o conteúdo chegava. O skeleton passou a reservar também os blocos de "Detalhes do NFT" e "Mais desta coleção": o footer fica em y=1612 no skeleton e com o conteúdo, e o CLS é 0 em 1440 e em 390.
- Descrição: `shortDescription` (mobile) e `description` (desktop) nas fixtures, cada uma com o texto do seu frame. Mobile: Edição 548 (=), edições 572 (+2), ID 615 (+1), Coleção 647 (+1), Atributos 677 (+1). Desktop sem mudança (3 linhas, como no frame). Chave do banco mock: `v4`.
- README: seção "Edições esgotadas nas fixtures" (`nft-4` 1/1), com o motivo de nenhum spec usar essa edição e como conferir à mão. A resposta 409 e o botão desabilitado foram conferidos no navegador.
- Testes E2E não rodados nesta etapa, conforme o `AGENTS.md` atualizado (o usuário pede no final). Typecheck e lint passaram.

## Carrinho

Base: as versões do usuário de `cart-page/index.tsx` e `cart-page/cart-summary/index.tsx` (commit `9839c8e`). O visual dessas versões foi mantido; as diferenças em relação ao Figma estão listadas abaixo, sem reverter, como pedido.

- Lógica fora dos componentes: `useCartLines` (linhas, quantidade e remoção otimistas com rollback), `useCartQuote` (cotação, cupom aplicado só depois que a API aceita, cupom guardado por usuário) e `useCartLiveNotice` (aviso do `nft.updated`). Funções puras em `features/cart/lib/cart-line`: total da linha em wei, limite de quantidade por edição e chave da linha. A página só compõe.
- `createQuote` saiu de `features/cart/api` para `shared/api/quote`, porque carrinho e pagamento usam a mesma chamada; o carrinho continua usando `cartOptions` de `shared/api/cart`. O catálogo ganhou `features/catalog/index.ts` (API pública: `catalogOptions`, `CatalogCard`, `withCatalogDefaults`).
- Um único `<h1>`: o mesmo elemento muda de posição e tamanho por breakpoint (no mobile fica no cabeçalho com o botão de voltar; a partir de `sm`, abaixo da trilha).
- Visitante vê o resumo: o MSW passou a cotar sem sessão (o pedido continua exigindo login). "Conectar e finalizar" leva o visitante ao login e volta para o pagamento.
- Quantidade: o estoque do NFT é compartilhado entre edições. O MSW soma as edições do mesmo NFT no `POST` e no `PATCH`, recusa edição esgotada, e o `DELETE` remove só a edição pedida (`?editionId=`). No cliente, o seletor de cada linha vai até o que sobra depois das outras edições.
- Cupom: `INVALIDO` → "Cupom inválido"; `KURIO5` → "Este cupom expirou" (cupom vencido, `409 COUPON_EXPIRED`); `KURIO10` → 10% de desconto. A mensagem vem da API e fica associada ao campo (`aria-describedby` do `Input`). "Remover cupom" volta à cotação sem desconto.
- Skeleton: os valores do resumo ficam com a mesma altura enquanto a cotação carrega (24px, e 52px na taxa com a nota "Taxa estimada"); "Calculando resumo..." passou a ser só para leitores de tela, para não empurrar o resumo. O skeleton da página segue as caixas da página carregada.
- `nft.updated`: aviso em `role="status"` com `aria-live` e o resumo recalculado.
- "Colecionadores também viram" usa o `CatalogCard` da Início. `product-card` e `nft-card` foram apagados (não tinham mais uso), e com eles `home-product-card-*` e `home-rare-badge`.
- Conferido no navegador: visitante com resumo (total 1.706 ETH com Sage Nomad 1/1), um único `<h1>`, as três respostas de cupom, remoção do cupom, persistência após refresh, aviso do `nft.updated` com novo total, estoque somado entre edições (2+2 de 4 bloqueia a terceira, `PATCH` para 3 recusado) e remoção de uma edição só.
- Snapshot de estilos computados contra a versão do usuário (1440 e 414, logado): diferenças visíveis só na fileira "Colecionadores também viram" (card novo, 300 → 352px de altura). O resto é invisível (propriedades de grid em elementos que não são grid no mobile, cor de borda de bordas com 0px, `start`/`flex-start`, e dois `<p>` novos: aviso ao vivo vazio e status só para leitores de tela).
- Testes: locators por classe trocados por papel (`list` "Itens do carrinho" → `listitem`, `region` "Colecionadores também viram", `status`) e `data-testid` (`cart-totals`, `cart-line-price`); asserções iguais. **Não rodados**, conforme o `AGENTS.md` atualizado.
- CSS: 27 classes removidas (`cart-*`, `home-product-card-*`, `home-rare-badge`). `.cart-empty` continua porque o pagamento ainda usa; sai na etapa do Pagamento.

### Diferenças da versão do usuário em relação ao Figma (acima de 2px, não revertidas)

Desktop (1440):

| Bloco | Figma | App | Diferença |
| --- | --- | --- | --- |
| trilha | 121,103 | 121,99 | y −4 |
| título "Carrinho de NFTs" | não existe no frame (a trilha vai direto para a tabela) | 48,80 da caixa de conteúdo, 28px | elemento a mais; a tabela e o resumo descem |
| linha 1 | 120,169 782×70 | 120,165 790×77 | y −4, w +8, h +7 |
| seletor de quantidade | pílulas laranja pequenas (− 2 +) | caixa com borda, botões quadrados | estilo diferente |
| resumo | sem fundo, título com linha embaixo | painel com fundo `surface-card` e 24px de padding | conteúdo deslocado ~24px para dentro |
| cupom | 988,183 332×62 | 988,205 332×45 | y +22, h −17 |
| subtotal (linha) | 989,271 330 de largura | 1012,279 | x +23, y +8 |
| total | 988,407 | 1012,407 | x +24 |
| "Conectar e finalizar" | 988,445 332×40, texto centralizado | 988,440 332×50, seta à direita | y −5, h +10 |
| "Continuar explorando" | 1064,501, centralizado na coluna | centralizado no painel | x −52 |
| "Colecionadores também viram" | título em y 615, cards em 673 | cards em 759 | y +86 (por causa do título a mais e do painel) |
| cards relacionados | 219×272, nome e preço abaixo da moldura | card da Início 230×352 | proporção diferente |

Mobile (414, logado):

| Bloco | Figma | App | Diferença |
| --- | --- | --- | --- |
| voltar | 28,32 35×35 | 28,50 36×25 (ícone) | y +18 |
| título | 124,42 | 111,61 | x −13, y +19 |
| linha 1 | 28,88 358×102 | 28,85 372×115 | y −3, w +14, h +13 |
| linha (conteúdo) | "Edição: 1/50", preço unitário, lixeira sobre o seletor | "ID do token", total da linha, lixeira no canto | conteúdo diferente |
| resumo | sem título "Resumo da carteira", sem "Continuar explorando" | com os dois | elementos a mais |
| cupom | 24,578 366×52 (pílula) | 28,570 358×56 | x +4, y −8 |
| subtotal | 25,642 | 28,650 | y +8 |
| total | 24,754 | 27,763 | y +9 |
| "Conectar e finalizar" | 24,800 366×60 | 28,805 358×60 | x +4, y +5, w −8 |

## Pagamento

- Lógica em `features/checkout/hooks`: `useCheckoutData` (sessão, carrinho, carteiras, perfil e cotação; sessão expirada leva ao login), `useCheckoutForm` (valores, validação e erros da API por campo), `useWalletConnection` (conexão simulada: conectar, recusar, desconectar), `usePlaceOrder` (revisão, revalidação, envio único com `Idempotency-Key`, recuperação após timeout), `usePendingOrder` (pedido criado com a chave guardada → vai para o pedido após refresh) e `useCheckoutLive` (`nft.updated`). Regras puras em `features/checkout/lib`: formulário e validação, comparação de cotações e descrição das mudanças, total da linha em wei. A página só compõe.
- Desktop e mobile têm estruturas diferentes nos frames (formulário completo × carteiras cadastradas e métodos), então a página escolhe a versão por `useMediaQuery`; as duas usam os mesmos hooks.
- Componentes: `WalletSelector` (cartões das carteiras e métodos no mobile), `RadioGroup` (métodos no desktop; ganhou `className`/`optionClassName`, só adição) e `Label` (rótulos dos campos). Os três passaram a ser exportados pelo barrel `@/components`. O `Input` do projeto não aceita o estilo do frame (o `className` substitui as classes dele), então os campos do pagamento usam um `TextField` local com `Label`, erro associado por `aria-describedby` e `aria-invalid`.
- Validação: a mesma regra no formulário e no MSW (`collectorSchema` em `src/contracts`), mais os obrigatórios do layout desktop (rede, tipo de carteira e código de indicação, com asterisco no frame). A API ainda recusa código de indicação inexistente (só `KURIO-2026` existe) e devolve `422` com `fields`; o erro aparece no campo.
- Carteira: o MSW ganhou `GET /api/wallets/connection`, `POST /api/wallets/:id/connect` (o cenário `wallet-rejected` recusa) e `POST /api/wallets/:id/disconnect`. Ao abrir, a carteira escolhida é conectada com o método destacado no frame (Coinbase Wallet); trocar de método ou de carteira reconecta; "Desconectar" desliga. O pedido exige carteira conectada (`409 WALLET_NOT_CONNECTED`).
- Revisão antes do envio: "Confirmar compra" valida o formulário, revalida a cotação e abre o diálogo "Revise sua compra". Qualquer diferença (preço, disponibilidade, desconto, taxa, total) aparece listada e o envio exige novo clique em "Enviar pedido"; um `nft.updated` com a revisão aberta revalida de novo; `QUOTE_STALE` da API também revalida.
- Conferido no navegador: conexão automática; erro de campo do layout; erro da API no campo; recusa da carteira com "Confirmar compra" desabilitado; desconexão; revisão com "Emerald Ape #042: preço de 1.19 para 0.125 ETH | total de 26.846 para 24.716 ETH"; **cinco cliques em "Enviar pedido" → 1 pedido no banco**; **timeout → mesmo pedido recuperado pela chave**; **refresh com pedido criado → vai para o pedido**.
- Dois bugs encontrados e corrigidos na conferência: (1) com o método recusado, o rádio voltava para o método anterior; (2) a checagem de pedido pendente reagia à chave recém-criada e remontava o formulário, apagando o que tinha sido digitado.
- CSS: classes `checkout-*` e `cart-empty` removidas (`checkout-skeleton` e `checkout-error` continuam porque pedido, perfil e carteiras ainda usam).
- Snapshot de estilos computados das outras telas (Início, Detalhe, Login, Cadastro, Perfil, Carteiras, Recibo; 1440 e 390) contra o estado anterior ao Carrinho: 0 diferenças, exceto o detalhe mobile, que muda pela `shortDescription` (`fix: detail caveats`, já commitado).
- Testes (não rodados, conforme o `AGENTS.md`): novo helper `placeOrder` em `tests/e2e/test.ts` (espera a conexão, preenche o código de indicação no desktop, confirma e envia na revisão). O passo do checkbox de consentimento foi trocado pela revisão em todos os specs. Em `phase9` ("mudança de preço exige nova confirmação" e "conflito de cotação"), a asserção "botão desabilitado" virou "a mudança aparece na revisão e o pedido só sai com novo clique / nenhum pedido foi criado"; no `phase7-resilience`, o corpo do pedido passou a levar `collector`.

### Medidas (Figma × app)

Desktop (1440), linhas de tinta:

| Bloco | Figma (y) | App (y) | Δ |
| --- | --- | --- | ---: |
| trilha | 103–118 | 103–118 | 0 |
| "Perfil do colecionador" | 150 | 150 | 0 |
| rótulos das 5 linhas | 184, 265, 346, 427, 508 | 185, 266, 347, 428, 509 | +1 |
| campos das 5 linhas | 206, 287, 368, 449, 530 | 206, 287, 368, 449, 530 | 0 |
| "Usar outra carteira?" | 594 | 594 | 0 |
| observação (rótulo / campo) | 639 / 665–816 | 637 / 663–814 | −2 |
| "Seus NFTs" / cabeçalho / linha | 151 / 179 / 204 | 151 / 179 / 205 | ≤1 |
| itens | 217, 299, 381 (70 de altura) | 218, 300, 382 (70) | +1 |
| promoção / subtotal / desconto / taxa | 465 / 495 / 527 / 559 | 465 / 495 / 527 / 559 | 0 |
| "Taxa estimada" / linha / Total | 591 / 614 / 629 | 591 / 614 / 631 | ≤2 |
| "Carteira e rede" | 657 | 657 | 0 |
| métodos | 691, 752, 813 (45 de altura) | 691, 752, 813 (45) | 0 |
| "Confirmar compra" | 882–926 | 882–926 | 0 |
| campo ".eth" | 513,530 79×40 | 513,530 78×40 | −1 |

Mobile (414×896), linhas de tinta: voltar 32→31, título 42 (x 88→89), "Carteira conectada"/"Trocar carteira" 94=94, cartões 124–216 e 237–329 iguais, "Carteira e rede" 348=348, métodos 378/459/540 iguais, Total 623=623, botão 804–863 igual. O valor do total difere do frame (26.846 × 8.936 ETH) porque o carrinho da fixture é outro.
