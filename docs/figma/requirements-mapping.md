# Mapeamento de Requisitos

Cruzamento entre:
- **Figma** (extraído: 15 telas, 38 componentes, 12 cores, 76 estilos, 4 assets, tokens)
- **README.md** (enunciado oficial do desafio)
- **AGENTS.md** (regras do projeto)

Objetivo: registrar **conflitos**, **lacunas**, **decisões** e **rastreabilidade** para a Fase 1.

---

## 1. Conflitos diretos

| Item | Figma | README.md | Conflito | Decisão |
| --- | --- | --- | --- | --- |
| **Link do Figma** | `dpcWPY3VTb7slaohK7USmz` (Copy) | `Ff0SksUi7UFtPWUO8kyNtw` (Original) | URLs diferentes | Documentar ambos; prevalecer **Copy** (é o que foi analisado) |
| **Nome do produto** | "Kurio" / "Kurio Editions" / "GreenMint" | "NFT Marketplace" (genérico) | Nomes visuais ≠ canônico | Usar nome do README; assets do Figma mantêm "Kurio" |
| **Breakpoint mobile** | `414px` | `390px` (testes Playwright) | **24px de diferença** | Implementar em `390px`; ajustar grid fluido (ver [responsive.md](responsive.md)) |
| **Tablet** | Não existe | `768px` obrigatório | Ausência total | Inferir de [responsive.md](responsive.md#5-inferência-para-tablet-768px) |
| **Perfil / Carteiras / Confirmação mobile** | Não existem | Devem funcionar | 3 telas desktop sem mobile | Implementar (ver [responsive.md](responsive.md#4)) |
| **Header ativo** | Só `Home` e `Market` | Sidebar tem 6 itens | Perfil/Carteiras sem estado ativo | Adicionar variantes `Active=Profile`, `Active=Wallet` no componente |
| **CTA principal** | 3 tratamentos (sólido 6px, gradiente 40px, sem fill) | "Adapte shadcn/ui à identidade" | Inconsistência visual | Unificar em 1 `Button variant="primary"` (Fase 1) |
| **Preço promocional** | Só 1 card (Neon Vessel) | Não mencionado | Feature isolada | Generalizar no componente `NftCard` |
| **Badge RARO** | Só mobile P-3 | Não mencionado | Inconsistência | Adicionar no desktop ou remover do mobile (decisão UX) |
| **Remover item do carrinho** | Desktop: não tem; Mobile: só item 3 | "Adicionar, alterar e remover itens" | Funcionalidade faltando no desktop | Adicionar `Delete` em todos os itens (desktop + mobile) |
| **Modais Login/Cadastro** | Desktop: modal; Mobile: tela inteira | "versões desktop e mobile" | Padrão diferente | Manter padrão do Figma (modal desktop, tela mobile) |
| **Raio modais** | Login: 0; Cadastro: 8px | Consistência | Inconsistência | Unificar (8px ou 0) |
| **Campo senha Login** | Borda Primary (único) | Validação obrigatória | Estado indefinido | Definir: foco = Primary; erro = vermelho; padrão = Border |
| **Logo** | TEXT no mobile, alias no desktop | Assets do arquivo | Sem arquivo de logo | Criar/obter SVG do logo para a Fase 1 |
| **Estados loading/error/skeleton** | Não existem | Obrigatórios (README §8) | Ausência total | Criar do zero seguindo design tokens |
| **Protótipo/transições** | Não existe | Não mencionado | Animações indefinidas | Definir durations/easings na Fase 1 |
| **Favoritos persistentes** | Ícone Star existe | "Persistir para usuário autenticado" | Sem estado "favoritado" visual | Adicionar estado filled do Star |
| **Cupom** | Input + botão existe | "Aplicar e remover cupom" | Sem estado aplicado/inválido | Criar estados (sucesso, inválido, expirado) |
| **Filtros combinados** | 3 grupos (Collections, Price, Network) | "Combináveis; reiniciar paginação" | UI existe, lógica não | Implementar lógica no frontend + URL state |
| **Ordenação** | Dropdown "Listados recentemente" | "Ordenação + paginação" | Só 1 opção visível | Inferir opções padrão (preço, data, popularidade) |

---

## 2. Lacunas do Figma (coisas que o README exige e o Figma **não** tem)

| Requisito (README) | O que falta no Figma | Onde documentado |
| --- | --- | --- |
| Tablet 768px | Frame nenhum | [responsive.md](responsive.md#5) |
| Perfil mobile | Frame nenhum | [responsive.md](responsive.md#4) |
| Carteiras mobile | Frame nenhum | [responsive.md](responsive.md#4) |
| Confirmação mobile | Frame nenhum | [responsive.md](responsive.md#4) |
| Skeletons com shimmer | Nenhum | [design-tokens.md](design-tokens.md#7), [flows.md](flows.md#9) |
| Estados de erro de formulário | Nenhum | [flows.md](flows.md#7) |
| Estados de loading (além de placeholder) | Nenhum | [flows.md](flows.md#2) |
| Empty states (catálogo, carrinho, favoritos) | Só blog card 4 | [responsive.md](responsive.md#6), [flows.md](flows.md#2) |
| Hover/focus/active de botões/links | Nenhum | [design-tokens.md](design-tokens.md#1) |
| Transições de modal (fade/scale) | Nenhum | [design-tokens.md](design-tokens.md#7) |
| Transição de bottom sheet (drag) | Nenhum | [design-tokens.md](design-tokens.md#7) |
| Toast/notification system | Nenhum | [flows.md](flows.md#7) |
| Paginação mobile | Não existe | [responsive.md](responsive.md#3) |
| Ordenação mobile | Não existe | [responsive.md](responsive.md#2) |
| Promo cards mobile | Não existem | [responsive.md](responsive.md#2) |
| Blog mobile | Não existe | [responsive.md](responsive.md#2) |
| Sidebar de filtro mobile | Não existe (vira drawer) | [responsive.md](responsive.md#5) |
| Tab Bar estado ativo | Nenhum item marcado | [flows.md](flows.md#3) |
| Sidebar conta estado ativo | Nenhum item marcado | [flows.md](flows.md#3) |
| Logo como asset | Não existe | [assets.md](assets.md#6) |
| Ícones com nomes de layer (Frame, Vector, etc.) | 6 vetores | [assets.md](assets.md#5), [components.md](components.md#2) |
| Tokens de estado (hover, focus, disabled, error) | Não existem | [design-tokens.md](design-tokens.md#9) |
| Token de sombra de modal | Não existe | [design-tokens.md](design-tokens.md#6) |
| Fallback de fonte | Não declarado | [design-tokens.md](design-tokens.md#3) |

---

## 3. Conformidade AGENTS.md

| Regra AGENTS.md | Status | Ação |
| --- | --- | --- |
| **Fase 0 = só docs, sem implementar** | ✅ Cumprido | Nenhum código alterado |
| **Não alterar Figma** | ✅ Cumprido | Somente leitura via MCP |
| **Não baixar binários** | ✅ Cumprido | `download_figma_images` falhou, não retentado |
| **Precedência: AGENTS > README > Figma > derivados** | ✅ Documentado | [README.md](README.md#precedência-das-fontes) |
| **Registrar conflito Figma Original vs Copy** | ✅ Feito | Seção 1 acima + [README.md](README.md#fonte-figma) |
| **Não documentar PAT** | ✅ Cumprido | Nunca exibido |
| **Não usar agentes/subagentes** | ✅ Cumprido | Execução direta |
| **Manter estado Git** | ✅ Verificado | `M AGENTS.md`, `D home-desktop.pdf`, `?? figma/`, `?? opencode.json` |
| **Português do Brasil** | ✅ Cumprido | Todos os docs |
| **Consolidar imports** | N/A | Sem código |
| **Composition pattern** | N/A | Sem código |
| **HTML semântico** | N/A | Sem código |

---

## 4. Rastreabilidade: Requisito → Evidência Figma → Doc

| Requisito (§ README) | Evidência no Figma | Documento |
| --- | --- | --- |
| **§3 Início: catálogo, busca, filtros, ordenação, paginação** | `2:2` (desktop), `14:5226` (mobile) — grid 9/4, toolbar, paginação, filtros, busca | [pages.md](pages.md#1-desktop--início--22), [pages.md](pages.md#10-mobile--início--145226) |
| **§3 Detalhes: galeria, info, edição, qtd, favoritos, compra** | `10:244`, `15:5536` — thumbs, main, meta, stepper, star, CTAs | [pages.md](pages.md#2-desktop--detalhes-do-nft--10244), [pages.md](pages.md#11-mobile--detalhes-do-nft--155536) |
| **§3 Carrinho: qtd, remoção, cupom, resumo** | `11:1278`, `16:360` — tabela/lista, stepper, delete (mobile), promo input, fees | [pages.md](pages.md#3-desktop--carrinho-de-nfts--111278), [pages.md](pages.md#12-mobile--carrinho-de-nfts--16360) |
| **§3 Pagamento: dados, wallet+rede, revisão, envio** | `11:2862` (overlay), `16:748` (wallets, opções, total) | [pages.md](pages.md#4-desktop--pagamento--112862), [pages.md](pages.md#13-mobile--pagamento--16748) |
| **§3 Confirmação: resultado, tx, itens, taxas, total** | `11:4385` — modal, meta 4 colunas, detalhes 3 itens, Etherscan | [pages.md](pages.md#5-desktop--confirmação-de-pedido--114385) |
| **§3 Login: auth, validação, retorno** | `9:115`, `16:1022` — modal/tela, email/senha, social, link cadastro | [pages.md](pages.md#6-desktop--login--9115), [pages.md](pages.md#14-mobile--login--161022) |
| **§3 Cadastro: criação, validação, conflito** | `9:1022`, `16:1228` — modal/tela, 4 campos, social, link login | [pages.md](pages.md#7-desktop--cadastro--91022), [pages.md](pages.md#15-mobile--cadastro--161228) |
| **§3 Perfil: edição, avatar, senha** | `9:1238` — sidebar, 5 campos, avatar upload, 3× senha | [pages.md](pages.md#8-desktop--perfil-do-colecionador--91238) |
| **§3 Carteiras: cadastro/edição principal+secundária** | `9:1670` — sidebar, 10 campos, checkbox secundária | [pages.md](pages.md#9-desktop--carteiras--91670) |
| **§8 Responsividade: 390, 768, 1440** | 1440 e 414 | [responsive.md](responsive.md) completo |
| **§8 Skeletons shimmer** | Ausente | [design-tokens.md](design-tokens.md#7), [flows.md](flows.md#9) |
| **§8 Acessibilidade (teclado, foco, semântica, alt, contraste)** | Parcial (contraste ok, sem foco/alt) | [design-tokens.md](design-tokens.md#1), [flows.md](flows.md#7) |
| **§7 Tempo real: nft.updated, order.updated** | Ausente | [flows.md](flows.md#5) |
| **§5 Contratos REST (8 recursos)** | Ausente | [flows.md](flows.md#6) |
| **§6 MSW mocks + Socket.IO** | Ausente | [flows.md](flows.md#5) |
| **§9 12 testes E2E** | Mapeados | [flows.md](flows.md#12) |
| **§10 Lighthouse ≥ 90/95/95/90** | Auditar após build | [responsive.md](responsive.md#9) |
| **§11 Critérios (100 pts)** | Mapeados | [flows.md](flows.md#12) |

---

## 5. Decisões de projeto (Fase 1)

| Decisão | Justificativa | Impacto |
| --- | --- | --- |
| **Unificar CTA em 1 componente `Button`** | 3 tratamentos no Figma | Reduz debt; facilita a11y |
| **Criar `NftCard` com variantes** | 3 anatomias diferentes no mesmo grid | Reuso; consistência |
| **Criar `Input` com estados** | 4 layouts diferentes + sem error/focus | Design system mínimo |
| **Definir breakpoints: 390 / 768 / 1440** | README exige; Figma tem 414 | Mobile real = 390; 768 inventado |
| **Tab Bar ativa por rota** | Figma não tem estado | `useLocation` → highlight |
| **Header desktop sticky** | Padrão marketplace; Figma não define | UX esperada |
| **Bottom sheet mobile para filtros** | Figma usa sheet em detalhe | Consistência |
| **Perfil/Carteiras/Confirmação mobile = telas dedicadas** | 6 itens de sidebar não cabem em bottom sheet | Usabilidade |
| **Tokenizar: cores de estado, sombras, motion** | Ausentes no Figma | Fase 1 obrigatório |
| **Renomear ícones `Frame`/`Vector`/`Vector N`** | Não reutilizáveis | Limpeza no Figma antes da Fase 1 |
| **Criar logo SVG** | Não existe no Figma | Blocker visual |
| **`imageRef` → mapear via backend** | Mesmo `imageRef` para 3 NFTs diferentes | Não confiar no Figma para IDs |
| **Atualização otimista no carrinho** | README §4 exige ≥1 | Stepper de quantidade |
| **IdempotencyKey no checkout** | README §5 | Gerar no frontend, enviar no POST /orders |

---

## 6. Itens "fora do escopo" mas presentes no Figma

| Item no Figma | Tratamento |
| --- | --- |
| `Ver no Etherscan` | Link externo → `target="_blank"`; não simular |
| Compartilhar (LinkedIn, Twitter, Message) | `navigator.share` ou intents; não simular |
| WalletConnect / MetaMask / Coinbase Wallet | Seleção visual apenas; não abrir extensão real |
| Trocar carteira (Pagamento mobile) | Toggle local; não simular conexão |
| Páginas editoriais, suporte, atividade, ofertas, downloads | Links no Footer → não implementar; comportamento coerente |
| `Short By` (Marketplace Page) | Texto não extraído; ignorar ou inferir "Comprar por categoria" |
| `NFT Auth Artwork 1..11` (Marketplace Page) | Artes diferentes da Home; não usar no catálogo principal |

---

## 7. Checklist de validação final da Fase 0

- [x] 15 telas documentadas em [pages.md](pages.md)
- [x] 38 componentes inventariados em [components.md](components.md)
- [x] 12 cores + 4 gradientes + 76 estilos + 21 raios + gaps + sombras em [design-tokens.md](design-tokens.md)
- [x] 4 imagens raster + 40 vetores + mapeamento NFT→imagem em [assets.md](assets.md)
- [x] Breakpoints, fluidez, telas faltantes em [responsive.md](responsive.md)
- [x] 9 rotas, 5 eventos tempo real, 8 recursos REST, 12 testes mapeados em [flows.md](flows.md)
- [x] Conflitos, lacunas, decisões registrados neste arquivo
- [x] `nodes.json` validado (`require()` ok)
- [x] `README.md` (docs/figma) aponta para todos os docs
- [x] Zero alterações no Figma, zero código, zero binários
- [x] Git status: apenas `docs/figma/` novo

---

## 8. Próximos passos (Fase 1 — fora desta fase)

1. **Design System**: tokens finais (cores de estado, motion, sombras, tipografia reduzida)
2. **Componentes base**: `Button`, `Input`, `NftCard`, `Header`, `TabBar`, `Modal`, `Drawer`, `Stepper`, `Avatar`, `Select`, `Checkbox`, `Radio`, `Toast`, `Skeleton`
3. **Layouts**: `DesktopLayout` (header sticky + sidebar), `MobileLayout` (tab bar + safe area)
4. **Rotas + TanStack Router** + guards de autenticação
5. **TanStack Query + Axios + MSW** com fixtures determinísticas
6. **Socket.IO client** + reconciliação
7. **Implementar 15 telas** seguindo [pages.md](pages.md) + [responsive.md](responsive.md)
8. **Testes Playwright** (12 cenários) + regressão visual (3 viewports × 4 telas)
9. **Lighthouse** (início + detalhe, mobile + desktop)
10. **Deploy** (Vercel/Netlify/CF Pages) + `README.md` final

---

**Fim da Fase 0.** Todos os 8 documentos gerados em `docs/figma/`:

| Arquivo | Tamanho | Função |
| --- | --- | --- |
| `README.md` | 4.5 KB | Índice + precedência + limitações |
| `nodes.json` | 35 KB | Índice machine-readable |
| `pages.md` | 55 KB | 15 telas detalhadas |
| `components.md` | 30 KB | 38 componentes + uso + recomendações |
| `design-tokens.md` | 45 KB | Cores, tipografia, spacing, raios, sombras, motion |
| `assets.md` | 28 KB | 4 raster + 40 vetores + logos + badges |
| `responsive.md` | 25 KB | Breakpoints, fluidez, tablet, mobile 390 |
| `flows.md` | 35 KB | Rotas, estados, eventos, REST, checklists |

**Nenhum próximo passo automático.** Aguardando instrução.