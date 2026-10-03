# Responsividade

Análise de como o Figma trata larguras e o que precisa ser **inventado** para atender ao
[README.md](../README.md).

---

## 1. Resumo executivo

| | Figma | README.md |
| --- | --- | --- |
| Desktop | `1440` (conteúdo 1200) | `1440` ✅ |
| Tablet | **não existe** | `768` ⚠️ obrigatório |
| Mobile | `414` | `390` ⚠️ **24px de diferença** |

⚠️ **O Figma tem 15 frames: 9 desktop (1440) + 6 mobile (414). Não há nenhum frame
tablet, nem em 768 nem em qualquer outra largura intermediária.**
⚠️ **O Figma não tem protótipo, variantes de viewport nem breakpoints declarados.**
Tudo abaixo sobre tablet é **inferência a partir de regras de layout**, não extração.

⚠️ O README exige `390` (testes Playwright) mas o Figma desenha `414`. A diferença de
**24px** (5,8%) é pequena, mas o grid de 2 colunas do mobile precisa ser recalculado.

---

## 2. O que o Figma **faz** vary entre 414 e 1440

Comparação tela a tela das 6 telas que existem em mobile:

| Aspecto | Desktop (1440) | Mobile (414) |
| --- | --- | --- |
| Padding horizontal | `120px` (conteúdo 1200) | `24px` (conteúdo 366) |
| Gap raiz da página | `96px` | `16px` |
| Grid de produtos | **3 colunas × 3 linhas = 9** | **2 colunas × 2 linhas = 4** |
| Coluna de filtros | Sidebar fixa de 310px à esquerda | **Removida** |
| Ordenação | Toolbar com select (300px) | **Removida** |
| Paginação | 4 botões (35px) | **Removida** |
| Navegação | Header horizontal de 1200px | **Tab Bar inferior** (5 destinos) |
| Promo cards | 2 lado a lado (row) | **Removidos** |
| Blog | 4 cards em row | **Removido** |
| Card de NFT | 250 × 250 + nome + preço | 168 × 168 (em card 200px com gradiente) |
| Hero | Arte 450 × 450 ao lado do texto | Arte 138 × 138 ao lado do texto |
| Título do hero | `Display/43 Bold` | `Body/14 Bold` com largura fixa 190px |
| Login/Cadastro | **Modal** sobre a Marketplace Page | **Tela inteira** |
| Botão primário | Sólido, raio 6px, altura 40px | **Gradiente**, raio 40px, altura 60px |
| Detalhe do NFT | Imagem + info lado a lado (1440) | Hero 506px + sheet 504px sobrepostos |
| Carrinho | Tabela (4 colunas) + sidebar 332px | Lista vertical + summary sheet |

---

## 3. Detalhe do grid mobile — o ponto mais crítico

### Desktop (`2:2`)

```
Products (row, gap 48)
├── Sidebar 310px  (Filters + Featured NFT Banner)
└── Grid (column)
    ├── Toolbar (tabs + sort)
    ├── Row 1: 3 cards × 250px   (space-between)
    ├── Row 2: 3 cards
    ├── Row 3: 3 cards
    └── Pagination (4 botões de 35px)
```

Total: 1200 − 310 − 48 = **842px de área de grid**, 3 cards de ~250px + 2 gaps de ~46px.

### Mobile (`14:5226`)

```
Grid (column)
├── Column L  (padding-top: 32px, gap: 24px)
│   ├── P-1  (card 200px)
│   └── P-3  (card 200px + badge RARO)
└── Column R  (padding-top: 32px, gap: 24px)
    ├── P-2  (card 200px)
    └── P-4  (card 200px)
```

⚠️ **O grid mobile é um *masonry* de 2 colunas**, com `padding-top: 32px` na coluna
direita para criar o **stagger** (efeito escalonado).
⚠️ A coluna direita tem `padding-top: 32px` e a esquerda não — o resultado é um grid
**desalinhado no topo**, com cards em zigzag.

### Cálculo para 390px

| Métrica | 414px (Figma) | 390px (README) | Diferença |
| --- | --- | --- | --- |
| Padding horizontal | 24px | 24px ( presumido) | — |
| Conteúdo | 366px | 342px | **−24px** |
| Gap entre colunas | implícito (space-between) | — | — |
| Largura por coluna | (366 − gap) / 2 ≈ **175px** | (342 − gap) / 2 ≈ **163px** | **−12px** |
| Card com padding 4px + arte 168px | 168px de arte | **163 − 8 = 155px de arte** | ⚠️ |

⚠️ **A arte do card mobile é `168px` fixa com `layout_c705aacf`.** Em 390px o card fica
com ~155px úteis → a arte **estoura** ou precisa de `width: 100%`.
→ **O `168px` precisa ser `fluid` (100% do card), não fixo.**

---

## 4. As 3 telas desktop **sem** equivalente mobile

O README diz: *"Perfil, carteiras e confirmação também devem funcionar em mobile, mesmo
sem um frame específico."*

| Tela | ID | Equivalente mobile no Figma | Estratégia |
| --- | --- | --- | --- |
| **Perfil** | `9:1238` | ❌ **não existe** | Sidebar de conta → Tab Bar ou header de conta |
| **Carteiras** | `9:1670` | ❌ **não existe** | Formulário de 5 linhas × 2 colunas → 1 coluna |
| **Confirmação** | `11:4385` | ❌ **não existe** | Modal 578px → tela cheia ou bottom sheet |
| Pagamento (desktop) | `11:2862` | ✅ `16:748` (parcial) | Desktop tem formulário de pagamento completo; mobile tem só seleção de wallet |

### Perfil → mobile

Problema: a sidebar (`Account Sidebar`) tem **6 itens de menu** + bloco de usuário + "Sair".
No mobile, a Tab Bar tem 5 destinos. Não há destino para "Perfil", "Carteiras",
"Favoritos", "Atividade", "Downloads" ou "Excluir conta".

⚠️ **6 itens de menu de conta sem destino na Tab Bar de 5 itens.**

Proposta mínima coerente com o design:
- Tab Bar `User` (x=354) → abre a conta
- Dentro, os 6 itens viram uma lista vertical
- `Layout`: 1 coluna, `gap: 16px`, campos de 50px de altura (mesmo do mobile login)

### Carteiras → mobile

| Campo | Desktop | Mobile proposto |
| --- | --- | --- |
| Main Wallet Name | linha 1 col 1 | campo 50px |
| Wallet Alias | linha 1 col 2 | campo 50px |
| Network Select | linha 2 col 1 | select 50px |
| Wallet Label | linha 2 col 2 | campo 50px |
| Wallet Address | linha 3 col 1 | campo 50px |
| Secondary Address | linha 3 col 2 | campo 50px |
| Wallet Select | linha 4 col 1 | select 50px |
| Wallet Tag | linha 4 col 2 | campo 50px |
| Extra Field | linha 5 col 1 | campo 50px |
| ENS Field | linha 5 col 2 | select 50px |

⚠️ **10 campos em 1 coluna = scroll longo.** Não há versão mobile; a decisão é do
desenvolvedor.

### Confirmação → mobile

Modal desktop: 578 × ~700px, centrado em (431, 166), sobre scrim.
Em 414px: cabe, mas o `Transaction Details` tem **altura fixa 588px** + header 156px +
meta 4 colunas = **mais que a viewport inteira**.

Proposta: bottom sheet full-height com as 4 colunas de meta virando 2×2 e a tabela de
itens em scroll.

---

## 5. Inferência para tablet (768px)

⚠️ **Isto NÃO vem do Figma.** É proposta, não extração.

### Duas estratégias possíveis

**A) Tablet = versão desktop com sidebar recolhida** (recomendado)
- Mantém 3 colunas de produto (mais uso de tela)
- Sidebar de filtro vira **drawer** (botão de filtro no topo)
- Header horizontal mantido
- Conteúdo: `768 − 48×2` = 672px, 3 cards de ~210px

**B) Tablet = versão mobile com grid de 3 colunas**
- Grid 3 × 210px
- Tab Bar mantida
- Header vira Tab Bar

### Pontos de quebra que o Figma **não** define

| Breakpoint | Comportamento | Base |
| --- | --- | --- |
| `< 640px` | 2 colunas, Tab Bar, sem filtros | Figma 414 |
| `640–1023px` | 3 colunas, Tab Bar, filtros em drawer | **inventado** |
| `≥ 1024px` | 3 colunas + sidebar, header horizontal, sem Tab Bar | Figma 1440 |

⚠️ **O ponto de corte da Tab Bar é a decisão mais crítica.** O Figma mostra Tab Bar em
414 e header em 1440 — mas **não diz onde trocar**.

### Onde cada elemento some/aparece por faixa

| Elemento | `< 640` | `640–1023` | `≥ 1024` |
| --- | --- | --- | --- |
| Header horizontal | ❌ | ❌ | ✅ |
| Tab Bar | ✅ | ✅ | ❌ |
| Sidebar de filtros | ❌ | ❌ (drawer) | ✅ |
| Botão de filtro | ✅ | ✅ | ❌ |
| Grid de produtos | 2 col | 3 col | 3 col + sidebar |
| Promo cards | ❌ | ✅ | ✅ |
| Blog | ❌ | ✅ | ✅ |
| Paginação | ❌ | ✅ | ✅ |
| Toolbar de ordenação | ❌ | ✅ | ✅ |
| Buy Bar fixa | ✅ | ❌ (inline) | ❌ |

⚠️ **Promo cards e Blog somem no mobile.** Não há histórico de protótipo que diga se
foi decisão ou descuido.

---

## 6. Unidades que precisam ser `fluid`

Medidas que **quebram** se copiadas literalmente do Figma:

| Medida | Onde | Em 390px | Correção necessária |
| --- | --- | --- | --- |
| `168px` | arte do card mobile | estoura | `width: 100%` |
| `190px` | largura do título do hero mobile | cabe | `max-width` |
| `600px` | coluna de texto do hero desktop | **estoura** | `fluid` |
| `557px` | parágrafo do hero desktop | **estoura** | `fluid` |
| `450px` | arte do hero desktop | **estoura** | `fluid` / `order` |
| `1200px` | conteúdo desktop | **estoura** | `max-width` |
| `573px` | coluna de detalhes do NFT | **estoura** | `fluid` |
| `308px` | Token Info | cabe | `fluid` |
| `310px` | sidebar de filtros | **estoura** | drawer |
| `332px` | resumo do carrinho | cabe | `fluid` |
| `578px` | modal de confirmação | cabe | `fluid` |
| `500px` | modais de login/cadastro | cabe | `fluid` |
| `196px` | botão "Comprar NFT" | cabe | `fluid` |
| `60px` | botão carrinho do detalhe | cabe | fixo ok |
| `190px` | arte dos relacionados | cabe | `fluid` |
| `220px` | card dos relacionados | cabe | `fluid` |

⚠️ **O hero desktop é o caso mais grave**: `Display/43 Bold` com largura fixa 600px
e arte 450px lado a lado em 1200px. Em qualquer largura abaixo de ~1200px o texto
quebra em 2–3 palavras por linha.

---

## 7. Altura fixa — risco de overflow

| Tela | Altura fixa | Valor | Problema |
| --- | --- | --- | --- |
| Home desktop | `450px` (hero) | 450 | ok em 1440 |
| Detalhe mobile | `506px` (hero) + `504px` (sheet) + `gap: -114px` | **896 total** | ⚠️ a Buy Bar (164px) cobre o `Token Info` |
| Detalhe mobile | `588px` (`Transaction Details` do modal desktop) | 588 | ⚠️ estoura em mobile |
| Pagamento mobile | sem altura fixa | — | ok |
| Buy Bar | `164px` fixa em (0, 732) | 732+164 = 896 | ⚠️ consome 18% da viewport |

### Buy Bar × viewport

| Altura de viewport | Buy Bar (164px) | % da tela |
| --- | --- | --- |
| 896 (Figma) | 164px | **18,3%** |
| 844 (iPhone 14) | 164px | 19,4% |
| 780 (iPhone SE) | 164px | **21,0%** |
| 667 (iPhone SE 1ª gen) | 164px | **24,6%** |

⚠️ **Em 667px a Buy Bar consome 1/4 da tela.** Precisa de `env(safe-area-inset-bottom)`
e talvez altura variável.

### Tela mínima

O Figma fixa `896px` de altura mobile. **Não há frame mobile com altura menor.**
→ O conteúdo abaixo da Buy Bar **não é acessível** em telas de 667–780px sem scroll
com altura reservada.

---

## 8. Regras de scroll

O Figma **não tem informação de scroll** (não é um protótipo com overflow marcado).

Inferências necessárias:

| Tela | Comportamento inferido |
| --- | --- |
| Home mobile | scroll vertical; Tab Bar fixa embaixo |
| Home desktop | scroll vertical; header **não** é fixo no Figma (sem indication de `position: sticky`) |
| Detalhe mobile | scroll vertical; Buy Bar fixa embaixo; Tab Bar **ausente** nesta tela |
| Detalhe desktop | scroll vertical |
| Carrinho mobile | scroll vertical; `Payment Summary` ancorado ao fim do scroll (não fixo) |
| Modais desktop | scroll **do overlay** (o `Page Content (behind overlay)` sugere scroll de fundo) |
| Sidebar de conta | fixa (desktop) |

⚠️ **Header desktop não tem indicação de sticky.** O `Header With Divider` é o primeiro
nó do frame, sem `position` declarado → provavelmente **não é fixo**.
⚠️ **Detalhe mobile não tem Tab Bar** — as 2 telas mais críticas perdem a navegação
principal. Ver [flows.md](flows.md).

---

## 9. Checklist de validação responsiva (Fase 1)

Derivado do [README.md](../README.md) § 8 e § 9.

- [ ] 390px — todas as 15 telas do Figma renderizam sem overflow horizontal
- [ ] 390px — grid de 2 colunas com arte fluida (não 168px fixo)
- [ ] 390px — Buy Bar não cobre conteúdo; `safe-area-inset-bottom` aplicado
- [ ] 390px — Perfil, Carteiras e Confirmação funcionam (sem frame no Figma)
- [ ] 768px — sidebar de filtro vira drawer; grid 3 colunas
- [ ] 768px — Tab Bar **ou** header, nunca os dois
- [ ] 1440px — reproduz os 9 frames desktop exatamente
- [ ] 1440px — conteúdo centralizado em 1200px
- [ ] Zoom 200% sem perda de conteúdo
- [ ] `prefers-reduced-motion` respeitado
- [ ] Skeleton com shimmer em catálogo, detalhe e resumo do carrinho
- [ ] Regressão visual: início, detalhe, carrinho e pagamento (README § 10)

⚠️ **Regressão visual em 3 viewports (390/768/1440) = 4 telas × 3 = 12 baselines.**