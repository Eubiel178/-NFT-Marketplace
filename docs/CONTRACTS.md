# Contratos REST e eventos

Fonte: README §§4–7. Prefixo `/api`; chamadas da aplicação sempre via Axios. Tipos iniciais em `src/contracts/index.ts`, validação de respostas implementadas com Zod. ETH é string decimal não negativa com até 18 casas; cálculos em wei/BigInt, quantidades inteiras. Datas planejadas em ISO 8601 UTC.

## Implementados na estrutura inicial

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| GET /session | — | `{ user: User | null }`; 401 `SESSION_EXPIRED` quando a sessão expira |
| GET /nfts | `q`, `category=all/art/music/photography`, `collection`, `network=all/ethereum/polygon`, `priceMin`, `priceMax`, `sort=recent/name/price-asc/price-desc`, `page>=1` | `{ items: Nft[], total, page, pageSize: 9 }` |
| GET /nfts/:id | identificador | `Nft` ou 404 |
| POST /__mock/reset | — | 204, restaura catálogo e cenário; recarregar a página após uso |
| POST /__mock/scenario | `{ scenario }` | `{ scenario }` ou 422 |
| POST /__mock/nfts/:id/update | identificador | aumenta versão, muda preço para `"0.125"`, persiste e emite `nft.updated` |

`Nft = { id, name, category, collection, network, image, price: string, available: integer, version: integer, tokenId?, description?, editions?, attributes?, reviews?, gallery? }`.

Erros usam `{ code, message, fields?: Record<string,string> }`. Implementados: 401 `SESSION_EXPIRED`/`UNAUTHORIZED`, 403 `FORBIDDEN`, 404 `NOT_FOUND`, 409 `QUOTE_STALE`/`IDEMPOTENCY_CONFLICT`, 422 `VALIDATION_ERROR`, 503 `TRANSIENT_FAILURE`, 504 `ORDER_TIMEOUT` e falha de conexão.

## Sessão implementada

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| POST /auth/register | `{ username, email, password, confirmPassword }` | `201 { user }`, cria sessão e faz merge do carrinho visitante |
| POST /auth/login | `{ email, password }` | `{ user }`, faz merge do carrinho visitante |
| POST /auth/logout | — | `204`, invalida a sessão persistida |
| POST /__mock/session/expire | — | `204`, cenário determinístico de expiração |

Credenciais fictícias ficam no fixture como hash SHA-256 com salt; a API nunca devolve o hash ou o salt. Validações retornam `422` com `fields`, conflitos de email retornam `409` e credenciais inválidas retornam `401`.

## Recursos implementados

| Recurso | Contrato proposto |
| --- | --- |
| Favoritos | GET /favorites; PUT /favorites/:nftId; DELETE /favorites/:nftId, sempre no usuário autenticado |
| Carrinho | GET /cart; POST /cart/items `{nftId,editionId,quantity}`; PATCH /cart/items/:id `{quantity}`; DELETE /cart/items/:id; POST /cart/merge após login |
| Cotação | POST /quotes `{items,couponCode?,walletId,network}` → `{id,version,expiresAt,items,subtotal,discount,networkFee,total}`; cupom inválido/expirado retorna 422 específico |
| Pedidos | POST /orders com header `Idempotency-Key` e `{quoteId,quoteVersion,walletId,network}` → pedido pendente/confirmado/recusado com `createdAt`; GET /orders/:id; GET /orders/by-key/:key para recuperar após timeout |
| Perfil | GET /profile; PATCH /profile `{displayName,username,bio,ens,website}`; PATCH /profile/avatar `{avatar: string|null}`; PATCH /profile/password `{currentPassword,newPassword,confirmPassword}` |
| Carteiras | GET /wallets; POST /wallets; PATCH /wallets/:id com `{address,network,primary}` |

Handlers privados validam sessão e propriedade (401/403). Conta repetida, cotação desatualizada e chave idempotente com payload diferente retornam 409; campos inválidos retornam 422. Uma mesma chave/payload recupera a mesma resposta/pedido, inclusive após timeout e refresh. O recibo mantém o snapshot persistido da cotação.

## Socket.IO

Transporte: WebSocket (`transports: ['websocket']`), namespace padrão, endpoint `/socket.io/`, origem atual por padrão. MSW intercepta rede e `@mswjs/socket.io-binding@0.2.0` codifica frames/handshake; heartbeat textual é mantido pelo mock. Não há servidor ou blockchain real.

- Implementado: `nft.updated = {eventId,resourceId,version,nft}`. Handler REST altera a DB, persiste e emite pelo binding. Cliente valida o NFT e a versão, ignora versões repetidas/antigas conhecidas e invalida consultas públicas, que recuperam REST.
- Implementado: `order.updated = {eventId,resourceId,version,userId,status}`. O cliente registra uma subscription para o próprio usuário e pedido; o mock entrega o evento somente ao socket inscrito. O cliente ainda valida identidade/recurso, reconcilia por REST na conexão/reconexão e encerra a subscription ao desmontar ou no logout. Pedidos confirmados e recusados são terminais; pedidos pendentes são consultados até a transição.

O binding publicado não oferece paridade completa (rooms, namespaces e broadcasting); envio para clientes é explicitamente percorrido no mock público. Nunca utilizar esse broadcast público para pedidos privados. Documentação da versão instalada em `node_modules/@mswjs/socket.io-binding/README.md`; [repositório oficial](https://github.com/mswjs/socket.io-binding) pode descrever uma API mais nova que a publicada. Polling, anexos binários, múltiplas abas e implantação real ainda não foram validados.
