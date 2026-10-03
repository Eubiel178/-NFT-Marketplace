# Auditoria de Arquitetura

**Objetivo:** Verificar estrutura de pastas, componentes, hooks, utilitários, rotas, serviços, cliente Axios, Socket.IO, MSW, testes e configuração contra AGENTS.md e boas práticas.

---

## 1. Estrutura de Pastas

### Atual (`src/`)

```
src/
├── app/                    # Roteamento + layout raiz
│   ├── layout.tsx          # Layout raiz (header, main, footer, socket)
│   ├── render.tsx          # Bootstrap React + providers
│   └── router.tsx          # 10 rotas + guards + type augmentation
├── components/             # Componentes UI compartilhados
│   ├── ui/
│   │   ├── button.tsx      # ❌ Viola AGENTS: deve ser button/index.tsx
│   │   └── skeleton.tsx    # ❌ Viola AGENTS: deve ser skeleton/index.tsx
│   └── index.ts            # Barrel exporta Button, Skeleton
├── contracts/              # Contratos Zod + tipos TypeScript
│   └── index.ts            # Schemas: eth, nft, catalog, session, cart, quote, order, wallet, events
├── features/               # Features por domínio (domain-driven)
│   ├── catalog/            # Catálogo + detalhe NFT
│   │   ├── api.ts          # queryOptions (catalog, nft)
│   │   └── pages.tsx       # CatalogPage, NftPage
│   ├── home/               # Preparada mas vazia
│   │   └── components/     # ❌ Pasta vazia
│   └── session/            # Sessão/autenticação
│       └── api.ts          # sessionOptions
├── lib/                    # Utilitários e clientes compartilhados
│   ├── env.ts              # Variáveis de ambiente tipadas
│   ├── eth.ts              # toWei / fromWei (BigInt)
│   ├── http.ts             # Axios client (baseURL, timeout, credentials)
│   ├── query.ts            # QueryClient + keys factory
│   ├── realtime.ts         # Socket.IO client + reconciliação
│   └── utils.ts            # cn() = clsx + twMerge
├── mocks/                  # MSW handlers + DB + Socket.IO binding
│   ├── browser.ts          # Worker setup
│   ├── db.ts               # localStorage + Zod + fixtures
│   ├── fixtures.ts         # 2 users + createNfts(24)
│   ├── handlers.ts         # 6 REST handlers + cenários
│   ├── scenarios.ts        # 7 cenários persistidos
│   └── socket.ts           # WS link + broadcast manual
├── main.tsx                # Entry point: MSW start → renderApp
├── styles.css              # Tailwind v4 + CSS variables + shimmer + reduced-motion
```

### Conformidade AGENTS.md (§ Estrutura de Arquivos)

| Regra | Status | Detalhe |
|-------|--------|---------|
| Componente em pasta com nome + `index.tsx` | ❌ | `button.tsx` e `skeleton.tsx` diretos em `ui/` |
| Subcomponentes composition pattern em pasta própria | N/A | Não há subcomponentes ainda |
| Hooks/utilitários: pasta + `index.ts` | ✅ | `lib/` com arquivos diretos (aceitável para utils) |
| Kebab-case nas pastas | ✅ | `features/catalog`, `features/home`, etc. |
| Arquivos auxiliares na mesma pasta | ✅ | Tipos em `contracts/index.ts` |

**Violação crítica:** `src/components/ui/button.tsx` e `skeleton.tsx` devem ser movidos para `button/index.tsx` e `skeleton/index.tsx`.

---

## 2. Componentes

### Inventário Atual

| Componente | Arquivo | Padrão | Uso |
|------------|---------|--------|-----|
| `Button` | `components/ui/button.tsx` | Radix `Slot` + CVA | `CatalogPage` |
| `Skeleton` | `components/ui/skeleton.tsx` | `div` + `cn` | `CatalogPage`, `NftPage` |
| `Layout` | `app/layout.tsx` | Componente de layout raiz | `root` route |
| `PendingFeature` | `app/layout.tsx` | Placeholder | 8 rotas |
| `CatalogPage` | `features/catalog/pages.tsx` | Página | `/` |
| `NftPage` | `features/catalog/pages.tsx` | Página | `/nfts/:id` |

### Barrel

`components/index.ts`:
```ts
export { Button } from './ui/button';
export { Skeleton } from './ui/skeleton';
```

### Composição

- `Button` usa **composition pattern**: `asChild` + `Slot` (Radix) + CVA variants ✅
- `Skeleton` é componente simples ✅
- **Faltam:** 36 componentes do inventário Figma (Card, Input, Select, Modal, Sheet, TabBar, Stepper, Avatar, Checkbox, Radio, Toast, etc.)

---

## 3. Hooks

**Hooks customizados:** Nenhum criado ainda.

**Hooks de biblioteca usados:**
- `@tanstack/react-router`: `useSearch`, `useParams`, `Link`, `Outlet`, `redirect`
- `@tanstack/react-query`: `useQuery`
- `react`: `useEffect`, `useState`

**Status:** ✅ Uso correto. ⚠️ **Faltam hooks de domínio** (ex.: `useCart`, `useFavorites`, `useAuth`, `useWallets`, `useQuote`).

---

## 4. Utilitários (`src/lib/`)

| Arquivo | Função | Qualidade |
|---------|--------|-----------|
| `env.ts` | Tipagem de `import.meta.env` | ✅ Simples, tipado |
| `eth.ts` | `toWei` (string → bigint), `fromWei` (bigint → string) | ✅ Precisão 18 casas, validação Zod |
| `http.ts` | Axios client singleton | ✅ Centralizado, timeout, credentials |
| `query.ts` | `QueryClient` + `keys` factory | ✅ Tipado, cancelamento, retry condicional |
| `realtime.ts` | Socket.IO client + lógica `nft.updated` | ✅ Validação schema, dedup, reconciliação, cleanup |
| `utils.ts` | `cn = twMerge(clsx(...))` | ✅ Padrão shadcn |

**Status:** ✅ Bem estruturado, tipado, reutilizável.

---

## 5. Rotas (`src/app/router.tsx`)

### Árvore de Rotas

```
root (Layout)
├── home          → "/"                    (validateSearch: catalogSearchSchema)
├── nft           → "/nfts/$nftId"         (params: nftId)
├── cart          → "/cart"                (PendingFeature)
├── login         → "/login"               (validateSearch: redirect)
├── register      → "/register"            (PendingFeature)
├── privateRoot   → (id: "authenticated")  (beforeLoad: session guard)
│   ├── checkout  → "/checkout"            (PendingFeature)
│   ├── profile   → "/profile"             (PendingFeature)
│   ├── wallets   → "/wallets"             (PendingFeature)
│   └── order     → "/orders/$orderId"     (PendingFeature)
```

### Recursos TanStack Router Usados

| Recurso | Uso |
|---------|-----|
| `createRootRoute` | Root com `notFoundComponent`, `errorComponent` |
| `createRoute` | 10 rotas |
| `validateSearch` | Zod schema no `home` + `login` |
| `beforeLoad` | Guard de autenticação em `privateRoot` |
| `redirect` | Redirect para `/login?redirect=...` |
| `Link` + `Outlet` | Navegação + renderização filha |
| `useSearch` | Parâmetros tipados no `CatalogPage` |
| `useParams` | `nftId` no `NftPage` |
| `defaultPreload: "intent"` | Pré-carregamento por intenção |
| Module augmentation | `declare module '@tanstack/react-router' { interface Register { router } }` |

**Status:** ✅ Completo e tipado. Guards funcionam (teste E2E passa).

---

## 6. Serviços / Camada de Dados

### Axios Client (`lib/http.ts`)

```ts
export const http = axios.create({
  baseURL: env.apiUrl,    // VITE_API_URL || '/api'
  timeout: 8_000,
  withCredentials: true
});
```

**Uso:** Todas as queries (`catalogOptions`, `nftOptions`, `sessionOptions`) usam `http.get`.

**Status:** ✅ Centralizado, configurável por env.

### TanStack Query (`lib/query.ts`)

```ts
export const keys = {
  catalog: (search) => ['nfts', 'list', search] as const,
  nft: (id) => ['nfts', 'detail', id] as const,
  session: ['session'] as const,
  user: (userId) => ['private', userId] as const,
};
```

**QueryClient defaults:**
- `staleTime: 30s`, `gcTime: 5min`
- `refetchOnWindowFocus: true`
- `retry` condicional (só 5xx)
- `mutations.retry: false`

**Status:** ✅ Keys tipadas, invalidação por prefixo `['nfts']` funciona.

---

## 6. Socket.IO (`lib/realtime.ts`)

```ts
export function connectCatalog(onConnection) {
  const socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false });
  const versions = new Map<string, number>();

  function onNft(event: NftUpdated) {
    // valida schema + version match + resourceId
    // dedup: event.version <= latest → ignore
    // reconcilia: queryClient.invalidateQueries({ queryKey: ['nfts'] })
  }

  socket.on('connect', () => { onConnection(true); reconcile() });
  socket.on('disconnect', () => onConnection(false));
  socket.on('nft.updated', onNft);
  socket.connect();

  return () => { /* cleanup: off + disconnect + versions.clear() */ };
}
```

**Integração:** `Layout` chama `connectCatalog(setConnected)` no `useEffect`.

**Status:** ✅ Funcional para `nft.updated` público.
⚠️ **Gaps:** `order.updated` não implementado; subscriptions privadas (pedidos, carrinho) não existem; não há reconciliação de pedidos pós-reconexão; não há isolamento por usuário.

---

## 7. MSW (`src/mocks/`)

### Estrutura

```
mocks/
├── browser.ts      # setupWorker(handlers, socketHandlers)
├── handlers.ts     # 6 REST handlers + conditions(scenario)
├── socket.ts       # ws.link + toSocketIo + broadcastNft
├── db.ts           # localStorage + Zod + createNfts()
├── fixtures.ts     # users[2] + createNfts(24)
├── scenarios.ts    # 7 cenários + localStorage persistence
```

### Handlers REST

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/session` | `{ user: null }` |
| GET | `/api/nfts` | Lista com `q`, `category`, `sort`, `page` (pageSize=6) |
| GET | `/api/nfts/:id` | Detalhe ou 404 |
| POST | `/api/__mock/reset` | Reset DB + cenário default |
| POST | `/api/__mock/scenario` | Troca cenário (valida whitelist) |
| POST | `/api/__mock/nfts/:id/update` | version++, price="0.125", save, broadcast |

### Socket.IO Binding

- `ws.link(url)` com namespace normalizado `/`
- `toSocketIo(connection)` → `client.emit('nft.updated', event)`
- Heartbeat textual `setInterval(() => connection.client.send('2'), 20s)`
- Cleanup no `close`

**Status:** ✅ Funciona para `nft.updated` público.
⚠️ **Gaps:** Handlers privados (cart, favorites, orders, wallets, profile) não existem; validação de sessão nos handlers ausente; `order.updated` não emitido.

---

## 8. Testes (`tests/e2e/foundation.spec.ts`)

### Configuração (`playwright.config.ts`)

```ts
projects: [
  { name: 'chromium-390', use: { ...devices['iPhone 12'], viewport: { width: 390, height: 844 } } },
  { name: 'chromium-768', use: { ...devices['iPad Mini'], viewport: { width: 768, height: 1024 } } },
  { name: 'chromium-1440', use: { viewport: { width: 1440, height: 900 } } },
]
webServer: { command: 'npm run preview', url: 'http://127.0.0.1:4173' }
```

### 6 Testes (×3 viewports = 18 passados)

| Teste | Cobertura README §9 |
|-------|---------------------|
| Catálogo REST + detalhe + 404 | Grupo 2 (parcial) |
| Parâmetros URL chegam ao mock | Grupo 1 (parcial) |
| Guarda privada + rota inexistente | Grupo 3 (parcial) |
| Socket.IO reconcilia detalhe + persistência | Grupo 9 (parcial) |
| Skeleton + erro + recuperação MSW | Grupo 12 (parcial) |
| Skip link teclado + overflow | Grupo 11 (parcial) |

**Status:** ✅ Infraestrutura de testes funcionando. ❌ **Cobertura: 6/12 grupos**, todos apenas smoke.

---

## 9. Configuração

| Arquivo | Status | Observação |
|---------|--------|------------|
| `package.json` | ✅ | Scripts completos, deps corretas, `msw.workerDirectory: public` |
| `tsconfig.json` | ✅ | Strict, paths `@/*`, `baseUrl` removido (TS 6) |
| `vite.config.ts` | ✅ | `@tailwindcss/vite` + `react()`, `resolve.alias @` |
| `eslint.config.js` | ✅ | `max-warnings: 0`, passa |
| `playwright.config.ts` | ✅ | 3 viewports, webServer, traces |
| `vercel.json` | ✅ | SPA rewrite |
| `.env.demo` / `.env.example` | ✅ | `VITE_ENABLE_MOCKS=true`, `VITE_API_URL=/api` |
| `scripts/lighthouse.mjs` | ✅ | 12 medições, medianas, relatórios |

---

## 10. Problemas Arquiteturais Resumidos

| # | Problema | Severidade | Regra Violada |
|---|----------|------------|---------------|
| 1 | `button.tsx` e `skeleton.tsx` não em pasta `index.tsx` | Alta | AGENTS: estrutura de arquivos |
| 2 | Cores CSS variables não correspondem ao Figma | Alta | README §8 + Figma |
| 3 | Fonte `system-ui` vs `Roboto Mono` | Alta | Figma design tokens |
| 4 | 36/38 componentes Figma ausentes | Alta | README §3 + Figma |
| 5 | Breakpoints 390/768/1440 não configurados no Tailwind | Média | README §8 |
| 6 | `catalogOptions` pageSize=6 vs Figma 9 desktop / 4 mobile | Média | Figma |
| 7 | Handlers privados MSW ausentes (auth, cart, favorites, orders, wallets, profile) | Alta | README §5-6 |
| 8 | `order.updated` Socket.IO não implementado | Alta | README §7 |
| 9 | Auth completo ausente (register, login, logout, hash, session) | Alta | README §3, §4 |
| 10 | Carrinho, cotação, cupom, idempotência ausentes | Alta | README §3 |
| 11 | Favoritos otimistas ausentes | Média | README §3 |
| 12 | Perfil/Carteiras/Confirmação mobile sem frames Figma | Média | README §3 |
| 13 | Regressão visual (baselines) não configurada | Média | README §9 |
| 14 | Deploy público não feito | Alta | README §12 |

---

## 11. Conformidade AGENTS.md — Checklist Detalhado

| Regra | Status | Evidência |
|-------|--------|-----------|
| TypeScript strict | ✅ | `tsconfig.json` + `typecheck` passa |
| Sem `any` | ✅ | Grep: 0 ocorrências |
| ETH = strings decimais | ✅ | `ethSchema` + `toWei/fromWei` |
| Quantidades = inteiros | ✅ | `z.number().int()` |
| REST via Axios client | ✅ | `http` em `lib/http.ts` |
| Mocks só no MSW | ✅ | Components usam `useQuery` |
| Socket.IO via `socket.io-client` | ✅ | `realtime.ts` |
| Composition pattern | ✅ | `Button` usa `Slot` + CVA |
| HTML semântico | ✅ | `nav`, `main`, `header`, `footer`, `section`, `ul/li` |
| Acessibilidade (labels, erros, foco, teclado) | ⚠️ | Básico no Layout; formulários não existem |
| `prefers-reduced-motion` | ✅ | CSS global |
| Imports consolidados do mesmo barrel | ✅ | `import { Button, Skeleton } from '@/components'` |
| Barrel `@/components` existe | ✅ | `components/index.ts` |
| Não criar barrels desnecessários | ✅ | Apenas 1 barrel |
| Estrutura: pasta + `index.tsx` | ❌ | `ui/button.tsx`, `ui/skeleton.tsx` |
| Kebab-case pastas | ✅ | `features/catalog`, `features/home` |
| `index.tsx` (JSX) / `index.ts` | ❌ | `button.tsx` não é `index.tsx` |
| Template literals | ✅ | Verificado |
| Sem `+` em strings | ✅ | Sem concatenação |

---

## 12. Resumo

**Pontos Fortes:**
- Infraestrutura completa e validada (typecheck, lint, build, testes, Lighthouse)
- Arquitetura limpa: separação por domínio, contratos tipados, cliente centralizado
- TanStack Router/Query bem configurados com guards, validação, cache, invalidação
- MSW + Socket.IO binding funcionais para cenário público
- Testes E2E em 3 viewports com isolamento

**Pontos Críticos (Bloqueiam Fase 2):**
1. Estrutura de componentes viola AGENTS.md (`button.tsx` vs `button/index.tsx`)
2. Design tokens do Figma **não aplicados** (cores, fonte, spacing, raios, sombras)
3. **0 telas implementadas** — apenas rotas + placeholders
4. Handlers MSW privados + auth + carrinho + pedidos + carteiras **ausentes**
5. `order.updated` Socket.IO **ausente**
6. Componentes base do design system **ausentes** (36/38)

**Recomendação:** Corrigir estrutura de componentes (item 1) e aplicar design tokens (item 2) **antes** de iniciar telas. O resto é implementação progressiva da Fase 2+.