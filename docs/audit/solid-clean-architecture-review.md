# Auditoria SOLID / Clean Architecture — Fase 8

**Data:** 03/10/2026  
**Escopo:** auditoria somente; nenhum arquivo de código foi alterado nesta fase.

## 1. Resumo

A arquitetura atual é suficientemente simples e funcional para o escopo do marketplace. As fronteiras mais importantes estão presentes: APIs de feature usam Axios e schemas Zod, o estado remoto usa TanStack Query, o realtime usa `socket.io-client`, os mocks ficam em MSW e as árvores Desktop/Mobile permanecem separadas quando a composição realmente diverge.

Foram encontrados seis problemas concretos que afetam dependências, contratos ou invariantes de negócio, e dois pontos de menor prioridade já conhecidos em auditorias anteriores. Não há justificativa para criar repositories, services, factories, use cases ou hooks genéricos apenas para reorganizar arquivos.

`docs/audit/refactor-plan.md` e `docs/audit/final-architecture-review.md` não existem no workspace. Essa ausência foi considerada na análise; os demais documentos solicitados foram lidos integralmente.

### Conclusão executiva

- **Corrigir:** ciclo de dependências entre layout compartilhado e catálogo; dependência da confirmação no catálogo mutável; contrato incorreto do `Select`; estado de galeria/edição não sincronizado com o NFT; validação incompleta do envelope de carteiras.
- **Corrigir quando houver próxima alteração de contrato:** duplicação do tipo/regras de `Network` e contrato polimórfico de `Button`.
- **Manter:** APIs de feature, contratos Zod, QueryClient central, MSW, Socket.IO, shells Desktop/Mobile, composição existente e páginas como orquestradoras.

## 2. Problemas encontrados

### AC-01 — Ciclo entre `components` e `features`

- **Arquivos:** `src/components/layout/auth-marketplace-background/index.tsx:4-5,19-25`; `src/components/index.ts:1-2`; `src/components/layout/index.ts:1-9`; `src/features/catalog/home/home-hero/index.tsx:3`.
- **Componente/módulo:** `AuthMarketplaceBackground`, barrel de componentes e `HomeHero`.
- **Problema:** um componente publicado como parte de `components/layout` importa a API e um componente da feature de catálogo. `HomeHero`, por sua vez, importa o barrel `@/components`, que reexporta o próprio layout. O grafo efetivo contém o ciclo `components -> features/catalog -> components`.
- **Princípio afetado:** Dependency Inversion, acyclic dependencies, separação entre UI compartilhada e feature.
- **Prioridade:** P1.
- **Risco:** médio. O bundler resolve o ciclo hoje, mas a ordem de inicialização pode produzir exports parcialmente inicializados e dificulta testes isolados do layout.
- **Impacto:** qualquer evolução do background ou do hero pode exigir carregar a feature inteira dentro da camada compartilhada; o layout deixa de ser reutilizável e os testes precisam montar infraestrutura de catálogo.
- **Solução sugerida:** manter a composição da tela de autenticação em uma fronteira de feature/app, ou fazer o shell receber o conteúdo decorativo como `children`. A solução não exige service nem hook novo.
- **Correção realmente necessária:** sim, antes de reutilizar `components/layout` fora desta aplicação ou ampliar o background. Não é necessário alterar o comportamento visual atual para corrigir a direção das dependências.

### AC-02 — Realtime conhece caches e domínios concretos

- **Arquivo:** `src/lib/realtime.ts:11,21-22,38-40,69-70`.
- **Componente/módulo:** `connectCatalog`, `connectNftUpdates` e `connectOrder`.
- **Problema:** o módulo de transporte Socket.IO depende diretamente do `queryClient` global e de chaves de catálogo, carrinho, cotação, checkout e pedidos. A camada de realtime decide quais queries de várias features devem ser invalidadas.
- **Princípio afetado:** Single Responsibility, Dependency Inversion e separação entre infraestrutura de transporte e política de atualização de cada feature.
- **Prioridade:** P2.
- **Risco:** médio. A adição de um novo recurso realtime exige editar um módulo central e aumenta a chance de invalidação indevida ou difícil de testar.
- **Impacto:** testes unitários do transporte precisam conhecer o QueryClient global; as features não controlam completamente a consequência dos eventos que recebem.
- **Solução sugerida:** preservar a conexão, validação de versão e cleanup no módulo realtime, mas deixar a reconciliação específica ser registrada pelo consumidor da feature ou por adaptadores pequenos e explícitos. Não criar um event bus genérico.
- **Correção realmente necessária:** não para o comportamento atual; torna-se necessária quando houver novos tipos de evento ou mais consumidores independentes.

### AC-03 — Confirmação de pedido depende do catálogo mutável

- **Arquivo:** `src/features/orders/order-page/index.tsx:8-9,19-35,107-155`.
- **Componente/módulo:** `OrderPage`.
- **Problema:** a página de pedido faz uma consulta adicional ao catálogo e usa o NFT atual como fallback para nome e imagem do recibo. O pedido já carrega dados de snapshot em `quote.items`, e a confirmação não deveria depender de uma fonte mutável ou de uma segunda feature.
- **Princípio afetado:** separação de bounded contexts, Dependency Inversion e responsabilidade única do recibo.
- **Prioridade:** P1.
- **Risco:** médio. Uma falha, ausência ou alteração posterior no catálogo pode modificar a apresentação do recibo ou impedir que a confirmação seja montada, contrariando a regra de snapshot do README.
- **Impacto:** `OrderPage` não pode ser testada somente com o contrato de pedido; o fluxo de confirmação também acopla disponibilidade do catálogo ao histórico de uma compra.
- **Solução sugerida:** tornar os dados necessários ao recibo obrigatórios no snapshot do pedido e renderizar a confirmação apenas a partir de `order.data.quote.items`. A API de catálogo não deve ser dependência do pedido confirmado.
- **Correção realmente necessária:** sim, para garantir integralmente a invariância do recibo. Se o backend/mock passar a garantir todos os campos de snapshot, a consulta do catálogo deve ser removida.

### AC-04 — Contrato de `Select` não representa o elemento renderizado

- **Arquivo:** `src/components/ui/select/index.tsx:14-25,27,185-246`.
- **Componente/módulo:** `Select`.
- **Problema:** `SelectProps` herda `ComponentProps<'select'>`, mas o componente renderiza uma `div`, um `button` e um `listbox`. Props como `name`, `form`, `multiple` e atributos de `<select>` são aceitos pelo TypeScript, mas não têm o comportamento prometido.
- **Princípio afetado:** Liskov Substitution, Interface Segregation e honestidade da fronteira de UI.
- **Prioridade:** P1.
- **Risco:** médio. Um consumidor pode acreditar que o campo participa de um formulário nativo ou que suporta semântica de select que não é aplicada ao DOM.
- **Impacto:** integração de formulários e testes por contrato ficam frágeis; a API pública promete mais do que a implementação fornece.
- **Solução sugerida:** definir props próprias somente para o combobox suportado, ou renderizar uma representação nativa/hidden quando `name` e submissão de formulário forem requisitos reais.
- **Correção realmente necessária:** sim, antes de adicionar consumidores que dependam de atributos nativos. Os consumidores atuais controlam `value` e `onChange`, portanto a correção pode ser planejada sem urgência visual.

### AC-05 — Estado do detalhe não acompanha troca de recurso

- **Arquivos:** `src/features/catalog/nft-detail/nft-detail-gallery/index.tsx:18-20,30-34,43`; `src/features/catalog/nft-detail/nft-detail-summary/index.tsx:24-26,54`.
- **Componente/módulo:** `NftDetailGallery` e `NftDetailSummary`.
- **Problema:** a galeria começa com `selectedImage = 1`, embora o índice válido inicial seja dependente do array; nenhum estado é reajustado quando `nft`, `gallery` ou `editions` mudam. A edição selecionada também pode permanecer inexistente para outro NFT.
- **Princípio afetado:** coesão de estado, invariantes de domínio e responsabilidade do componente de apresentação em manter seu estado derivado válido.
- **Prioridade:** P1.
- **Risco:** médio. Um NFT com galeria curta pode produzir imagem indefinida; navegação entre recursos ou respostas atualizadas pode manter seleção inválida.
- **Impacto:** a apresentação passa a depender de shape incidental da resposta e fica mais difícil de testar com fixtures variadas.
- **Solução sugerida:** iniciar em índice válido e reajustar/clamp a seleção quando o identificador, a galeria ou as edições mudarem. A seleção deve ser validada contra o recurso atual.
- **Correção realmente necessária:** sim, para robustez do contrato de detalhe. Não exige abstração compartilhada entre galeria e resumo.

### AC-06 — Envelope de carteiras é afirmado antes de ser validado

- **Arquivo:** `src/features/account/api/index.ts:20-23`.
- **Componente/módulo:** `getWallets`.
- **Problema:** a resposta Axios é convertida por `as { items: unknown }` antes de qualquer validação do envelope. Apenas `data.items` é validado; `null`, uma resposta sem `items` ou uma resposta com envelope diferente pode produzir erro de acesso em vez de falha de contrato explícita.
- **Princípio afetado:** Dependency Inversion na fronteira de infraestrutura, contrato explícito e fail-fast previsível.
- **Prioridade:** P2.
- **Risco:** baixo a médio. O endpoint atual funciona, mas a forma do transporte fica implicitamente acoplada ao consumidor.
- **Impacto:** erros de integração aparecem como exceções genéricas e o módulo de API não oferece um contrato Zod completo para testes ou evolução do endpoint.
- **Solução sugerida:** declarar um schema de resposta `{ items: z.array(walletSchema) }` em `contracts` e fazer `parse` do payload inteiro no módulo de API.
- **Correção realmente necessária:** recomendada antes de alterar o contrato de carteiras ou integrar backend real; não exige criar camada intermediária.

### AC-07 — Contrato de rede duplicado apesar do tipo compartilhado

- **Arquivos:** `src/contracts/index.ts:5,8,33,41-42`; `src/features/checkout/api/index.ts:4`; `src/mocks/handlers.ts:19-20,46`; `src/features/catalog/home/home-filters/index.tsx:8,12`.
- **Componente/módulo:** contratos de `Network`, APIs de checkout, mocks e filtros.
- **Problema:** `Network` foi criado, mas APIs, interfaces, schemas e mocks continuam repetindo unions e enums independentes. A repetição permite que uma nova rede seja aceita em um ponto e rejeitada em outro.
- **Princípio afetado:** Open/Closed, consistência de contrato e Single Source of Truth.
- **Prioridade:** P2.
- **Risco:** baixo no estado atual; médio quando o domínio de redes evoluir.
- **Impacto:** aumenta o número de pontos que precisam ser alterados e dificulta garantir que transporte, estado e UI compartilhem exatamente o mesmo conjunto de valores.
- **Solução sugerida:** centralizar o schema de rede e derivar os tipos usados por pedidos, carteiras, filtros e mocks, sem criar um serviço ou uma fábrica.
- **Correção realmente necessária:** não para os valores atuais; recomendada antes de adicionar qualquer nova rede.

### AC-08 — API polimórfica de `Button` aceita contrato de botão para filhos não-botão

- **Arquivo:** `src/components/ui/button/index.tsx:38-44,60-75`.
- **Componente/módulo:** `Button` com `asChild`.
- **Problema:** `ButtonProps` sempre herda `ComponentProps<'button'>`, embora `asChild` possa renderizar um link via `Slot`; o callback também precisa de um cast de evento para parecer um evento de botão.
- **Princípio afetado:** Liskov Substitution e Interface Segregation.
- **Prioridade:** P2.
- **Risco:** baixo no uso atual; médio se o componente receber mais atributos ou consumidores polimórficos.
- **Impacto:** o TypeScript aceita combinações inválidas e não protege atributos do elemento filho real.
- **Solução sugerida:** modelar duas variantes de props, uma para botão e outra para `asChild`, preservando a API visual existente.
- **Correção realmente necessária:** não para os consumidores atuais; recomendada antes de ampliar a API pública.

## 3. Componentes e módulos adequados

Os seguintes pontos devem permanecer como estão no desenho atual:

- `src/features/*/api`: APIs de feature usam o cliente Axios e validam respostas com schemas antes de expor dados à UI.
- `src/contracts/index.ts`: a concentração dos contratos compartilhados é adequada para o mock, transporte e estado atuais; não há necessidade de criar contratos duplicados por feature.
- `src/lib/http.ts`: cliente Axios e parsing de erros estão centralizados sem introduzir service/repository artificial.
- `src/lib/query.ts`: QueryClient e factory de chaves fornecem uma fronteira simples e adequada para o estado remoto.
- `src/mocks/handlers.ts`, `src/mocks/db.ts` e `src/mocks/socket.ts`: a regra simulada permanece na camada MSW, como exigido pelo README e pelo AGENTS.
- `src/components/ui/modal/*`: composição, contexto, foco e lifecycle formam uma fronteira coesa.
- `src/components/ui/filters/*`: composição por `children` não conhece regras de negócio e é adequada.
- `src/features/catalog/nft-detail/*`: `NftDetail.Root` e suas partes representam uma composição concreta da feature, não uma abstração genérica.
- `src/features/catalog/home/home-page/*`: as extrações Desktop/Mobile, promoções, blog e normalização da Home preservam a responsabilidade da página sem criar um `Home.Root` artificial.
- `src/features/cart/cart-page/*` e `src/features/checkout/checkout-page/*`: as partes extraídas são privadas e deixam as páginas como orquestradoras; não há motivo para criar controladores genéricos somente pelo tamanho.
- `src/components/layout/desktop-layout` e `src/components/layout/mobile-layout`: shells estruturalmente diferentes devem continuar separados.
- `src/features/catalog/home/nft-card/*` e `HomeHero`: as árvores responsivas têm composição e conteúdo diferentes; unificá-las aumentaria condicionais e risco visual.
- `src/main.tsx`: inicializar MSW antes do carregamento do app é uma decisão correta para interceptar REST e WebSocket.
- `src/lib/eth.ts`: manter conversões de ETH isoladas e baseadas em strings/BigInt é adequado ao contrato do domínio.

## 4. Violações concretas

| ID | Violação | Princípio principal | Prioridade | Necessidade |
| --- | --- | --- | --- | --- |
| AC-01 | Ciclo `components -> features/catalog -> components` | DIP / dependências acíclicas | P1 | Sim antes de ampliar o shell |
| AC-02 | Realtime conhece caches de várias features | SRP / DIP | P2 | Não imediata |
| AC-03 | Recibo consulta catálogo mutável | fronteira de domínio / snapshot | P1 | Sim para a garantia do recibo |
| AC-04 | `SelectProps` promete `<select>` mas renderiza combobox | LSP / ISP | P1 | Sim antes de novos consumidores |
| AC-05 | Seleção de galeria/edição pode ficar inválida | coesão e invariantes | P1 | Sim |
| AC-06 | Envelope de carteiras não é validado inteiro | fronteira de contrato | P2 | Recomendada |
| AC-07 | `Network` repetido em contratos, API e mocks | OCP / single source of truth | P2 | Não imediata |
| AC-08 | `Button` polimórfico possui tipo de botão único | LSP / ISP | P2 | Não imediata |

## 5. Prioridades

### P1

- AC-01: quebrar o ciclo de dependências entre layout compartilhado e catálogo.
- AC-03: preservar o snapshot do pedido sem depender do catálogo atual.
- AC-04: alinhar o contrato público de `Select` ao elemento realmente renderizado.
- AC-05: manter seleção de imagem e edição válida quando o recurso muda.

### P2

- AC-02: reduzir conhecimento de domínios no módulo realtime quando novos eventos forem adicionados.
- AC-06: validar o envelope completo de carteiras.
- AC-07: consolidar o domínio de rede antes de adicionar novos valores.
- AC-08: tornar a API polimórfica do `Button` honesta antes de ampliá-la.

### P3

Não foi encontrado problema adicional que exigisse P3. Melhorias puramente organizacionais, redução de arquivos ou padronização estética não foram classificadas como achados.

## 6. Refatorações recomendadas

- Reposicionar a composição específica do background de autenticação em uma fronteira de feature/app ou injetar somente o conteúdo necessário no shell, eliminando o ciclo.
- Fazer o pedido confirmado carregar e exibir seu snapshot completo, removendo a consulta de catálogo da confirmação.
- Restringir a interface de `Select` ao contrato de combobox efetivamente suportado.
- Corrigir a inicialização e sincronização do estado local de galeria e edição.
- Validar o envelope de carteiras com schema Zod completo.
- Reutilizar um schema/tipo de rede compartilhado quando houver nova evolução do domínio.
- Modelar a variante `Button`/`asChild` somente se surgirem novos consumidores que dependam dessa API.
- Manter a validação de eventos e o cleanup no Socket.IO, mas mover a política de invalidação específica para os consumidores quando a quantidade de eventos crescer.

## 7. Refatorações que não devem ser feitas

- Não criar repositories, services ou use cases que apenas repassem chamadas Axios existentes.
- Não criar factories ou interfaces para abstrair uma única implementação.
- Não criar hooks genéricos para query, mutation, formulário, cache ou realtime sem um segundo consumidor e uma regra compartilhada real.
- Não transformar `Home`, `Cart`, `Checkout` ou `Order` em compounds públicos.
- Não unificar `DesktopLayout` e `MobileLayout` por flags.
- Não unificar `HomeHero`, `NftCard`, buy bar do detalhe ou os blocos Desktop/Mobile quando a hierarquia visual é diferente.
- Não dividir `mocks/handlers.ts` somente por tamanho se as fronteiras não reduzirem acoplamento real.
- Não mover contratos para módulos locais de cada feature enquanto são compartilhados por transporte, estado e MSW.
- Não substituir MSW por respostas nos componentes nem substituir Socket.IO por callbacks diretos.
- Não alterar CSS, tokens, assets, URLs ou composição visual como parte desta auditoria arquitetural.

## 8. Ordem recomendada das eventuais correções

1. Corrigir AC-03 para proteger o snapshot do pedido, pois é uma invariância funcional do README.
2. Corrigir AC-01 para eliminar a dependência circular entre shell compartilhado e catálogo.
3. Corrigir AC-04 e AC-05, endurecendo contratos de UI e invariantes de estado local.
4. Corrigir AC-06 na próxima alteração da API de carteiras.
5. Consolidar AC-07 antes de adicionar outra rede ou alterar contratos de pagamento.
6. Reavaliar AC-02 e AC-08 somente quando houver novos eventos realtime ou novos usos polimórficos de `Button`.

## Resultado

Esta fase produziu somente este relatório. Nenhum arquivo de código, CSS, teste, contrato, mock, rota ou componente foi alterado.
