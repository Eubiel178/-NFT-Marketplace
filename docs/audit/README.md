# Auditoria da Estrutura Inicial — Fase 1

**Data:** 02/10/2026
**Ambiente:** Windows 10 x64, Node.js 24.18.0, npm 11.16.0
**Projeto:** nft-marketplace@0.1.0

## Resumo Executivo

A infraestrutura base está **instalada e funcional** (typecheck ✅, lint ✅, build ✅, testes ✅, Lighthouse ✅).
No entanto, **a implementação das telas e fluxos do Figma não foi iniciada** — apenas a estrutura de rotas, contratos, mocks e componentes básicos existem.

## O que está correto

- Stack completa instalada e efetivamente usada no código
- TypeScript strict sem `any`
- TanStack Router com rotas de todas as 9 telas + guards de autenticação
- TanStack Query com cache, invalidação e retry configurados
- Axios client centralizado
- Socket.IO client + binding MSW para `nft.updated`
- MSW com handlers REST + WebSocket, cenários determinísticos, DB persistida
- Tailwind CSS v4 + shadcn/ui (Button, Skeleton)
- Playwright com 6 testes passando (catálogo, detalhe, auth guard, socket, skeleton/erro, a11y)
- Lighthouse executando 12 medições
- Estrutura de pastas por domínio (app, components, contracts, features, lib, mocks)
- Convenção kebab-case + `index.tsx` respeitada
- HTML semântico nos componentes existentes
- `prefers-reduced-motion` no CSS global
- Template literals nas strings
- ETH como strings decimais com BigInt/wei

## O que está incompleto / faltando

| Área | Status |
|------|--------|
| 9 telas do Figma (desktop + mobile) | **0% implementado** — apenas rotas + `PendingFeature` |
| Componentes do design system | 2/38 (Button, Skeleton) |
| Design tokens (cores, tipografia, spacing, raios, sombras) | Não aplicados — CSS usa cores genéricas |
| Assets (4 imagens raster, 40 vetores, logo) | Não integrados |
| Busca, filtros combinados, ordenação, paginação na URL | Parcial (apenas parâmetros no catálogo) |
| Detalhe: galeria, edições, favoritos, compra | Rota existe, componente é placeholder |
| Carrinho: add/alterar/remover, cupom, cotação | Rota existe, componente é placeholder |
| Pagamento: validação, carteiras, rede, idempotência | Rota existe, componente é placeholder |
| Confirmação: recibo, snapshot, Etherscan | Rota existe, componente é placeholder |
| Auth: cadastro, login, logout, sessão, hash senha | Rotas existem, componentes são placeholders |
| Perfil / Carteiras / Favoritos | Rotas existem, componentes são placeholders |
| `order.updated` Socket.IO autenticado | Não implementado |
| 12 grupos de testes E2E + regressão visual | 6/12 grupos (smoke apenas) |
| Deploy público | Não feito |

## Violações do AGENTS.md

| Regra | Status | Detalhe |
|-------|--------|---------|
| `TypeScript strict, sem any` | ✅ | Nenhum `any` encontrado |
| Valores ETH como strings decimais | ✅ | `ethSchema` + `toWei/fromWei` |
| Quantidades como inteiros | ✅ | `z.number().int()` nos contratos |
| Chamadas REST via Axios client | ✅ | `http` em `src/lib/http.ts` |
| Mocks apenas na camada MSW | ✅ | Componentes usam `useQuery`/`mutations` |
| Socket.IO via `socket.io-client` | ✅ | `realtime.ts` + binding MSW |
| Composition pattern | ⚠️ | Button usa `Slot` + CVA, mas não há subcomponentes |
| HTML semântico | ✅ | `nav`, `main`, `header`, `footer`, `section`, `ul/li` |
| Acessibilidade (labels, erros, foco, teclado) | ⚠️ | Básico no Layout; faltam labels/erros em formulários |
| `prefers-reduced-motion` | ✅ | No CSS global |
| Imports consolidados do mesmo barrel | ✅ | `import { Button, Skeleton } from '@/components'` |
| Barrel `@/components` existe | ✅ | `src/components/index.ts` |
| Estrutura: pasta + `index.tsx` | ✅ | `components/ui/button/index.tsx` não existe — **violação**: arquivo `button.tsx` direto em `ui/` |
| Kebab-case nas pastas | ✅ | `features/catalog`, `features/home`, `lib`, `mocks` |
| Template literals | ✅ | Verificado em arquivos |
| Regra do `+` (sem concatenação de strings) | ✅ | Sem `+` em strings |

## Violações do README.md

| Requisito | Status | Gap |
|-----------|--------|-----|
| 9 telas com fidelidade ao Figma | ❌ | 0 telas implementadas |
| Busca, filtros, ordenação, paginação na URL/histórico | ⚠️ | Parâmetros existem, mas UI e lógica de filtro não |
| Detalhe: galeria, edições, favoritos, compra | ❌ | Placeholder |
| Carrinho: add/alterar/remover, cupom, cotação | ❌ | Placeholder |
| Pagamento: validação, carteiras, rede, idempotência | ❌ | Placeholder |
| Confirmação: snapshot, Etherscan, estados terminais | ❌ | Placeholder |
| Auth completo com hash de senha | ❌ | Placeholder |
| Perfil, avatar, senha, carteiras | ❌ | Placeholder |
| Favoritos persistentes + otimista | ❌ | Não existe |
| `nft.updated` + `order.updated` Socket.IO | ⚠️ | Só `nft.updated` público |
| 12 grupos E2E + regressão visual | ⚠️ | 6 testes smoke |
| Lighthouse ≥ 90/95/95/90 na aplicação completa | ⚠️ | Só estrutura |
| Deploy público | ❌ | Não feito |
| Skeletons com shimmer + dimensões finais | ⚠️ | Skeleton genérico |

## Problemas Arquiteturais Identificados

1. **`src/components/ui/button.tsx` e `skeleton.tsx` estão na raiz de `ui/`, não em pastas próprias com `index.tsx`** — viola estrutura de arquivos do AGENTS.md
2. **Barrel `src/components/index.ts` exporta `Button` e `Skeleton` mas não há subpastas** — inconsistência com composition pattern
3. **CSS global usa cores CSS variables genéricas (`--primary: #c9b5ff`, etc.) que NÃO correspondem aos tokens do Figma** (`Color/Ink #140D0A`, `Color/Primary #D28A4C`, etc.)
4. **Fonte `system-ui` no CSS vs `Roboto Mono` no Figma**
5. **`src/features/home/components` existe mas vazio** — estrutura preparada mas sem uso
6. **`catalogOptions` usa `pageSize: 6` hardcoded** — Figma mostra 9 cards desktop (3×3) e 4 mobile (2×2)
7. **Nenhum componente usa os 76 estilos tipográficos do Figma** — apenas classes Tailwind genéricas
8. **Responsividade: breakpoints 390/768/1440 não configurados** — apenas `md:` do Tailwind
8. **Tab Bar mobile, Buy Bar, Sheet do detalhe não existem**
9. **Modais Login/Cadastro desktop vs telas mobile — padrão divergente não implementado**
10. **Sidebar de conta com 6 itens sem estado ativo / rotas correspondentes**

## Próximos Passos (Fase 2+)

A implementação deve seguir a ordem de dependência:
1. Design tokens → CSS variables + Tailwind config
2. Componentes base (Button variants, Input, Card, Modal, Sheet, TabBar, Stepper, Avatar, Select, Checkbox, Radio, Toast, Skeleton dimensionado)
3. Layouts (DesktopLayout com header sticky + sidebar, MobileLayout com tab bar + safe area)
4. Telas: Home → Detalhe → Carrinho → Checkout → Confirmação → Auth → Perfil/Carteiras
5. Integração completa: carrinho persistente, favoritos otimistas, idempotência, `order.updated`
6. Testes E2E (12 grupos) + regressão visual
7. Lighthouse + deploy

---