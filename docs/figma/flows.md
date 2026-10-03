# Fluxos e Estados

Mapeamento dos 15 frames do Figma + requisitos do README.md → fluxos de navegação,
estados de tela, eventos de tempo real e integrações necessárias.

> **Figma não tem protótipo** (sem conexões, overlays nem transições).
> Tudo abaixo é **inferido** da estrutura dos frames + [README.md](../README.md).

---

## 1. Mapa de rotas (baseado em TanStack Router)

| Rota | Desktop | Mobile | Proteção |
| --- | --- | --- | --- |
| `/` | Início `2:2` | Início `14:5226` | pública |
| `/nfts/:id` | Detalhes `10:244` | Detalhes `15:5536` | pública |
| `/cart` | Carrinho `11:1278` | Carrinho `16:360` | pública (itens) / privada (checkout) |
| `/checkout` | Pagamento `11:2862` | Pagamento `16:748` | **privada** |
| `/orders/:id` | Confirmação `11:4385` | **não existe** | **privada** |
| `/login` | Modal em `/` `9:115` | Login `16:1022` | pública |
| `/register` | Modal em `/` `9:1022` | Cadastro `16:1228` | pública |
| `/profile` | Perfil `9:1238` | **não existe** | **privada** |
| `/wallets` | Carteiras `9:1670` | **não existe** | **privada** |

⚠️ **Login/Cadastro desktop são modais** sobre a Marketplace Page — a rota
pode ser `/` com query `?auth=login` ou `/login` abrindo modal via layout.
⚠️ **Perfil, Carteiras, Confirmação** não têm frames mobile → devem ser implementados
(ver [responsive.md](responsive.md#4-as-3-telas-desktop-sem-equivalente-mobile)).

---

## 2. Fluxo principal — Descoberta → Compra

```mermaid
flowchart TD
    A[Início] -->|click NFT| B[Detalhes do NFT]
    B -->|Adicionar ao carrinho| C[Carrinho]
    B -->|Comprar agora| D[Checkout/Pagamento]
    C -->|Conectar e finalizar| D
    D -->|Confirmar compra| E[Confirmação de pedido]
    E -->|Ver no Etherscan| F[(Link externo)]
    E -->|X (fechar)| A
```

### Estados por tela

| Tela | Estado vazio | Estado carregando | Estado erro | Estado sucesso |
| --- | --- | --- | --- | --- |
| **Início** | catálogo vazio | skeleton grid 3×3 / 2×2 | erro de API / timeout | lista + paginação |
| **Detalhes** | NFT inexistente | skeleton galeria + info | 404 / 500 | galeria + ações |
| **Carrinho** | sem itens | skeleton lista + summary | erro de cotação / cupom | itens + resumo |
| **Pagamento** | sem carteira | carregando carteiras | erro de conexão / rede | formulário + revisão |
| **Confirmação** | — | — | — | recibo + link Etherscan |
| **Login** | — | autenticando | credenciais inválidas / 401 | redirect ao fluxo anterior |
| **Cadastro** | — | criando conta | conflito / validação | login automático + redirect |
| **Perfil** | — | carregando dados | erro de sessão | formulário preenchido |
| **Carteiras** | sem carteira secundária | carregando | erro de validação endereço | lista + formulário |

---

## 3. Navegação estrutural

### Header desktop (`Header With Divider`)

| Item | Rota | Estado ativo |
| --- | --- | --- |
| Início | `/` | `Active=Home` |
| Mercado | `/nfts` (ou `/`) | `Active=Market` |
| (busca) | — | — |
| Carrinho (ícone + badge) | `/cart` | badge = contagem |
| Login / Perfil | `/login` ou `/profile` | — |

⚠️ **Só 2 variantes ativas no Figma** (`Home` e `Market`). Perfil e Carteiras
**não têm item de nav ativo** — o design não define como fica o header nessas telas.

### Tab Bar mobile

| Ícone (x) | Destino inferido | Rota | Presente no Figma? |
| --- | --- | --- | --- |
| Home (36) | Início | `/` | ✅ |
| Carrinho (108) | Carrinho | `/cart` | ✅ (vector sem label) |
| Ação central (194) | Comprar / Conectar | `/checkout` | ✅ (group sem label) |
| Shop (292) | Mercado / Catálogo | `/nfts` | ✅ |
| User (354) | Conta / Perfil | `/profile` | ✅ |

⚠️ **Nenhum item está marcado como ativo** — não há estado visual de "página atual".
⚠️ O ícone em x=194 é o único elevado (26.82×24, y=21 vs y=71 dos outros) → provável
botão de ação primária flutuante (FAB).

### Sidebar de conta (desktop)

| Item | Ícone | Rota | Ativo no Figma? |
| --- | --- | --- | --- |
| Perfil | Location | `/profile` | ❌ |
| Minhas compras | Shopping | `/orders` (não existe) | ❌ |
| Favoritos | Heart | `/favorites` (não existe) | ❌ |
| Atividade | Activity | — | ❌ |
| Downloads | Download | — | ❌ |
| Excluir conta | Danger Triangle | `/delete-account` | ❌ |
| Sair | Logout | `/logout` | ❌ |

⚠️ **Nenhum item ativo**. A sidebar existe igual em Perfil e Carteiras.
⚠️ **6 itens sem rota correspondente** no Figma (`/orders`, `/favorites` não existem).

---

## 4. Estados de componentes críticos

### Grid de NFTs (Início)

| Estado | Desktop | Mobile |
| --- | --- | --- |
| Padrão | 9 cards (3×3) | 4 cards (2×2 stagger) |
| Carregando | 9 skeletons | 4 skeletons |
| Vazio | "Nenhum NFT encontrado" | "Nenhum NFT encontrado" |
| Erro | toast + retry | toast + retry |
| Filtro ativo | badge no header | botão de filtro com badge |

⚠️ **Preço promocional** só no card C (`Neon Vessel #552`): `1.99 ETH` + `2.29 ETH` riscado.
⚠️ **Badge RARO** só no mobile P-3 — não existe no desktop.

### Stepper de quantidade

| Contexto | Mín | Máx | Comportamento |
| --- | --- | --- | --- |
| Detalhes desktop | 1 | — (estoque da API) | `Add Button` ± + input central |
| Detalhes mobile | 1 | — | igual |
| Carrinho desktop | 1 | — | igual |
| Carrinho mobile | 1 | — | igual |

⚠️ No carrinho desktop, **não há ícone de remover** — só o stepper.
No mobile, **só o item 3 (selecionado) tem `Iconly/Curved/Delete`**.
→ Inconsistência: remover item só possível no mobile e só no item focado.

### Modais de autenticação (desktop)

| Modal | Tamanho | Abas | Campos | Redes sociais |
| --- | --- | --- | --- | --- |
| **Login** | 500 × 600 | Entrar / Criar conta | email, senha | Google, Facebook |
| **Cadastro** | 500 × 656 | Entrar / Criar conta | username, email, senha, confirmar | Google, Facebook |

⚠️ **Login tem borda Primary no campo senha** — estado de foco ou erro? Não indicado.
⚠️ **Cadastro tem raio 8px**, Login **não tem raio** → inconsistência.
⚠️ **Não há checkbox "Termos"** nem link para política de privacidade.
⚠️ **Mobile = tela inteira** (não modal), sem abas, só link de texto para alternar.

---

## 5. Eventos de tempo real (Socket.IO — obrigatório pelo README)

| Evento | Payload | Telas afetadas | Ação na UI |
| --- | --- | --- | --- |
| `nft.updated` | `{ id, price, available, edition?, version }` | Início, Detalhes, Carrinho | Atualizar preço, disponibilidade; se no carrinho, avisar + recalcular total |
| `order.updated` | `{ id, status: pending\|confirmed\|rejected, txHash?, version }` | Pagamento, Confirmação, Perfil (pedidos) | Se confirmed → abrir Confirmação; se rejected → toast + manter carrinho |

### Cenário obrigatório (README § 7)

```
1. NFT no carrinho
2. Preço/disponibilidade muda (nft.updated)
3. UI informa alteração + atualiza resumo
4. Checkout impede confirmação com cotação desatualizada
   → deve revalidar via /api/quote antes de confirmar
```

### Reconexão

| Situação | Comportamento |
| --- | --- |
| Pedido pendente + desconexão | Ao reconectar, reconciliar via REST (`GET /orders/:id`); não criar novo pedido |
| Pedido confirmed/rejected | Terminais — não reprocessar |
| Sessão expirada durante checkout | Preservar contexto, redirect para login, retomar após auth |

---

## 6. Integrações REST (mínimo por README § 5)

| Recurso | Operações | Endpoints (sugeridos) |
| --- | --- | --- |
| Sessão/Conta | POST /auth/register, POST /auth/login, GET /auth/session, POST /auth/logout, POST /auth/refresh | `/api/auth/*` |
| NFTs | GET /nfts (query: search, filters, sort, page, limit), GET /nfts/:id | `/api/nfts` |
| Favoritos | GET /favorites, POST /favorites, DELETE /favorites/:id | `/api/favorites` |
| Carrinho | GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id | `/api/cart` |
| Cotação | POST /quote (cartItems[], coupon?) → { subtotal, discount, networkFee, total } | `/api/quote` |
| Pedidos | POST /orders (idempotencyKey), GET /orders/:id | `/api/orders` |
| Perfil | GET /profile, PATCH /profile, PATCH /profile/avatar, PATCH /profile/password | `/api/profile` |
| Carteiras | GET /wallets, POST /wallets, PATCH /wallets/:id | `/api/wallets` |

### Contratos de erro (README § 5)

| Código | Quando |
| --- | --- |
| 400 | Validação de body/query |
| 401 | Sessão inválida/expirada |
| 403 | Falta de permissão (ex.: rota privada sem auth) |
| 404 | NFT/pedido/usuário inexistente |
| 409 | Conflito: edição esgotada, cupom inválido, idempotencyKey reutilizada com payload diferente |
| 503 | Falha transitória (gateway, blockchain sim) |

---

## 7. Persistência de carrinho e sessão (README § 3)

| Cenário | Comportamento |
| --- | --- |
| Visitante adiciona ao carrinho | Armazenar localmente (IndexedDB/localStorage) |
| Visitante faz login | Migrar carrinho local → API (merge por NFT+edição) |
| Autenticado faz refresh | Carrinho vem da API (TanStack Query cache) |
| Troca de usuário | Limpar cache + carrinho + subscriptions Socket.IO do usuário anterior |
| Expiração de sessão no checkout | Salvar `idempotencyKey` + itens; após re-login, retomar em `/checkout` |

---

## 7. Fluxos de validação (formulários)

| Formulário | Campos | Regras (README) |
| --- | --- | --- |
| **Login** | email, senha | Obrigatórios; email válido; senha não vazia; erro 401 = credenciais |
| **Cadastro** | username, email, senha, confirmar | Obrigatórios; email único (409); senha = confirmar; força? não especificada |
| **Perfil** | displayName, username, bio, ENS, website, avatar | username único; ENS formato; avatar = upload |
| **Senha** | atual, nova, confirmar | atual correta; nova = confirmar; força? |
| **Carteira principal** | nome, alias, rede, endereço, label, tag, ENS | endereço `0x...` válido; rede conhecida; ENS opcional |
| **Carteira secundária** | igual + checkbox "igual à principal" | se marcada, copiar da principal |

⚠️ **O Figma não desenha estados de erro de formulário** — todos devem seguir
o mesmo padrão visual (borda `Color/Primary`? toast? inline message?).

---

## 8. Ações fora do escopo (README § 3)

> "Links externos e ações auxiliares devem ter comportamento coerente; ações fora do
> escopo não devem aparentar sucesso funcional."

| Ação no Figma | Escopo | Comportamento esperado |
| --- | --- | --- |
| `Ver no Etherscan` (Confirmação) | Externo | Abrir nova aba; não simular sucesso |
| `Compartilhar` (LinkedIn, Twitter, Message) | Externo | Abrir intent/share nativo; não simular |
| `Trocar carteira` (Pagamento mobile) | Fora do escopo | Não simular conexão real — só trocar seleção local |
| `WalletConnect` / `MetaMask` / `Coinbase` | Fora do escopo | Simular seleção; não abrir extensão real |
| `Aplicar cupom` | No escopo | Simular via MSW (válido/inválido/expirado) |
| `Conectar e finalizar` | No escopo | Abrir `/checkout` (desktop) ou submeter (mobile) |
| `Continuar explorando` (Carrinho) | Navegação | `router.navigate('/')` |
| `Ver minha coleção` | Não existe | Implementar se necessário (rota `/profile` → aba compras) |

---

## 9. Checklist de implementação por fluxo

| Fluxo | Tarefas críticas |
| --- | --- |
| **Descoberta** | URL state (search/filtros/sort/page); skeletons; empty state; ordenação + paginação; debounce busca |
| **Detalhe** | Acesso direto `/nfts/:id`; 404; galeria (thumbnails → main); favorito (persist); stepper; comprar vs adicionar |
| **Carrinho** | Persistência (local → API); stepper + remover; cupom (aplicar/remover); cotação em tempo real; preço alterado via Socket.IO bloqueia checkout |
| **Checkout** | Formulário colecionador; seleção wallet+rede; revisão; idempotencyKey; revalidar cotação antes de enviar; bloquear double-submit |
| **Confirmação** | Receber `orderId` + `status`; se pending → poll/ws até confirmed/rejected; exibir recibo snapshot; link Etherscan; fechar → home |
| **Auth** | Modal (desktop) / tela (mobile); redirect pós-login ao fluxo anterior; logout limpa tudo; expiração preserva contexto |
| **Conta** | Perfil (dados + avatar + senha); Carteiras (CRUD); Sidebar com 6 itens + logout; mobile: bottom sheet ou tela |
| **Tempo real** | `nft.updated` → catálogo/detalhe/carrinho; `order.updated` → checkout/confirmação/perfil; reconciliação pós-reconexão; dedup eventos |

---

## 10. Pontos de decisão de UX (não no Figma)

| Decisão | Opções | Recomendação |
| --- | --- | --- |
| Header desktop sticky? | Sim / Não | **Sim** — padrão de marketplace |
| Tab Bar mobile sticky? | Sim / Não | **Sim** — já fixa no Figma |
| Buy Bar mobile sticky? | Sim / Não | **Sim** — já fixa no Figma (bottom) |
| Filtro mobile: drawer ou bottom sheet? | Drawer lateral / Bottom sheet | **Bottom sheet** — segue padrão mobile do Figma (sheet em detalhe) |
| Confirmação mobile: modal ou tela? | Modal / Tela cheia / Bottom sheet | **Tela cheia** — modal 578px não cabe bem em 390px |
| Perfil mobile: dentro da Tab Bar User ou tela? | Aba na conta / Tela dedicada | **Tela dedicada** — 6 itens não cabem em bottom sheet |
| Skeleton: shimmer ou pulse? | Shimmer / Pulse | **Shimmer** — README § 8 pede explicitamente |
| Toast vs inline error | Toast / Inline / Ambos | **Inline nos campos + toast global** para ações (carrinho, cupom) |
| Empty state carrinho | Ilustração + CTA "Explorar" | Seguir padrão do blog card 4 (surface card) |

---

## 11. Resumo de lacunas do Figma

| Lacuna | Impacto | Resolução |
| --- | --- | --- |
| Sem tablet (768px) | README exige | Definir breakpoints em [responsive.md](responsive.md) |
| Sem Perfil/Carteiras/Confirmação mobile | README exige | Implementar com base no desktop + mobile patterns |
| Sem estados de erro/loading/skeleton | README exige | Criar do zero seguindo design tokens |
| Sem protótipo de transições | Animações | Definir durations/easings na Fase 1 |
| Sem fluxo de "minhas compras" / "favoritos" | Sidebar tem itens | Criar telas `/orders`, `/favorites` ou integrar em `/profile` |
| Sem validação visual de formulários | Acessibilidade obrigatória | Definir padrões inline + toast |
| Badge RARO só no mobile | Consistência | Adicionar no desktop ou remover do mobile |
| Preço promocional só em 1 card | Consistência | Generalizar componente `NftCard` com `hasDiscount` |
| CTA inconsistente (3 tratamentos) | Design system | Unificar em `Button variant="primary"` |
| `imageRef` não identifica NFT | Backend | Mapear NFT→imagem via API, não Figma |

---

## 12. Traceabilidade (Figma → Requisito → Teste)

| Requisito README | Frame(s) Figma | Teste E2E (§9) |
| --- | --- | --- |
| Busca, filtros, ordenação, paginação | `2:2`, `14:5226` | #1 |
| Acesso direto ao detalhe + 404 | `10:244`, `15:5536` | #2 |
| Cadastro, login, expiração, logout, troca | `9:115`, `9:1022`, `16:1022`, `16:1228` | #3 |
| Favoritos + falha + recuperação | `11:1192` (star), `15:5690` (review) | #4 |
| Carrinho: qtd, remoção, cupom, persistência | `11:1278`, `16:360` | #5 |
| Compra completa (catálogo → recibo) | todas | #6 |
| Falha pagamento, clique repetido, timeout | `11:2862`, `11:4385`, `16:748` | #7 |
| Perfil, avatar, senha, carteiras + erros | `9:1238`, `9:1670` | #8 |
| Socket.IO preço/disponibilidade no checkout | `11:2862`, `16:748` | #9 |
| Eventos duplicados/antigos, reconexão | — | #10 |
| Teclado, foco, validação | — | #11 |
| Skeletons, feedback, retry | — | #12 |