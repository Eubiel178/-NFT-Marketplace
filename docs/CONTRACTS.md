# Contratos REST e eventos

Fonte: README §§4–7. Prefixo `/api`; chamadas da aplicação sempre via Axios. Tipos iniciais em `src/contracts/index.ts`, validação de respostas implementadas com Zod. ETH é string decimal não negativa com até 18 casas; cálculos em wei/BigInt, quantidades inteiras. Datas planejadas em ISO 8601 UTC.

## Implementados na estrutura inicial

| Método e rota | Entrada | Resposta |
| --- | --- | --- |
| GET /session | — | `{ user: null }` (somente visitante por enquanto) |
| GET /nfts | `q`, `category=all/art/music/photography`, `sort=name/price-asc/price-desc`, `page>=1` | `{ items: Nft[], total, page, pageSize: 6 }` |
| GET /nfts/:id | identificador | `Nft` ou 404 |
| POST /__mock/reset | — | 204, restaura catálogo e cenário; recarregar a página após uso |
| POST /__mock/scenario | `{ scenario }` | `{ scenario }` ou 422 |
| POST /__mock/nfts/:id/update | identificador | aumenta versão, muda preço para `"0.125"`, persiste e emite `nft.updated` |

`Nft = { id, name, category, price: string, available: integer, version: integer }`. Edições, imagens e metadados serão adicionados ao implementar o detalhe.

Erros usam `{ code, message, fields?: Record<string,string> }`. Implementados: 404 `NOT_FOUND`, 422 `VALIDATION_ERROR` no seletor, 401 `SESSION_EXPIRED` simulado nas consultas, 503 `TRANSIENT_FAILURE` e falha de conexão. O cenário 401 ainda não expira uma sessão real.

## Planejados — não implementados

| Recurso | Contrato proposto |
| --- | --- |
| Sessão | POST /auth/register `{name,email,password}`; POST /auth/login `{email,password}`; POST /auth/logout; GET /session; POST /__mock/session/expire |
| Favoritos | GET /favorites; PUT /favorites/:nftId; DELETE /favorites/:nftId, sempre no usuário autenticado |
| Carrinho | GET /cart; POST /cart/items `{nftId,editionId,quantity}`; PATCH /cart/items/:id `{quantity}`; DELETE /cart/items/:id; POST /cart/merge após login |
| Cotação | POST /quotes `{items,couponCode?,walletId,network}` → `{id,version,expiresAt,items,subtotal,discount,networkFee,total}`; cupom inválido/expirado retorna 422 específico |
| Pedidos | POST /orders com header `Idempotency-Key` e `{quoteId,quoteVersion,walletId,network,collector}` → pedido pendente; GET /orders/:id; GET /orders/by-key/:key para recuperar após timeout |
| Perfil | GET /profile; PATCH /profile `{name,email,avatar?}`; PATCH /profile/password `{currentPassword,newPassword}` |
| Carteiras | GET /wallets; POST /wallets; PATCH /wallets/:id com `{address,network,primary}` |

Handlers privados validarão sessão e propriedade (401/403). Conta repetida, disponibilidade alterada, cotação vencida e chave idempotente com payload diferente retornam 409; campos inválidos retornam 422. Uma mesma chave/payload deve recuperar a mesma resposta/pedido, inclusive após timeout e refresh. O recibo deve ser snapshot persistido, nunca calculado do catálogo atual. Esses invariantes ainda precisam de implementação e testes.

## Socket.IO

Transporte: WebSocket (`transports: ['websocket']`), namespace padrão, endpoint `/socket.io/`, origem atual por padrão. MSW intercepta rede e `@mswjs/socket.io-binding@0.2.0` codifica frames/handshake; heartbeat textual é mantido pelo mock. Não há servidor ou blockchain real.

- Implementado: `nft.updated = {eventId,resourceId,version,nft}`. Handler REST altera a DB, persiste e emite pelo binding. Cliente valida o NFT e a versão, ignora versões repetidas/antigas conhecidas e invalida consultas públicas, que recuperam REST.
- Planejado: `order.updated = {eventId,resourceId,version,userId,status}`. Precisa de autenticação, isolamento, terminalidade e reconciliação de pedidos.

O binding publicado não oferece paridade completa (rooms, namespaces e broadcasting); envio para clientes é explicitamente percorrido no mock público. Nunca utilizar esse broadcast público para pedidos privados. Documentação da versão instalada em `node_modules/@mswjs/socket.io-binding/README.md`; [repositório oficial](https://github.com/mswjs/socket.io-binding) pode descrever uma API mais nova que a publicada. Polling, anexos binários, múltiplas abas e implantação real ainda não foram validados.
