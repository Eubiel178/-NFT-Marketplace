# Desafio Frontend — Marketplace de NFTs

Implemente o **NFT Marketplace** em React e TypeScript, seguindo o [layout no Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1).

O desafio avalia fidelidade visual, qualidade das interações, integração com APIs, gerenciamento de estado assíncrono, tempo real, acessibilidade e performance.

## 1. Escopo

Entregue os fluxos de descoberta, compra e conta do colecionador, com versões desktop e mobile. APIs, autenticação, carteiras e pagamentos devem funcionar com dados simulados. Integrações reais com blockchain, extensões de carteira e gateways de pagamento estão fora do escopo.

O Figma define a identidade visual e a composição das telas. Este enunciado define os comportamentos e os cenários de avaliação. Estados não desenhados devem seguir o mesmo padrão visual.

## 2. Stack obrigatória

| Responsabilidade | Tecnologia |
| --- | --- |
| Interface | React |
| Linguagem | TypeScript |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Integração de dados | REST APIs |
| Tempo real | Socket.IO |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui |
| Mocking | MSW |
| Testes E2E e regressão visual | Playwright |
| Auditoria de performance e qualidade | Lighthouse |

As tecnologias devem participar efetivamente da solução. A ferramenta de build, a organização do projeto e as bibliotecas complementares ficam a critério do candidato.

## 3. Telas e fluxos

| Tela | Funcionalidades obrigatórias |
| --- | --- |
| Início | Destaques, catálogo, busca, filtros, ordenação e navegação para o NFT |
| Detalhes do NFT | Galeria, informações, edição, quantidade, favoritos e compra |
| Carrinho de NFTs | Edição de quantidades, remoção, cupom e resumo de valores |
| Pagamento | Dados do colecionador, seleção de carteira e rede, revisão e envio do pedido |
| Confirmação de pedido | Resultado, identificação da transação, itens, taxas e total |
| Login | Autenticação, validação e retorno ao fluxo anterior |
| Cadastro | Criação de conta, validação e tratamento de conflito |
| Perfil do colecionador | Edição dos dados, avatar e alteração de senha |
| Carteiras | Cadastro e edição de carteiras principal e secundária |

Implemente os frames desktop e mobile disponíveis. Perfil, carteiras e confirmação também devem funcionar em mobile, mesmo sem um frame específico.

Páginas editoriais, suporte, atividade, ofertas e downloads não fazem parte da entrega. Links externos e ações auxiliares devem ter comportamento coerente; ações fora do escopo não devem aparentar sucesso funcional.

### Catálogo e detalhe

- Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico.
- Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação.
- As consultas devem refletir os parâmetros enviados à API, com tratamento de resultados vazios, falhas e respostas fora de ordem.
- O detalhe deve suportar acesso direto, NFT inexistente, edição indisponível e limite de quantidade.
- Favoritos devem persistir para o usuário autenticado.

### Carrinho

- Adicionar, alterar e remover itens, respeitando a disponibilidade por NFT e edição.
- Manter o carrinho após refresh e preservar os itens do visitante ao autenticar.
- Aplicar e remover cupom, com tratamento de código inválido ou expirado.
- Exibir subtotal, desconto, taxa de rede e total coerentes com a resposta da API.
- Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto.

Valores em ETH devem trafegar como strings decimais e manter precisão nos cálculos e na apresentação. Quantidades são inteiras. A cotação da API é a referência para finalizar o pedido.

### Pagamento e confirmação

- Validar os campos do layout e permitir revisão antes do envio.
- Utilizar as carteiras cadastradas, com seleção de rede e simulação de conexão, recusa e desconexão.
- Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário.
- Impedir pedidos duplicados em cliques repetidos ou reenvios após timeout.
- Representar pedido pendente, confirmado e recusado, com recuperação após refresh ou reconexão.
- Exibir a confirmação somente para pedido efetivamente confirmado na simulação.
- Preservar os itens em falhas; após confirmação, remover do carrinho apenas os itens e quantidades comprados.

O recibo deve reproduzir o snapshot do pedido. Alterações posteriores no catálogo não podem modificar seus valores. Referências de transação e links de exploração são simulados.

### Conta e sessão

Cadastro, login, logout e sessão são obrigatórios, integrados à API simulada. Checkout, perfil, carteiras, favoritos e pedidos exigem autenticação.

A sessão deve ser recuperável após refresh. Trate expiração durante a navegação e durante o checkout, preservando o contexto para retomada. Logout e troca de usuário devem limpar dados privados em cache e subscriptions da sessão anterior.

Valide os formulários de cadastro, perfil, senha e carteiras, incluindo erros retornados pela API. Alterações confirmadas devem permanecer após refresh. Use credenciais fictícias e não armazene senhas em claro.

## 4. Integração e estado

Use TanStack Router nas rotas, parâmetros de busca e proteção dos fluxos privados. Use TanStack Query nas consultas, mutations e sincronização do cache. As chamadas REST devem passar pelo Axios.

A solução deve garantir:

- contratos tipados entre transporte, estado e interface;
- estados de carregamento, vazio, erro, sucesso e atualização em segundo plano;
- invalidação coerente após mutations e eventos;
- cancelamento ou descarte de respostas obsoletas;
- isolamento dos dados por usuário e pelos parâmetros da consulta;
- recuperação de falhas sem duplicar operações;
- tratamento de rotas inexistentes e acesso direto a qualquer tela prevista.

Aplique atualização otimista em pelo menos uma interação, com rollback em caso de falha. A política de cache, retries e sincronização deve ser documentada.

## 5. Contratos REST

Defina e documente os contratos utilizados. Os recursos mínimos são:

| Recurso | Operações |
| --- | --- |
| Sessão e conta | Cadastro, login, consulta da sessão, logout e expiração |
| NFTs | Listagem com busca/filtros/ordenação/paginação e detalhe por identificador |
| Favoritos | Consulta, inclusão e remoção |
| Carrinho | Consulta, inclusão, alteração e remoção de itens |
| Cotação | Validação de cupom, disponibilidade, descontos, taxas e total |
| Pedidos | Criação idempotente e consulta do estado e recibo |
| Perfil | Consulta, atualização de dados/avatar e alteração de senha |
| Carteiras | Consulta, cadastro e atualização |

As respostas devem representar erros de validação, sessão inválida, falta de permissão, recurso inexistente, conflito de disponibilidade e falha transitória.

As mutations de pedido devem aceitar uma chave de idempotência. Na simulação, a mesma tentativa deve recuperar o mesmo pedido; reutilizar a chave com conteúdo diferente deve gerar conflito.

## 6. Mocking com MSW

Implemente os mocks na camada de rede, reutilizando contratos e cenários entre desenvolvimento, demonstração e testes. Componentes, hooks e cliente Axios não devem conter respostas fictícias ou caminhos alternativos de negócio.

Os mocks devem manter estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras e pedidos. Persistência local é permitida para sustentar refresh; o reset deve restaurar integralmente um cenário conhecido.

### Simulating Network Conditions and Failures

Simule condições de rede e falhas com MSW, incluindo lentidão, latência variável, timeouts, indisponibilidade de conexão e respostas HTTP de erro. Os cenários devem ser configuráveis e reproduzíveis, permitindo avaliar o carregamento, o feedback de erro e a recuperação da interface.

Disponibilize fixtures com variedade suficiente para exercitar filtros e paginação, pelo menos dois usuários e cenários determinísticos de:

- sucesso e resultado vazio;
- latência variável e respostas fora de ordem;
- falhas de conexão e respostas HTTP 4xx/5xx;
- sessão expirada e acesso não autorizado;
- conflito de cadastro ou de validação de formulário;
- cupom inválido ou expirado;
- preço alterado ou edição esgotada durante a compra;
- timeout após criação do pedido, com recuperação por idempotência;
- pagamento confirmado e pagamento recusado.

Use MSW também na simulação dos eventos, com uma integração compatível com o protocolo Socket.IO, como [@mswjs/socket.io-binding](https://github.com/mswjs/socket.io-binding). Documente o transporte utilizado e suas limitações no ambiente de mocks.

Os cenários devem exercitar `socket.io-client`. Substituir o socket por chamadas diretas a setters, callbacks ou ao cache não atende ao requisito.

A camada de mocks deve ser ativada por configuração e estar disponível no build de demonstração. Mudanças nos dados simulados devem ser refletidas tanto nas respostas REST quanto nos eventos correspondentes.

## 7. Tempo real com Socket.IO

Implemente, no mínimo, os seguintes eventos:

| Evento | Comportamento esperado |
| --- | --- |
| `nft.updated` | Atualizar preço e disponibilidade no catálogo, detalhe e carrinho |
| `order.updated` | Atualizar o estado do pedido e apresentar confirmação ou recusa |

Os eventos devem carregar identidade estável, recurso afetado e versão. O cliente deve tolerar duplicatas e eventos antigos, sem regredir um estado mais recente nem reaplicar efeitos.

Após reconexão, reconcilie os recursos ativos com a API REST. Eventos de uma sessão anterior não podem atualizar dados de outro usuário. Listeners e subscriptions devem ser liberados ao encerrar seu ciclo de vida.

Implemente o cenário:

1. Um NFT está no carrinho.
2. Seu preço ou disponibilidade muda durante a navegação.
3. A interface informa a alteração e atualiza o resumo.
4. O checkout impede a confirmação com uma cotação desatualizada.

Também deve funcionar uma interrupção de conexão enquanto o pedido está pendente. Após reconectar ou recarregar a página, o usuário deve recuperar seu estado sem criar outra compra. Pedidos confirmados ou recusados são terminais.

## 8. Interface, responsividade e acessibilidade

Preserve tipografia, cores, espaçamentos, hierarquia, imagens, proporções e composição do Figma. Adapte os componentes shadcn/ui à identidade visual do projeto.

Todas as telas devem funcionar em desktop, tablet e mobile, com atenção a filtros, navegação, formulários, carrinho e checkout. Avalie, no mínimo, larguras de 390, 768 e 1440 pixels.

Use **skeletons com shimmer effect** nos componentes dependentes de dados durante o carregamento, incluindo catálogo, detalhe e resumo do carrinho. Preserve as dimensões do conteúdo para evitar deslocamentos de layout e respeite a preferência por movimento reduzido.

São obrigatórios:

- navegação por teclado e foco visível;
- controle de foco em diálogos e drawers;
- semântica adequada, labels e mensagens de erro associadas aos campos;
- alternativas textuais para imagens relevantes;
- contraste legível e estados não dependentes apenas de cor;
- feedback acessível para mutations e alterações em tempo real;
- ausência de overflow horizontal indevido e perda de conteúdo com zoom.

Use os assets do arquivo quando disponíveis e mantenha imagens e fontes necessárias acessíveis à execução local. Documente qualquer substituição de asset ou ajuste de acessibilidade em relação ao layout.

## 9. Testes com Playwright

Entregue testes E2E executáveis com os mocks, cobrindo:

1. Busca, filtros combinados, ordenação, paginação e restauração pelo histórico.
2. Acesso direto ao detalhe e tratamento de recurso inexistente.
3. Cadastro, login, expiração de sessão, logout e troca de usuário.
4. Favoritos, incluindo falha de mutation e recuperação do estado.
5. Carrinho, quantidades, remoção, cupom e persistência após refresh/login.
6. Compra completa, do catálogo ao recibo confirmado.
7. Falha de pagamento, clique repetido e timeout com recuperação do mesmo pedido.
8. Edição de perfil, avatar, senha e carteiras, com erros de validação.
9. Alteração de preço/disponibilidade via Socket.IO durante o checkout.
10. Eventos duplicados ou antigos, desconexão e retomada de pedido pendente.
11. Navegação por teclado, foco de diálogos e validação de formulários.
12. Skeletons durante carregamento lento, feedback de falha e recuperação após nova tentativa.

Execute os fluxos principais em Chromium, nos viewports desktop e mobile. Inclua regressão visual de início, detalhe, carrinho e pagamento, com baselines versionadas e dados estáveis.

Cada teste deve partir de um estado isolado. Controle relógio, latência e disparo dos eventos nos cenários sensíveis a tempo. Entregue relatório HTML e traces das falhas.

As verificações devem observar a interface e os resultados das operações. Os testes de tempo real precisam passar pelo cliente Socket.IO e os de REST pelos handlers MSW.

## 10. Performance e Lighthouse

Audite início e detalhe do NFT com Lighthouse em perfis mobile e desktop, usando build otimizado e o cenário padrão dos mocks.

| Categoria | Meta |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |

Execute três medições por página e perfil e reporte a mediana de cada categoria. Versione a configuração da auditoria e entregue relatórios HTML/JSON, versões das ferramentas, ambiente e condições de execução.

Registre LCP, CLS e TBT. Justifique resultados abaixo das metas e identifique as causas. A auditoria deve carregar as imagens, fontes e funcionalidades da entrega, sem simplificações exclusivas para melhorar a pontuação.

## 11. Critérios de avaliação

| Critério | Pontos | Evidência esperada |
| --- | ---: | --- |
| Fidelidade visual e responsividade | 20 | Aderência ao Figma e consistência entre tamanhos de tela |
| Fluxos e experiência de uso | 20 | Compra e conta completas, validações e recuperação de erros |
| Integração e estado | 15 | Router, Query, Axios, contratos e cache coerentes |
| Tempo real | 10 | Eventos, reconexão, ordenação e sincronização com REST |
| Mocking | 10 | MSW, cenários determinísticos, persistência e reset |
| Testes | 10 | Cobertura dos fluxos e falhas com Playwright |
| Acessibilidade | 5 | Operação por teclado, semântica, foco e feedback |
| Performance | 5 | Resultados e análise das auditorias Lighthouse |
| Arquitetura e documentação | 5 | Tipagem, responsabilidades e execução reproduzível |
| **Total** | **100** | |

São eliminatórios: ausência de uso efetivo da stack obrigatória, fluxos principais apenas visuais, compra confirmada sem resposta da simulação, exposição de dados entre usuários, eventos simulados diretamente na UI ou ausência de testes E2E executáveis.

## 12. Entrega

Entregue código-fonte, lockfile, assets, mocks, fixtures, testes e configurações de auditoria.

O **deploy é obrigatório**. Envie o link do repositório e uma URL pública da aplicação. Recomenda-se [Vercel](https://vercel.com/docs/frameworks/frontend/vite); [Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) e [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) também são aceitos.

A versão publicada deve corresponder ao código entregue e permanecer acessível durante a avaliação, com os mocks e os fluxos de tempo real funcionando. Acesso direto e refresh das rotas devem funcionar no ambiente publicado.

O `README.md` da solução deve conter setup, variáveis de ambiente, credenciais fictícias, seleção e reset dos cenários, comandos de execução e instruções para reproduzir os fluxos de falha.

Documente os contratos REST e eventos, a política de sessão, o estado do carrinho, a estratégia de cache e a reconciliação entre REST e Socket.IO. Registre limitações, decisões de UX e eventuais desvios do Figma em `ARCHITECTURE.md`.

Disponibilize comandos para desenvolvimento com mocks, build, preview, verificação de tipos, lint, testes Playwright e auditoria Lighthouse.

A entrega deve executar a partir de um checkout limpo, sem depender de serviços privados ou do backend de produção.

---

## 13. Solução

Marketplace de NFTs em React + TypeScript (Vite), com TanStack Router, TanStack Query, Axios, Socket.IO (`socket.io-client`), Tailwind CSS v4, shadcn/ui (Radix + CVA), MSW (REST e Socket.IO via `@mswjs/socket.io-binding`), Playwright e Lighthouse. Não há backend: toda a API e o tempo real são simulados por MSW no navegador, inclusive no build de demonstração.

Documentos: [arquitetura, decisões, desvios do Figma e limitações](ARCHITECTURE.md), [contratos REST e eventos](docs/CONTRACTS.md), [progresso por tela](docs/progresso.md), [auditoria dos requisitos](docs/eliminatorios.md), [medidas contra o Figma](docs/figma-medidas.md), [validação inicial](docs/VALIDATION.md).

### Setup e comandos

Node.js 24.18.0 utilizado; requisito mínimo 22.19.0 (incluindo Lighthouse). Use npm e o `package-lock.json` entregue:

```sh
npm ci
npx playwright install chromium
npm run dev
```

`dev` usa `.env.demo` e atende em `http://127.0.0.1:5173`. Para personalizar, copie `.env.example` para `.env.local`.

| Variável (públicas, nunca inserir segredos) | Padrão | Efeito |
| --- | --- | --- |
| `VITE_ENABLE_MOCKS` | `true` | Liga o MSW (REST e Socket.IO). Sem ele, a aplicação espera um backend compatível; nenhum é entregue |
| `VITE_API_URL` | `/api` | Prefixo da API. Os mocks atendem `/api` na mesma origem; mantenha na demonstração |
| `VITE_SOCKET_URL` | vazio | Origem do Socket.IO; vazio usa a origem atual |

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento com MSW |
| `npm run build` | Tipos e build; mocks conforme o ambiente |
| `npm run build:demo` | Build otimizado com MSW habilitado (usado no deploy) |
| `npm run preview` | Servir o build em `http://127.0.0.1:4173` |
| `npm run typecheck` | Verificação TypeScript estrita |
| `npm run lint` | ESLint sem warnings |
| `npm run test:e2e` | Playwright: build demo automático, Chromium 1440 (`chromium-desktop`), 768 (`chromium-tablet`) e 390 (`chromium-mobile`) |
| `npm run test:e2e:ui` | Playwright em modo interativo |
| `npm run test:report` | Relatório HTML; traces e screenshots de falhas em `test-results` |
| `npm run test:visual` | Só os testes `@visual` (regressão visual) |
| `npm run audit:lighthouse` | 12 medições (Home e Detalhe × mobile e desktop × 3), HTML/JSON e medianas em `reports/lighthouse/`; requer o preview em execução e Chrome |

Para um spec isolado: `npx playwright test phase23 --project=chromium-desktop --project=chromium-mobile`. Para Lighthouse, execute `npm run build:demo` e `npm run preview` em um terminal e `npm run audit:lighthouse` em outro. `CHROME_PATH` escolhe o Chrome/Chromium e `AUDIT_URL` muda a origem. A configuração não simplifica a aplicação para a auditoria.

### Credenciais fictícias

| Usuário | E-mail | Senha |
| --- | --- | --- |
| Ana | `ana@example.test` | `kurio-demo` |
| Bruno | `bruno@example.test` | `bruno-demo` |

Usadas só no modo demo; as senhas ficam no mock apenas como hash SHA-256 com salt, e novos cadastros também. O código de indicação (obrigatório no pagamento desktop e na carteira) aceito é `KURIO-2026`; outro código devolve `422` no campo.

### Mocks, cenários e reset

O banco do mock (catálogo, usuários, sessão, carrinhos, favoritos, perfil, carteiras, cotações, pedidos e chaves de idempotência) persiste em `localStorage` (`nft-marketplace:mock-db:v8`); o cenário ativo, em `nft-marketplace:scenario`. Os endpoints abaixo só existem no mock e são chamados do console do navegador da aplicação, com o MSW ativo. Eles não fazem parte do contrato de produto.

```js
// Seleciona um cenário e recarrega
await fetch('/api/__mock/scenario', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'slow' }),
})
location.reload()

// Restaura o banco inteiro e o cenário `default`
await fetch('/api/__mock/reset', { method: 'POST' })
location.reload()
```

| Endpoint (`/api/__mock/...`) | Efeito |
| --- | --- |
| `POST /scenario` `{ scenario }` | Seleciona o cenário (`422` se desconhecido) |
| `POST /reset` | Restaura o banco e o cenário `default` |
| `POST /session/expire` | Marca a sessão como expirada (`GET /session` passa a dar `401`) |
| `POST /nfts/:id/update` | Sobe a versão do NFT, muda o preço para `0.125` ETH, persiste e emite `nft.updated` |
| `POST /nfts/:id/event` `{ version?, price? }` | Reemite `nft.updated` **sem alterar o banco**, para duplicata ou versão antiga; o preço do payload nunca é aplicado pelo cliente |
| `POST /orders/:id/confirm` | Confirma um pedido pendente (tira do carrinho só o que foi comprado) e emite `order.updated` |
| `POST /orders/:id/decline` | Recusa um pedido pendente (carrinho preservado) e emite `order.updated` |
| `POST /orders/:id/event` `{ version?, status? }` | Emite `order.updated` sem alterar o pedido (duplicata ou versão antiga); só chega ao socket inscrito do dono |
| `GET /socket/clients` | Quantidade de conexões Socket.IO abertas no mock |
| `POST /socket/disconnect` | Derruba as conexões Socket.IO (o cliente reconecta sozinho) |

Cenários (`default` é o padrão):

| Cenário | Efeito |
| --- | --- |
| `default` | Sucesso |
| `empty` | `GET /nfts` devolve lista vazia |
| `slow` | 2 s no catálogo, no detalhe, na cotação, no perfil e nas carteiras |
| `variable-latency` | Catálogo: páginas ímpares 900 ms e pares 100 ms (respostas fora de ordem) |
| `network-error` | Falha de conexão no catálogo e no detalhe |
| `http-500` | `503 TRANSIENT_FAILURE` no catálogo e no detalhe |
| `unauthorized` | `401 SESSION_EXPIRED` no catálogo e no detalhe |
| `favorites-error` | `503` em favoritos |
| `cart-error` / `cart-load-error` | `503` ao alterar / ao carregar o carrinho |
| `quote-error` | `503` na cotação |
| `profile-error` / `wallets-error` | `503` em perfil / carteiras |
| `order-error` | `503` ao consultar um pedido |
| `wallet-rejected` | A carteira recusa a conexão (`409 WALLET_REJECTED`) |
| `payment-declined` | O pedido nasce recusado |
| `payment-pending` | O pedido nasce pendente e é confirmado sozinho em 400 ms, pelo evento `order.updated` |
| `payment-held` | O pedido nasce pendente e só muda com `POST /__mock/orders/:id/confirm` ou `/decline` |
| `payment-timeout` | O pedido é criado, mas a resposta é `504 ORDER_TIMEOUT`; o cliente recupera o mesmo pedido pela chave de idempotência |
| `stale-quote` | Todo `POST /orders` devolve `409 QUOTE_STALE` |

Como reproduzir os fluxos de falha:

| Fluxo | Como |
| --- | --- |
| Lentidão e skeletons | `slow`, abrir `/`, `/nfts/nft-1`, `/profile` ou `/wallets` |
| Erro e nova tentativa | `network-error` ou `http-500`, abrir `/`, voltar a `default` e clicar em "Tentar novamente" |
| Respostas fora de ordem | `variable-latency`, ir da página 2 para a 3 e logo para a 4: a tela fica na 4 |
| Sessão expirada | Logado, `POST /session/expire` e navegar para uma rota privada ou salvar o perfil: vai ao login com `expired=true` e volta ao destino depois do login |
| Acesso não autorizado | `unauthorized` (visitante só vê o erro; com usuário na sessão, vai ao login) |
| Cupom inválido ou expirado | No carrinho, `INVALIDO` ou `KURIO5` |
| Preço alterado | Com um NFT no carrinho, `POST /nfts/nft-1/update` |
| Edição esgotada | `/nfts/nft-4`, edição `1/1` |
| Carteira recusada | `wallet-rejected`, "Desconectar" e "Conectar" no pagamento |
| Pagamento recusado | `payment-declined` e enviar o pedido |
| Timeout após criar o pedido | `payment-timeout` e enviar o pedido: abre o mesmo pedido, pendente, e a confirmação chega pelo socket |
| Clique repetido / idempotência | Clicar várias vezes em "Enviar pedido": um único `POST /orders` bem-sucedido |
| Pedido pendente | `payment-held`, enviar o pedido e voltar a `/checkout`: leva ao pedido |
| Queda do Socket.IO | `payment-held`, enviar o pedido, `POST /socket/disconnect` e `POST /orders/:id/confirm`: ao reconectar o pedido aparece confirmado |

Cenário com tempo real: abra `/nfts/nft-1`, aguarde o carregamento e execute `await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' })`. O preço persistido muda, o mock emite `nft.updated` pelo protocolo Socket.IO e o cliente reconcilia por REST.

### Regras de comportamento

- **Cache** (`src/lib/query.ts`): dados frescos por 30 s, coletados após 5 min sem uso, reconsulta ao voltar o foco da janela. Queries repetem uma vez, apenas em falha de rede ou 5xx (nunca 4xx); mutations não têm retry. A sessão tem `staleTime` 0 e sem retry. As chaves levam o usuário (`cart`, `favorites`, `profile`, `wallets`, `orders`, cotações) e todos os parâmetros do catálogo.
- **Respostas obsoletas**: o `AbortSignal` do Query chega ao Axios em todas as consultas; mudar os parâmetros abandona a consulta anterior, e a resposta atrasada nunca ocupa a tela.
- **Atualização otimista com rollback**: favoritos, quantidade e remoção no carrinho, e troca da carteira principal.
- **Tempo real**: o socket é criado antes da aplicação (o MSW precisa estar ativo antes de o `socket.io-client` ser avaliado, por isso `main.tsx` importa `app/render` depois de `worker.start()`). Eventos só invalidam queries e o REST é a fonte da verdade. Duplicatas e eventos antigos são descartados pela versão; reconexão reconcilia catálogo, carrinho, cotações e pedidos por REST; eventos de pedido só valem para quem assinou, e a assinatura é descartada no logout e na troca de usuário.
- **Sessão expirada**: qualquer `401` do Axios (menos login, cadastro e logout) descarta os dados privados, encerra as assinaturas e vai ao login com o destino atual; o guard faz o mesmo a cada navegação privada. No pagamento, o formulário e a revisão aberta são guardados por usuário e restaurados depois do login, com a mesma chave de idempotência (sem pedido duplicado). Detalhes em [ARCHITECTURE.md](ARCHITECTURE.md).
- **Pedido pendente**: `GET /api/orders?status=pending` (por usuário) faz o `/checkout` redirecionar para o pedido; `POST /api/orders` com pedido pendente responde `409 ORDER_PENDING`. Confirmado e recusado são terminais e liberam novo pagamento.
- **ETH** é sempre string decimal (BigInt em wei nos cálculos) e quantidades são inteiras.

### Testes E2E (`tests/e2e`)

Os specs rodam pelos handlers MSW e pelo `socket.io-client`; cada teste parte de um contexto isolado e do reset do mock. Relatório HTML e traces de falha pelo `playwright.config.ts`. A regressão visual (`visual-regression.spec.ts`: Início, Detalhe, Carrinho e Pagamento em 1440, 768 e 390) usa baselines versionadas em `tests/e2e/visual-regression.spec.ts-snapshots/`, nomeadas só por tela e projeto (sem plataforma), com `maxDiffPixelRatio` 0,002; para regenerar depois de uma mudança de layout intencional: `npx playwright test visual-regression --update-snapshots`. Os specs `phase16` a `phase23`:

| Spec | Cobertura |
| --- | --- |
| `phase16-pagination-session` | Paginação (URL, histórico, refresh, sem overflow em 390); sessão expirada sem recarregar (navegação, ação na página e envio do pedido, com retomada e sem pedido duplicado) |
| `phase17-ordering-latency` | Ordenação por preço e por nome; respostas fora de ordem com `variable-latency` |
| `phase18-scenarios` | `unauthorized` (visitante e logado) e `wallet-rejected` |
| `phase19-clock` | `page.clock`: pedido pendente após timeout até o relógio avançar; expiração com o relógio parado |
| `phase20-review-dialog-focus` | Foco do diálogo "Revise sua compra": entra, fica preso, Esc e Fechar devolvem ao botão |
| `phase21-realtime-events` | `nft.updated` e `order.updated` duplicados ou antigos; queda do socket com pedido pendente |
| `phase22-detail-skeleton-tablet` | Skeleton do detalhe em 768px |
| `phase23-pending-order` | Pedido pendente bloqueia novo checkout; terminais liberam; isolamento entre usuários |

Os demais specs (`foundation`, `phase0-*`, `phase2` a `phase15`, `phase5-visual`, `home-visual`, `visual-regression`) cobrem os fluxos de catálogo, conta, carrinho, compra, perfil, carteiras, estados e acessibilidade; o mapeamento item a item do §9 está em [docs/eliminatorios.md](docs/eliminatorios.md).
