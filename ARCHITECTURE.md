# Arquitetura e estado da entrega

Esta é a **estrutura inicial**, não a solução completa. Requisitos normativos preservados no [README](README.md), rastreabilidade em [docs/CHECKLIST.md](docs/CHECKLIST.md), contratos em [docs/CONTRACTS.md](docs/CONTRACTS.md).

## Organização

- `src/app`: composição de rotas e layout provisório.
- `src/components/ui`: componentes shadcn/ui sob controle do projeto, Radix Slot/CVA; barrel existente em `src/components/index.ts`.
- `src/contracts`: esquemas de transporte e envelopes compartilhados.
- `src/features/catalog`, `src/features/account` e `src/features/session`: integrações por domínio. Criar os demais domínios quando implementados, evitando módulos vazios.
- `src/lib`: Axios, ambiente, QueryClient, precisão ETH e ciclo de vida Socket.IO.
- `src/mocks`: fixtures, banco persistido e handlers REST/socket; nenhuma resposta fictícia no cliente HTTP, hooks ou componentes.
- `tests/e2e`: smoke tests que passam pela rede MSW e cliente Socket.IO.
- `scripts`: auditoria Lighthouse. `public/mockServiceWorker.js`: worker gerado, necessário também no deploy de demonstração.

## Cache, retries e sincronização

Chaves públicas incluem todos os parâmetros: `['nfts','list',search]` e `['nfts','detail',id]`. `AbortSignal` do Query chega ao Axios. Dados ficam frescos por 30 s e são coletados após 5 min sem uso; foco da janela e conexão disparam reconciliação. Queries repetem uma vez apenas falhas de rede/5xx, nunca 4xx; mutations não têm retry automático. Sessão usa staleTime zero e sem retry.

O socket público pertence ao layout raiz e tem cleanup de listeners/conexão, inclusive StrictMode. Pedidos pendentes abrem uma subscription privada própria, filtrada por `userId` e `orderId`, com reconciliação REST na conexão e reconexão; o cleanup é registrado para o logout. Eventos válidos causam reconsulta REST e versões antigas não regredem o estado. Logout cancela queries, encerra subscriptions privadas e limpa o cache antes de trocar identidade.

O catálogo mantém busca, filtros combináveis, ordenação e paginação no estado da URL; a busca digitada aguarda 300 ms antes de consultar o mesmo `GET /api/nfts`. O filtro de preço usa a faixa visível no Figma (`0` a `2.29` ETH) e só aplica a alteração ao pressionar `Aplicar`. Em mobile a paginação permanece oculta conforme o frame Figma; em tablet os filtros usam o drawer previsto em `docs/figma/responsive.md`.

## Sessão, carrinho e dinheiro

O endpoint de sessão retorna visitante ou a conta autenticada persistida no mock. Cadastro e login usam Axios/MSW, guardas preservam o destino e distinguem visitante de sessão expirada. Usuários de fixture e novos cadastros armazenam somente hash SHA-256 com salt; a resposta pública remove os campos secretos. Login faz merge por NFT/edição do carrinho visitante, e logout limpa o cache do TanStack Query antes de trocar para visitante. `POST /api/__mock/session/expire` permite reproduzir expiração sem expor uma ação de produto.

Carrinho é persistido na DB mock, com identificador de visitante e merge por NFT/edição ao login. Cotação é a autoridade de preço e taxas: cada resposta fica registrada por `quoteId` para revalidar preço, disponibilidade, cupom e itens antes do pedido. Helpers convertem strings ETH para wei usando BigInt (sem float). A chave de idempotência fica no localStorage durante a tentativa e no mock até o reset; o pedido guarda snapshot de preço, nome e imagem, transições terminais e recuperação por chave. Recusa mantém o carrinho; confirmação remove somente os itens e quantidades do snapshot comprado.

## Persistência e cenários

Atualmente a DB local versionada contém catálogo, usuários, sessão, carrinhos, favoritos, perfil, carteiras, cotações, pedidos e chaves de idempotência. `POST /api/__mock/reset` restaura todos os dados e o cenário; recarregar encerra conexões e mantém a sessão do modo demo. Eventos `nft.updated` invalidam catálogo, carrinho e cotações ativas; `order.updated` é emitido pelo transporte Socket.IO mockado, com endpoints de teste para duplicatas, versões antigas e queda de conexão. Checkout exige nova confirmação após alteração de NFT. Cada teste Playwright recebe contexto isolado. A expiração, recusa, timeout, cotação desatualizada e erro de favorito são reproduzíveis por cenários/endpoints de mock.

## UX, Figma e acessibilidade

 As telas de detalhe, carrinho, pagamento, confirmação e carteiras foram comparadas aos frames disponíveis em `figma/` com screenshots em `1440px`, `768px` e `390px`; a fixture de demonstração mantém uma carteira secundária cadastrada, enquanto o frame de carteiras mostra o estado vazio, portanto a tela exibe a contagem e a ação de edição. A aplicação usa os assets locais disponíveis e equivalentes Lucide para ícones sem marca específica; isso pode causar diferenças de rasterização em relação aos ícones proprietários do Figma. Não são usadas imagens remotas ou compra decorativa para simular funcionalidade.
 O frame mobile não expõe uma ação visual de favorito, embora o README exija favoritos autenticados; por isso a ação foi adicionada como controle acessível na buy bar mobile, preservando o restante da composição. O estado é compartilhado entre a galeria e o resumo do detalhe e é persistido pelo recurso de favoritos.
 A seleção de thumbnails, o limite inteiro de quantidade e o estado de edição indisponível são dirigidos pelo `Nft` retornado pela API. Comprar e adicionar ao carrinho usam o handler REST existente, atualizam a query do carrinho e só então navegam.
 O README exige perfil com avatar e senha, então o avatar usa `PATCH /api/profile/avatar` com o conteúdo selecionado pelo usuário e a senha valida a senha atual, confirmação e persiste novo hash com salt no mock. Não foi criada uma rota independente de coleção: o requisito disponível é atendido pelo bloco `Mais desta coleção` no detalhe, pois o README não especifica uma tela de coleção.

  Base inclui link de salto, landmark principal, foco visível, feedback semântico, skeleton shimmer e redução de movimento. Acessibilidade completa exige formularios, dialogs/drawers, foco na navegação, imagens finais e auditoria. As medidas de Lighthouse da estrutura não podem ser apresentadas como pontuação da solução final. O texto dos CTAs âmbar e o texto secundário sobre o card claro usam cores de maior contraste que o raster original quando necessário para cumprir WCAG; os indicadores de carrossel mantêm o ponto visual de 8px dentro de uma área de toque de 24px.
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

## Execução e deploy

Vite é a ferramenta complementar escolhida; todas as tecnologias obrigatórias têm dependência/configuração dedicada. REST, Socket.IO, Router, Query, Axios, Tailwind e componentes iniciais já têm caminho de execução. Playwright exercita a infraestrutura. Lighthouse tem script preparado, sem atestar metas finais. Build de demonstração ativa MSW inclusive em produção; build normal permite API configurada, mas não existe backend externo entregue.

Configuração Vercel prepara build e fallback SPA, sem publicar nesta etapa. Acesso público, HTTPS/socket, rotas diretas e paridade com código entregue precisam de validação após deploy. `.git` foi preservado e passou a ser reconhecido pelo Git na verificação posterior; não foi reinicializado. `home-desktop.pdf`, surgido durante o trabalho, também foi preservado e ainda precisa de inspeção na etapa visual.

MSW deve iniciar antes de importar o módulo que carrega `socket.io-client`, pois o transporte captura a implementação de WebSocket ao avaliar o módulo. Por isso `main.tsx` importa `app/render` dinamicamente após `worker.start()`. O handler `ws.link` usa a origem/namespace `/`: MSW normaliza `/socket.io/` na correspondência. Esses detalhes são cobertos pelo teste de integração do evento real.
