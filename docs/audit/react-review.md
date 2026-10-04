# React/TypeScript Review

## 1. Escopo e método

Esta auditoria cobre os componentes React, páginas de feature, hooks, contexto, tipos e contratos de props encontrados em `src/**/*.ts` e `src/**/*.tsx`.

Foram lidos integralmente:

- `AGENTS.md`;
- `README.md`;
- `docs/audit/ui-architecture-review.md`.

R-01 a R-05 foram considerados concluídos e não foram reavaliados como tarefas de implementação. Esta etapa é somente análise. Nenhum arquivo de código, CSS, token, asset, rota ou teste foi alterado.

A skill `react-patterns` foi solicitada, mas não está disponível neste ambiente. A análise foi feita diretamente sobre os padrões React 19, TypeScript strict, TanStack Router/Query e as convenções já presentes no projeto.

## 2. Resumo executivo

O projeto usa padrões adequados em várias áreas:

- `Modal`, `Filters`, `Header` e `Footer` usam composição por partes com fronteiras legíveis.
- `useLayoutMode` usa `useSyncExternalStore`, com snapshot de servidor e subscription explícita.
- Estado de domínio permanece próximo das páginas que controlam a regra correspondente.
- A duplicação Desktop/Mobile em Home, detalhe e cards representa árvores estruturalmente diferentes e não deve ser removida apenas para reduzir linhas.
- `SheetProps` tem várias opções, mas elas pertencem ao comportamento do overlay e não formam uma API de negócio sobrecarregada.

Os principais pontos de atenção são:

1. `CheckoutPage`, `CartPage` e `HomePage` acumulam orquestração assíncrona, estado local, realtime e uma árvore visual extensa.
2. Alguns contratos TypeScript aceitam valores mais amplos que os componentes realmente suportam.
3. Há estados locais inicializados a partir de props que não são reajustados quando o recurso muda.
4. A remoção de duplicação deve ser seletiva: os trees Desktop/Mobile e os controles repetidos do detalhe devem permanecer até existir uma necessidade de manutenção que justifique extração.

## 3. Achados

### RCT-01 — Orquestração excessiva em `CheckoutPage`

- **Arquivo:** `src/features/checkout/checkout-page/index.tsx:28-120` e `src/features/checkout/checkout-page/index.tsx:125-149`.
- **Problema:** o componente controla queries de sessão, carrinho e carteiras; estado de formulário; cotação; realtime; expiração de sessão; idempotência; revalidação; mutation de pedido; foco; tratamento de erros; e toda a árvore visual do checkout.
- **Evidência:** há estados para `walletId`, `network`, `name`, `email`, `walletAddress`, `accepted`, `paymentMethod`, `quoteStale`, `liveNotice` e `realtimeConnected`, além de três refs, quatro queries e uma mutation no mesmo componente.
- **Impacto:** qualquer alteração no fluxo de pagamento exige navegar por regras de rede, sessão, cotação e renderização no mesmo módulo. A superfície de testes e o risco de uma mudança afetar estados não relacionados aumentam.
- **Prioridade:** P1.
- **Risco:** médio; uma extração mal feita pode alterar a ordem de revalidação, a chave de idempotência ou o bloqueio de submissão.
- **Solução sugerida:** quando o checkout receber novos estados, extrair um controlador de domínio específico, como `useCheckoutController`, e separar apenas seções sem regra própria, como dados do colecionador, carteiras e resumo. O hook deve continuar expondo estados explícitos, sem criar um objeto genérico de formulário ou de async state.
- **Necessidade:** não é necessária para o comportamento atual. É recomendada antes de ampliar o fluxo de pagamento.

### RCT-02 — Orquestração e renderização acopladas em `CartPage`

- **Arquivo:** `src/features/cart/cart-page/index.tsx:19-85` e `src/features/cart/cart-page/index.tsx:90-145`.
- **Problema:** a página concentra queries, três mutations, optimistic update, cupom, cotação, subscriptions Socket.IO, estado de conexão, mensagens live e todo o markup de carrinho, resumo e recomendações.
- **Evidência:** `CartPage` mantém `coupon`, `appliedCoupon`, `liveNotice`, `realtimeConnected`, `quote` e `optimisticallyRemoved`, além de escrever diretamente no cache de `keys.cart` em múltiplos callbacks de mutations.
- **Impacto:** o contrato entre cache otimista, cotação e renderização fica difícil de acompanhar. Mudanças em uma mutation podem afetar a visibilidade das linhas, o resumo ou o botão de checkout.
- **Prioridade:** P1.
- **Risco:** médio; separar a lógica sem preservar rollback, invalidação e reconciliação realtime pode causar itens duplicados ou resumo obsoleto.
- **Solução sugerida:** separar o controlador do carrinho da apresentação quando houver manutenção adicional. O controlador pode expor linhas, resumo, estado das mutations e comandos explícitos; o JSX pode ser dividido em linha, resumo e recomendações. Não criar um hook de mutation genérico para todas as features.
- **Necessidade:** não é necessária para o comportamento atual, mas é a próxima área com maior custo de manutenção depois do checkout.

### RCT-03 — Estado local redundante para remoção otimista do carrinho

- **Arquivo:** `src/features/cart/cart-page/index.tsx:27-32`, `src/features/cart/cart-page/index.tsx:44-63` e `src/features/cart/cart-page/index.tsx:107`.
- **Problema:** a remoção de uma linha é representada simultaneamente por `optimisticallyRemoved` e pela atualização otimista do cache de `keys.cart`.
- **Evidência:** o clique adiciona o NFT a `optimisticallyRemoved`; `onMutate` também remove a linha do cache; `onError` restaura o cache e limpa o array local; `onSuccess` atualiza o cache, mas não limpa o array local.
- **Impacto:** existem duas fontes de verdade para a presença da linha. Uma refetch ou uma atualização realtime durante a mutation pode produzir estados difíceis de prever, e uma linha que reapareça no cache pode continuar escondida pelo filtro local.
- **Prioridade:** P2.
- **Risco:** médio; a correção precisa manter o rollback sem criar uma segunda mutation ou perder o feedback imediato.
- **Solução sugerida:** escolher uma fonte de verdade. A opção preferível é usar o cache otimista como estado da lista e manter somente um estado de pending por item para controlar disabled/feedback; alternativamente, o array local deve ser exclusivamente um overlay temporário e ser removido também no sucesso.
- **Necessidade:** recomendada antes de adicionar inclusão de itens diretamente no carrinho ou mais eventos realtime. Pode permanecer enquanto o fluxo atual continuar estável.

### RCT-04 — `HomePage` mistura controlador de URL e três árvores de conteúdo

- **Arquivo:** `src/features/catalog/home/home-page/index.tsx:47-106` e `src/features/catalog/home/home-page/index.tsx:108-177`.
- **Problema:** o componente trata search params, debounce, query, derivação de filtros, paginação, estado do Sheet e renderização Desktop, Mobile, promoções e blog.
- **Evidência:** `HomePage` possui `filtersOpen`, `searchDebounce`, `routeSearch`, `updateSearch`, `handleSearchChange`, mapeamento de coleções e duas árvores de catálogo com tabs e cards.
- **Impacto:** mudanças de URL ou query exigem editar um arquivo que também contém detalhes visuais de várias seções. A leitura e a cobertura isolada de estados ficam mais difíceis.
- **Prioridade:** P2.
- **Risco:** médio; uma extração pode alterar a ordem dos nós ou os `key`s que sustentam a composição responsiva.
- **Solução sugerida:** extrair um controlador de busca/paginação somente quando houver evolução da regra e separar seções sem apagar a duplicação Desktop/Mobile. A árvore Desktop/Mobile deve continuar explícita, pois R-02 confirmou diferença estrutural real.
- **Necessidade:** não é necessária agora. A duplicação visual pode permanecer como está.

### RCT-05 — Cast inseguro do search state da Home

- **Arquivo:** `src/features/catalog/home/home-page/index.tsx:49` e `src/features/catalog/home/home-page/index.tsx:129`.
- **Problema:** o componente abandona o tipo gerado pelo TanStack Router com `strict: false` e usa casts para `Partial<CatalogSearch>` e `CatalogSearch['sort']`.
- **Evidência:** `const routeSearch = useSearch({ strict: false }) as Partial<CatalogSearch>` e `event.target.value as CatalogSearch['sort']`.
- **Impacto:** uma alteração futura no schema de busca pode deixar a página aceitando valores que `catalogOptions` ou a API não esperam. O compilador não protege a fronteira entre URL, select e query.
- **Prioridade:** P1.
- **Risco:** médio; valores inválidos podem gerar queries inconsistentes sem erro de TypeScript.
- **Solução sugerida:** usar o search tipado da rota Home ou normalizar a entrada em uma função única baseada em `catalogSearchSchema`. Para o `<select>`, derivar as opções de um conjunto literal tipado em vez de converter qualquer string.
- **Necessidade:** recomendada. Não exige mudança visual ou de comportamento esperado, apenas reforça a fronteira de tipos.

### RCT-06 — Cast duplicado do search state de autenticação

- **Arquivo:** `src/features/auth/auth-page/index.tsx:15-18`.
- **Problema:** `AuthPage` declara manualmente o tipo de `redirect` e `expired` em vez de consumir o contrato validado pela rota.
- **Evidência:** `useSearch({ strict: false }) as { redirect?: string; expired?: boolean | string }`, enquanto `authSearch` em `src/app/router.tsx:23-25` já normaliza esses valores.
- **Impacto:** o tipo do componente pode divergir do tipo efetivamente produzido pelo router. A regra de redirect fica duplicada entre a rota e a página.
- **Prioridade:** P2.
- **Risco:** baixo a médio; novas propriedades ou mudanças na normalização podem ser aceitas em um lugar e ignoradas no outro.
- **Solução sugerida:** manter a normalização no router e usar o search tipado da rota dentro de `AuthPage`. Se o componente continuar compartilhado entre login e registro, preservar apenas o prop de modo (`login`/`register`).
- **Necessidade:** não é urgente, mas é recomendada quando o contrato de autenticação receber novos parâmetros.

### RCT-07 — Contrato de `Select` não corresponde ao elemento renderizado

- **Arquivo:** `src/components/ui/select/index.tsx:14-27` e `src/components/ui/select/index.tsx:185-241`.
- **Problema:** `SelectProps` herda `ComponentProps<'select'>`, mas o componente renderiza uma `div` com um `button` e um `listbox`, além de receber `ref` para `HTMLDivElement`.
- **Evidência:** `extends Omit<ComponentProps<'select'>, 'onChange'>` contrasta com `forwardRef<HTMLDivElement>`; propriedades como `name`, `form`, `multiple` e outras aceitas pelo tipo nativo não são aplicadas ao DOM.
- **Impacto:** consumidores podem acreditar que o componente participa de submissão nativa de formulário ou suporta atributos de `<select>` que são silenciosamente ignorados. O contrato público promete mais do que a implementação fornece.
- **Prioridade:** P1.
- **Risco:** médio; a perda é principalmente de integração e acessibilidade de formulário, não visual.
- **Solução sugerida:** definir um contrato próprio para o combobox, incluindo somente atributos suportados, e documentar explicitamente como o valor participa de formulários. Se `name` for necessário, renderizar um input hidden controlado ou usar um `<select>` nativo estilizado.
- **Necessidade:** recomendada antes de reutilizar `Select` em novos formulários. Pode permanecer para os consumidores atuais, que usam `value` e `onChange` controlados.

### RCT-08 — API polimórfica de `Button` não está refletida nos tipos

- **Arquivo:** `src/components/ui/button/index.tsx:35-44` e `src/components/ui/button/index.tsx:60-78`.
- **Problema:** `ButtonProps` herda props de `<button>` mesmo quando `asChild` renderiza um `Slot` com `Link` ou `<a>`. Além disso, `ButtonVariant` e `ButtonSize` são declarados, mas a interface repete os unions inline.
- **Evidência:** `asChild?: boolean` controla uma árvore com outro elemento, e `onClick` é convertido com `event as React.MouseEvent<HTMLButtonElement>`. Os aliases exportados não são usados por `ButtonProps`.
- **Impacto:** TypeScript pode aceitar atributos de botão em links, rejeitar atributos válidos do elemento filho e permitir que os aliases exportados se desviem da API real.
- **Prioridade:** P2.
- **Risco:** baixo a médio; mudanças nos tipos podem revelar usos existentes, embora a renderização atual permaneça estável.
- **Solução sugerida:** usar uma união polimórfica explícita para `asChild` e reutilizar `ButtonVariant`/`ButtonSize` na interface. Não criar um sistema polimórfico global para todos os componentes.
- **Necessidade:** recomendada para segurança de tipos da API pública; não é necessária para a renderização atual.

### RCT-09 — Cast de `string` para rede no checkout

- **Arquivo:** `src/features/checkout/checkout-page/index.tsx:89` e `src/features/checkout/checkout-page/index.tsx:112-115`.
- **Problema:** o `Select` entrega `string`, mas o valor é convertido diretamente para `'ethereum' | 'polygon'` antes de chamar `createOrder`.
- **Evidência:** `network: network as 'ethereum' | 'polygon'`; `changePaymentMethod` também altera a rede por literals, mas não restringe a origem do `Select`.
- **Impacto:** um valor fora do contrato pode atravessar o componente sem proteção estática. O cast mascara a diferença entre o contrato genérico do `Select` e o contrato de pedido.
- **Prioridade:** P1.
- **Risco:** médio; uma opção inválida adicionada ao select pode chegar à mutation e ao mock/API.
- **Solução sugerida:** usar um tipo `Network` compartilhado e um handler que valide/narrow a string recebida, ou tornar o `Select` genérico sobre o conjunto de opções. A mutation deve receber um valor já validado, sem cast.
- **Necessidade:** recomendada. Não altera o comportamento dos valores atuais.

### RCT-10 — Props de desconto permitem combinações inválidas

- **Arquivo:** `src/features/catalog/home/nft-card/nft-card-types/index.ts:1-11`, `src/features/catalog/home/nft-card/nft-card-desktop/index.tsx:7-17` e `src/features/catalog/home/home-product-card/index.tsx:7-30`.
- **Problema:** `originalPrice` e `hasDiscount` representam o mesmo estado em duas props independentes. O contrato permite `hasDiscount: true` sem preço original ou preço original sem desconto.
- **Evidência:** a apresentação só renderiza o preço original com `originalPrice && hasDiscount`; `HomeProductCard` precisa preencher manualmente os dois campos.
- **Impacto:** combinações inválidas falham silenciosamente ou exigem conhecimento implícito do consumidor. A API do card fica menos expressiva que o estado visual real.
- **Prioridade:** P3.
- **Risco:** baixo; os consumidores atuais passam os valores coerentes.
- **Solução sugerida:** usar uma união discriminada para o estado promocional ou derivar o desconto exclusivamente da presença de `originalPrice`. Não ampliar a API com mais flags.
- **Necessidade:** pode permanecer. A mudança só se torna necessária ao adicionar outro consumidor ou mais variações de preço.

### RCT-11 — Estado da galeria e edição é inicializado a partir de props sem sincronização

- **Arquivo:** `src/features/catalog/nft-detail/nft-detail-gallery/index.tsx:17-20` e `src/features/catalog/nft-detail/nft-detail-summary/index.tsx:24-28`.
- **Problema:** `selectedImage` começa em `1` e `selectedEdition` começa em `nft.editions?.[2]`, mas nenhum estado é reajustado quando `nft`, `gallery` ou `editions` mudam.
- **Evidência:** `const [selectedImage, setSelectedImage] = useState(1)` seguido de `gallery[selectedImage]`; `const [selectedEdition, setSelectedEdition] = useState(nft.editions?.[2] ?? '1/50')`.
- **Impacto:** uma galeria com uma única imagem pode acessar `gallery[1]`; uma troca de NFT no mesmo ciclo de vida pode manter índice ou edição inexistente. O TypeScript atual não sinaliza o acesso porque `noUncheckedIndexedAccess` não está habilitado.
- **Prioridade:** P1.
- **Risco:** médio; o problema depende do shape recebido e pode aparecer em acesso direto, navegação entre detalhes ou fixtures novas.
- **Solução sugerida:** iniciar a imagem em índice válido (`0`), derivar/clamp o índice quando o recurso mudar e validar a edição selecionada contra a lista atual. Se o domínio garantir arrays não vazios, expressar essa garantia no contrato em vez de depender do índice.
- **Necessidade:** recomendada para robustez de dados. Não exige abstração compartilhada entre galeria e resumo.

### RCT-12 — IDs fixos no `Sheet` e lifecycle de overlays não totalmente composable

- **Arquivo:** `src/components/ui/sheet/index.tsx:35-79` e `src/components/ui/modal/modal-root/index.tsx:15-66`.
- **Problema:** cada `Sheet` usa os mesmos IDs `sheet-title` e `sheet-description`, e `Sheet` e `ModalRoot` duplicam a própria implementação de foco, `Escape`, scroll lock e restauração do elemento ativo.
- **Evidência:** `const titleId = 'sheet-title'` e `const descriptionId = 'sheet-description'`; ambos os overlays manipulam `document.body.style.overflow` e guardam `previousActiveElement` separadamente.
- **Impacto:** múltiplos Sheets simultâneos podem gerar IDs duplicados e associação ARIA ambígua. Overlays aninhados podem restaurar foco ou scroll em ordem incorreta. Atualmente há um uso de Sheet e um uso de Modal visíveis no fluxo principal.
- **Prioridade:** P2.
- **Risco:** baixo no uso atual, médio se overlays forem compostos ou abertos de forma concorrente.
- **Solução sugerida:** trocar IDs fixos por `useId` e, somente se existir requisito de overlays aninhados, extrair uma infraestrutura interna de focus/scroll testada. Não unificar `Modal` e `Sheet` em um componente de props genéricas apenas por duplicação.
- **Necessidade:** `useId` é recomendável antes de permitir múltiplas instâncias; a abstração de lifecycle pode permanecer adiada.

### RCT-13 — Dependência de efeito usa objeto de usuário em `OrderPage`

- **Arquivo:** `src/features/orders/order-page/index.tsx:36-41`.
- **Problema:** a subscription de pedido depende de `session.data?.user`, o objeto inteiro, em vez de depender apenas do identificador usado pelo socket.
- **Evidência:** `connectOrder(session.data.user.id, id, setRealtimeConnected)` com dependency array `[id, session.data?.user]`.
- **Impacto:** uma atualização da sessão que produza novo objeto com o mesmo usuário pode desconectar e reconectar o socket sem mudança de identidade. Em cenários de refetch frequente, isso aumenta churn e pode produzir estados transitórios de conexão.
- **Prioridade:** P3.
- **Risco:** baixo; o cleanup de `connectOrder` existe e evita listener permanente.
- **Solução sugerida:** depender de `session.data?.user?.id` e manter a função de conexão baseada somente nos valores que realmente determinam a subscription.
- **Necessidade:** pode permanecer enquanto a sessão mantiver identidade estrutural estável; é uma correção pequena se churn for observado.

## 4. Padrões avaliados e mantidos

### Composição

- `Modal.Root` com `Header`, `Title`, `Close` e `Body` é uma composição válida: existe contexto compartilhado para acessibilidade e lifecycle do diálogo.
- `Filters.Root` e `Filters.Group` usam `children` no ponto correto e não precisam receber dados de negócio.
- `Header.Root`, `Header.Navigation` e `Header.Actions` mantêm a ordem do shell sem uma lista excessiva de props no root.
- `Footer` permanece com rows concretas e sem reintroduzir `Column` ou `Bottom`, conforme R-05.

### Desktop/Mobile

- A duplicação de Home, `HomeHero`, `NftCard` e buy bar do detalhe é estrutural e deve permanecer explícita.
- Os dois trees em `HomePage` não justificam uma abstração comum cheia de flags. Uma futura extração deve separar dados de apresentação, não apagar a diferença de composição.
- A repetição dos controles de quantidade em `NftDetailSummary` é aceitável enquanto as regiões Desktop e Mobile permanecerem distintas.

### Hooks e callbacks

- Não há justificativa para adicionar `useMemo` ou `useCallback` genericamente. A maior parte dos callbacks são handlers locais ou callbacks de mutations e não demonstram custo de identidade por si só.
- `useLayoutMode` está bem localizado e usa o mecanismo apropriado para um external store responsivo.
- Queries e mutations permanecem próximas das regras de negócio; não há evidência para criar um hook global de formulário, mutation ou estado assíncrono.

### Children e tipos

- `DesktopLayout`, `MobileLayout`, `AccountSidebar` e partes compostas usam `children` de forma apropriada.
- `HomeFiltersProps`, `NftDetailRootProps` e os contratos de query tornam estados de loading/erro explícitos; não devem ser substituídos por um objeto genérico de estado.
- Os pontos de atenção de tipos estão concentrados nos casts de search/network, no `Select` customizado e na API polimórfica de `Button`, não na ausência de tipos em geral.

## 5. Prioridade sugerida

1. Corrigir os limites de tipo que mascaram valores inválidos: `Select`, search params, rede do checkout e `Button`.
2. Corrigir a inicialização/sincronização de estado da galeria e da edição.
3. Reduzir a duplicidade de estado otimista do carrinho.
4. Extrair controladores ou seções de `CheckoutPage`, `CartPage` e `HomePage` somente quando houver nova mudança de negócio ou manutenção comprovadamente difícil.
5. Endurecer IDs e lifecycle dos overlays se o produto passar a renderizar múltiplas instâncias.

Nenhum item deste relatório foi implementado nesta etapa.
