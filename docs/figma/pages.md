# Telas

15 telas em **1** canvas (`Marketplace de NFTs GreenMint`, `0:1`).

| # | ID | Tela | Breakpoint | Tamanho | Padding | Gap | Nós |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `2:2` | Desktop / Início | desktop | 1440 × auto | `24px 120px` | 96px | 333 |
| 2 | `10:244` | Desktop / Detalhes do NFT | desktop | 1440 × auto | `24px 120px` | 96px | 240 |
| 3 | `11:1278` | Desktop / Carrinho de NFTs | desktop | 1440 × auto | `24px 120px` | 96px | 243 |
| 4 | `11:2862` | Desktop / Pagamento | desktop | 1440 × auto | `24px 120px` | 96px | 243 |
| 5 | `11:4385` | Desktop / Confirmação de Pedido | desktop | 1440 × auto | `24px 120px` | 96px | 325 |
| 6 | `9:115` | Desktop / Login | desktop | 1440 × auto | `24px 120px 0px` | 96px | 191 |
| 7 | `9:1022` | Desktop / Cadastro | desktop | 1440 × auto | `24px 120px 0px` | 96px | 191 |
| 8 | `9:1238` | Desktop / Perfil do Colecionador | desktop | 1440 × 1080 | `24px 120px` | 96px | 120 |
| 9 | `9:1670` | Desktop / Carteiras | desktop | 1440 × 1080 | `24px 120px` | 96px | 136 |
| 10 | `14:5226` | Mobile / Início | mobile | 414 × 896 | `40px 24px 0px` | 16px | 84 |
| 11 | `15:5536` | Mobile / Detalhes do NFT | mobile | 414 × 896 | — | **-114px** | 59 |
| 12 | `16:360` | Mobile / Carrinho de NFTs | mobile | 414 × 896 | `32px 0px 0px` | 4px | 80 |
| 13 | `16:748` | Mobile / Pagamento | mobile | 414 × 896 | `32px 28px` | — | 47 |
| 14 | `16:1022` | Mobile / Login | mobile | 414 × 896 | `80px 28px 24px` | 40px | 32 |
| 15 | `16:1228` | Mobile / Cadastro | mobile | 414 × 896 | `80px 28px 24px` | 40px | 37 |

Convenções:

- **Auto** = altura `hug`, determinada pelo conteúdo.
- Todos os frames desktop usam `fills: Color/Ink` (`#140D0A`).
- Todos os frames mobile usam `borderRadius: 40px` e **não** declaram fill — herdam do fundo.
- Conteúdo desktop = `1440 - 240` = **1200px** (`Header With Divider` tem exatamente 1200px).
- ⚠️ marca texto que **não** foi extraível (alias `template=EL-*`). Ver
  [README.md](README.md#limitação-conhecida-e-relevante).

---

## 1. Desktop / Início — `2:2`

Frame `1440` de largura, altura automática. Ordem vertical das seções, com `gap: 96px`.

### Top

- `Header With Divider` `70522:3240` (1200px) → `Header Row` com variante `Active=Home`.
  A barra de navegação tem 4 itens; o ativo traz `LINE` "Active Underline".
  Ações à direita: `Search Icon`, grupo `Cart` (ícone + `ELLIPSE` "Badge" + contador),
  grupo `Login` (botão com `Iconly/Curved/Logout`).
  ⚠️ Rótulos da nav, do badge e do botão de login não extraídos.
- `LINE` divisória no rodapé do header.

### Hero — `70347:239`

Altura fixa `450px`, `padding-left: 40px`, conteúdo centralizado.

| Elemento | ID | Medidas / estilo |
| --- | --- | --- |
| Ornamento de fundo | `2:104` | IMAGE-SVG 1200 × 450, absoluto |
| Container | `70342:2674` | row, 1160px, `space-between`, centralizado |
| Coluna de texto | `70342:2672` | column 600px, `align-items: flex-end`, `gap: 44px` |
| "Bem-vindo à Kurio" | `3:113` | `Body/14 Medium · lh 16` |
| "SEJA DONO DO FUTURO\nDA ARTE DIGITAL" | `3:107` | `Display/43 Bold` |
| Parágrafo | `3:114` | 557px, `Body/14 Regular · lh 24` |
| CTA `EXPLORAR` | `3:127` | 140 × 40, `fill: Color/Primary`, `radius: 6px`, `padding: 10px 36px 10px 28px` |
| Selo decorativo | `3:131` | IMAGE-SVG 40 × 8 |
| Arte principal | `70342:2673` | 450 × 450, `imageRef 84592047…`, `radius: 24px` |

O texto do hero é **alinhado à direita** (`alignItems: flex-end`) enquanto a arte fica à
direita do container. Em telas menores isso estoura — ver [responsive.md](responsive.md).

### Products — `70342:2831`

Row, `gap: 48px`, preenchendo a largura. Três colunas.

**Sidebar — `70410:3725`**

- `Filters` `70485:382` (310px, `fill: Color/Surface Card`, `padding: 20px`), 3 grupos:
  - `Collections Filter` — 8 opções com `ELLIPSE` + rótulo + contagem ⚠️
  - `Price Filter` — `Slider` (2 `ELLIPSE` + 2 `LINE`), rótulo de faixa ⚠️, `Apply Button` ⚠️
  - `Network Filter` — 3 opções (rótulo + contagem) ⚠️
- `Featured NFT Banner` `70410:3791` (310 × 470, `padding: 24px 0 4px`, `gap: 10px`):
  - Badges `NFT EM DESTAQUE` e `OFERTA LIMITADA` (`layout_56d3c81c`)
  - Arte `NFT Artwork 18` `70410:3798`, altura 368px, `imageRef 2986a7cb…`, `radius: 22px`
  - 3 decorações absolutas: `70410:3799` (22×22, borda), `70410:3800` (45×45, gradiente
    `fill_928da933`), `70410:3801` (15×15, gradiente)
  - ⚠️ Nome, preço e CTA do NFT em destaque não extraídos.

**Product Grid — `70342:2830`**

Column `align-items: flex-end`, `gap: 88px`.

**Toolbar — `70351:239`** (row, `space-between`, centralizado)

| Elemento | ID | Detalhe |
| --- | --- | --- |
| Tabs | `70351:240` | row `gap: 20px`: `Todos os NFTs` `4:138`, `Novos lançamentos` `4:144`, `Em alta` `4:145` — todos `Body/15 Medium` |
| Sort | `70351:241` | 300 × 18 |
| "Ordenar por:" | `4:147` | x=0, 109 × 20, `Body/15 Regular · lh 16` |
| "Listados recentemente" | `4:148` | x=110, 190 × 20, `Body/15 Regular · lh 16` |
| Chevron | `4:152` | x=278, 16 × 16, `componentId 4:153` (`Iconly/Two-tone/Arrow - Down 2`) |
| Underline de aba ativa | `4:146` | `LINE` absoluta em y=23, 101 × 0, `strokeWeight: 2px` |

O Figma mostra **apenas um estado de ordenação** ("Listados recentemente"). As demais opções
do dropdown não estão no design — a lista é **inferência**.

**Grid Rows — `70342:2828`** — column `stretch`, `gap: 72px`, **3 linhas × 3 cards = 9 itens por página**.

Linha 1 — `70342:2802` (row `space-between`):

| Card | ID | Arte | Nome | Preço |
| --- | --- | --- | --- | --- |
| A | `70342:2678` | `4:137` 250×250 `imageRef 84592047…` r15 | Emerald Ape #042 | **1.19 ETH** |
| B | `70342:2679` | `4:162` 250×250 `imageRef 2986a7cb…` r15 | Sage Nomad #009 | **1.69 ETH** |
| C | `70342:2681` | `4:164` 250×250 `imageRef 9df2ff42…` r15 | Neon Vessel #552 | **1.99 ETH** + ~~2.29 ETH~~ |

Linha 2 — `70342:2826`:

| Card | ID | Arte | Nome | Preço |
| --- | --- | --- | --- | --- |
| D | `70342:2805` | `4:280` 224×286 `imageRef 2986a7cb…` r13 | Cosmic Bloom #118 | **1.29 ETH** |
| E | `70342:2808` | `4:282` `imageRef 2986a7cb…` r15 | Violet Nomad #314 | **1.39 ETH** |
| F | `70342:2811` | `4:284` `imageRef 9df2ff42…` r15 | Ivory Baron #088 | **1.79 ETH** |

Linha 3 — `70342:2827`:

| Card | ID | Arte | Nome | Preço |
| --- | --- | --- | --- | --- |
| G | `70342:2814` | `4:286` | Golden Beat #207 | **0.99 ETH** |
| H | `70342:2816` | `4:289` | Golden Signal #160 | **0.39 ETH** |
| I | `70342:2819` | `4:291` | Golden Signal #160 | **0.39 ETH** |

⚠️ **Inconsistência do design:** os cards H e I mostram **o mesmo nome e o mesmo preço**
(`Golden Signal #160` / `0.39 ETH`), com nodes de arte diferentes (`4:289`, `4:291`). Card G
é `Golden Beat #207` / `0.99 ETH`. Provável erro de duplicação no Figma.

⚠️ Os cards A e B usam template `EL-58c59944` (column 258px, `gap: 12px`, com um
`RECTANGLE` de fundo `fill: Color/Surface Card` de altura 300px e a arte **absoluta**
sobreposta). Cards C–I usam `EL-ffd4256b` (mesma column, sem fundo) ou frames de mídia
(`EL-b4be263e` / `EL-a0112c2b`, row 300px, `padding: 24px 4px 28px`, `gap: 10px`,
`fill: Color/Surface Card`). **Existem pelo menos 3 anatomias de card diferentes no mesmo grid.**

Card C tem **preço promocional**: `1.99 ETH` em `Body Large/18 Bold` ao lado de
`2.29 ETH` em `Body Large/18 Regular` (`layout_5efdc068`, `gap: 12px`).
O Figma **não** desenha o strikethrough — apenas o segundo preço com peso menor.

Nomes sempre `Body Large/16 Regular · lh 16`; preços sempre `Body Large/18 Bold · lh 16`.
Meta column: `gap: 6px`, largura 154 / 164 / 173px conforme o card.

**Pagination — `70342:2825`** (row, `align-items: center`, `gap: 8px`, `hug`):

| Item | ID | Estado |
| --- | --- | --- |
| `1` | `70342:2820` | **ativo** — `fill: Color/Primary`, 35×35, `radius: 4px`, `Body Large/18 Bold · lh 16` |
| `2` `3` `4` | `2821`–`2823` | inativos — template `EL-47e13f90`: 35×35, `stroke: Color/Border` 1px, `radius: 4px`, `padding: 8px 12px 10px` |
| próxima | `70342:2824` | 35×35, borda 1px, `radius: 4px`, `Arrow - Right 2` (`componentId 4:393`) |

⚠️ Não há estado "anterior" desabilitado, nem indicador de página atual além do `1`.

### Promos — `70353:241`

Dois cards `Promo Card` com o mesmo template (`EL-1655bc96`), Children alternados:

**Promo Card — Genesis Drops — `70353:239`**

- Título `4:406`: "Lançamentos gênesis\nde edição limitada" — `Body Large/18 Bold · lh 24`
- Corpo `4:425`: "Colecione edições escassas diretamente dos criadores antes da revelação pública." — `Body/14 Regular · lh 24`
- Arte `NFT Artwork 17` `4:428`: 292 × 250, `imageRef 84592047…`, `radius: 18px`
- CTA `#5:112`: 140 × 40, rótulo ⚠️ + `Arrow - Right`
- `Mask Group` `5:134` decorativo

**Promo Card — Curated Art — `70353:240`**

- Título `4:420`: "Arte digital selecionada\ne muito mais" — `Body Large/18 Bold · lh 24`
- Corpo `4:426`: "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura."
- Arte `NFT Artwork 16` `4:423`: 287 × 250, `imageRef 9df2ff42…`, `radius: 17px`
- CTA `#5:113`: 140 × 40, rótulo ⚠️ + `Arrow - Right`
- `Mask Group` `5:130` decorativo

⚠️ O corpo do Genesis está com `textAlignHorizontal: RIGHT` (via `layout_56d3c81c` +
`Body/14 Regular · lh 24 (70321:346)`), enquanto o do Curated Art está alinhado à esquerda.
Provável inconsistência.

### Blog — `70343:253`

- `Blog Section Header` `70343:254`: "Diário da Cunhagem" (com `fill_757d6004` = `#F5F1EB`)
  + "Histórias, guias e insights para colecionadores sobre o universo da propriedade digital."
- `Cards` `70343:257` — 4 cards de ~268px:

| Card | ID | Data · leitura | Título | Resumo | Arte |
| --- | --- | --- | --- | --- | --- |
| 1 | `70343:258` | 12 de setembro \| 6 min | Como funciona a propriedade de NFTs | Aprenda a colecionar, negociar e verificar ativos digitais. | `imageRef 9df2ff42…` |
| 2 | `70343:267` | 13 de setembro \| 2 min | 10 artistas digitais para acompanhar | Conheça criadores que moldam a cultura digital. | `imageRef 84592047…` |
| 3 | `70343:276` | 15 de setembro \| 3 min | Raridade, atributos e procedência | Entenda raridade, procedência, direitos autorais e utilidade. | `imageRef 2986a7cb…` |
| 4 | `70343:285` | 15 de setembro \| 2 min | Como proteger sua carteira | Proteja sua carteira, seus ativos e sua identidade. | `imageRef 87580f2d…` |

Card 4 é o único com `fills: Color/Surface Card` explícito e `radius: 8px`; os demais usam
template `EL-e19c9b12`. Imagem com `layout_fde60827` (fill de largura, altura 195px).
CTA de cada card = rótulo + rótulo ⚠️ (dois `TEXT` em `EL-757ec353` / `EL-ada10762`).

### Footer — `70492:696`

Instância de `Footer` `70491:1286`. Estrutura: 3 colunas de links + 1 de newsletter, cada uma
com título (`EL-bc02c57d`), 2-3 links e um `RECTANGLE` divisor; depois barra inferior com
`Logo`, 4 links e 5 redes sociais (`Facebook`, `Instagram`, `Twitter`, `Linkedin`, `Union`),
mais um bloco deAssinatura. ⚠️ Todos os textos não extraídos.

### Estados visíveis nesta tela

- Tab de filtro ativa (aba "Todos os NFTs" com `LINE`).
- Paginação com item 1 ativo.
- Card com preço promocional (`Neon Vessel #552`).
- Item de carrinho com badge no header (contador visível).
- Item de blog com surface card (`Card 4`).
- **Nenhum** estado de carregamento (skeleton), erro, lista vazia ou hover.

---

## 2. Desktop / Detalhes do NFT — `10:244`

Header `Header Row` `70488:626` (variante `Active=Market` — a nav ativa é outra).

### Breadcrumb

`10:290`: "Início / Mercado" — `Body/15 Bold · lh 16`.

### Product — `70342:2764`

Row, `gap: 32px`, preenchendo a largura.

**Product Images — `70363:239`** (573 × 448, row, `gap: 28px`, centralizado)

- 4 slots de thumb `100 × 100`, `fill: Color/Surface Card`, `radius: 6px`, empilhados em
  y = 0 / 116 / 232 / 348 (`#11:1074`–`#11:1077`)
- `Thumbnails` `70342:2682` (column 100px, `gap: 16px`):
  - `NFT Collection Artwork 02` `#11:1188` — **selecionada**, `fill_0380e2ac`, `strokeWeight: 1px`, `radius: 8px`
  - `NFT Collection Artwork 04` `#11:1181`, `05` `#11:1189`, `03` `#11:1190` — template `EL-447bc567` (100 × 100, `layout_019a9238`) ⚠️ sem `imageRef` próprio
- `Main Image` `70342:2683` (444 × 444, `padding: 16px`, `fill: Color/Surface Card`, `radius: 6px`)
  - `NFT Collection Artwork 01` `#11:1161` — 404 × 404, `imageRef 84592047…`, `radius: 24px`
- Botão flutuante `#70410:3937` (absoluo em x=530, y=15): `ELLIPSE` 30×30 `fill: Color/Surface Raised`
  borda 1px + `Vector` 20×20 → **favoritar**.

⚠️ Apenas **1** das 4 thumbnails tem `imageRef`; as outras 3 são placeholders com fill de surface.
⚠️ O botão de favoritar está em `#70410:3937`; o botão de voltar/paginação não existe nesta tela.

**Details — `70342:2763`**

- Título `#11:1132`: "Emerald Ape #042" — **`Heading/28 Bold`**
- Preço `#11:1141`: "1.19 ETH" — **`Title/22 Bold`**
- Avaliação `#11:1210` (template `EL-e487a1a2`): **5×** `Iconly/Bold/Star` + "19 avaliações de colecionadores" (`Body/15 Regular · lh 16`)
- `LINE` `#11:1211` — 573 × 0, `strokeWeight: 0.3px`
- "Sobre este NFT:" `#11:1214` — `Body/15 Bold · lh 16`
- Descrição `#11:1215` — altura 66px, `Body/14 Regular · lh 24`
- "Edição:" `#11:1216` + 4 pills de edição (`70342:2694`–`2693`, alturas 28px, `gap: 6px`):
  - `1/1` — `ELLIPSE` 36×28 absoluta com borda, texto `Body/14 Regular · lh 16`
  - 3 pills com `ELLIPSE` + rótulo ⚠️ (`42×28`, `46×28`, `66×28`)

**Ações — `#70342:2762`** (row, `space-between`)

| Elemento | ID | Detalhe |
| --- | --- | --- |
| Stepper | `#11:1238` | grupo 103 × 49.5: 2 `Add Button` + "1" (`Title/20 Regular · lh 10`) |
| `COMPRAR` | `70342:2756` | 130 × 40, `fill: Color/Primary`, `radius: 6px`, `Body/14 Bold · lh 20` |
| `Favoritar` | `70342:2757` | 130 × 40, borda 1px, `radius: 6px`, `heart 1` + `Body/14 Medium · lh 20` |

**Token Info — `#70342:2761`** (column 308px, `gap: 12px`)

- `#10:291`: "ID do token: #0042"
- `#11:1212`: "Coleção: Kurio Apes"
- `#11:1226`: "Atributos: Óculos, Esmeralda, Raro"

**Compartilhar — `#70342:2760`**: "Compartilhar este NFT:" (`Body/15 Bold · lh 16`) +
`Linkedin` 15×14.38 + `Message` `11:1248` + `Twitter` 15.97×12.19.

⚠️ **Só 3 ícones de compartilhamento** (LinkedIn, mensagem, Twitter). **Faltam** WhatsApp,
Telegram, e-mail e cópia do link. Ver [requirements-mapping.md](requirements-mapping.md).

### Description — `70342:2780`

Column aninhada (7 níveis) com:

- "Detalhes do NFT" `10:289` — `Body Large/17 Bold` + `LINE` `EL-d9f11a23`
- "Avaliações de colecionadores (19)" `11:1253` — `Body Large/17 Regular · lh 16`
- `LINE` `EL-1540ab37`
- Texto longo `#11:1251` — `Body/14 Regular · lh 24`, 2 parágrafos mencionando **Nova Sato** e 5% de direitos autorais
- "Rede:" `11:1258` (`Body/14 Bold · lh 24`) → "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS." `11:1259`
- "Contrato:" `11:1260` → "0x7A42...19E8 • Contrato inteligente ERC-721 verificado." `11:1263`
- "Direitos autorais:" `11:1262` → "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis." `11:1261`

⚠️ A seção é rotulada "Detalhes do NFT" mas **não há link para as avaliações** — é texto estático.
O título "Avaliações de colecionadores (19)" aparece como subtítulo, sem componente de review.

### Related Products — `70364:239`

- `Section Heading` `70342:2782` (1200px): "Mais desta coleção" `Body Large/17 Bold` + `LINE`
- `#70342:2800` (column 1200px, `gap: 32px`): row `space-between` com **5 cards** de ~220px:

| Card | ID | Arte | Nome | Preço |
| --- | --- | --- | --- | --- |
| 1 | `70342:2798` | `11:1177` 190×243 `imageRef 2986a7cb…` r11 | Cosmic Bloom #118 | 1.29 ETH |
| 2 | `70342:2797` | `11:1178` 212×212 `imageRef 2986a7cb…` r13 | Violet Nomad #314 | 1.39 ETH |
| 3 | `70342:2796` | `11:1179` 212×212 `imageRef 9df2ff42…` r13 | Ivory Baron #088 | 1.79 ETH |
| 4 | `70342:2795` | `11:1180` | Golden Beat #207 | 0.99 ETH |
| 5 | `70342:2794` | `11:1182` | Golden Signal #160 | 0.39 ETH |

Nomes `Body/15 Regular · lh 16`; preços `Body Large/16 Bold · lh 16`.
`#11:1179` e `#11:1180` usam `imageRef`s de cards do grid (`9df2ff42…`, `87580f2d…`) ⚠️.
- `Carousel Dots` `70364:240`: 3 `ELLIPSE`, o do meio com template diferente (`EL-ad3672e9`)
  → indício de estado ativo, mas **sem rótulo**.

### Estados visíveis

- Thumbnail 2 selecionada (borda).
- Favoritar em estado não-ativo.
- 5 estrelas de avaliação.
- Carousel com ponto 2 ativo.
- **Nenhum** estado de carregamento, NFT vendido, NFT favoritado ou erro.

---

## 3. Desktop / Carrinho de NFTs — `11:1278`

Header `Header Row` `70488:651`.

### Breadcrumb

`11:1309`: "Início / Mercado / Carrinho" — `Body/15 Bold · lh 16`.

### Cart — `70369:239`

Column 1200px, `gap: 12px`.

**Cart Table — `70369:241`**

`Table Header` `70369:242` (row, `padding-right: 24px`, `space-between`) — larguras fixas:

| Coluna | ID | Largura | Rótulo |
| --- | --- | --- | --- |
| Item | `#70402:3326` | 250 | ⚠️ (`EL-11f6cb7e`) |
| Preço | `#70402:3327` | 77 | "Preço" (`Body Large/16 Medium · lh 16`) |
| Quantidade | `#70402:3328` | 75 | ⚠️ (`EL-67d886cb`) |
| Total | `#70402:3329` | 87 | "Total" (`Body Large/16 Medium · lh 16`) |
| (ações) | `#70402:3331` | 24 | vazio |

`LINE` `#11:1919` abaixo do header.

**Cart Items — `70369:243`** — 3 itens:

| Item | ID | Arte | Nome | Token | Unit | Qtd | **Total** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `70369:244` | `11:1900` 70×70 `imageRef 84592047…` r6 | ⚠️ | ⚠️ | 1.19 ETH | **2** | **2.38 ETH** |
| 2 | `70369:245` | `11:2092` 70×fill `imageRef 2986a7cb…` r6 | ⚠️ | ID do token: **#0009** | 1.39 ETH | **6** | **8.34 ETH** |
| 3 | `70369:246` | `11:2094` 70×fill `imageRef 9df2ff42…` r6 | ⚠️ | ID do token: **#0552** | 1.79 ETH | **9** | **16.11 ETH** |

Item 3 tem `fills: Color/Surface Card` e 782 × 70 — é o item **em foco/selecionado**.

Cada item: nome (`Body/15 Bold · lh 16` no item 1, `Body/15 Regular · lh 16` ⚠️ nos demais ⚠️
**inconsistência de estilo entre itens da mesma tabela**), stepper com 2 `Add Button` + contador
(`Body Large/17 Regular · lh 10`), total (`Body Large/16 Bold · lh 16`) e
`Iconly/Curved/Delete` (`componentId 11:2030`).

⚠️ Nomes dos NFTs do carrinho **não** foram extraídos (aliases `EL-01d81d0e`, `EL-67d6bc3a`,
`EL-efdd8382`). Pela paleta de `imageRef` e token id, provavelmente Emerald Ape #042 (#0042),
Sage/Violet Nomad e Neon Vessel — **inferência, não confirmar sem o Figma aberto**.

⚠️ Aritmética confere por item: `1.19×2 = 2.38`, `1.39×6 = 8.34`, `1.79×9 = 16.11`.
A soma dos totais exibidos é **26.83 ETH**, mas a tela de confirmação exibe **26.846 ETH**
(ver tela 5) — divergência de arredondamento no design.

**Wallet Summary — `70370:239`** (column 332px, `gap: 24px`)

- `Heading` `70370:240`: "Resumo da carteira" (`Body Large/18 Bold · lh 16`) + `LINE`
- `Promo Code` `70370:241`:
  - Rótulo "Código promocional" (`Body/14 Bold · lh 16`)
  - `Promo Input` `70370:242`: 332 × 40, borda 1px, `radius: 3px`, `padding-left: 8px`,
    placeholder "Digite o código promocional..." (`Caption/12 Regular · lh 16`)
  - Botão "Aplicar" `#70402:3334`: 102 × 40, `radius: 0px 3px 3px 0px` (`Body/15 Bold · lh 16`)
- `Fees` `70370:243`: `Subtotal`, `Discount`, `Network Fee` — rótulos e valores ⚠️
  (`EL-bbd7df8b`/`EL-a21f1e2a`, `EL-b36b1d25`/`EL-71c2d2d6`, `EL-c58ebb9b`/`EL-04886d4d`)
  + uma nota extra ⚠️ (`EL-b2294f39`) sob a taxa de rede
- `Total` `70370:247` — rótulo e valor ⚠️ (`EL-45743393`/`EL-854453e2`)
- `Checkout CTA` `70370:248`:
  - `Button` `70370:249`: altura 40px, `radius: 3px`, `layout_5841ee2b`, "Conectar e finalizar" (`Body/15 Bold · lh 16`)
  - `Continuar explorando` `11:2842` (`Body/15 Regular · lh 16`)

⚠️ **"Conectar e finalizar"** — o checkout exige carteira conectada **antes** de pagar.
Fluxo em [flows.md](flows.md).

### Related Products — `70371:239`

- "Colecionadores também viram" `11:1963` (`Body Large/17 Bold`) + `LINE`
- **5 cards** (`Product Card 1`–`5`) com template `EL-312a8cc3`:

| Card | ID | Arte | Nome | Preço |
| --- | --- | --- | --- | --- |
| 1 | `70371:242` | `11:1976` 190×243 `imageRef 2986a7cb…` r15 | Cosmic Bloom #118 | 1.29 ETH |
| 2 | `70371:243` | `11:1979` 212×212 `imageRef 2986a7cb…` r17 | Violet Nomad #314 | 1.39 ETH |
| 3 | `70371:245` | `11:1982` 212×212 `imageRef 9df2ff42…` r17 | Ivory Baron #088 | 1.79 ETH |
| 4 | `70371:247` | `11:1985` | Golden Beat #207 | 0.99 ETH |
| 5 | `70371:248` | `11:1988` | Golden Signal #160 | 0.39 ETH |

- `Carousel Dots` `70371:249` com template `EL-eda14dc5`, 3 pontos.

### Estados visíveis

- Item 3 do carrinho com surface (selecionado).
- Stepper com quantidade > 1.
- **Nenhum** estado de carrinho vazio, item removido, cupom aplicado ou erro.

---

## 4. Desktop / Pagamento — `11:2862`

**Toda a tela é uma instância de `Checkout Page` `70522:3321`** (componentId `70504:3190`)
+ `Footer` `70493:2063`.

⚠️ Praticamente toda a tela é `template=EL-*`. A única informação legível é o nome do
primeiro filho: **`Page Content (behind overlay)`** — ou seja, existe um **overlay por cima**
de uma página de conteúdo. Ver tela 5 para o overlay desenhado por extenso.

### Estrutura inferida do overlay

O bloco visível é uma coluna com:

1. Um `TEXT` de título (`EL-a769c16b`)
2. Uma frame (`EL-4cc4151a`) que parece um **formulário**:
   - `EL-5ac9eff6` com `EL-5822ae43` (título de seção) e `EL-1bc16580`
   - Dentro dele, `EL-4848f3c9` com **duas colunas** (`EL-5ac9eff6` e `EL-ec900ebf`)
   - Cada coluna tem ~4 fileiras `EL-dfdf56f9`, e cada fileira:
     - `EL-e2494a44` = rótulo (`EL-758e5ab5`, `EL-5d86d6bd`, `EL-6a716b44`, `EL-557b43d9`, `EL-800e8dbe`, `EL-b688edf3`, `EL-06303175`, `EL-817e0f28`) + placeholder ⚠️ (`EL-1ef93be2`, `EL-878834f0`)
     - + `RECTANGLE` `EL-fce90af0` (o input)
     - **3 dos campos têm `Arrow-Down`**: `EL-724b7904` + `EL-d8d37b5f` (componente `Arrow-Down` `9:1589`) → são **`<select>`**
   - `EL-eda14dc5`: `ELLIPSE` `EL-95e01047` + `TEXT` `EL-53b87567` (**checkbox**), e
     `EL-325c17d4` (`TEXT` `EL-55fb0506` + `RECTANGLE` `EL-679efff7` — provavelmente link + botão)
3. `EL-68a123d7` (coluna):
   - `TEXT` `EL-04f24d76` (título)
   - `EL-1519dabc`/`EL-1540ab37`: linha "rótulo → valor" (`EL-11f6cb7e` → `EL-cd31e97c`) + `LINE`
   - **Resumo da compra com 3 itens** (`NFT Receipt Artwork 1`, `2`, `3`), cada um com
     nome + subtítulo ⚠️ e dois valores ⚠️
   - `EL-29764127`: disclaimer ⚠️ + `Subtotal` (`EL-bbd7df8b`→`EL-a21f1e2a`) +
     `Discount` (`EL-b36b1d25`→`EL-71c2d2d6`) + `Network Fee` (`EL-c58ebb9b`→`EL-04886d4d`)
     + nota ⚠️ + `LINE` + `Total` (`EL-45743393`→`EL-854453e2`)
   - `EL-286f649c`: abaixo do total, um seletor de **método de pagamento** com 3 opções
     (`EL-29748c50`, `EL-2ffeaae2`, `EL-8b1099bd`), cada uma com `ELLIPSE` + `TEXT`
     (`EL-97ec27a5`, `EL-f419ec4c`, `EL-f0d783cd`), e abaixo `EL-3e9fc162` ⚠️

⚠️ **Nada** desse overlay tem texto extraído. A página de pagamento precisa ser lida
diretamente no Figma antes de ser implementada.

### Estados visíveis

- Página de conteúdo com overlay por cima (a página por trás existe e está rolável).
- **Nenhum** estado visível de erro de transação, saldo insuficiente ou loading.

---

## 5. Desktop / Confirmação de Pedido — `11:4385`

Base: instância de `Checkout Page` `70522:3496` + `Footer` `70493:2519`,
**por cima**:

- `RECTANGLE` "BG" `#11:5105` — 1440 × 1657, absoluto em (0, 0) → **scrim** do overlay
- `Order Confirmation Modal` `#70376:239` — 578px de largura, absoluto em (431, 166),
  `fills: Color/Surface Card`

### Modal Header — `#70376:240`

Altura fixa `156px`, column centralizado, `gap: 16px`.

- `thank-you 1` `#11:5150` — IMAGE-SVG 80 × 80
- `#11:5149` — "Seus NFTs agora estão na sua carteira" (`Body Large/16 Bold · lh 16`)

### Transaction Meta — `#70376:241`

`padding: 4px 36px`, `gap: 12px`. 4 colunas de larguras fixas separadas por `LINE`
(`EL-49e1f2b7`):

| Coluna | ID | Largura | Rótulo | Valor |
| --- | --- | --- | --- | --- |
| 1 | `#11:5142` | 127 | **ID da transação** (`Body/14 Bold · lh 16`) | `0xA91F…E82C` |
| 2 | `#11:5139` | 109 | Data (`Body/14 Regular · lh 16`) | `29 Jul, 2026` |
| 3 | `#11:5140` | 91 | Total (`Body/14 Regular · lh 16`) | **`26.846 ETH`** |
| 4 | `#11:5141` | 73 | **Carteira** (`Body/14 Bold · lh 16`) | MetaMask |

⚠️ Valores em `Body/15 Regular · lh 16`.
⚠️ Rótulos 1 e 4 em **Bold**, 2 e 3 em **Regular** — inconsistência de peso na mesma linha.

### Transaction Details — `#70376:242`

`padding: 20px 44px 48px`, `gap: 12px`, altura fixa **588px**.

- Título `#11:5167` — "Detalhes da transação" (`Body/15 Bold · lh 16`)
- `Table Header` `#70376:243`: `EL-11f6cb7e` ⚠️ + `EL-67d886cb`/`EL-cd31e97c` ⚠️ + `LINE`
- **3 itens** — `NFT Receipt Artwork 4` (`11:5194`), `5` (`11:5208`), `6` (`11:5209`);
  nomes ⚠️, 2 valores por item com `gap: 48px` ⚠️ (larguras 194, 192, e `EL-a88312b8`)
- `Totals` `#70376:248`: `Network Fee` (`EL-c58ebb9b`→`EL-04886d4d`) e
  `Total` (`EL-45743393`→`EL-854453e2`) ⚠️
- `LINE` `#12:5220`

### Footer Note — `#70376:249`

- `#12:5217` — "Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede." (`Body/14 Regular · lh 22`)
- `Etherscan Button` `#70376:250` — `radius: 5px`, `padding: 16px`,
  "Ver no Etherscan" (`Body Large/16 Bold · lh 16`)

### Outros

- `RECTANGLE` `#11:5119` — spacer, altura 10px
- Fechar: `X` `#12:5223` — 18 × 17.35, absoluto em (546, 16.74), `componentId 9:947`

⚠️ **Não há** botão "Continuar comprando" / "Ver minha coleção" — só o X e o link do Etherscan.

### Estados visíveis

- Sucesso de compra com scrim e modal.
- **Nenhum** estado de falha, transação pendente ou carregando.

---

## 6. Desktop / Login — `9:115`

Frame 1440, `padding: 24px 120px 0px`.

Base: instância de `Marketplace Page` `70522:3671` (componentId `70504:3297`) contendo
`Header With Divider` + `Page Content (behind overlay)`.
⚠️ Esse "page content" é uma **versão diferente** da Home (`EL-7c2a5d08`) com grupos
`Main Banner`, `Short By` e `Products` (11 artworks `NFT Auth Artwork 1`–`11`) e uma
`Filters` — todo com `template=EL-*`. Serve só de fundo para o modal.

Por cima:
- `RECTANGLE` "BG" `#9:945` (template `EL-f4f8c67e`) → scrim
- `Sign In Modal` `#70381:239` — **500 × 600**, absoluto em (470, 160), `fills: Color/Surface Card`

### Modal Header — `#70381:240`

**Tabs** dentro do modal:

- "Entrar" `#9:949` — `Title/20 Medium` (ativa)
- "Criar conta" `#9:950` — `Title/20 Medium`, com padding `10px`
- Subtítulo `#9:955` — "Entre para gerenciar sua carteira, coleção e perfil de criador."
  (`Caption/13 Regular · lh 16`)

### Form — `#70381:241`

| Campo | ID | Detalhe |
| --- | --- | --- |
| Email Input | `70381:242` | template `EL-5323f1d1` ⚠️ |
| Password Input | `70381:243` | `layout_ff84fc38` (padding `12px 16px`, 40px), `stroke: fill_982f3e54` (**`#D28A4C` = Primary!**) 1px, `radius: 5px`; valor "**********" (`Body Large/16 Regular · lh 16`); `Iconly/Curved/Hide` `#9:963` |
| Forgot Link | `70381:244` | template `EL-6f779a3e`, rótulo ⚠️ |

⚠️ **O campo de senha tem borda `Color/Primary`** enquanto o de email usa o template padrão.
Ou é um estado de foco, ou é erro — **não está indicado** qual.

### CTA — `#70381:245`

- `Sign In Button` `70381:246` — template `EL-99483cc9` (⚠️ raio não legível), rótulo ⚠️

### Social — `#70381:247`

`padding-top: 24px`, `gap: 12px`.

- `Divider` `70381:248` — `LINE` + `TEXT` ⚠️ + `LINE`
- `#70402:3572` (`padding: 0px 80px`, `gap: 12px`) com 2 `Social Button`:
  - `70484:260` → variante `Provider=Google`
  - `70484:240` → variante `Provider=Facebook`

### Outros

- `RECTANGLE` `#9:1228` — 500 × 10 em y=590 (spacer)
- Fechar: `X` `9:947` — 18 × 18, absoluto em (470, 11)

⚠️ **Não há** link "Criar conta" fora da tab, nem checkbox "lembrar-me", nem indicador de força da senha.

---

## 7. Desktop / Cadastro — `9:1022`

Base: `Marketplace Page` `70522:3841` + `RECTANGLE` "BG" `#9:1145` (mesmo scrim).
Por cima: `Sign Up Modal` `#70383:239` — **500 × 656**, absoluto em (470, 158),
`fills: Color/Surface Card`, **`radius: 8px`**.

⚠️ Login não tem raio declarado, Cadastro tem `8px` — **inconsistência entre modais irmãos**.

### Modal Header — `#70383:240`

- Tabs: "Entrar" `#9:1149` + "Criar conta" `#9:1150` (ambas `Title/20 Medium`; a 2ª com `padding: 10px`)
- Subtítulo `#9:1152` — "Crie seu perfil de colecionador e conecte uma carteira quando quiser."
  (`Caption/13 Regular · lh 16`)

### Form — `#70383:241` — **4 campos**, todos template `EL-5323f1d1`

| Campo | ID | Extra |
| --- | --- | --- |
| Username Input | `70383:242` | ⚠️ |
| Email Input | `70383:243` | ⚠️ |
| Password Input | `70383:244` | `Iconly/Curved/Hide` `#9:1167` |
| Confirm Password Input | `70383:245` | ⚠️ |

⚠️ **O de confirmação de senha não tem botão de mostrar/ocultar**, ao contrário do de senha.

### CTA — `#70383:246`

- `Sign Up Button` `70383:247` — template `EL-99483cc9`, "Criar conta" (`Body Large/16 Bold · lh 16`)

### Social — `#70383:248`

`padding-top: 24px`, `gap: 16px` (⚠️ 16 aqui vs. 12 no Login).

- `Divider` `70383:249` — `LINE` + `TEXT` ⚠️ + `LINE`
- `#70402:3596` (`padding: 0px 80px`, `gap: 16px`):
  - `70484:276` → `Provider=Google`
  - `70484:245` → `Provider=Facebook`

### Outros

- `RECTANGLE` `#9:1230` — 500 × 10 em y=646 (spacer)
- Fechar: `X` `#9:1147` — 18 × 18, em (469, 13)

⚠️ **Nenhuma caixa de aceite de termos** — requisito implícito de cadastro, ausente no design.

---

## 8. Desktop / Perfil do Colecionador — `9:1238`

Frame 1440 × 1080, `padding: 24px 120px`, `gap: 96px`, `fills: Color/Ink`.

### Account Sidebar — `#70420:4536`

1. Título ⚠️ (`#70420:4538`)
2. Bloco do usuário `#70420:4539` — `layout_76bc8883` (column, `padding: 0 16px`),
   `strokeWeight: "0px 0px 0px 6px"` (**borda só à esquerda, 6px**):
   `User` `#70420:4541` + nome ⚠️ `#70420:4542`
3. **6 itens de menu** (template `EL-bfb470be`), cada um ícone + rótulo ⚠️:

| Item | Ícone | Rótulo |
| --- | --- | --- |
| 1 | `Iconly/Light-Outline/Location` `#70420:4544` | ⚠️ |
| 2 | `shopping 1` `#70420:4547` | ⚠️ |
| 3 | `heart 1` `#70420:4551` | ⚠️ |
| 4 | `Iconly/Curved/Activity` `#70420:4555` | ⚠️ |
| 5 | `Iconly/Curved/Download` `#70420:4558` | ⚠️ |
| 6 | `Iconly/Curved/Danger Triangle` `#70420:4561` | ⚠️ |

4. `LINE` `#70420:4563`
5. Sair: `Iconly/Curved/Logout` `#70420:4565` + rótulo ⚠️

⚠� **Nenhum item de menu está marcado como ativo** — não há estado "página atual".
O bloco do usuário é o único elemento com borda de destaque.

### Profile Form — `#70386:239`

- Título `#9:1569` — "Perfil do colecionador" (`Body Large/16 Bold · lh 16`)
- `Fields` `#70386:240` — **3 linhas × 2 colunas**:

| Linha | Campo 1 | Campo 2 |
| --- | --- | --- |
| 1 | `Display Name Field` `70386:242` | `Username Field` `70386:243` (label + contador de 14px ⚠️) |
| 2 | `Bio Field` `70386:246` | `ENS Field` `70386:247` com `ENS Input` `70386:249` + `Arrow-Down` `9:1589` (**select**) |
| 3 | `Website Field` `70386:251` | `Avatar Field` `70386:252` |

⚠️ Todos os rótulos e placeholders dos 5 campos de texto são aliases `EL-*`.

**Avatar Field — `#70386:252`** (column, `gap: 10px`, 417px)

- Label `#9:1536` — "Avatar" (`Body/15 Regular · lh 15`)
- `Avatar Controls` `#70386:254` → `#70410:4359` (row, `gap: 24px`):
  - Botão de upload `#9:1581`: 50 × 50, `padding: 12px`, `fill: Color/Surface Raised`,
    borda 1px, `radius: 25px`, `Iconly/Curved/Image 2` `#9:1560` (`componentId 9:1550`)
  - `#9:1582`: 98 × 40, `radius: 3px`, com **dois rótulos sobrepostos**:
    "Alterar" `#9:1547` (Bold, absoluto em x=25, y=12) sobre "Remover" `#9:1548` (Regular)
    ⚠️ **Sobreposição de texto não resolvida** — provável protótipo, não estado final.

### Change Password — `#70386:255`

- Título `#9:1586` — "Alterar senha" (`Body Large/16 Medium · lh 16`)
- 3 campos, todos `template EL-8f2f1080` com rótulos **legíveis**:

| Campo | ID | Rótulo | Input |
| --- | --- | --- | --- |
| Atual | `70386:256` | "Senha atual" `#9:1529` | `Password Input` `70522:3144` + `Iconly/Light-Outline/Hide` |
| Nova | `70386:258` | "Nova senha" `#9:1532` | `Password Input` `70522:3158` + `Iconly/Light-Outline/Hide` |
| Confirmar | `70386:260` | "Confirmar nova senha" `#9:1534` | `Password Input` `70522:3172` + `Iconly/Light-Outline/Hide` |

Rótulos em `Body/15 Regular · lh 15`.

- `Save Button` `#70386:262` — "Salvar" (`Body/14 Bold · lh 16`)

⚠️ **Um único botão "Salvar"** para formulário de perfil + 3 campos de senha juntos.
⚠️ **Não há** botão "Excluir conta" na tela, apesar de o item 6 do menu usar
`Iconly/Curved/Danger Triangle`.

---

## 9. Desktop / Carteiras — `9:1670`

Frame 1440 × 1080. **Mesma `Account Sidebar`** (`#70420:4594`) com os mesmos 6 itens —
⚠️ e **também sem item ativo marcado**, então não há como saber visualmente que esta é a
página de carteiras.

### Wallets Form — `#70390:239`

**Section Heading — `#70390:240`**

- `Title Row` `#70390:241`: "Carteira principal" `#9:1703` (`Body Large/17 Bold`) +
  "Adicionar" `#9:1833` (`Body Large/16 Medium · lh 16`)
- `#9:1834` — "Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados."
  (`Body/14 Regular · lh 15`)

**Fields — `#70390:242` — 5 linhas**

| Linha | Campo 1 | Campo 2 |
| --- | --- | --- |
| 1 | `Main Wallet Name` `70390:244` | `Wallet Alias` `70390:245` |
| 2 | `Network Select` `70390:247` com `Input` `70390:248` — placeholder **"Selecione uma rede"** + `Arrow-Down` `#9:1837` | `Wallet Label` `70390:249` |
| 3 | `Wallet Address` `70390:251` — placeholder **"Endereço 0x da carteira"** | `Secondary Address Input` `70390:253` — placeholder **"ENS ou carteira secundária (opcional)"** |
| 4 | `Wallet Select` `70390:255` — placeholder **"Selecione uma carteira"** + `Arrow-Down` `#9:1854` | `Wallet Tag` `70390:257` |
| 5 | `Extra Field` `70390:259` ⚠️ | `ENS Field` `70390:260` com `Arrow-Down` `#9:1758` |

Placeholders visíveis: `Body/14 Regular · lh 15`. Rótulos ⚠️ (aliases `EL-*`).
⚠️ `Wallet Address` tem apenas 181px de label — mais estreito que os outros.

### Save + Secondary Wallet

- `Save Wallet Button` `#70390:262` — "Salvar carteira" (`Body/14 Bold · lh 16`)
- `Secondary Wallet` `#70390:263`:
  - `Title Row`: "Carteira secundária" `#9:1863` (`Body Large/17 Bold`)
  - `Actions` `#70390:265` (343 × 16):
    - `ELLIPSE` `#9:1867` 16×16, `strokeWeight: 1.5px` → **checkbox não marcado**
    - "Igual à carteira principal" `#9:1866` (`Body/14 Regular · lh 16`)
    - "Adicionar" `#9:1864` (`Body Large/16 Medium · lh 16`)
  - `#9:1865` — "Você ainda não adicionou uma carteira secundária."
    (`Body/14 Regular · lh 15`) → **estado vazio**

### Estados visíveis

- Estado vazio de carteira secundária.
- Checkbox desmarcado.
- Selects com placeholder (nenhum selecionado).
- **Nenhum** estado de carteira conectada, erro de endereço inválido ou carregando.

---

## 10. Mobile / Início — `14:5226`

Frame **414 × 896**, `radius: 40px`, `padding: 40px 24px 0px`, `gap: 16px`.

### Search Bar — `#70395:239` (altura 45px)

- Input `#70410:4124`: 313 × 45, `padding: 12px 129px 12px 12px`, `fill: Color/Surface Card`,
  `radius: 10px`, contendo `Search` `15:5331` (18.33px) + "Explorar coleções"
  (`Body/14 Bold · lh 16`)
- Botão de filtro `#70410:4122`: 45 × 45 em x=321, `padding: 12px`, `radius: 14px`,
  `Iconly/Curved/Filter` `#15:5488` (`componentId 15:5313`),
  `fills: linear-gradient(137deg, rgba(210,138,76,0.45), rgba(210,138,76,1))`
  → **botão com gradiente Primary**, não sólido (ver [design-tokens.md](design-tokens.md#2-gradientes--4-tokens))

### Hero Banner — `#70395:240`

Altura **190px**, `radius: 12px`, `padding: 16px`, conteúdo centralizado, `gap: 10px`.
`Mask Group` `#14:5290` 366 × 190 absoluto.

- Coluna de texto (`#15:5292`, `gap: 6px`):
  - "Bem-vindo à Kurio" `#14:5288`
  - "SEJA DONO DA\nCULTURA DIGITAL" `#14:5234` — **largura fixa 190px**
  - "Descubra NFTs selecionados de criadores do mundo todo." `#14:5289` (`Caption/12 Regular · lh 18`)
- CTA (`#15:5299`, `gap: 8px`): "EXPLORAR" `#15:5294` (`Caption/12 Bold`) +
  `Arrow - Right` `#15:5295` (`componentId 5:100`)
  ⚠️ **O CTA mobile não tem `fills`** nem dimensões — é só texto + ícone, sem background.
- Grupo de arte `#70410:4127` (138 × 146, `radius: 16px`):
  - `Mobile NFT Artwork 1` `#14:5238` — 138 × 138, `imageRef 84592047…`, `radius: 16px`
  - `Mobile NFT Artwork 2` `#14:5239` — 58 × 58 em (14, 88), `imageRef 2986a7cb…`, `radius: 16px`
- 3 pontos de paginação `#15:5300` (template `EL-d269e0eb`)

⚠️ O hero mobile **não tem título Display** nem parágrafo longo como o desktop —
o `Display/43 Bold` foi substituído por `Body/14 Bold` com largura fixa de 190px.
A 414px, `Display/43` não caberia.

### Tabs — `#70395:241`

Template `EL-5473bef8`. Row `gap: 20px` com:

| Aba | ID | Estilo |
| --- | --- | --- |
| "Todos os NFTs" | `#15:5361` | **`Body/14 Bold · lh 16`** (ativa) + `LINE` `#15:5366` (`layout_3cdeda1d`, 2px) |
| "Novos lançamentos" | `#15:5362` | `Body/14 Regular · lh 16` |
| "Em alta" | `#15:5363` | `Body/14 Regular · lh 16` |

⚠️ **O Figma não desenha o "Ordenar por" no mobile** — o sort desktop (`Todos / Novos / Em alta`
+ ordenação) não tem equivalente. Ver [responsive.md](responsive.md).

### Product Grid — `#70395:242`

**2 colunas**, com *stagger* vertical — `Column L` e `Column R` (`padding-top: 32px`, `gap: 24px`):

| Card | ID | Coluna | Arte | Nome | Preço |
| --- | --- | --- | --- | --- | --- |
| P-1 | `15:5497` | L | `#70410:4135` 168×168 `imageRef 84592047…` + botão 28×28 `fill: Color/Surface Raised` | ⚠️ | ⚠️ |
| P-3 | `15:5499` | L | `Mobile NFT Artwork 5` `#15:5416` (`layout_c705aacf`, `imageRef 9df2ff42…`, `needsCropping: true`) + badge **"RARO"** | ⚠️ | ⚠️ |
| P-2 | `15:5498` | R | `Mobile NFT Artwork 4` `#15:5415` `imageRef 2986a7cb…` | ⚠️ | ⚠️ |
| P-4 | `15:5500` | R | `Mobile NFT Artwork 6` `#15:5431` `imageRef 87580f2d…` | ⚠️ | ⚠️ |

Anatomia do card mobile (`#70410:4136` / `#70410:4149` / `#70410:4153`):
altura fixa **200px**, `fill: fill_af2f5fc9` (gradiente `#241612 → #2F1D15`),
`radius: 20px`, `padding: 12px 4px 20px`, `gap: 10px`, arte em `layout_c705aacf` (168 × 168,
`radius: 16px`), depois meta column `gap: 8px` (P-4) / `gap: 6px` (P-1, P-2).

Extras:
- **P-1**: botão circular 28×28, `fill: Color/Surface Raised`, borda 1px, `radius: 14px`,
  com `Vector` 15×13.35 — **favoritar**, dentro da arte com
  `padding: 0px 8px 140px 133px` (empurra o botão para o canto inferior direito).
- **P-3**: badge "RARO" `#15:5419` (`Caption/13 Medium`) em `RECTANGLE` 68×32, absoluto em y=16.
- **P-2 / P-4**: IMAGE-SVG `EL-5569641f` **acima** do card, fora dele.

⚠️ **Todos** os nomes e preços do grid mobile são aliases `EL-*` — não extraídos.
⚠️ O grid mobile mostra **4 cards**, o desktop **9**. **Não há paginação mobile.**

### Tab Bar — `#70395:245`

414 × 126, absoluto em (0, 770).

- `Vector` `#15:5504` — 414 × 94.95 em y=31, `fill: Color/Surface Card`,
  `boxShadow: 0 -10px 30px 0 rgba(10,6,4,0.45)`
- `ELLIPSE` `#15:5507` — 65 × 65 em (175, 0) → recorte/notch central
- **5 destinos**, todos a y≈71:

| x | Destino | Node | Tamanho |
| --- | --- | --- | --- |
| 36 | Home | `Iconly/Bold/Home` `#15:5519` (`componentId 15:5516`) | 20 × 20 |
| 108 | (cart) | `Vector` `#15:5527` | 20 × 17.79 |
| 194 (y=21) | **(ação central, elevada)** | `Group` `#15:5529` | 26.82 × 24 |
| 292 | Shop | `Shop` `15:5524` | 20 × 20 |
| 354 | User | `User` `15:5522` | 20 × 20 |

⚠️ Os destinos em x=108 e x=194 **não têm nome** — só "Vector" e "Group".
A hipótese mais provável é `x=108` = carrinho (badge?) e `x=194` = ação central elevada
(comprar / conectar carteira). **Inferência — confirmar no Figma.**

⚠️ **Nenhum item está marcado como ativo.** Não há estado de aba selecionada.

---

## 11. Mobile / Detalhes do NFT — `15:5536`

Frame **414 × 896**, `radius: 40px`, column com **`gap: -114px`**.
O gap negativo faz a `Details Sheet` **sobrescrever** o `Hero` em ~114px — é um *bottom sheet*
sobreposto, não um layout empilhado.

### Hero — `#70396:241` (414 × 506)

- `RECTANGLE` `#15:5559` — 414 × 506, `fill: fill_af2f5fc9` (gradiente)
- `IMAGE-SVG` `#15:5657` — 56 × 7 em (179, 365) → **alça de arrastar** do sheet
- Linha superior `#70410:4159` em (28, 23), 361px, `space-between`:

| Botão | ID | Detalhe |
| --- | --- | --- |
| Back | `#70410:4156` | 35px, `padding: 8px`, `fill: Color/Surface Raised`, borda 1px, `radius: 17.5px`, `Arrow - Left 2` (`componentId 15:5746`) |
| Heart | `#70410:4157` | idem, `Vector` 16 × 14.23 |

- `Mobile NFT Hero Artwork` `#15:5639` — largura fill, altura 356px,
  `imageRef 84592047…`, `radius: 24px`

### Details Sheet — `#70396:242` (414 × 504)

`fills: Color/Surface Card`, **`radius: 31px 31px 0 0`**, `padding: 32px 24px 24px`, `gap: 12px`.

- `Title Row` `#70396:243`:
  - "Emerald Ape #042" `#15:5561` (`Title/20 Bold · lh 16`)
  - `Review` `#15:5690` (82.58 × 27): `Iconly/Bold/Star` `#15:5663` (`componentId 11:1192`),
    **"4.8"** `#15:5687` (`Body/14 Medium · lh 16`), **"(19)"** `#15:5662` (`Body/14 Regular · lh 16`),
    `RECTANGLE` 80.16 × 27 com `radius: 32px` e borda 1px
- Descrição `#15:5668` — 361 × 71, `Body/14 Regular · lh 24`:
  "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum."
- `Edição:` `#15:5660` (`Body/15 Bold · lh 16`) + row `#70410:4178` (`gap: 12px`) com **4 pills**:
  - 2 com template `EL-01b851a3` (ELLIPSE + rótulo ⚠️)
  - `#70410:4167` — 46 × 28, `ELLIPSE` `EL-c482c82a` + rótulo `EL-3ba5ded1` ⚠️
  - `#70410:4168` — 66 × 28, `ELLIPSE` `EL-da934025` + rótulo `EL-7ecf96b0` ⚠️
- `Token Info` `#70396:244` (template `EL-8f2f1080`):
  - "ID do token: #0042" `#15:5693`
  - "Coleção: Kurio Apes" `#15:5694`
  - "Atributos: Óculos, Esmeralda, Raro" `#15:5695`
  - todos `Body/15 Regular · lh 16`

### Buy Bar — `#70396:245`

414 × 164, **absoluto em (0, 732)**, `fills: Color/Surface Card`,
**`radius: 40px 40px 0 0`**, `effect_e368b9ba` (`0 0 20px 0 rgba(10,6,4,0.45)`),
`padding: 20px 24px 36px`, `gap: 10px`.

- Linha superior (`space-between`):
  - "Qtd." `#15:5759` (`Body/15 Medium`) + stepper: 2 `Add Button` (`EL-9e206f71`) +
    "1" `#15:5720` (`Body Large/18 Medium`)
  - "1.19 ETH" `#15:5562` (`Title/20 Bold · lh 16`)
- Linha de CTAs (`gap: 12px`):
  - `Comprar NFT` `#70410:4211` — **196 × 60**, `fill: fill_4399d4cf` (gradiente Primary),
    `radius: 40px`, `padding: 20px 44px 20px 48px`, `Body Large/16 Bold · lh 20`
  - `Shop` `#70410:4212` — **60 × 60**, `fill: Color/Surface Raised`, borda 1px,
    `radius: 40px`, `padding: 20px`, `Shop` `16:357` (`componentId 15:5524`)

⚠️ A `Buy Bar` está a y=732 com altura 164 → termina em 896, exatamente o fim do frame.
Em 896px de altura **não sobra espaço para rolar o conteúdo** — a Buy Bar é fixa e cobre
o `Token Info`. Ver [responsive.md](responsive.md).

⚠️ **Não há "Adicionar ao carrinho"** no mobile — só "Comprar NFT" e um botão de carrinho
de 60×60. O fluxo de carrinho existe no desktop, mas não há entrada para ele nesta tela.

---

## 12. Mobile / Carrinho de NFTs — `16:360`

Frame 414 × 896, `radius: 40px`, `padding: 32px 0px 0px`, `gap: 4px`.

### Content — `#70397:239`

`padding: 0px 28px`, `gap: 12px`.

- `Screen Header` `#70397:240`: `Back` `#16:393` + "Carrinho de NFTs" `#16:415`
  (`Title/20 Bold · lh 16`) em x=96
- `Cart Items` `#70397:241` — **4 itens** (template `EL-70b69b6c`):

| Item | ID | Arte 100×100 | Nome | Edição | Preço |
| --- | --- | --- | --- | --- | --- |
| 1 | `70397:242` | `imageRef 84592047…` | Emerald Ape #042 `16:429` | ⚠️ | **1.19 ETH** `16:435` |
| 2 | `70397:243` | `imageRef 2986a7cb…` | Violet Nomad #314 `22:1327` | Edição: **1/1** | **1.39 ETH** |
| 3 | `22:1359` (GROUP) | `imageRef 9df2ff42…` | Ivory Baron #088 `22:1341` | Edição: **1/10** | **3.58 ETH** |
| 4 | `70397:244` | `imageRef 87580f2d…` | Golden Beat #207 `22:1355` | ⚠️ | **1.98 ETH** |

Cada item tem um stepper (`EL-941ff168`: rótulo + ícone + `RECTANGLE` + texto ⚠️).
**Item 3** é o único com `fill: fill_73ba89d3` + `effect_12da039e` → **em foco**.
**Item 3** também é o único com `Iconly/Curved/Delete` visível (`16:463`, 24×24,
`componentId 11:2030`).

⚠️ **Preços divergem do desktop para os mesmos NFTs:**
| NFT | Desktop (Início) | Mobile (Carrinho) |
| --- | --- | --- |
| Golden Beat #207 | 0.99 ETH | 1.98 ETH |
| Ivory Baron #088 | 1.79 ETH | 3.58 ETH |
| Violet Nomad #314 | 1.39 ETH | 1.39 ETH |

⚠️ `Subtotal` exibe **8.92 ETH**, mas a soma dos preços unitários visíveis é
`1.19 + 1.39 + 3.58 + 1.98` = **8.14 ETH**. As quantidades vêm de aliases `EL-*`,
então a diferença provavelmente vem de um item com quantidade > 1 — **não verificável**.
Ver também: 2.29 ETH aparece como preço antigo de Neon Vessel na Home, então
**3.58 = 1.79 × 2** para Ivory Baron é uma hipótese plausível (item 3 é o selecionado).

⚠️ Item 1 tem título em `Body/15 Bold · lh 16`; itens 2–4 em `Body/15 Bold · lh 16` também
⚠️ — porém "Edição" aparece em `Body/14 Regular · lh 16` só nos itens 2 e 3.

### Payment Summary — `#70397:245`

`fills: Color/Surface Card`, **`radius: 40px 40px 0 0`**, `padding: 24px 24px 36px`,
`justify-content: space-between`.

| Bloco | ID | Detalhe |
| --- | --- | --- |
| `Promo Input` | `70397:246` | altura 50px, `fill: Color/Surface Card`, borda 1px, `radius: 40px`, `padding-left: 16px`; placeholder "Digite o código promocional..." (`Caption/13 Regular · lh 22`); botão `#70410:4215` 97 × 50 `radius: 40px` "Aplicar" (`Body/15 Bold · lh 16`) |
| `Subtotal` | `70397:247` | **8.92 ETH** `16:1015` (`Body Large/16 Regular · lh 16`), rótulo ⚠️ |
| `Discount` | `70397:248` | rótulo e valor ⚠️ |
| `Network Fee` | `70397:249` | **0.016 ETH** `16:1016` + nota ⚠️ `#16:1013` |
| `Total` | `70397:250` | rótulo e valor ⚠️ |
| `Checkout Button` | `70397:251` | `layout_71d785bb` (altura 60px, fill), `fill: fill_4399d4cf`, `radius: 40px`, "Conectar e finalizar" (`Body Large/16 Bold · lh 16`) |

⚠️ `Discount` e `Total` são **totalmente ilegíveis** no mobile (aliases).
No desktop os mesmos blocos são igualmente aliases. → **O resumo financeiro do design
precisa ser lido no Figma.**

⚠️ "Conectar e finalizar" — mesma exigência de carteira conectada do desktop.

---

## 13. Mobile / Pagamento — `16:748`

Frame 414 × 896, `radius: 40px`, `padding: 32px 28px`.

### Screen Header — `#70398:240`

`Back` `#16:757` + "Pagamento com carteira" `#16:756` (`Title/20 Bold · lh 16`) em x=59.

### Linha de status — `#70304:365` (`space-between`)

- "Carteira conectada" `#16:844` (`Body Large/16 Bold · lh 16`)
- "Trocar carteira" `#16:846` (`Body/14 Bold · lh 16`) → **link**

### Wallet Cards — `#70398:241` — 2 cards (template `EL-b63a4e0f`)

**Wallet Card — Reserva — `#70398:242`** → **selecionada**

- `RECTANGLE` `#16:987` (`layout_7cd6d44e`, 358 × 93): `fill: Color/Surface Card`,
  `radius: 14px`, **`boxShadow: 0 20px 20px 0 rgba(10,6,4,0.45)`**
- "Reserva" `#16:988` (`Body Large/16 Bold · lh 16`) em (54, 15)
- "nova.kurio.eth\nRede Polygon" `#16:989` (`Body/14 Regular · lh 22`) em (54, 38)
- `IMAGE-SVG` `#16:998` — **16 × 16 em (19, 39)** → **ícone de rede Ethereum (diamond)**
- `IMAGE-SVG` `#16:990` (template `EL-19376dde`) → **check de seleção** ⚠️

**Wallet Card — Principal — `#70398:243`** → não selecionada

- `RECTANGLE` `#16:980`: `fill: Color/Surface Card`, `radius: 14px`, **sem sombra**
- "Principal" `#16:981` (`Body Large/16 Bold · lh 16`)
- "0xA91F…E82C\nRede principal Ethereum" `#16:982` (`Body/14 Regular · lh 22`)
- `ELLIPSE` `#16:1001` — **16 × 16 em (19, 38)**, `stroke: Color/Border Soft` 1.2px
  → **oposto ao diamond**: é o **vazio (não selecionado)** do mesmo radio

⚠️ As duas wallets usam **o mesmo endereço base** (`0xA91F…E82C` na Principal e
`0xA91F…E82C` na transação da tela 5), mas a Reserva é `nova.kurio.eth` em Polygon.
⚠️ A seleção é por **ícone** (diamond cheio vs. círculo vazio), não por radio button
visível — acessibilidade a avaliar.

### Wallet Options — `#70398:244` (column, `gap: 16px`)

- "Carteira e rede" `#16:852` (`Body Large/16 Bold · lh 16`)

**3 opções** (template `EL-a72050c5`):

| Opção | ID | Rótulo | Ícone | Estado |
| --- | --- | --- | --- | --- |
| WalletConnect | `70398:245` | "WalletConnect" `#16:894` | `ELLIPSE` + `TEXT` **"W"** `70243:316` | não selecionada |
| MetaMask | `70398:246` | "MetaMask" `#16:889` | `ELLIPSE` + `TEXT` **"M"** `70243:315` | não selecionada |
| **Coinbase Wallet** | `70398:247` | "Coinbase Wallet" `#16:854` | `Iconly/Curved/Wallet` `#23:1379` 24×24 (`componentId 23:1373`) + `IMAGE-SVG` `#16:994` | **selecionada** — `fill: Color/Surface Card`, `radius: 15px`, `boxShadow: 0 0 40px 0 rgba(10,6,4,0.45)` |

⚠️ **Inconsistência:** WalletConnect e MetaMask usam **iniciais como ícone** ("W", "M")
dentro de um `ELLIPSE`, enquanto Coinbase usa o ícone real `Iconly/Curved/Wallet`.
⚠️ `Coinbase Wallet` selecionada tem `layout_c96d35de` (359 × 65) vs. template `EL-d8f27824`
das outras — **alturas diferentes** entre opções.

### Total Row — `#70398:248` (template `EL-6f779a3e`)

- "Total:" `#16:832` (`Body Large/16 Bold · lh 16`) + valor ⚠️ (`EL-03fc51f5`)

### Confirm Button — `#70398:249`

`layout_66f02499` (358 × 60), `fill: fill_4399d4cf`, `radius: 40px`,
"Confirmar compra" (`Body/15 Bold · lh 16`).

⚠️ O botão de confirmação está **sempre ativo** — não há estado desabilitado
durante a aprovação da carteira.

---

## 14. Mobile / Login — `16:1022`

Frame 414 × 896, `radius: 40px`, `padding: 80px 28px 24px`, **`gap: 40px`**.

- `Logo` `#70399:239` (texto ⚠️)
- `Title` `#70399:240`: **"Entrar"** `#16:1173` (`Title/20 Bold · lh 16`)
- `Form` `#70399:241` (template `EL-50ef8a26`):

| Campo | ID | Detalhe |
| --- | --- | --- |
| 1 | `#70410:4221` | 358 × 50, `padding-left: 16px`, borda 1px, `radius: 10px`, `gap: 10px` ⚠️ |
| 2 | `#70410:4220` | `layout_329f2220` (358 × 50, `padding: 0 16px`, `gap: 10px`), borda 1px, `radius: 10px`; valor "**********" (`Body Large/16 Regular · lh 16`) + `Iconly/Curved/Hide` `#16:1191` |
| — | `70399:242` | `Forgot Link` alinhado à direita ⚠️ |

- `Sign In Button` `#70399:243` — `layout_66f02499` (358 × 60), `radius: 10px` ⚠️
- `Mobile Social Block` `#70522:3186` (componentId `70504:2994`):
  `LINE` + `TEXT` ⚠️ + `LINE`, depois 2 `Social Button`:
  `google 1` (template `EL-40488527`) e `facebook 1` (`EL-16148383`)
- `Signup Link` `#70399:247` (centralizado): **"Novo na Kurio? Crie uma conta"**
  `#16:1227` (`Body/15 Regular · lh 16`)

⚠️ **Divergência desktop × mobile:**
| | Desktop | Mobile |
| --- | --- | --- |
| Login/Cadastro | **modais** sobre a Marketplace Page | **telas inteiras** |
| Aba Entrar/Criar conta | sim (tabs no header do modal) | **não** — só link de texto |
| Raio do botão | 5px (template) | **10px** |
| Raio do modal | 0 (Login) / 8px (Cadastro) | n/a |

---

## 15. Mobile / Cadastro — `16:1228`

Frame 414 × 896, `radius: 40px`, `padding: 80px 28px 24px`, `gap: 40px`.

- `Logo` `#70410:4345` ⚠️
- `Title` `#70399:249`: **"Criar perfil de colecionador"** `#16:1241`
  (`Body Large/18 Bold · lh 16`) ⚠️ **difere do desktop**, onde a aba se chama "Criar conta"
- `Form` `#70399:250` — **4 linhas de 358 × 50**, borda 1px, `radius: 10px`:

| Linha | ID | `padding` | Extra |
| --- | --- | --- | --- |
| 1 | `#70410:4348` | `0px 16px`, `space-between` | ⚠️ |
| 2 | `#70410:4349` | `0px 16px`, `gap: 10px` | ⚠️ |
| 3 | `#70410:4351` | `layout_329f2220` | `RECTANGLE` `#16:1291` (`layout_ad60d786`, 358 × 50) + `Iconly/Curved/Hide` `#16:1292` |
| 4 | `#70410:4353` | `0px 16px` | `IMAGE-SVG` `#16:1299` (`layout_ad60d786`, `radius: 10px`) + `Iconly/Curved/Hide` `#16:1302` |

⚠️ As linhas 3 e 4 são **aninhadas** (`layout_329f2220` > `layout_ad60d786` com as mesmas
dimensões) — provável sobra de protótipo.

- `Create Profile Button` `#70399:251` — `layout_71d785bb` (358 × 60), `radius: 10px`,
  **"Criar perfil"** `#16:1256` (`Body Large/16 Bold · lh 16`)
  ⚠️ **"Criar perfil"** ≠ **"Criar conta"** (desktop)
- `Mobile Social Block` `#70522:3213` — idem ao Login
- `Login Link` `#70399:255` (centralizado): **"Já tem uma conta? Entre"** `#16:1243`
  (`Body/15 Regular · lh 16`)

⚠️ **Nenhuma caixa de aceite de termos.**

---

## Cobertura de estados — resumo

| Estado | Presente no Figma? | Onde |
| --- | --- | --- |
| Aba de filtro ativa | Sim | Início desktop e mobile |
| Item de paginação ativo | Sim | Início desktop |
| Card com preço promocional | Sim | Início desktop (Neon Vessel #552) |
| Item de carrinho selecionado | Sim | Carrinho desktop (item 3), mobile (item 3) |
| Wallet selecionada | Sim | Pagamento mobile (Reserva, Coinbase Wallet) |
| Modal aberto | Sim | Login, Cadastro, Confirmação |
| Sucesso de compra | Sim | Confirmação |
| Estado vazio | Sim | Carteiras (secundária), Blog card 4 |
| Checkbox desmarcado | Sim | Carteiras |
| Select com placeholder | Sim | Carteiras (rede, carteira) |
| Badge "RARO" | Sim | Início mobile (P-3) |
| Carousel com ponto ativo | Sim | Detalhes, Carrinho |
| **Skeleton / loading** | **Não** | — |
| **Lista vazia** (exceto secundária) | **Não** | — |
| **Erro de formulário** | **Não** | — |
| **Hover / focus** | **Não** | — |
| **NFT vendido / indisponível** | **Não** | — |
| **Favoritado** | **Não** | — |
| **Carrinho vazio** | **Não** | — |
| **Transação pendente/falha** | **Não** | — |
| **Menu mobile aberto** | **Não** | — |
| **Aba ativa na Tab Bar** | **Não** | — |
| **Item ativo na sidebar de conta** | **Não** | — |
