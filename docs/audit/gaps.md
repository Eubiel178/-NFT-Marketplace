# Auditoria de Gaps — Figma vs Implementação

**Fonte:** `docs/figma/` (8 arquivos) vs código atual (`src/`)
**Objetivo:** Identificar telas, componentes, assets, tokens, rotas e comportamentos documentados mas não implementados.

---

## 1. Telas (15 frames Figma → 9 rotas)

| # | Figma Frame | Rota Atual | Status Implementação | Gap Principal |
|---|-------------|------------|----------------------|---------------|
| 1 | Desktop / Início (`2:2`) | `/` | ❌ `CatalogPage` = skeleton genérico | Header, Hero, Toolbar, Grid 3×3, Promos, Blog, Footer |
| 2 | Desktop / Detalhes (`10:244`) | `/nfts/:id` | ❌ `NftPage` = placeholder | Galeria thumbs, main image, meta, stepper, CTAs, Description, Related |
| 3 | Desktop / Carrinho (`11:1278`) | `/cart` | ❌ `PendingFeature` | Tabela 4 cols, 3 itens, stepper, wallet summary, cupom, related |
| 4 | Desktop / Pagamento (`11:2862`) | `/checkout` | ❌ `PendingFeature` | Checkout Page + overlay modal, form, wallet select, revisão |
| 5 | Desktop / Confirmação (`11:4385`) | `/orders/:id` | ❌ `PendingFeature` | Modal + scrim, meta 4 cols, detalhes 3 itens, Etherscan |
| 6 | Desktop / Login (`9:115`) | `/login` | ❌ `PendingFeature` | Modal 500×600, tabs, email/senha, social, X |
| 7 | Desktop / Cadastro (`9:1022`) | `/register` | ❌ `PendingFeature` | Modal 500×656, 4 campos, social, X |
| 8 | Desktop / Perfil (`9:1238`) | `/profile` | ❌ `PendingFeature` | Sidebar 6 itens, 5 campos + avatar, 3× senha |
| 9 | Desktop / Carteiras (`9:1670`) | `/wallets` | ❌ `PendingFeature` | Sidebar, 10 campos, checkbox secundária |
| 10 | Mobile / Início (`14:5226`) | `/` (mobile) | ❌ Mesmo `CatalogPage` | Search bar, Hero 190px, Tabs, Grid 2×2 stagger, Tab Bar |
| 11 | Mobile / Detalhes (`15:5536`) | `/nfts/:id` (mobile) | ❌ Mesmo `NftPage` | Hero 506px + Sheet 504px (gap -114px), Buy Bar fixa |
| 12 | Mobile / Carrinho (`16:360`) | `/cart` (mobile) | ❌ `PendingFeature` | 4 itens, stepper, Promo Input, Payment Summary, CTA |
| 13 | Mobile / Pagamento (`16:748`) | `/checkout` (mobile) | ❌ `PendingFeature` | Wallet cards (Reserva/Principal), 3 opções, total, confirmar |
| 14 | Mobile / Login (`16:1022`) | `/login` (mobile) | ❌ `PendingFeature` | Tela inteira, 2 campos, social, link cadastro |
| 15 | Mobile / Cadastro (`16:1228`) | `/register` (mobile) | ❌ `PendingFeature` | Tela inteira, 4 campos, social, link login |

**Resumo:** **0/15 telas implementadas**. Rotas existem mas componentes são placeholders ou genéricos.

---

## 2. Componentes (38 no Figma → 2 implementados)

### Inventário Figma (de `docs/figma/components.md` + `nodes.json`)

| Categoria | Componentes Figma | Implementado | Gap |
|-----------|-------------------|--------------|-----|
| **Estruturais (7)** | Header With Divider, Header Row (set+2 variants), Footer, Filters, Checkout Page, Marketplace Page, Mobile Social Block, Password Input, Social Button (set+2 variants) | 0/9 | Todos ausentes |
| **Ícones (25)** | Logout, Arrow-Down(2), Arrow-Right(2), Star, Message, Delete, X, Hide(2), Image 2, User(2), Location, Activity, Download, Danger Triangle, Search, Filter, Home, Shop, Arrow-Left, Wallet | 0/25 | Button usa `lucide-react` genérico |
| **Total** | **38** | **2** | **36 ausentes** |

### Componentes Implementados vs Necessários

| Componente Base | Status | Necessário Para |
|-----------------|--------|-----------------|
| `Button` (variants: primary/secondary/ghost, sizes: sm/md/lg) | ✅ Parcial (1 variant, 1 size) | Todas as telas (12+ CTAs diferentes no Figma) |
| `Input` (text/password/select/promo, sizes, states) | ❌ | Login, Cadastro, Perfil, Carteiras, Carrinho, Checkout |
| `NftCard` (variants: sm/md/lg, hasDiscount) | ❌ | Home (3 anatomias), Detalhe Related, Carrinho Related |
| `Header` (active: home/market/null, cartCount, user) | ❌ | Todas telas desktop |
| `TabBar` (active: home/cart/action/shop/user) | ❌ | Mobile Início, Detalhes, Carrinho |
| `Modal` (sizes: sm/md, variants: auth/confirm) | ❌ | Login, Cadastro, Confirmação desktop |
| `Sheet` / `Drawer` (mobile filters, mobile sidebars) | ❌ | Mobile Filtros, Perfil/Carteiras mobile |
| `Stepper` (Add Button + contador) | ❌ | Detalhes, Carrinho (desktop + mobile) |
| `Avatar` (upload + remove) | ❌ | Perfil |
| `Select` / `Combobox` (Arrow-Down) | ❌ | Filtros rede, Carteiras, Perfil ENS |
| `Checkbox` / `Radio` (wallet selection) | ❌ | Pagamento mobile, Carteiras secundária |
| `Toast` / `Snackbar` | ❌ | Feedback mutations, erros, socket |
| `Tooltip` / `Popover` | ❌ | Ícones, badges |
| `Badge` (RARO, EM DESTAQUE, OFERTA LIMITADA) | ❌ | Home mobile, Featured NFT Banner |
| `Pagination` (4 itens + prev/next) | ❌ | Home desktop |
| `TabBar` mobile | ❌ | Mobile Início |
| `Buy Bar` (fixa mobile detalhe) | ❌ | Mobile Detalhes |
| `Payment Summary` (mobile carrinho/checkout) | ❌ | Mobile Carrinho/Pagamento |

---

## 3. Assets (4 raster + 40 vetores + logo)

### Imagens Raster (4 `imageRef` únicos, 38 usos)

| `imageRef` / alias | Usos no Figma | Integrado? |
|--------------------|---------------|------------|
| `84592047…` / `fill_0380e2ac` | 11 (Hero desktop, Card A, Promo Genesis, Blog 2, Thumb selecionada, Main detail, Cart item 1, Hero mobile, Hero detail mobile, Cart mobile 2) | ❌ |
| `2986a7cb…` / `fill_02276ad0` | 14 (Featured NFT, Cards B/D/E, Blog 3, Collection 6/7, Cart items 2/7, Related 1/2, Hero mobile arte 2, Grid mobile P-2, Cart mobile 3) | ❌ |
| `9df2ff42…` / `fill_26d577be` | 9 (Card C promo, Card F, Promo Curated, Blog 1, Collection 8, Cart item 3, Related 3, Cart mobile 4) | ❌ |
| `87580f2d…` / `fill_d003b2ae` | 4 (Blog 4, Grid mobile P-4, Cart mobile 5) | ❌ |

**Nenhuma imagem baixada ou integrada.** `nodes.json` tem `figmaImageUrl` e `apiImageEndpoint` (incorreto — usa `imageRef` em vez de node id).

### Vetores (40 únicos / 84 ocorrências)

- 25 ícones `Iconly` (4 famílias: Curved, Bold, Light-Outline, Two-tone) → **não integrados**
- 6 decorativos com nomes de layer (`Frame`, `Vector`, `Vector N (Stroke)`, `Ellipse 2 (Stroke)`) → **não reutilizáveis**
- `Mask Group`, `thank-you 1`, `Group` → decorativos

**Nenhum SVG importado.** `lucide-react` usado no Button é genérico.

### Logo

- Desktop: alias `EL-*` no Header/Footer → **não extraído**
- Mobile: nó `TEXT` "Kurio" → **não é arquivo de logo**
- **Nenhum SVG/PNG de logo disponível.**

---

## 4. Design Tokens (docs/figma/design-tokens.md vs styles.css)

### Cores — 12 tokens Figma vs CSS Atual

| Token Figma | Hex | CSS Atual | Match? |
|-------------|-----|-----------|--------|
| `Color/Ink` | `#140D0A` | `--background: #17171b` | ❌ |
| `Color/Foreground` | `#F5F1EB` | `--foreground: #f5f5f7` | ❌ |
| `Color/Primary` | `#D28A4C` | `--primary: #c9b5ff` | ❌ |
| `Color/Secondary` | `#B39463` | — | ❌ |
| `Color/Surface Card` | `#241612` | `--muted: #303038` | ❌ |
| `Color/Surface Dark` | `#38220F` | — | ❌ |
| `Color/Surface Raised` | `#2F1D15` | — | ❌ |
| `Color/Border` | `#3F2319` | `--border: #62626c` | ❌ |
| `Color/Border Soft` | `#55321F` | — | ❌ |
| `Text/Accent` | `#E89B55` | — | ❌ |
| `Text/Secondary` | `#CFB28C` | — | ❌ |
| `Text/Coral` | `#F0805F` | — | ❌ |

**0/12 cores correspondem.** CSS usa paleta genérica roxa/azulada vs Figma âmbar/escuro.

### Gradientes (4 globais + 5 inline)

| Alias Figma | CSS | Usado no CSS? |
|-------------|-----|---------------|
| `fill_928da933` | `linear-gradient(145deg, rgba(210,138,76,0.3)...)` | ❌ |
| `fill_af2f5fc9` | `linear-gradient(135deg, #241612, #2F1D15)` | ❌ |
| `fill_4399d4cf` | `linear-gradient(137deg, rgba(210,138,76,1), rgba(210,138,76,0.8))` | ❌ |
| `fill_73ba89d3` | `linear-gradient(144deg, #241612, #241612)` | ❌ |
| 5 inline (Featured Banner, Filter button, Tab Bar notch, Apply button) | — | ❌ |

### Tipografia (76 estilos Figma)

| Propriedade | Figma | CSS Atual |
|-------------|-------|-----------|
| Fonte | `Roboto Mono` | `system-ui, sans-serif` |
| Pesos | 400, 500, 700 | Não configurados |
| Escala | 9,10,12,13,14,15,16,17,18,20,21,22,24,28,32,43 | Tailwind padrão |
| Line heights | 10,15,16,18,20,22,24,30,40,45,auto | Tailwind padrão |
| Letter spacing | 0.1em (3), 0.0111em (1) | Não configurado |
| 76 estilos (incl. alinhamento variants) | ✅ | ❌ |

**Fonte errada, escala errada, 76 estilos não mapeados.**

### Espaçamento (Gaps + Paddings)

| Gaps Figma (freq) | Tailwind Padrão | Match? |
|-------------------|-----------------|--------|
| 10px (53), 12px (18), 16px (10), 8px (6) | 4, 8, 12, 16, 24, 32 | Parcial (10, 12, 16, 8 ok; 44, 48, 72, 88, -114 ausentes) |
| Paddings únicos por componente | Não mapeados | ❌ |

### Raios (21 valores Figma)

| Top 10 Figma | Tailwind Padrão |
|--------------|-----------------|
| 40px (12), 6px (11), 0px (10), 10px (9), 14px (9), 15px (7), 16px (7), 24px (3), 13px (3) | 4, 6, 8, 12, 16, 24, full |
| **Valores únicos Figma:** 0, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 17.5, 18, 20, 22, 24, 25, 29, 31, 32, 40 | **Muitos ausentes** (17.5, 29, 31, 32) |

### Sombras (2 globais + 3 inline)

| Alias | CSS Figma | No CSS? |
|-------|-----------|---------|
| `effect_12da039e` | `0 6px 20px 0 rgba(10,6,4,0.45)` | ❌ |
| `effect_e368b9ba` | `0 0 20px 0 rgba(10,6,4,0.45)` | ❌ |
| Inline Tab Bar | `0 -10px 30px 0 rgba(10,6,4,0.45)` | ❌ |
| Inline Wallet Reserva | `0 20px 20px 0 rgba(10,6,4,0.45)` | ❌ |
| Inline Coinbase | `0 0 40px 0 rgba(10,6,4,0.45)` | ❌ |
| Extra: `rgba(20,13,10,0.15)` (2 sombras) | Cor `Color/Ink` 15% | ❌ |

### Motion (Ausente no Figma)

- Nenhuma duração, easing, transição definida
- CSS tem apenas `shimmer` + `prefers-reduced-motion`

---

## 5. Rotas (9 definidas vs 15 telas Figma)

| Rota | Figma Desktop | Figma Mobile | Status |
|------|---------------|--------------|--------|
| `/` | Início `2:2` | Início `14:5226` | ⚠️ Rota única, componente não responsivo |
| `/nfts/:id` | Detalhes `10:244` | Detalhes `15:5536` | ⚠️ Rota única, componente não responsivo |
| `/cart` | Carrinho `11:1278` | Carrinho `16:360` | ❌ Placeholder |
| `/checkout` | Pagamento `11:2862` | Pagamento `16:748` | ❌ Placeholder |
| `/orders/:id` | Confirmação `11:4385` | **Não existe** | ❌ Placeholder (mobile faltando) |
| `/login` | Login `9:115` (modal) | Login `16:1022` (tela) | ❌ Placeholder |
| `/register` | Cadastro `9:1022` (modal) | Cadastro `16:1228` (tela) | ❌ Placeholder |
| `/profile` | Perfil `9:1238` | **Não existe** | ❌ Placeholder (mobile faltando) |
| `/wallets` | Carteiras `9:1670` | **Não existe** | ❌ Placeholder (mobile faltando) |

**Gaps de Rota:**
- Mobile usa **mesmo componente** das rotas desktop → não há responsividade real
- Perfil, Carteiras, Confirmação **não têm frames mobile no Figma** → precisam ser inventados (README §3)
- Login/Cadastro desktop = modal; mobile = tela inteira → **padrão divergente não implementado**
- Tab Bar mobile não existe → navegação mobile quebrada

---

## 6. Comportamentos (docs/figma/flows.md + README)

| Comportamento | Documentado | Implementado | Gap |
|---------------|-------------|--------------|-----|
| Busca + filtros combinados + ordenação + paginação na URL | ✅ | ⚠️ Parâmetros só | UI filtros, ordenação, paginação, reset paginação ao filtrar |
| Filtros combináveis | ✅ | ❌ | Mock combina `q` + `category`; UI não existe |
| Detalhe: acesso direto + 404 + edição indisponível + limite qtd | ✅ | ⚠️ Acesso + 404 | Galeria, edições, favoritos, stepper, limite |
| Favoritos persistentes + otimista + rollback | ✅ | ❌ | API, hook, UI, sincronização |
| Carrinho: add/alterar/remover por NFT/edição/disponibilidade | ✅ | ❌ | API, UI, stepper, delete (desktop não tem) |
| Carrinho persistente visitante + merge login | ✅ | ❌ | localStorage → API merge |
| Cupom: aplicar/remover, inválido/expirado | ✅ | ❌ | API `/quotes`, UI Promo Input, estados |
| Cotação autoritativa (strings ETH, BigInt) | ✅ | ⚠️ `eth.ts` pronto | Endpoint `/quotes`, integração carrinho/checkout |
| Socket `nft.updated` → catálogo/detalhe/carrinho | ✅ | ⚠️ Catálogo+detalhe | Carrinho não existe; toast/status UI |
| Socket `order.updated` → checkout/confirmação/perfil | ✅ | ❌ | Evento, handler, reconciliação, isolamento |
| Checkout: validação, carteiras, rede, idempotência | ✅ | ❌ | Form, wallet select, `Idempotency-Key`, revalidação |
| Confirmação: snapshot, Etherscan, estados terminais | ✅ | ❌ | Modal/recibo, link, pending/confirmed/declined |
| Auth: register/login/logout/session/expiração/hash | ✅ | ❌ | Handlers, formulários, validação, redirect, hash |
| Perfil: dados, avatar, senha (3 campos) | ✅ | ❌ | Formulários, upload, validação |
| Carteiras: principal + secundária, checkbox | ✅ | ❌ | CRUD, validação endereço/ENS |
| 12 grupos E2E + regressão visual | ✅ | 6 smoke | 6 grupos + baselines + isolamento |
| Skeletons shimmer + dimensões finais | ✅ | ⚠️ Shimmer genérico | Dimensões não correspondem ao Figma |
| Acessibilidade completa (labels, erros, foco, alt, contraste) | ✅ | ⚠️ Básico | Formulários, diálogos, estados, alt text |
| Responsividade 390/768/1440 | ✅ | ❌ | Breakpoints, Tab Bar, Buy Bar, Sheet, Grid fluido |
| Lighthouse ≥ 90/95/95/90 app completo | ✅ | ⚠️ Estrutura | App final não auditado |
| Deploy público | ✅ | ❌ | Não feito |

---

## 7. Resumo Quantitativo de Gaps

| Categoria | Documentado (Figma/README) | Implementado | % Gap |
|-----------|----------------------------|--------------|-------|
| Telas | 15 | 0 | 100% |
| Componentes | 38 | 2 | 95% |
| Assets raster | 4 (38 usos) | 0 | 100% |
| Assets vetores | 40 (84 ocorrências) | 0 | 100% |
| Logo | 1 | 0 | 100% |
| Cores | 12 | 0/12 | 100% |
| Gradientes | 9 | 0 | 100% |
| Tipografia | 76 estilos | 0 | 100% |
| Fonte | Roboto Mono | system-ui | 100% |
| Espaçamento (gaps/paddings) | ~30 valores | Parcial | ~80% |
| Raios | 21 valores | Parcial | ~70% |
| Sombras | 5 | 0 | 100% |
| Motion | 0 (definir) | shimmer only | N/A |
| Rotas mobile dedicadas | 6 (Perfil, Carteiras, Confirmação, Login, Cadastro, Início/Detalhes responsivos) | 0 | 100% |
| Handlers REST privados | ~24 ops | 0 | 100% |
| Eventos Socket.IO | 2 | 1 | 50% |
| Testes E2E grupos | 12 | 6 (smoke) | 50% |
| Regressão visual baselines | 12 | 0 | 100% |
| Deploy | 1 | 0 | 100% |

---

## 8. Priorização Sugerida (Fase 2+)

### Bloco 1 — Fundação (pré-requisito para tudo)
1. Corrigir estrutura `components/ui/button` → `button/index.tsx`, `skeleton` → `skeleton/index.tsx`
2. Aplicar **design tokens** no Tailwind config: cores, fonte `Roboto Mono`, escala tipográfica, spacing, raios, sombras, gradientes
3. Criar componentes base: `Button` (variants/sizes), `Input`, `Card`, `Modal`, `Sheet`, `TabBar`, `Stepper`, `Avatar`, `Select`, `Checkbox`, `Radio`, `Toast`, `Badge`, `Pagination`, `Tooltip`

### Bloco 2 — Layouts Responsivos
4. `DesktopLayout`: Header sticky + sidebar filtro + max-w-6xl (1200px conteúdo)
5. `MobileLayout`: Tab Bar (5 destinos, estado ativo) + safe-area + Buy Bar (detalhe) + Sheet (filtros)
6. Breakpoints Tailwind: `390`, `768`, `1440` + container `max-w-[1200px]` desktop / `px-6` mobile

### Bloco 3 — Telas (ordem de dependência)
7. **Home** (desktop + mobile) → define Grid, Card, Hero, Promos, Blog, Footer
8. **Detalhe NFT** → Galeria, Sheet mobile, Buy Bar, Stepper, Favoritos
9. **Carrinho** → Tabela/List, Stepper, Delete, Cupom, Payment Summary, Related
10. **Checkout** → Form, Wallet Select, Revisão, Idempotency Key
11. **Confirmação** → Modal/Sheet, Snapshot, Etherscan
12. **Auth** → Modal desktop / Tela mobile, Hash senha, Redirect, Sessão
13. **Perfil / Carteiras** → Sidebar/Tab Bar, Formulários, Avatar, Senha

### Bloco 4 — Integração Completa
14. Carrinho persistente + merge login + cotação + socket updates
13. `order.updated` + reconciliação pedidos + isolamento usuário
14. Favoritos otimistas + rollback
15. Testes E2E (12 grupos) + Regressão visual (12 baselines)
16. Lighthouse app completo + Deploy

---

## 9. Conclusão

**A documentação Figma (`docs/figma/`) está completa e detalhada.**
**A implementação (`src/`) tem apenas a infraestrutura técnica.**

**Gaps totais:** ~95% da camada de UI/fluxos não implementada.
**Próximo passo obrigatório:** Fundação (tokens + componentes base + layouts) antes de qualquer tela.