# Progresso — migração das páginas para Tailwind e fidelidade ao Figma

Ordem: preparação → Início → Detalhes do NFT → Carrinho → Pagamento → Confirmação de Pedido → Login → Cadastro → Perfil do Colecionador → Carteiras.
Ao retomar, continue da primeira etapa não concluída. Pausas obrigatórias depois de Início e de Pagamento.

Método de contagem: `wc -l src/css/styles.css` e classes distintas que aparecem em seletores (comentários removidos, regras `@` ignoradas no início do seletor).

| Etapa | Situação | Linhas antes → depois | Classes antes → depois | Commit |
| --- | --- | --- | --- | --- |
| Preparação (Badge + tipografia) | concluída | 3.574 → 3.031 | 308 → 203 | ver git log |
| Início | concluída (ressalvas restantes: preço das linhas 1 e 3, paginação) | 3.031 → 2.323 | 203 → 137 | ver git log |
| Detalhes do NFT | concluída (ressalvas: textos divergentes entre os frames) | 2.323 → 1.709 | 137 → 97 | ver git log |
| Carrinho | pendente | | | |
| Pagamento | pendente | | | |
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

- Mobile: o texto "Sobre este NFT" é diferente nos dois frames (o desktop tem "com arte desbloqueável e acesso para colecionadores", o mobile não). O app usa um texto só; no mobile ele quebra em 4 linhas em vez de 3, e tudo abaixo da descrição desce 24px. Os espaçamentos entre os blocos seguem o frame.
- "Coleção: Kurio Apes" no frame; no app, "Arte digital", porque as fixtures seguem as coleções do painel da Início (decisão anterior do usuário).
- Miniatura selecionada: o frame destaca a 2ª; o app começa na 1ª (a imagem principal é a da miniatura escolhida).
- Edições no frame mobile: "1/10, 1/10, 1/50, ABERTA" (repetição no frame); o app mostra as edições do NFT ("1/1, 1/10, 1/50, ABERTA"), como no desktop.
- Seção "Detalhes do NFT" no frame: o texto de "Contrato" e o de "Direitos autorais" estão trocados entre si; o app mantém cada texto no rótulo certo.
