# Auditoria de Stack — Uso Efetivo

**Verificação:** cada tecnologia da stack obrigatória deve estar **presente E sendo usada efetivamente** no código.

---

## ✅ React 19.3.0

**Onde usado:**
- `src/main.tsx` — `createRoot`, `StrictMode`
- `src/app/render.tsx` — `StrictMode`, `QueryClientProvider`, `RouterProvider`
- `src/app/layout.tsx` — `Layout`, `PendingFeature` (componentes funcionais)
- `src/features/catalog/pages.tsx` — `CatalogPage`, `NftPage` (hooks `useQuery`, `useSearch`)
- `src/components/ui/button.tsx` — `Button` (component + `Slot`)
- `src/components/ui/skeleton.tsx` — `Skeleton`

**Status:** ✅ Efetivamente usado em toda a aplicação.

---

## ✅ TypeScript 6.0.3 (strict)

**Configuração:** `tsconfig.json` — `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`

**Verificações:**
- `npm run typecheck` → **PASSOU** (0 erros)
- Nenhum `any` encontrado no código fonte
- Tipos inferidos corretamente (Zod schemas, TanStack Router search params, Query keys)

**Status:** ✅ Strict mode ativo e passando.

---

## ✅ TanStack Router 1.170.41

**Onde usado:**
- `src/app/router.tsx` — `createRootRoute`, `createRoute`, `createRouter`, `redirect`, `validateSearch`, `beforeLoad` (auth guard), `declare module` augmentation
- `src/app/render.tsx` — `RouterProvider`
- `src/app/layout.tsx` — `Link`, `Outlet`
- `src/features/catalog/pages.tsx` — `useSearch`, `Link` com `params`
- `src/features/session/api.ts` — `sessionOptions` usado no `beforeLoad`

**Rotas definidas (9):**
| Rota | Path | Proteção |
|------|------|----------|
| `home` | `/` | pública |
| `nft` | `/nfts/$nftId` | pública |
| `cart` | `/cart` | pública |
| `login` | `/login` | pública (com `redirect`) |
| `register` | `/register` | pública |
| `privateRoot` | (id: `authenticated`) | **guard `beforeLoad`** |
| `checkout` | `/checkout` | **privada** (filha de `privateRoot`) |
| `profile` | `/profile` | **privada** |
| `wallets` | `/wallets` | **privada** |
| `order` | `/orders/$orderId` | **privada** |

**Status:** ✅ Efetivamente usado com validação de search params, guards, lazy loading via `defaultPreload: "intent"`.

---

## ✅ TanStack Query 5.104.1

**Onde usado:**
- `src/lib/query.ts` — `QueryClient` com `defaultOptions` (staleTime, gcTime, refetchOnWindowFocus, retry condicional)
- `src/features/catalog/api.ts` — `catalogOptions`, `nftOptions` com `queryOptions` + `queryKey` tipados + `queryFn` com `signal` (cancelamento)
- `src/features/catalog/pages.tsx` — `useQuery(catalogOptions(search))`, `useQuery(nftOptions(id))`
- `src/features/session/api.ts` — `sessionOptions` com `staleTime: 0`, `retry: false`
- `src/lib/realtime.ts` — `queryClient.invalidateQueries`, `queryClient.getQueryData`
- `src/app/render.tsx` — `QueryClientProvider`

**Configuração de cache:**
```ts
queries: {
  staleTime: 30_000,
  gcTime: 300_000,
  refetchOnWindowFocus: true,
  retry: (count, error) => count < 1 && (!axios.isAxiosError(error) || !error.response || error.response.status >= 500)
}
mutations: { retry: false }
```

**Status:** ✅ Efetivamente usado com keys tipadas, cancelamento via AbortSignal, retry inteligente, invalidação por Socket.IO.

---

## ✅ Axios 1.20.0

**Onde usado:**
- `src/lib/http.ts` — `axios.create({ baseURL: env.apiUrl, timeout: 8000, withCredentials: true })` → exportado como `http`
- `src/features/catalog/api.ts` — `http.get('/nfts', { params: search, signal })`, `http.get(\`/nfts/\${id}\`, { signal })`
- `src/features/session/api.ts` — `http.get('/session', { signal })`

**Status:** ✅ Cliente centralizado, usado em todas as queries, com timeout e credentials.

---

## ✅ socket.io-client 4.8.4

**Onde usado:**
- `src/lib/realtime.ts` — `io(env.socketUrl, { transports: ['websocket'], autoConnect: false })`
  - Eventos: `connect`, `disconnect`, `nft.updated`
  - Lógica: validação de schema + versão, dedup por `versions` Map, invalidação REST via `reconcile()`
  - Cleanup: `off` + `disconnect` + `versions.clear()` no retorno
- `src/app/layout.tsx` — `connectCatalog(setConnected)` no `useEffect`
- `src/main.tsx` — Carregamento **após** MSW iniciar (garante interceptor WebSocket)

**Status:** ✅ Efetivamente usado para evento público `nft.updated` com reconciliação REST.
⚠️ **Falta:** `order.updated` autenticado, reconciliação de pedidos, isolamento por usuário, cleanup de subscriptions privadas.

---

## ✅ Tailwind CSS 4.3.3 (via `@tailwindcss/vite`)

**Onde usado:**
- `vite.config.ts` — `plugins: [tailwindcss()]`
- `src/styles.css` — `@import 'tailwindcss';` + `@theme inline` com CSS variables
- Classes em componentes: `src/app/layout.tsx` (`border-b`, `p-6`, `mx-auto`, `max-w-6xl`, `flex`, `gap-6`, `sr-only`, `focus:not-sr-only`, etc.)
- `src/features/catalog/pages.tsx` (`grid`, `gap-4`, `md:grid-cols-3`, `h-40`, `rounded-lg`, `border`, `border-border`, `p-4`, `text-xl`, `underline`, `mt-4`)
- `src/components/ui/button.tsx` — CVA com classes: `inline-flex`, `min-h-11`, `items-center`, `justify-center`, `gap-2`, `rounded-md`, `px-4`, `py-2`, `text-sm`, `font-medium`, `transition-colors`, `focus-visible:outline-2`, `focus-visible:outline-offset-4`, `focus-visible:outline-primary`, `disabled:pointer-events-none`, `disabled:opacity-50`, `bg-primary`, `text-primary-foreground`, `hover:opacity-90`, `border`, `border-border`, `bg-background`, `hover:bg-muted`
- `src/components/ui/skeleton.tsx` — `skeleton`, `rounded-md`, `bg-muted`

**CSS Variables definidas (NÃO correspondem ao Figma):**
```css
:root {
  --background: #17171b;      /* Figma: Color/Ink #140D0A */
  --foreground: #f5f5f7;      /* Figma: Color/Foreground #F5F1EB */
  --primary: #c9b5ff;         /* Figma: Color/Primary #D28A4C */
  --primary-foreground: #22133e;
  --muted: #303038;           /* Figma: Color/Surface Card #241612 */
  --border: #62626c;          /* Figma: Color/Border #3F2319 */
}
```

**Status:** ⚠️ **Instalado e usado, mas tokens NÃO correspondem ao Figma.** Cores, fonte (`system-ui` vs `Roboto Mono`), spacing, raios, sombras não aplicados.

---

## ✅ shadcn/ui (via componentes próprios)

**Componentes existentes:**
| Componente | Arquivo | Base |
|------------|---------|------|
| `Button` | `src/components/ui/button.tsx` | Radix Slot + CVA |
| `Skeleton` | `src/components/ui/skeleton.tsx` | `div` + `cn` |

**Barrel:** `src/components/index.ts` — `export { Button } from './ui/button'; export { Skeleton } from './ui/skeleton';`

**Uso:** `src/features/catalog/pages.tsx` — `import { Button, Skeleton } from '@/components'`

**Status:** ✅ Base instalada e usada. **Faltam 36+ componentes** do inventário Figma (Card, Input, Select, Modal, Sheet, TabBar, Stepper, Avatar, Checkbox, Radio, Toast, etc.)

---

## ✅ MSW 2.15.0

**Onde usado:**
- `src/mocks/browser.ts` — `setupWorker(...handlers, ...socketHandlers)`
- `src/main.tsx` — `worker.start({ onUnhandledRequest })` **antes** de importar app
- `src/mocks/handlers.ts` — 6 handlers REST + cenários
- `src/mocks/socket.ts` — `ws.link` + `@mswjs/socket.io-binding` para `nft.updated`
- `src/mocks/db.ts` — localStorage + Zod schema + `createNfts()` (24 NFTs)
- `src/mocks/fixtures.ts` — 2 usuários + factory de NFTs
- `src/mocks/scenarios.ts` — 7 cenários persistidos em localStorage
- `src/mocks/socket.ts` — broadcast manual para clientes conectados

**Handlers REST:**
| Método | Rota | Função |
|--------|------|--------|
| GET | `/api/session` | `{ user: null }` |
| GET | `/api/nfts` | Lista com busca/filtro/ordenção/paginação |
| GET | `/api/nfts/:id` | Detalhe ou 404 |
| POST | `/api/__mock/reset` | Reset DB + cenário |
| POST | `/api/__mock/scenario` | Troca cenário |
| POST | `/api/__mock/nfts/:id/update` | Atualiza versão/preço + emite `nft.updated` |

**Cenários:** `default`, `empty`, `slow` (2s), `variable-latency`, `network-error`, `http-500` (503), `unauthorized` (401)

**Status:** ✅ Efetivamente usado para REST + WebSocket. Mocks na camada de rede, sem lógica de negócio em componentes.

---

## ✅ Playwright 1.63.0

**Configuração:** `playwright.config.ts`
- Projects: `chromium-390` (390×844), `chromium-768` (768×1024), `chromium-1440` (1440×900)
- `baseURL: 'http://127.0.0.1:5173'`
- `webServer` com `npm run preview` (build demo)
- `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`

**Testes existentes (`tests/e2e/foundation.spec.ts`):**
| Teste | Verifica |
|-------|----------|
| catálogo REST e detalhe por acesso direto | Link visível, navegação, reload, 404 |
| parâmetros da URL chegam ao mock REST | `q`, `category`, `sort`, `page` + reload |
| guarda privada preserva destino | `/checkout` → `/login?redirect=...` |
| evento Socket.IO reconcilia detalhe | `nft.updated` → preço atualiza + persiste após reload |
| skeleton, erro e recuperação usam MSW | Cenário `slow` → skeleton → `http-500` → erro → reset → retry |
| link de salto por teclado + overflow | `Tab` → skip link → `Enter` → foco no main + `scrollWidth <= innerWidth` |

**Resultado:** `npm run test:e2e` → **18 testes passaram** (6 testes × 3 viewports)

**Status:** ✅ Configurado e executando. ⚠️ **Cobertura:** 6/12 grupos obrigatórios do README §9 (apenas smoke).

---

## ✅ Lighthouse 13.5.0

**Script:** `scripts/lighthouse.mjs`
- 3 medições por página/perfil
- Páginas: Início, Detalhe
- Perfis: mobile (preset), desktop (1440×900, UA desktop, throttling)
- Relatórios HTML/JSON + `summary.json` com medianas, LCP, CLS, TBT
- Executa via `npm run audit:lighthouse` (requer `npm run preview` rodando)

**Última execução (estrutura provisória):**
| Página/Perfil | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---------------|------|------|----|-----|-----|-----|-----|
| Início mobile | 98 | 100 | 100 | 91 | 2121 | 0 | 65.5 |
| Início desktop | 100 | 100 | 100 | 91 | 495 | 0.0024 | 0 |
| Detalhe mobile | 97 | 100 | 100 | 91 | 2384 | 0.0152 | 81 |
| Detalhe desktop | 100 | 100 | 100 | 91 | 565 | 0.0080 | 0 |

**Status:** ✅ Script funcional. ⚠️ **Auditoria da estrutura, não da aplicação final** (sem assets Figma, sem fluxos completos).

---

## Resumo da Stack

| Tecnologia | Instalada | Usada Efetivamente | Observação |
|------------|-----------|-------------------|------------|
| React | ✅ | ✅ | App completo |
| TypeScript | ✅ | ✅ | Strict, sem `any` |
| TanStack Router | ✅ | ✅ | 10 rotas + guards |
| TanStack Query | ✅ | ✅ | Cache, invalidação, cancelamento |
| Axios | ✅ | ✅ | Cliente centralizado |
| socket.io-client | ✅ | ✅ | `nft.updated` + reconciliação |
| Tailwind CSS | ✅ | ⚠️ | Tokens NÃO correspondem ao Figma |
| shadcn/ui | ✅ | ⚠️ | 2/38 componentes |
| MSW | ✅ | ✅ | REST + WS, cenários, DB |
| Playwright | ✅ | ⚠️ | 6/12 grupos E2E |
| Lighthouse | ✅ | ⚠️ | Estrutura apenas |

**Conclusão:** A stack está **instalada e operacional**, mas a **camada de UI/design system não reflete o Figma** (cores, tipografia, componentes, responsividade).