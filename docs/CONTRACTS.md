# Contratos REST e eventos

Fonte: README §§4–7. Prefixo `/api`; todas as chamadas da aplicação passam pelo Axios (`src/lib/http.ts`) e todas as respostas são validadas com Zod (`src/contracts/index.ts`, compartilhado por cliente e mocks). A API é simulada por MSW (`src/mocks`). ETH é string decimal não negativa com até 18 casas (`^\d+(\.\d{1,18})?$`); cálculos em wei com BigInt; quantidades são inteiros.

## Erros

Formato: `{ code, message, fields?: Record<string, string> }`. `fields` associa a mensagem ao campo do formulário.

| Status | Códigos |
| --- | --- |
| 401 | `UNAUTHORIZED` (sem sessão), `SESSION_EXPIRED` (sessão expirada), `INVALID_CREDENTIALS` (login) |
| 403 | `FORBIDDEN` (recurso de outro usuário) |
| 404 | `NOT_FOUND` |
| 409 | `OUT_OF_STOCK`, `INVALID_COUPON`, `COUPON_EXPIRED`, `QUOTE_STALE`, `IDEMPOTENCY_CONFLICT`, `ORDER_PENDING`, `WALLET_REJECTED`, `WALLET_REQUIRED`, `WALLET_NOT_CONNECTED`, `USERNAME_TAKEN`, `EMAIL_CONFLICT` (e-mail já cadastrado ou em uso por outro usuário) |
| 422 | `VALIDATION_ERROR`, `INVALID_PASSWORD` (com `fields`) |
| 503 | `TRANSIENT_FAILURE` |
| 504 | `ORDER_TIMEOUT` (só no cenário `payment-timeout`) |

Qualquer `401` recebido pelo Axios (exceto login, cadastro e logout) aciona o tratamento global de sessão expirada (ver `ARCHITECTURE.md`, "Sessão expirada").

## Sessão e conta

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `GET /session` | — | `{ user: { id, name, email } \| null }`; `401 SESSION_EXPIRED` quando a sessão expirou |
| `POST /auth/register` | `{ username, email, password, confirmPassword }` | `201 { user }`; cria a sessão e faz o merge do carrinho do visitante; `422` com `fields`; `409 EMAIL_CONFLICT` (`fields.email`) se o e-mail já existe |
| `POST /auth/login` | `{ email, password }` | `{ user }` e merge do carrinho do visitante; `422` com `fields`; `401 INVALID_CREDENTIALS` |
| `POST /auth/logout` | — | `204`; invalida a sessão |

Senhas ficam no mock só como hash SHA-256 com salt; a API nunca devolve hash nem salt.

## NFTs

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `GET /nfts` | `q`, `category` (`all/art/music/photography`), `collection`, `network` (`all/ethereum/polygon/solana`), `priceMin`, `priceMax` (ETH), `sort` (`recent/name/price-asc/price-desc`), `page` ≥ 1 | `{ items: Nft[], total, page, pageSize: 9, facets }` |
| `GET /nfts/:id` | identificador | `Nft` ou `404` |

`facets = { collections: [{ value, count }], networks: [{ value, label, count }], price: { min, max } }`, calculado sobre o catálogo inteiro, independente da busca.

`Nft = { id, name, category, collection, network, image, price, originalPrice?, rare?, available, version, tokenId?, description?, shortDescription?, editions?, attributes?, reviews?, gallery?, soldOutEditions?, rating?, details?: { paragraphs, network, contract, royalties } }`. `version` sobe a cada alteração do NFT.

## Favoritos (exigem sessão)

| Método e rota | Resposta |
| --- | --- |
| `GET /favorites` | `{ items: string[] }` (ids dos NFTs favoritos do usuário) |
| `PUT /favorites/:nftId` | `{ items }`; `404` se o NFT não existe |
| `DELETE /favorites/:nftId` | `{ items }` |

## Carrinho e cotação

O carrinho é do usuário da sessão ou do visitante; no login, os itens do visitante são somados por NFT e edição.

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `GET /cart` | — | `{ items: [{ nftId, editionId, quantity, nft }] }` |
| `POST /cart/items` | `{ nftId, editionId, quantity }` | `201 { items }`; `409 OUT_OF_STOCK` se a edição está esgotada ou o estoque (somado entre as edições do NFT) não cobre |
| `PATCH /cart/items/:nftId` | `{ editionId, quantity }` | `{ items }`; `404` se a linha não existe; `409 OUT_OF_STOCK` |
| `DELETE /cart/items/:nftId?editionId=` | — | `{ items }`; sem `editionId` remove todas as edições do NFT |
| `POST /quote` | `{ items: [{ nftId, editionId, quantity }], coupon? }` | `{ id, version, expiresAt, items (com preço, nome, imagem e tokenId do momento), subtotal, discount, networkFee, total }` |

Cotação responde também para visitante. Cupons: `KURIO10` dá 10% de desconto no subtotal; `KURIO5` responde `409 COUPON_EXPIRED`; qualquer outro, `409 INVALID_COUPON`. A taxa de rede é fixa (`0.016`). Cada cotação fica registrada por `id` para revalidar a criação do pedido.

## Perfil (exige sessão)

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `GET /profile` | — | `{ userId, displayName, username, email, ens, walletAlias, avatar: string \| null }` |
| `PATCH /profile` | `{ displayName, username, email, ens, walletAlias }` | Perfil atualizado. `422` com `fields`; `409 USERNAME_TAKEN` (`fields.username`) e `409 EMAIL_CONFLICT` (`fields.email`) |
| `POST /profile/avatar` | `multipart/form-data` com o arquivo em `avatar` | Perfil atualizado. `422` com `fields.avatar` (tipo diferente de imagem ou acima de 512 KB) |
| `DELETE /profile/avatar` | — | Perfil sem avatar |
| `PATCH /profile/password` | `{ currentPassword, newPassword, confirmPassword }` | `204`; `422 INVALID_PASSWORD` com `fields` (senha atual incorreta, mínimo de 8 caracteres, confirmação diferente) |

O e-mail do perfil é o do login: alterá-lo altera o e-mail da sessão. O ENS é guardado completo (`nome.eth`). O avatar é devolvido como data URL.

## Carteiras (exigem sessão)

`Wallet = { id, userId, name, alias, address, network: 'ethereum' | 'polygon', label, tag, ens, profileName, referralCode, email, primary }`.

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `GET /wallets` | — | `{ items: Wallet[] }` |
| `POST /wallets` | `{ name, alias, network, profileName, address, label, tag, referralCode, email, ens, primary? }` | A carteira criada. A primeira do usuário é principal; `primary: true` torna a nova principal e a anterior secundária. `422` com `fields` (endereço `0x` com 40 hex ou abreviado, `tag` entre as opções do formulário, código de indicação existente) |
| `PATCH /wallets/:id` | os mesmos campos | A carteira atualizada; mesmas validações |
| `PATCH /wallets/:id/primary` | — | Torna a carteira principal e as demais secundárias, no mesmo passo; `{ items }` |
| `GET /wallets/connection` | — | `{ connection: { walletId, method } \| null }` (`method`: `walletconnect`, `metamask`, `coinbase`) |
| `POST /wallets/:id/connect` | `{ method }` | `{ walletId, method }`; `409 WALLET_REJECTED` no cenário `wallet-rejected` |
| `POST /wallets/:id/disconnect` | — | `204` |

Carteira de outro usuário responde `403 FORBIDDEN` e inexistente, `404`. Código de indicação aceito: `KURIO-2026` (outro valor devolve `422` com `fields.referralCode`).

## Pedidos (exigem sessão)

`Order = { id, userId, version, status: 'pending' | 'confirmed' | 'declined', createdAt, quote, transactionRef: string | null, wallet: { address, network, name, method } }`. O pedido guarda o **snapshot** da cotação (preços, nomes, imagens, totais): alterações posteriores no catálogo não mudam o recibo.

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| `POST /orders` | Header `Idempotency-Key`; `{ quoteId, quoteVersion, walletId, network, collector }` | `201 Order` na criação; `200` com o mesmo pedido se a chave se repete com o mesmo conteúdo |
| `GET /orders?status=pending` | `status` opcional (`pending`, `confirmed`, `declined`) | `{ items: Order[] }` só do usuário da sessão |
| `GET /orders/:id` | — | `Order`; `404`; `403` se o pedido é de outro usuário |
| `GET /orders/by-key/:key` | — | O pedido criado com a chave; usado para recuperar após timeout ou refresh |

`collector = { displayName, username, profileName, email, walletAddress, ens, referralCode, note }` (mesma regra de validação no formulário e no MSW).

Regras de `POST /orders`, nesta ordem:

1. Sem sessão: `401`. Corpo inválido ou sem `Idempotency-Key`: `422` com `fields`. Código de indicação inexistente: `422` com `fields.referralCode`.
2. **Idempotência.** A mesma chave com o mesmo conteúdo devolve o mesmo pedido (`200`), inclusive após timeout e refresh; a mesma chave com conteúdo diferente responde `409 IDEMPOTENCY_CONFLICT`. Uma chave de outro usuário responde `403`.
3. **`409 ORDER_PENDING`**: o usuário já tem um pedido pendente. A resposta traz `fields: { orderId }` com o pedido pendente, mesmo com outra chave de idempotência. Confirmado e recusado são terminais e não bloqueiam. O cliente também redireciona `/checkout` ao pedido pendente usando `GET /orders?status=pending`.
4. `409 QUOTE_STALE`: cotação inexistente, de outra versão, ou preço, disponibilidade, cupom ou taxa que mudaram desde a cotação (o checkout exige nova confirmação do usuário).
5. `409 WALLET_REQUIRED` (carteira não cadastrada) e `409 WALLET_NOT_CONNECTED` (a carteira precisa estar conectada).
6. O estado vem da simulação: `confirmed` (padrão, retira do carrinho só os itens e as quantidades comprados), `declined` (cenário `payment-declined`, carrinho preservado) ou `pending` (cenários `payment-pending`, `payment-held` e `payment-timeout`). No cenário `payment-timeout` o pedido é criado e a resposta é `504 ORDER_TIMEOUT`.

## Socket.IO

Transporte: WebSocket (`transports: ['websocket']`), namespace padrão, origem atual por padrão (`VITE_SOCKET_URL` altera). O MSW intercepta a rede e `@mswjs/socket.io-binding` 0.2.0 codifica frames e handshake; o heartbeat textual é mantido pelo mock. Não há servidor real.

Todo evento carrega identidade estável (`eventId`), o recurso afetado (`resourceId`) e a versão (`version`).

| Evento | Payload | Quem recebe |
| --- | --- | --- |
| `nft.updated` | `{ eventId, resourceId, version, nft }` | Todos os clientes conectados |
| `order.updated` | `{ eventId, resourceId, version, userId, status }` | Só o socket que assinou o pedido (`order.subscribe`) e que pertence ao `userId` |

Cliente → servidor: `order.subscribe` com `{ userId, orderId }`, enviado ao assinar e a cada (re)conexão.

Comportamento do cliente:

- `nft.updated`: valida o NFT contra o contrato, exige `nft.id === resourceId` e `nft.version === version`, e só aceita versão maior que a última vista no socket e no cache. Aceito, invalida catálogo, detalhe, carrinho e cotações, e o REST traz o valor; o payload nunca é copiado para o cache. Duplicata e versão antiga são descartadas sem efeito.
- `order.updated`: valida o payload e só vale para pedido assinado nesta sessão, do mesmo `userId`; aceita só versão maior que a vista no socket e no cache e invalida o pedido. Confirmado e recusado são terminais.
- Reconexão: o cliente reconcilia por REST catálogo, carrinho, cotações e pedidos assinados, e reassina os pedidos.
- Logout e troca de usuário descartam as assinaturas privadas e reabrem a conexão, para o servidor esquecer as da sessão anterior.

O binding publicado não oferece rooms, namespaces nem broadcast completos; o mock percorre os clientes e filtra os eventos de pedido por usuário e pedido (nunca usar o broadcast público para pedidos). Polling, anexos binários e implantação real não foram validados.

## Endpoints só do mock

`/api/__mock/...`, para desenvolvimento, demonstração e testes. Não fazem parte do contrato de produto; a lista completa, com exemplos, está no README (§13): `scenario`, `reset`, `session/expire`, `nfts/:id/update`, `nfts/:id/event`, `orders/:id/confirm`, `orders/:id/decline`, `orders/:id/event`, `socket/clients` e `socket/disconnect`.
