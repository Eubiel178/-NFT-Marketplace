# Arquitetura, decisões e limitações

Documento da solução entregue. Requisitos normativos no [README](README.md) (§1–§12), instruções de execução, cenários e endpoints de mock no README (§13), contratos em [docs/CONTRACTS.md](docs/CONTRACTS.md), progresso por tela em [docs/progresso.md](docs/progresso.md) e auditoria dos requisitos em [docs/eliminatorios.md](docs/eliminatorios.md).

## Organização

- `src/app`: bootstrap da aplicação (`render.tsx`), rotas (`router.tsx`, com guard das rotas privadas), layout e `session-expiry` (tratamento global de sessão expirada).
- `src/routes` e `src/shared` do `AGENTS.md` não existem como pastas: as rotas ficam em `app/router.tsx` e o código compartilhado em `src/shared` (hooks, API de sessão, carrinho e cotação), `src/lib` (Axios, ambiente, QueryClient, ETH, armazenamento por usuário) e `src/components`.
- `src/components`: componentes de UI (shadcn/ui com Radix e CVA, mais componentes próprios) e layout (header, footer, tab bar), com barrel em `src/components/index.ts`.
- `src/contracts`: esquemas Zod dos contratos de transporte, compartilhados por cliente e mocks.
- `src/features/<nome>`: `account`, `auth`, `cart`, `catalog`, `checkout`, `favorites`, `orders`; cada uma com `api/`, `hooks/`, `lib/` (regras puras) e componentes, e `index.ts` como API pública.
- `src/realtime`: cliente Socket.IO, assinaturas e reconciliação com REST.
- `src/mocks`: fixtures, banco persistido, cenários, handlers REST e servidor Socket.IO simulado; importado só no bootstrap. Nenhuma resposta fictícia no cliente HTTP, nos hooks ou nos componentes.
- `tests/e2e`: specs Playwright; `scripts`: auditoria Lighthouse; `public/mockServiceWorker.js`: worker gerado, necessário também no deploy.

## Cache, retries e sincronização

**Política** (`src/lib/query.ts`)

- Dados frescos por 30 s (`staleTime`) e coletados após 5 min sem uso (`gcTime`); reconsulta ao voltar o foco da janela e na (re)conexão do socket.
- Queries repetem uma vez, apenas em falha de rede ou 5xx; nunca em 4xx. Mutations não têm retry automático, para nunca duplicar uma operação; o pedido se recupera pela chave de idempotência.
- A sessão tem `staleTime` 0 e sem retry. A consulta de pedidos pendentes ao abrir o pagamento é sempre relida (`staleTime` 0, `gcTime` 0, `refetchOnMount: 'always'`).
- As chaves públicas levam todos os parâmetros (`['nfts','list',search]`, `['nfts','detail',id]`). As privadas levam o usuário: `cart`, `favorites`, `profile`, `wallets`, `orders`, pedidos pendentes, conexão da carteira e cotações. O cache de uma sessão nunca atende outra.
- Logout e troca de usuário cancelam as queries, encerram as assinaturas privadas, apagam o cupom e a chave de idempotência guardados e limpam o cache antes de trocar a identidade.

**Respostas obsoletas.** O `AbortSignal` do Query é repassado ao Axios em todas as consultas. Como a chave inclui os parâmetros, mudar busca, filtro, ordenação ou página abandona a consulta anterior (que o Query cancela) e a resposta atrasada nunca ocupa a tela. Coberto por `phase17` (`variable-latency`: página 3 lenta pedida antes da 4 rápida; a tela fica na 4 depois do atraso).

**Atualização otimista com rollback.**

| Interação | Hook |
| --- | --- |
| Favoritar | `useFavorite` (`onMutate` guarda o anterior e `onError` o restaura) |
| Quantidade e remoção no carrinho | `useCartLines` |
| Trocar a carteira principal | `useSetPrimaryWallet` |

Todas cancelam as consultas da mesma chave antes de escrever no cache.

**Sincronização REST × Socket.IO.** Eventos só invalidam queries: o payload nunca é copiado para o cache e o REST é a fonte da verdade.

- `nft.updated` invalida catálogo, detalhe, carrinho e cotações. O cliente valida o NFT e aceita só versões mais novas que a última vista no socket e no cache (duplicata e evento antigo não têm efeito).
- `order.updated` só vale para pedidos assinados nesta sessão, do usuário que assinou (a assinatura privada leva `userId` e `orderId` e o mock só entrega ao socket inscrito), e invalida o pedido.
- Na reconexão, o cliente reconcilia catálogo, carrinho, cotações e pedidos assinados por REST. Pedidos confirmados e recusados são terminais.
- **Inicialização.** O `socket.io-client` captura o `WebSocket` ao ser avaliado, então o MSW precisa estar ativo antes. `main.tsx` inicia o worker e só então importa dinamicamente `app/render`, que chama `startRealtime()` antes de montar o React (um socket por aba, vivo enquanto a aba existir). A função de cleanup que `startRealtime()` devolve não é usada. Os listeners de NFT e as assinaturas de pedido têm cleanup nos hooks.

O catálogo mantém busca, filtros combináveis, ordenação e paginação no estado da URL; a busca digitada aguarda 300 ms antes de consultar o mesmo `GET /api/nfts`. O filtro de preço usa a faixa visível no Figma (`0` a `2.29` ETH) e só aplica a alteração ao pressionar `Aplicar`. Em mobile a paginação aparece centralizada, com o mesmo padrão do desktop (desvio do frame, que não a desenha: o README exige paginação); em tablet os filtros usam o drawer previsto em `docs/figma/responsive.md`.

## Sessão, carrinho e dinheiro

O endpoint de sessão retorna visitante ou a conta autenticada persistida no mock. Cadastro e login usam Axios/MSW, guardas preservam o destino e distinguem visitante de sessão expirada. Usuários de fixture e novos cadastros armazenam somente hash SHA-256 com salt; a resposta pública remove os campos secretos. Login faz merge por NFT/edição do carrinho visitante, e logout limpa o cache do TanStack Query antes de trocar para visitante. `POST /api/__mock/session/expire` permite reproduzir expiração sem expor uma ação de produto.

Carrinho é persistido na DB mock, com identificador de visitante e merge por NFT/edição ao login. Cotação é a autoridade de preço e taxas: cada resposta fica registrada por `quoteId` para revalidar preço, disponibilidade, cupom e itens antes do pedido. Helpers convertem strings ETH para wei usando BigInt (sem float). A chave de idempotência fica no localStorage durante a tentativa e no mock até o reset; o pedido guarda snapshot de preço, nome e imagem, transições terminais e recuperação por chave. Recusa mantém o carrinho; confirmação remove somente os itens e quantidades do snapshot comprado.

## Persistência e cenários

Atualmente a DB local versionada contém catálogo, usuários, sessão, carrinhos, favoritos, perfil, carteiras, cotações, pedidos e chaves de idempotência. `POST /api/__mock/reset` restaura todos os dados e o cenário; recarregar encerra conexões e mantém a sessão do modo demo. Eventos `nft.updated` invalidam catálogo, carrinho e cotações ativas; `order.updated` é emitido pelo transporte Socket.IO mockado, com endpoints de teste para duplicatas, versões antigas e queda de conexão. Checkout exige nova confirmação após alteração de NFT. Cada teste Playwright recebe contexto isolado. A expiração, recusa, timeout, cotação desatualizada e erro de favorito são reproduzíveis por cenários/endpoints de mock.

## UX, Figma e acessibilidade

 As telas de detalhe, carrinho, pagamento, confirmação e carteiras foram comparadas aos frames disponíveis em `figma/` com screenshots em `1440px`, `768px` e `390px`; a fixture de demonstração mantém uma carteira secundária cadastrada, enquanto o frame de carteiras mostra o estado vazio, portanto a tela exibe a contagem e a ação de edição. A aplicação usa os assets locais disponíveis e equivalentes Lucide para ícones sem marca específica; isso pode causar diferenças de rasterização em relação aos ícones proprietários do Figma. Não são usadas imagens remotas ou compra decorativa para simular funcionalidade.
 O frame mobile não expõe uma ação visual de favorito, embora o README exija favoritos autenticados; por isso a ação foi adicionada como controle acessível na buy bar mobile, preservando o restante da composição. O estado é compartilhado entre a galeria e o resumo do detalhe e é persistido pelo recurso de favoritos.
 A seleção de thumbnails, o limite inteiro de quantidade e o estado de edição indisponível são dirigidos pelo `Nft` retornado pela API. Comprar e adicionar ao carrinho usam o handler REST existente, atualizam a query do carrinho e só então navegam.
 O README exige perfil com avatar e senha, então o avatar usa `POST /api/profile/avatar` (multipart, com tipo e tamanho validados) e `DELETE` para remover, e a senha valida a senha atual, confirmação e persiste novo hash com salt no mock. Não foi criada uma rota independente de coleção: o requisito disponível é atendido pelo bloco `Mais desta coleção` no detalhe, pois o README não especifica uma tela de coleção.

  Base inclui link de salto, landmark principal, foco visível, feedback semântico, skeleton shimmer e redução de movimento. O foco de diálogos e drawers (Radix) é coberto em `phase12` e `phase20`; a verificação automatizada de acessibilidade é uma limitação (ver "Limitações conhecidas"). O texto dos CTAs âmbar e o texto secundário sobre o card claro usam cores de maior contraste que o raster original quando necessário para cumprir WCAG; os indicadores de carrossel mantêm o ponto visual de 8px dentro de uma área de toque de 24px.
  Na fundação responsiva da Etapa 4, o shell troca em `1024px`: abaixo desse limite usa a composição mobile do Figma (conteúdo fluido, Tab Bar quando a tela permite e sem footer), e a partir dele usa o header horizontal, container de `1200px` em `1440px`, sidebar e footer desktop. O Figma não fornece frame tablet; em `640px–1023px` mantemos a adaptação já documentada em `docs/figma/responsive.md` (grid de três colunas e filtros em drawer nas telas que os exibem), sem criar um terceiro shell visual ou afirmar que essa faixa é um frame do Figma.

### Desvios registrados do Figma (layout global e componentes base)

Medidas e método em `docs/figma-medidas.md`.

- **Favoritos na tab bar:** o frame mobile tem um coração na 2ª posição, mas o README não prevê página de favoritos. O ícone fica na posição do Figma como botão desabilitado (`Favoritos (indisponível)`), sem aparentar sucesso funcional.
- **Footer no mobile:** o frame mobile (414×896) mostra só a primeira dobra. Header e footer aparecem a partir de `1024px`; abaixo disso há só a tab bar, sem footer.
- **Header autenticado:** o Figma só desenha o estado deslogado ("Entrar"). Logado, o header mostra o avatar (iniciais, link para o perfil) e o botão "Sair" no mesmo estilo do "Entrar".
- **Tab bar em 390px:** o frame é de 414px. A barra usa o desenho do asset `tab-bar-background.svg` dividido em três partes: as laterais esticam, enquanto o recorte central e os cantos mantêm a forma original. Os ícones da esquerda ficam ancorados à esquerda e os da direita à direita, nas distâncias medidas em 414px.
- **Ícones da tab bar:** são os SVGs do Figma aplicados como máscara (`Icon`), para que o item ativo use `text-accent` e os demais `text-secondary` em qualquer rota. Com `<img>`, o ícone de início ficava laranja em todas as telas.
- **Destaque de opção no Select:** com o Radix, o foco vai para a opção. O destaque usa `surface-raised`, porque o tom anterior era igual ao fundo da lista e deixava o foco invisível (foco visível é obrigatório).
- **Animação de abertura de overlays:** as animações do shadcn/ui dependem do pacote `tw-animate-css`, que não foi instalado. Dialog, Sheet e Select abrem sem transição.

### Tipografia composta (decisão de 04/10/2026)

Os 30 estilos compostos do Figma (`text-body-14-bold`, `text-display-43-bold`…) deixaram de ser classes CSS e viraram **tokens de texto no `@theme`**, com as propriedades associadas do Tailwind v4 (`--text-<nome>--line-height`, `--font-weight` e `--letter-spacing`). Motivos:

- é o mecanismo nativo do Tailwind para "tamanho + entrelinha + peso": gera o utilitário `text-<nome>`, funciona com variantes (`lg:text-heading-28-bold`) e continua sobrescrevível por `leading-*`, `font-*` e `tracking-*`, o que um `@utility` com propriedades fixas não garante;
- os valores do Figma ficam uma vez só no tema, como pede o `AGENTS.md`;
- o `cn()` (`src/lib/utils.ts`) recebeu os 30 nomes, senão o tailwind-merge os trataria como cor e descartaria o tamanho ao lado de `text-text-secondary`.

O único estilo com alinhamento (`display-32-bold`, centralizado) não leva o `text-align` no token, porque um token de texto não carrega alinhamento: quem usar escreve `text-center` no JSX. Hoje nenhum componente o usa.

As 76 classes `.figma-*` (cópia da lista de estilos do Figma em `px`) não eram usadas por nenhum componente e foram removidas. O snapshot de estilos computados de 9 telas em 1440 e 390 deu 0 diferenças antes e depois.

### Início: filtros, fixtures e desvios (04/10/2026)

**Facets vêm do MSW.** `GET /api/nfts` devolve, além da página, `facets`: coleções (nome e contagem), redes (valor, rótulo e contagem) e a faixa de preço do catálogo inteiro (`catalogFacetsSchema` em `src/contracts`). O handler calcula tudo a partir do banco mock, independente da busca atual. O componente de filtros só renderiza o que chega; os rótulos e contagens que estavam fixos no componente foram removidos.

**As contagens do Figma são inconsistentes.** O painel mostra 9 coleções que somam 239 NFTs (Arte digital 33, Fotografia 12, Música 65, Arte 3D 39, Colecionáveis 23, Generativa 17, Jogos 19, Assinaturas 13, Utilidade 18) e 3 redes que somam 283 (Ethereum 119, Polygon 78, Solana 86). Como cada NFT tem uma coleção e uma rede, as duas somas não podem bater. Por decisão do usuário, as fixtures reproduzem os números do Figma: o catálogo tem 283 NFTs e os **44 que sobram ficam na coleção "Edições avulsas", que não aparece no painel** (o MSW só lista as 9 coleções do Figma). A faixa de preço vai de 0,02 a 12,30 ETH, como no frame. Para isso o contrato ganhou a rede `solana` nos NFTs e na busca (carteiras e pedidos continuam só com Ethereum e Polygon), e os NFTs ganharam os campos opcionais `originalPrice` (preço riscado do card) e `rare` (selo "RARO"), que antes eram decididos pela posição do card no grid. A chave do banco mock passou para `v2`, para descartar bancos salvos com as fixtures antigas.

**Decisões e desvios da tela:**

- Uma versão no DOM: catálogo, abas, cards e paginação são um único grid responsivo (duas colunas desencontradas no mobile, três a partir de `sm`). Só o hero e a sidebar de filtros escolhem a versão com `useMediaQuery`: o hero porque textos e composição mudam entre os frames, a sidebar porque vira drawer abaixo de `lg`. A versão que não vale não é renderizada.
- No mobile o grid mostra os 9 NFTs da página na ordem da API. O frame mostra o 7º NFT na 4ª posição; o app mostra o 4º.
- A busca do mobile aparece também no tablet, onde a sidebar vira drawer, e ali é o único botão "Abrir filtros".
- O coração do 1º card do frame mobile é o botão de favorito do card (só abaixo de `sm`), com atualização otimista e rollback (`useFavorite`). O frame mostra o coração só no 1º card; no app ele aparece em todos, porque é um controle e não decoração. No desktop o favorito fica no detalhe.
- O item escolhido nos filtros fica com a cor de destaque. No frame, "Arte digital" já aparece destacado sem filtro; no app, nenhum item é destacado sem filtro na URL.
- Os botões do slider de preço ficam na posição do valor. No frame o botão da direita está no meio da faixa mesmo com o texto "12,30".
- "Aplicar" fica sempre habilitado, como no frame; aplicar a mesma faixa não muda a URL.
- Paginação: o app mostra a última página ("… 32") porque o catálogo tem 32 páginas; o frame mostra só "1 2 3 4 >".
- Paginação no mobile (desvio do frame): o frame mobile não tem paginação, mas o README exige paginação compondo a URL. O mesmo bloco do desktop (1 2 3 4 … 32 e seta) aparece abaixo do grid, centralizado e com 24px de respiro, em 390px; os botões mantêm 35×35.
- Abas no mobile seguem o frame: as duas primeiras sem espaço entre si e 14px antes de "Em alta"; o sublinhado da aba ativa é 6px mais curto que o texto, como no frame.
- Promoções e Diário da Cunhagem não aparecem abaixo de `sm`, porque o frame mobile mostra só a primeira dobra. Os títulos das promoções têm a quebra de linha do frame escrita no texto.
- Título da página: o título visível do hero é o `h1`; "Marketplace de NFTs" (só para leitores de tela) virou `h2`, para a página ter um único `h1`.
- Novo token `--leading-70` (4,375rem): entrelinha do título do hero, medida no frame (70px entre as duas linhas).

### Detalhes do NFT: decisões e desvios (04/10/2026)

- **Duas versões, uma no DOM.** Os frames têm estruturas diferentes: no desktop, trilha, miniaturas, imagem com lupa e resumo ao lado; no mobile, barra do topo, folha sobre a imagem e barra de compra fixa. A página escolhe `Desktop` ou `Mobile` com `useMediaQuery('(width >= 40rem)')`. As duas usam `useNftPurchase`, `useFavorite` e as mesmas partes (`Editions`, `Quantity`, `TokenInfo`, `Description`, `Related`). O preço existe uma única vez no DOM.
- **Dados do detalhe vêm do MSW.** O contrato do NFT ganhou `rating`, `soldOutEditions` e `details` (parágrafos, rede, contrato, direitos autorais). As fixtures preenchem esses campos e os já existentes (edições, atributos, ID, avaliações, galeria) para todos os NFTs; o nft-1 tem os textos do frame. Os componentes não têm mais valores padrão inventados. A chave do banco mock passou para `v3`.
- **Edição esgotada.** Fica desabilitada, riscada e com "(esgotada)" no nome acessível; se a edição escolhida estiver esgotada, a compra fica bloqueada com aviso. O MSW também recusa a edição no carrinho (409). A edição inicial é a 1/50, destacada no frame, quando estiver à venda; senão, a primeira disponível.
- **Quantidade.** Inteira, entre 1 e o estoque atual do NFT. Se um `nft.updated` reduzir o estoque, a quantidade escolhida acompanha.
- **Favorito.** `useFavorite` (feature `favorites`) faz a atualização otimista e volta ao estado anterior se a API falhar; o visitante é levado ao login e volta ao detalhe.
- **Aviso ao vivo.** Um `role="status"` anuncia mudanças de preço e estoque que chegam pelo `nft.updated` (o socket invalida a query e o REST traz a nova versão).
- **Seções abaixo da dobra no mobile.** O frame mobile termina na folha do resumo. "Detalhes do NFT" e "Mais desta coleção" continuam no mobile, abaixo da folha, com espaço para a barra fixa.
- **Descrição curta:** os frames têm textos diferentes; as fixtures guardam os dois (`description` no desktop, `shortDescription` no mobile).
- **Desvios de conteúdo entre os frames** (o app usa um dado só): "Kurio Apes" no frame e "Arte digital" nas fixtures; edições "1/10" repetidas no frame mobile; textos de "Contrato" e "Direitos autorais" trocados no frame desktop; o frame destaca a 2ª miniatura e o app começa na 1ª.
- **Ícones.** Estrela, lupa, LinkedIn, mensagem, Twitter, carrinho e o botão "voltar" são os SVGs do Figma. − e + do seletor e o coração do favorito usam o lucide, porque não estão no export.
- **`CarouselDots`:** pontos de 12px a cada 20px, como no frame (o componente só é usado aqui), mantendo a área de toque de 24px.

### Carrinho: decisões (04/10/2026)

- **Visual da versão do usuário mantido.** As diferenças em relação ao Figma estão medidas em `docs/progresso.md` (seção Carrinho) e não foram revertidas, por decisão do usuário.
- **Visitante cotado.** `POST /api/quote` não exige mais sessão; o pedido continua exigindo. O resumo aparece para todos, e finalizar leva o visitante ao login.
- **Estoque por NFT, somado entre edições.** `available` é do NFT; o carrinho pode ter mais de uma edição do mesmo NFT, e a soma não passa do estoque. Edição em `soldOutEditions` é recusada. Linhas são identificadas por NFT + edição, inclusive na remoção.
- **Cupom vencido distinto de inválido.** `KURIO5` responde `COUPON_EXPIRED`; códigos desconhecidos, `INVALID_COUPON`. A interface mostra a mensagem da API no campo.
- **`createQuote` em `shared/api/quote`.** Carrinho e pagamento usam a mesma chamada; antes o pagamento importava de dentro da feature do carrinho.
- **Ajustes ao frame (item 4 depois do Pagamento).** O título "Carrinho de NFTs" é só para leitores de tela a partir de `sm` (o frame desktop não tem título; no mobile continua visível no cabeçalho). O resumo não tem fundo nem padding no desktop (no mobile continua a folha com fundo, como no frame). A trilha fica 24px mais perto da tabela (`sm:-mb-6`), e o cabeçalho mobile subiu 18px (voltar em 28,32, como no frame).
- **Diferenças que continuam** (centro da linha de texto, 1440 / 414, conta da Ana):

  | Bloco | Figma | App | Δ |
  | --- | --- | --- | ---: |
  | trilha (desktop) | y 109 | y 105 | −4 |
  | "Resumo da carteira" | y 137 | y 137 | 0 |
  | título do resumo | linha embaixo | sem linha | — |
  | campo do cupom | 988,205 332×40 | 988,197 332×40 (rótulo acima) | −8 |
  | subtotal | y 279 | y 273 | −6 |
  | total | y 413 | y 422 | +9 |
  | "Conectar e finalizar" | 988,445 332×40, texto centralizado | 988,458 332×40, seta à direita | +13 |
  | "Continuar explorando" | y 507 | y 534 | +27 |
  | "Colecionadores também viram" | y 622 | y 644 | +22 |
  | linhas da tabela | 1ª em y 169 | 1ª em y 174 | +5 |
  | seletor de quantidade | pílulas laranja pequenas | caixa com borda | estilo |
  | cards relacionados | 219×272 | card da Início 230×352 | proporção |
  | voltar (mobile) | 28,32 | 28,32 | 0 |
  | título (mobile) | y 49 | y 50 | +1 |
  | linha 1 (mobile) | 28,88 358×102 | 28,90 382×100 | +2, w +24 |
  | resumo (mobile) | sem "Resumo da carteira" e sem "Continuar explorando" | com os dois | elementos a mais |

### Pagamento: decisões e desvios (04/10/2026)

- **Duas versões, uma no DOM.** Desktop (formulário do colecionador + resumo) e mobile (carteiras cadastradas + métodos + total) têm estruturas diferentes nos frames; a página escolhe por `useMediaQuery` e as duas usam os mesmos hooks.
- **Título.** O frame desktop não mostra título visível; o `<h1>` "Pagamento com carteira" existe só para leitores de tela no desktop e é visível no mobile, como no frame.
- **Formulário pré-preenchido.** O frame desktop mostra os campos vazios; o app preenche nome, usuário, perfil, ENS e e-mail a partir do perfil e da sessão, e endereço e rede a partir da carteira escolhida. O endereço só é editável com "Usar outra carteira?" marcado.
- **Código de indicação obrigatório no desktop**, como indica o asterisco do frame; a API aceita só `KURIO-2026`. No mobile o frame não tem formulário: os dados do colecionador vêm do perfil e, se faltar algo, a tela pede para completar o perfil.
- **Conexão de carteira simulada** (requisito do readme, sem frame próprio): uma linha de status ("Coinbase Wallet conectada · Desconectar", "Conectando…", recusa com "Tentar de novo") fica logo abaixo do botão no desktop e abaixo do total no mobile, para não deslocar o resto do frame.
- **Revisão em diálogo.** O frame não tem etapa de revisão; o readme exige. "Confirmar compra" abre o diálogo "Revise sua compra" com a cotação revalidada; o envio é "Enviar pedido". Não há mais checkbox de consentimento.
- **Carteira padrão.** O frame mobile mostra "Reserva" selecionada sob "Carteira conectada". A fixture começa com a Reserva conectada e o pagamento seleciona a carteira conectada (sem conexão, a principal), nos dois layouts. A ordem continua a da API (Principal primeiro; no frame a Reserva vem antes).
- **Título "Carteira conectada" (mobile).** Segue o estado da conexão: "Conectando carteira" e "Conectar carteira" quando não há conexão, para não afirmar uma conexão inexistente; o frame só desenha o estado conectado.
- **Métodos no desktop.** A primeira opção do frame é o selo "METAMASK · WALLETCONNECT · COINBASE"; no app ela é a opção WalletConnect (nome acessível "WalletConnect").
- **Aviso de mudança** (`nft.updated`) no pagamento usa `role="alert"`: exige ação antes de confirmar.

### Confirmação de Pedido: decisões e desvios (04/10/2026)

- **Sem header e footer.** O frame desktop mostra só o cartão sobre o fundo escuro. A rota usa `staticData.hideChrome` (mesmo mecanismo do `hideTabBar`), e o cartão fica no fluxo da página, sem camada sobre o resto. Assim não há foco do teclado em links escondidos atrás de um scrim.
- **Sem frame mobile.** O cartão vai de ponta a ponta abaixo de `sm` (como o Pagamento), os quatro metadados ficam em grade 2×2 e as colunas do recibo encolhem (imagem de 48px, nome em 14px, cabeçalho em 12px). Ordem e elementos iguais aos do desktop.
- **"Carteira" mostra o aplicativo** (MetaMask, Coinbase Wallet, WalletConnect), como no frame ("MetaMask"), a partir do novo `wallet.method` do pedido.
- **Explorador pela rede** (decisão confirmada pelo usuário). Ethereum → "Ver no Etherscan" (`https://etherscan.io/tx/…`); Polygon → "Ver no Polygonscan" (`https://polygonscan.com/tx/…`). O `phase5` cobre os dois casos: com a Principal (Ethereum) conectada pela API antes do pagamento, e com o padrão das fixtures (Reserva, Polygon); cada um confere o nome do link, o `href`, `target="_blank"`, a rede no texto e a ausência do outro explorador. O frame mostra Etherscan com uma transação na Ethereum. O link abre em nova aba, com "(abre em nova aba)" para leitores de tela, e não tem o ícone que havia antes (o frame não tem).
- **Rótulos em negrito** só em "ID da transação" e "Carteira", como no frame.
- **Recibo é snapshot.** Nada vem do catálogo atual: um `nft.updated` depois da compra não muda o recibo (coberto pelo `phase13`).
- **Carrinho depois da compra.** Ao confirmar, o MSW remove só os itens e quantidades comprados; `useOrder` invalida a query do carrinho para o contador refletir isso.

### Login e Cadastro: decisões e desvios (04/10/2026)

- **Fundo só com o hero** (desvio confirmado pelo usuário). O frame desktop mostra a Início inteira atrás do cartão (hero, filtros e grade). O app reutiliza só o hero, sem alterá-lo; abaixo dele não há catálogo (o fundo é decorativo, `aria-hidden` e `inert`). Sem escurecimento, como no frame.
- **Header.** O cartão fica em y=160, como no frame. O hero fica na mesma posição da Início (o header atual tem 45px, contra 68 no frame), então o texto do hero aparece 13px acima do frame.
- **Botão do cadastro segue o frame** (decisão do usuário): "Criar conta" no desktop e "Criar perfil" no mobile. Os dois textos ficam no botão com `sm:hidden`/`max-sm:hidden`; o oculto não entra no nome acessível. Os specs usam `registerButtonName(page)` (`tests/e2e/test.ts`) para o nome de cada viewport.
- **Título.** No desktop o `<h1>` é só para leitores de tela (o frame não mostra título); no login o nome acessível é "Login".
- **Ações fora do escopo** (Google, Facebook, "Esqueceu a senha?"): o readme não prevê login social nem recuperação de senha. Os controles ficam como no frame e o clique só anuncia que a ação não está disponível.
- **Ícones.** O "ocultar senha" é o SVG do Figma (`iconly-curved-hide`); o "mostrar" (senha visível) usa o lucide, porque não há asset. Os logos do Google e do Facebook não estão no export: foram desenhados como SVG em `public/assets/icons`.
- **Detalhes seguidos do frame:** sem botão de mostrar senha na confirmação do cadastro no desktop (o mobile tem); placeholder "Nome de usuário" centralizado no mobile; "Esqueceu a senha?" no lugar de "Esqueci minha senha"; abas com divisória laranja em vez de sublinhado.
- **Estados sem frame:** mensagens de erro abaixo dos campos (12px, `text-error`), erro geral e aviso de sessão expirada em 13px; foco dos campos com borda e anel laranja de 1px.

### Perfil e Carteiras: decisões e desvios (04/10/2026)

- **Sem frame mobile** (o readme pede as duas telas em mobile): o painel da conta ("Meu perfil", menu e "Sair") vai para cima do conteúdo, com a largura toda, o mesmo visual do desktop e uma coluna de itens. Os campos passam para uma coluna (`sm:grid-cols-2` no desktop) e a margem lateral de 24px vem do `Layout`, como nas outras telas. Uma só versão no DOM, por classes; abaixo de `lg` não há a grade de duas colunas (painel de 310px + conteúdo). O campo sem rótulo da carteira ("ENS ou carteira secundária") perde o espaço do rótulo no mobile.
- **Painel compartilhado** (`features/account/account-sidebar` e `account-shell`): usado por Perfil e Carteiras. O nome do usuário saiu do painel visível (o frame não tem) e ficou só para leitores de tela. "Atividade" usa o carrinho do lucide e "Ofertas" o `SquareActivity`, os mais próximos dos ícones do frame (não há assets no export). Os itens fora do escopo (Atividade, Lista de interesse, Ofertas, Arquivos baixados, Suporte) continuam como texto, como antes.
- **Campos do perfil seguem o frame:** nome de exibição, nome de usuário, e-mail, nome ENS (sufixo `.eth` + nome), apelido da carteira, avatar e senha. `bio` e `website` saíram do contrato (o frame não os mostra). O e-mail é o do login: mudar o perfil muda o e-mail da sessão (`409` no campo se outro usuário já usa). O ENS é guardado completo (`ana.kurio.eth`); o formulário separa nome e sufixo (`features/account/lib/ens`).
- **Campos da carteira seguem o frame:** nome de exibição, apelido, rede, nome do perfil, endereço, "ENS ou carteira secundária (opcional)" (campo `label`), tipo de carteira (`tag`), código de indicação (`KURIO-2026`, a mesma regra do pagamento), e-mail e nome ENS. `profileName`, `referralCode` e `email` entraram no contrato da carteira. **Desvio confirmado contra o frame (ausência de definição):** em `figma/Desktop/Carteiras.png`, "Tipo de carteira" é só um seletor fechado com o texto "Selecione uma carteira" e "ENS ou carteira secundária (opcional)" é só um campo de texto com esse placeholder, sem rótulo. O frame não mostra as opções nem diz que um deles distingue principal de secundária (a distinção está nos títulos das duas seções). Como o readme também não define, as opções "Hot wallet" e "Cold wallet" são invenção minha e o campo "ENS ou carteira secundária" é um texto livre (`label`), sem efeito na principal/secundária. O seletor "Carteira" do formulário antigo saiu: com a principal única, o formulário principal edita sempre a principal.
- **Principal única.** `PATCH /api/wallets/:id/primary` troca as duas no mesmo passo; `POST /api/wallets` aceita `primary: true` (a nova assume e a anterior vira secundária), e a primeira carteira de um usuário já é principal. Na tela: "Tornar principal" na lista de secundárias (atualização otimista com rollback, `useSetPrimaryWallet`) e "Adicionar" na seção principal (cadastra uma nova principal; "Cancelar" volta à edição da atual). A lista vem da mesma query key do pagamento (`keys.wallets(userId)`): salvar ou trocar a principal invalida essa key, então o pagamento mostra a carteira editada sem recarregar. A UI de troca não está no frame; segue o padrão visual das outras listas (borda fina, links laranja).
- **Avatar** por upload simulado: `POST /api/profile/avatar` (multipart) com 700 ms de espera e validação de tipo (imagem) e de tamanho (512 KB), devolvendo `422` no campo `avatar`; `DELETE` remove. Estados: carregando (botão com `aria-busy`, avatar pulsando só sem movimento reduzido) e erro (ligado ao botão por `aria-describedby`).
- **Senha:** só existe no estado do formulário (limpa depois de salvar); o MSW guarda hash com salt. "Senha atual incorreta" vem da API com `fields.currentPassword` (`422`; antes era `401`).
- **Cenário `slow`** agora também atrasa `GET /api/profile` e `GET /api/wallets` em 2 s, para o skeleton ser verificável.
- **Desvios do frame:** ""Remover" segue o frame (sempre ativo); sem avatar não faz nada e avisa "Não há avatar para remover."; a cor dos itens do painel e o ícone do avatar (lucide `ImageIcon`) são aproximações; "Adicionar" da seção secundária fica 6px à direita do frame (alinhado à borda direita do conteúdo, depois da opção "Igual à carteira principal").
- **Componentes compartilhados:** `TextField` (era do pagamento) foi para `@/components` e ganhou `labelClassName`, `inputClassName` e `prefix`; `Select` ganhou `variant="frame"`, `className` e `labelClassName` (o pagamento passou a usar a variante, com o mesmo resultado visual).

## Execução e deploy

Vite é a ferramenta complementar escolhida. O build de demonstração (`npm run build:demo`) liga o MSW inclusive em produção; o build normal permite uma API configurada, mas nenhum backend é entregue. A configuração da Vercel está em `vercel.json` (build de demonstração, fallback SPA para o `index.html` exceto `assets/` e `mockServiceWorker.js`, e `no-cache` no worker). O deploy ainda não foi publicado: a URL pública, o acesso direto às rotas, o refresh e o funcionamento do MSW e do Socket.IO no ambiente publicado precisam ser validados depois de publicar.

O MSW deve iniciar antes de importar o módulo que carrega `socket.io-client`, pois o transporte captura a implementação de WebSocket ao avaliar o módulo (ver "Sincronização REST × Socket.IO"). O handler `ws.link` usa a origem/namespace `/`: o MSW normaliza `/socket.io/` na correspondência. Esses detalhes são cobertos pelos testes de evento real.

**Transporte Socket.IO e limitações no ambiente de mocks.** WebSocket (`transports: ['websocket']`), namespace padrão, origem atual. O MSW intercepta a rede e `@mswjs/socket.io-binding` 0.2.0 codifica frames e handshake; o binding publicado não implementa heartbeat, então o mock envia o ping textual a cada 20 s, e não oferece rooms, namespaces nem broadcast completos (o mock percorre os clientes e filtra os pedidos privados por usuário e pedido). Polling, anexos binários e implantação real não foram validados.

## Sessão expirada (política)

Qualquer `401` do Axios, exceto login, cadastro e logout (onde `401` é credencial inválida), chama o handler instalado por `app/session-expiry`. Se havia usuário na sessão em cache, ele guarda o contexto do pagamento (formulário e revisão aberta, por usuário), cancela as queries (menos a da sessão, que o guard pode estar aguardando), encerra as assinaturas privadas, limpa o cache e leva ao login com `redirect` para o destino atual e `expired=true`. Visitante com `401` não é expiração. O guard das rotas privadas roda a cada navegação e faz a mesma limpeza antes de redirecionar. Cupom e chave de idempotência do usuário permanecem; depois do login, o pagamento relê o contexto guardado (uma vez), restaura o formulário e reabre a revisão revalidando a cotação. O envio reaproveita a mesma chave, então não cria pedido duplicado. Se outro usuário entrar depois da expiração, o contexto guardado do anterior não é lido por ele (a chave é por usuário) e só é apagado no próximo logout daquele usuário. Coberto por `phase16` e `phase19`.

## Pedido pendente

`GET /api/orders?status=pending` devolve só os pedidos do usuário da sessão. Ao abrir `/checkout`, o cliente redireciona para o pedido pendente; `POST /api/orders` com pedido pendente do usuário responde `409 ORDER_PENDING` com `fields.orderId`, mesmo com outra chave de idempotência (a repetição da mesma chave continua devolvendo o mesmo pedido, antes dessa checagem). Confirmado e recusado são terminais e liberam um novo pagamento. Coberto por `phase23`.

## Desempenho e Lighthouse (medição de 05/10/2026)

**Ferramentas e ambiente.** Lighthouse 13.5.0; Chrome headless 154.0.0.0 (o instalado em `C:\Program Files\Google\Chrome`); Node v24.18.0; Windows 10.0.19045 x64; AMD Ryzen 5 5500 (12 threads), 16 GB. Build `npm run build:demo` servido por `vite preview` em `http://127.0.0.1:4173`, cenário `default` do MSW, Chrome novo e sem cache a cada medição, mocks, imagens, fontes e Socket.IO ativos (nenhuma simplificação para a auditoria). Um servidor de desenvolvimento do Vite (porta 5173) estava aberto e ocioso. Script: `scripts/lighthouse.mjs`; relatórios HTML/JSON de cada medição e o `summary.json` (versões, sistema, condições e medianas) em `reports/lighthouse/`, versionados.

| Perfil | Emulação | Throttling (`simulate`) |
| --- | --- | --- |
| Mobile | 412×823, DPR 1,75, UA de Android | RTT 150 ms, 1.638,4 Kbps, CPU 4× mais lenta |
| Desktop | 1440×900, DPR 1 | RTT 40 ms, 10.240 Kbps, CPU 1× |

**Medianas de 3 medições por página e perfil (depois das correções)**

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início | mobile | 94 | 100 | 100 | 100 | 2.688 | 0 | 155 |
| Início | desktop | 99 | 100 | 100 | 100 | 930 | 0 | 0 |
| Detalhe | mobile | 91 | 97 | 100 | 100 | 3.190 | 0 | 155 |
| Detalhe | desktop | 99 | 97 | 100 | 100 | 923 | 0 | 0 |

Metas (Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90): **todas as medianas atendem**. Performance das 3 medições: Início mobile 89/94/94 (a primeira, com Chrome frio, costuma sair mais baixa), Início desktop 99/99/99, Detalhe mobile 89/91/91, Detalhe desktop 99/99/99.

**Reconferência mobile (1 medição).** Reconferência das duas páginas mobile, com **1 medição** cada, sobre o HEAD final (Chrome frio, primeira medição): Início mobile **90** (LCP 3.432 ms, CLS 0, TBT 136 ms) e Detalhe mobile **93** (LCP 3.100 ms, CLS 0, TBT 96 ms); Accessibility 100 e 97, Best Practices 100 e 100, SEO 100 e 100. A tabela acima é a **mediana de 3 medições** feita antes; a reconferência não é mediana. O 90 do Início mobile é a mesma pontuação das primeiras medições a frio (89/90) e está na margem da meta; as medições seguintes, com o Chrome aquecido, deram 94. O diagnóstico é o mesmo: cadeia SPA + MSW (HTML → `index` → chunk do MSW → `render` → `GET /api/nfts`).

**Antes × depois (medição de 04/10/2026 → esta)**

| Métrica | Antes | Depois |
| --- | --- | --- |
| Início mobile: Performance / LCP | 90 / 3.394 ms | 94 / 2.688 ms |
| Detalhe mobile: Performance / LCP | 93 / 3.036 ms | 91 / 3.190 ms |
| SEO (todas) | 92 | 100 |
| Best Practices Início mobile (pior medição) | 96 | 100 |
| Accessibility Início desktop | 97 | 100 |
| CLS Início desktop | 0,0333 | 0 |

**O que foi corrigido**

- **Hero mobile (LCP do Início mobile):** a imagem `mobile-hero-mask.svg` deixou de ser `loading="lazy"`, ganhou `fetchpriority="high"` e um `<link rel="preload">` (só até 639px) em `index.html`. Enquanto o catálogo carrega, o mobile já mostra o hero (texto e máscara, que não dependem da API) com a busca e a arte como skeletons das mesmas dimensões.
- **SEO:** `public/robots.txt` válido; título e descrição sem "estrutura inicial"; `lang` e `viewport` já estavam corretos.
- **Best Practices:** `public/favicon.svg` e `<link rel="icon">` (acabou o 404 de `favicon.ico`).
- **Accessibility:** os `input[type=range]` do filtro de preço passaram de 16 para 24 px de altura (`-top-1 h-6`, com o botão no mesmo lugar) e os pontos do carrossel do Detalhe para áreas de 20×24 px, sem sobreposição e sem mover os pontos.
- **CLS do Início desktop:** a imagem do hero não tinha tamanho reservado (o link era `w-fit`), então o hero crescia de 366 para 450 px quando a imagem carregava e empurrava o catálogo; agora o link tem 450×450 px. O skeleton de sm em diante também espelha o layout carregado (margem do hero, busca abaixo de lg, filtros e destaque a partir de lg, abas, grade 3×3 e paginação).

**Tentado e descartado (medido pior)**

- Iniciar o MSW em paralelo com o render, ou só depois do primeiro commit (consultas pausadas até o worker responder): Início mobile 83–87 e Detalhe 83. A ordem original (worker primeiro, depois a aplicação) ficou melhor e foi mantida.
- Dividir o código por rota (`lazyRouteComponent`) e carregar o `socket.io-client` sob demanda: ajudava o Início em ~1 ponto, mas o Detalhe caiu de ~92 para ~89; revertido.
- `fetchpriority="high"` em todas as imagens `priority`: piorava o Detalhe (83); ficou só no hero mobile.

**O que ainda limita o resultado (nenhuma meta está abaixo)**

- **Início e Detalhe mobile, LCP de 2,7 a 3,2 s** (acima dos 2,5 s considerados bons): a página é uma SPA com MSW; a cadeia é HTML → `index-*.js` → chunk `browser-*.js` (worker do MSW, ~170 kB gz, ~450 ms de execução) → `render-*.js` (~218 kB gz) → `GET /api/nfts` → imagem. No Detalhe, o LCP é a imagem do NFT (`loading="eager"`, mas só descobrível depois da API e sem `fetchpriority`). O chunk do MSW existe porque o build de demonstração precisa do mock em produção. O TBT de 155 ms (CPU 4× mais lenta) vem desses mesmos dois chunks.
- **Accessibility 97 no Detalhe:** falha só `target-size` nos três pontos do carrossel (`role="tab"` "Página 1…3"): o Figma fixa o passo de 20 px entre pontos, e para passar a regra de 24 px o passo teria que ser de 24 px, o que mudaria o desenho. Mantido por fidelidade ao Figma.
- **Imagens grandes:** `home-hero.png`, `featured-nft.png`, `neon-vessel.png` e `golden-beat.png` têm ~2 MB cada (assets do Figma). Não pesam no LCP medido do Início mobile (o LCP é o SVG), mas pesam no Detalhe e em conexões lentas; recodificar para WebP exigiria uma ferramenta que não está instalada.

**Limitações da medição.** Chrome headless e `vite preview` locais, sem CDN, e CPU do Windows com `simulate`: valores absolutos mudam em outro hardware e na URL publicada (o deploy ainda não existe). A primeira medição de cada perfil costuma sair 2 a 5 pontos abaixo; a mediana descarta essa. Repetir depois de publicar.

## Limitações conhecidas

Tudo abaixo está registrado em [docs/eliminatorios.md](docs/eliminatorios.md) e não foi resolvido.

**Entrega**
- O deploy público ainda não existe (ver "Execução e deploy").

**Tempo e rede nos mocks**
- Só o pedido tem timeout simulado (`payment-timeout` responde `504`); nenhum cenário faz a conexão exceder os 8 s do Axios no catálogo ou no detalhe.
- As condições de rede (`slow`, `variable-latency`, `network-error`, `http-500`, `unauthorized`) valem para `GET /api/nfts` e `GET /api/nfts/:id`; os demais recursos têm cenários de erro próprios.
- O debounce de 300 ms da busca não é controlado por `page.clock` (o teste usa espera real).

**Tempo real**
- O `eventId` é gerado, mas a deduplicação usa só a versão.
- O mapa de versões vistas de NFT nunca é limpo; um reset do mock com a aba aberta faz as versões voltarem a 1 e o cliente ignora os eventos seguintes até recarregar.
- Favoritos, perfil e carteiras não têm eventos nem reconciliação na reconexão.
- A regra `quoteVersion !== 1 → QUOTE_STALE` do mock é um atalho.

**Interface e Figma**
- Tablet não tem frame no Figma; usa a adaptação descrita em `docs/figma/responsive.md`.
- O seletor "Ordenar por" só existe a partir de 640px; no mobile a ordenação vem das abas.
- O skeleton do detalhe em 768px é cerca de 476px mais baixo que o conteúdo abaixo da dobra (sem footer nessa largura; sem deslocamento medido, CLS 0).
- O 404 global é só um título, sem link de volta.
- shadcn/ui: só o `Toaster` está montado e nenhum `toast()` é chamado; o `Modal` é próprio sobre o Radix `Dialog`.
- Desvios do Figma por tela estão nas seções acima.

**Acessibilidade e testes**
- Não há verificação automatizada de acessibilidade (sem axe, sem `eslint-plugin-jsx-a11y`); teclado e foco são cobertos nos pontos citados em `docs/eliminatorios.md` (§8 e §9 item 11), sem um fluxo completo só por teclado.
- Baselines visuais geradas no Windows (Chromium do Playwright); outro sistema com rasterização de fonte diferente pode exigir regenerá-las. O Lighthouse foi medido sobre o build de demonstração local; repetir na URL publicada (ver "Desempenho e Lighthouse").
