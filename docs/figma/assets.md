# Assets

Inventário completo de imagens e vetores do Figma. Machine-readable em
[nodes.json](nodes.json) → `assets`.

> **Atualização da Etapa 6:** 4 raster e 48 SVGs foram baixados via MCP e organizados em
> `public/assets/figma/mcp/`. O manifesto machine-readable está em
> [`public/assets/figma/mcp/manifest.json`](../../public/assets/figma/mcp/manifest.json).

---

## 1. Resumo

| Tipo | Únicos | Ocorrências |
| --- | --- | --- |
| Imagens raster (`imageRef`) | **4** | **38** |
| Vetores nomeados (únicos por tipo+nome) | **40** | **84** |
| Ícones como `COMPONENT` | 25 | 39 instâncias |

⚠️ **O design inteiro usa apenas 4 imagens raster.** Os "NFTs" são as mesmas 4 imagens
reaproveitadas em 38 posições com nomes diferentes (`NFT Artwork 03`, `NFT Collection
Artwork 01`, `NFT Cart Artwork 6`, `Mobile NFT Artwork 1`, …).
**Não há variety**: o mesmo `imageRef` representa "Emerald Ape", "Cosmic Bloom",
"Sage Nomad" e o hero ao mesmo tempo.

---

## 2. Imagens raster — 4 assets

Todas com `scaleMode: FILL` (preenchem o container, respeitando `borderRadius`).

### `fill_0380e2ac`

- **imageRef:** `8459204731e6eba9d474cbc8ebc37071360d3ba5`
- **Ocorrências:** 11 (o asset mais usado)
- **Onde:**

| Node | Nome no Figma | Medidas |
| --- | --- | --- |
| `70342:2673` | *(frame do hero)* | 450 × 450 |
| `4:137` | `NFT Artwork 03` (card A do grid) | 250 × 250 |
| `4:428` | `NFT Artwork 17` (promo Genesis Drops) | 292 × 250 |
| `70343:268` | `Image` (blog card 2) | — |
| `11:1188` | `NFT Collection Artwork 02` (**thumbnail selecionada**) | — |
| `11:1161` | `NFT Collection Artwork 01` (**imagem principal do detalhe**) | 404 × 404 |
| `11:1900` | `NFT Cart Artwork 6` (carrinho desktop item 1) | — |
| `14:5238` | `Mobile NFT Artwork 1` (hero mobile) | 138 × 138 |
| `15:5639` | `Mobile NFT Hero Artwork` (hero do detalhe mobile) | — |
| `22:1315` | *(item 2 do carrinho mobile)* | — |
| `22:1330` | `Mobile Cart NFT 2` | 100 × 100 |

⚠️ Esta única imagem é ao mesmo tempo o hero desktop, o hero mobile, a imagem principal do
detalhe, o primeiro card do grid, uma thumbnail e um item de carrinho.

### `fill_02276ad0`

- **imageRef:** `2986a7cb16d09de8970824d2dd58bf0bb021702c`
- **Ocorrências:** 14 (o mais usado)
- **Onde:**

| Node | Nome no Figma | Medidas |
| --- | --- | --- |
| `70410:3798` | `NFT Artwork 18` (**NFT em destaque**) | altura 368 |
| `4:162` | `NFT Artwork 04` (card B) | 250 × 250 |
| `4:280` | `NFT Artwork 06` (card D) | 224 × 286 |
| `4:282` | `NFT Artwork 07` (card E) | — |
| `70343:277` | `Image` (blog card 3) | — |
| `11:1177` | `NFT Collection Artwork 06` (relacionado 1) | — |
| `11:1178` | `NFT Collection Artwork 07` (relacionado 2) | — |
| `11:2092` | `NFT Cart Artwork 7` (carrinho desktop item 2) | — |
| `11:1976` | `NFT Cart Artwork 1` (relacionado carrinho 1) | — |
| `11:1979` | `NFT Cart Artwork 2` (relacionado carrinho 2) | — |
| `14:5239` | `Mobile NFT Artwork 2` (arte secundária do hero mobile) | 58 × 58 |
| `15:5415` | `Mobile NFT Artwork 4` (grid mobile P-2) | — |
| `22:1318` | *(item 3 do carrinho mobile)* | — |
| `22:1344` | `Mobile Cart NFT 3` | 100 × 100 |

### `fill_26d577be`

- **imageRef:** `9df2ff42dd27ba657621c304557d1a855a4be6a5`
- **Ocorrências:** 9
- **Onde:**

| Node | Nome no Figma | Medidas |
| --- | --- | --- |
| `4:164` | `NFT Artwork 05` (card C — **preço promocional**) | 250 × 250 |
| `4:284` | `NFT Artwork 08` (card F) | — |
| `4:423` | `NFT Artwork 16` (promo Curated Art) | 287 × 250 |
| `70343:259` | `Image` (blog card 1) | — |
| `11:1179` | `NFT Collection Artwork 08` (relacionado 3) | — |
| `11:2094` | `NFT Cart Artwork 8` (carrinho desktop item 3) | — |
| `11:1982` | `NFT Cart Artwork 3` (relacionado carrinho 3) | — |
| `22:1332` | *(item 4 do carrinho mobile)* | 100 × 100 |
| `22:1358` | `Mobile Cart NFT 4` | — |

⚠️ Este `imageRef` **não tem nenhum nó no grid mobile** — apesar de o card mobile P-3
(`15:5416`) precisar de crop.

### `fill_d003b2ae`

- **imageRef:** `87580f2def9af0ce13f4b6f6ce17bb2449bcfc16`
- **Ocorrências:** 4 (o menos usado)
- **Onde:**

| Node | Nome no Figma | Medidas |
| --- | --- | --- |
| `70343:286` | `Image` (blog card 4) | — |
| `15:5431` | `Mobile NFT Artwork 6` (grid mobile P-4) | — |
| `22:1346` | *(item 5 do carrinho mobile)* | — |
| `16:553` | `Mobile Cart NFT 1` | — |

---

## 3. Caixas que NÃO têm `imageRef`

Além das 38 posições com imagem, existem caixas de imagem **sem `imageRef`** — são
placeholders com apenas `fills` de surface. Se forem placeholders, o design está
incompleto; se forem intencionais, são "NFT sem imagem".

| Contexto | Nodes | Tratamento |
| --- | --- | --- |
| **Thumbnails do detalhe** | `11:1181` (`NFT Collection Artwork 04`), `11:1189` (`05`), `11:1190` (`03`) | template `EL-447bc567` (100×100, `layout_019a9238`), **sem `imageRef`** — só `fill: Color/Surface Card` |
| **Cards D, E, F, G, H, I do grid** | `4:280`, `4:282`, `4:284`, `4:286`, `4:289`, `4:291` | `4:280` tem imagem; `4:282`–`4:291` usam `imageRef` herdado do template |
| **Relacionados 4 e 5** | `11:1180`, `11:1182` | sem `imageRef` próprio |
| **Blog cards** | `70343:258`–`70343:285` (4×) | `layout_fde60827` (altura 195) + `imageRef` |
| **Grid mobile P-3** | `15:5416` (`Mobile NFT Artwork 5`) | `layout_c705aacf`, **`needsCropping: true`**, sem `imageRef` listado |

⚠️ **3 das 4 thumbnails da página de detalhe não têm imagem.**
⚠️ O card mobile P-3 está marcado com `needsCropping: true` — o Figma indica que a arte
precisa de recorte e **não tem `imageRef` associado**.

---

## 4. Mapeamento `imageRef` → NFT nomeado

Cruizando as imagens com os textos de nome/coleção do Figma:

| `imageRef` | NFT que o design associa | Evidência |
| --- | --- | --- |
| `84592047…` | **Emerald Ape #042** (coleção `Kurio Apes`, token `#0042`) | card A do grid + detalhe principal (`11:1161` = 404×404) + `ID do token: #0042` |
| `2986a7cb…` | **Cosmic Bloom #118** / **Sage Nomad #009** / **Violet Nomad #314** | 3 nomes diferentes, **mesma imagem** |
| `9df2ff42…` | **Neon Vessel #552** / **Ivory Baron #088** | 2 nomes, mesma imagem |
| `87580f2d…` | **Golden Beat #207** / **Golden Signal #160** | 2 nomes, mesma imagem |

⚠️ **Nomes de card no grid (Home):**

| Card | Nome | `imageRef` |
| --- | --- | --- |
| A | Emerald Ape #042 | `84592047…` |
| B | Sage Nomad #009 | `2986a7cb…` |
| C | Neon Vessel #552 | `9df2ff42…` |
| D | Cosmic Bloom #118 | `2986a7cb…` |
| E | Violet Nomad #314 | `2986a7cb…` |
| F | Ivory Baron #088 | `9df2ff42…` |
| G | Golden Beat #207 | `87580f2d…` |
| H | Golden Signal #160 | `87580f2d…` |
| I | Golden Signal #160 | `87580f2d…` |

⚠️ `2986a7cb…` aparece em **3 cards com nomes diferentes** (B, D, E) e
`87580f2d…` em **3 cards com 2 nomes** (G, H, I — sendo H e I idênticos).
→ **O `imageRef` não é um identificador confiável de NFT.** O mapeamento NFT→imagem
precisa vir de dados do backend, não do Figma.

---

## 5. Vetores nomeados — 40 únicos / 84 ocorrências

### Ícones reutilizáveis (componente ou nome estável)

| Nome | Tipo | Ocorrências |
| --- | --- | --- |
| `Iconly/Bold/Star` | IMAGE-SVG | 6 |
| `Iconly/Curved/Delete` | IMAGE-SVG | 4 |
| `Iconly/Curved/Hide` | IMAGE-SVG | 5 |
| `User` | IMAGE-SVG + COMPONENT | 4 |
| `Shop` | IMAGE-SVG + COMPONENT | 2 |
| `Iconly/Curved/Logout` | IMAGE-SVG | 3 |
| `Iconly/Light-Outline/Location` | IMAGE-SVG | 2 |
| `Iconly/Curved/Activity` | IMAGE-SVG | 2 |
| `Iconly/Curved/Download` | IMAGE-SVG | 2 |
| `Iconly/Curved/Danger Triangle` | IMAGE-SVG | 2 |
| `heart 1` | IMAGE-SVG | 2 |
| `Iconly/Curved/Arrow - Right` | IMAGE-SVG | 2 |
| `Linkedin` | IMAGE-SVG | 1 |
| `Twitter` | IMAGE-SVG | 1 |
| `Message` | COMPONENT | 1 |
| `X` | IMAGE-SVG + COMPONENT | 3 |
| `Arrow-Down` | IMAGE-SVG + COMPONENT | 4 |
| `Search` | COMPONENT | 2 |
| `Back` | IMAGE-SVG | 2 |
| `Group` | IMAGE-SVG | 1 |
| `Mask Group` | IMAGE-SVG | 2 |
| `thank-you 1` | IMAGE-SVG | 1 |

### Vetores decorativos (não reutilizáveis — nome de layer do Figma)

| Nome | Ocorrências | Onde |
| --- | --- | --- |
| `Frame` | 8 | bordas de input, círculos, tab bar |
| `Vector` | 6 | tab bar, badges, glitter |
| `Vector 13 (Stroke)` | 1 | ícone ao lado do Twitter no compartilhamento |
| `Vector 37 (Stroke)` | 1 | dentro do `Arrow-Down` |
| `Vector 139 (Stroke)` | 1 | dentro do `X` |
| `Ellipse 2 (Stroke)` | 1 | dentro do `Search` |
| `Union` | — | dentro do `Social Button` (não listado nos 40) |

⚠️ **6 vetores com nome de layer** (`Frame`, `Vector`, `Vector N (Stroke)`, `Ellipse N`)
não podem ser reutilizados nem identificados. Precisam renomear no Figma ou substituir
por SVG próprio na Fase 1.

### Ícones do `Iconly` — 4 famílias

| Família | Ícones |
| --- | --- |
| `Iconly/Curved` | `Arrow - Right 2`, `Arrow - Right`, `Arrow - Left 2`, `Arrow - Down 2` (não — esse é Two-tone), `Delete`, `Hide`, `Logout`, `Activity`, `Download`, `Danger Triangle`, `Image 2`, `Filter`, `Wallet` |
| `Iconly/Bold` | `Star`, `Home` |
| `Iconly/Light-Outline` | `Location`, `Hide` |
| `Iconly/Two-tone` | `Arrow - Down 2` |

⚠️ O mesmo conceito existe em famílias diferentes: `Hide` (Curved + Light-Outline),
`Arrow-Down` (Curved) vs `Arrow - Down 2` (Two-tone), `Star` (Bold).

---

## 6. Logos

| Onde | Nome | Tipo | Estado |
| --- | --- | --- | --- |
| Home desktop | `Logo` (dentro de `Header Row`) | `EL-f866e5d5` | ⚠️ alias — **não extraído** |
| Footer | `Logo` | alias | ⚠️ alias |
| Login mobile | `Logo` `#70399:239` | TEXT | ⚠️ **texto**, não imagem |
| Cadastro mobile | `Logo` `#70410:4345` | TEXT | ⚠️ **texto**, não imagem |

⚠️ **O logo é um nó `TEXT` nas telas mobile** e um alias `EL-*` no header/footer.
→ **Não há arquivo de logo (SVG/PNG) no Figma.** Precisa ser criado/obtido para a Fase 1.
⚠️ Nome do produto no Figma: **Kurio** (telas) / **Kurio Editions** (texto do detalhe).
O nome canônico do projeto está no [README.md](../README.md) — prevalecer sobre o Figma.

---

## 7. Badges e rótulos gráficos

| Elemento | Onde | Medidas | Tokens |
| --- | --- | --- | --- |
| `NFT EM DESTAQUE` | Featured NFT Banner | — | `layout_56d3c81c` |
| `OFERTA LIMITADA` | Featured NFT Banner | — | `layout_56d3c81c` |
| `RARO` | grid mobile P-3 (`15:5419`) | 68 × 32, `radius: 32px` | `Caption/13 Medium` |
| Badge de carrinho | Header (`ELLIPSE`) | — | `Text/Coral`? ⚠️ não confirmado |
| Alça de arrastar | detalhe mobile (`15:5657`) | 56 × 7 | IMAGE-SVG |
| Notch da Tab Bar | `ELLIPSE #15:5507` | 65 × 65 | gradiente Primary inline |

⚠️ **"RARO" e "NFT EM DESTAQUE" / "OFERTA LIMITADA" são as únicas tags de raridade.**
O grid desktop **não tem** badge de raridade, só o mobile (1 de 4 cards).
⚠️ **Não existe** badge de "vendido", "lista" ou "auction" em nenhuma tela.

---

## 8. Ilustrações decorativas sem nome

| Node | Onde | Medidas |
| --- | --- | --- |
| `Mask Group #5:134` | promo Genesis Drops | — |
| `Mask Group #5:130` | promo Curated Art | — |
| `Mask Group #14:5290` | hero mobile | 366 × 190 |
| `RECTANGLE #70410:3799` | Featured NFT Banner (círculo 22×22, borda gradiente **verde**) | 2px, opacity 0.2 |
| `RECTANGLE #70410:3800` | Featured NFT Banner (45×45, gradiente Primary) | — |
| `RECTANGLE #70410:3801` | Featured NFT Banner (15×15, gradiente) | — |
| `Vector #15:5642` | detalhe mobile | — |
| `Vector #15:5427` | grid mobile | — |
| `Vector #70410:3935` | detalhe desktop (botão favoritar) | 20 × 20 |
| `Vector #11:1249` | detalhe desktop (ícone de mensagem) | — |
| `vector 8` / `Vector 2` / `Vector 3` / `Vector 4` | dentro do `shop 1` | — |
| `Ellipse #15:5504` | Tab Bar (fundo 414 × 94.95) | `radius` — |

---

## 9. Escala de imagem e `object-fit`

Todos os `imageRef` usam `scaleMode: FILL`. Padrão de dimensionamento por contexto:

| Contexto | Medida | Raio | Proporção |
| --- | --- | --- | --- |
| Hero desktop | 450 × 450 | 24px | 1:1 |
| Imagem principal do detalhe | 404 × 404 (dentro de 444 com padding 16) | 24px | 1:1 |
| Thumbnail selecionada | 100 × 100 | 8px (+1px borda) | 1:1 |
| Card do grid (A, B, C) | 250 × 250 | 15px | 1:1 |
| Card do grid (D) | 224 × 286 | 13px | **4:5 (retrato)** |
| Card do grid (E, F) | ~250 | 15px | 1:1 |
| NFT em destaque | altura 368 (largura fill) | 22px | variável |
| Promo Genesis | 292 × 250 | 18px | ~7:6 |
| Promo Curated | 287 × 250 | 17px | ~7:6 |
| Blog | altura 195 (largura fill) | — | variável |
| Hero mobile | 138 × 138 | 16px | 1:1 |
| Hero mobile arte 2 | 58 × 58 | 16px | 1:1 |
| Card mobile | 168 × 168 | 16px | 1:1 |
| Hero detalhe mobile | largura fill, altura 356 | 24px | variável |
| Item de carrinho | 70 × 70 (desktop) / 100 × 100 (mobile) | 6px / — | 1:1 |

⚠️ **O card D (`4:280`) é 224 × 286 (retrato 4:5)** enquanto todos os outros são 1:1.
O grid mistura proporções sem `object-fit` declarado.
⚠️ `needsCropping: true` no card mobile P-3 → o Figma está avisando que o crop é forçado.

---

## Limitação de download e atualização da Etapa 6

O inventário original foi produzido sem binários. Na Etapa 6, o download por node ID foi
executado com sucesso:

- 4 raster únicos em PNG, usando os `imageRef` do inventário e node IDs representativos;
- 48 exportações SVG para ícones, ilustrações e backgrounds nomeados;
- manifesto com origem, node IDs, caminhos locais e impedimentos em
  `public/assets/figma/mcp/manifest.json`.

Os impedimentos que permanecem são:

1. O logo não está disponível como arquivo exportável: os nós desktop/footer são aliases
   `EL-*` e os nós mobile são texto. Nenhum logo substituto foi criado.
2. `RARO`, `NFT EM DESTAQUE` e `OFERTA LIMITADA` são composições de texto e formas, não
   arquivos binários independentes.
3. Caixas sem `imageRef` não têm imagem real associada; não foram preenchidas.
4. Uma nova consulta `figma_get_figma_data` retornou `HTTP 429`, com `Retry-After` de
   aproximadamente `393558` segundos. O download funcionou porque os node IDs já estavam
   documentados neste inventário.
5. Na Etapa 7, o download do ornamento do hero desktop `2:104` (IMAGE-SVG de 1200x450)
   não retornou arquivo, enquanto os outros quatro nodes solicitados foram exportados.
   Nenhuma forma CSS ou imagem substituta foi criada para esse ornamento.

⚠️ **O campo `apiImageEndpoint` em `nodes.json` é apenas uma referência de formato e
está incorreto:** a API `GET /v1/images/:key` espera **node ids** no parâmetro `ids`,
não `imageRef`. O `imageRef` só funciona em `GET /v1/files/:key` (via `imageRef` no
JSON) e em `GET /v1/images/:key` usando o **node id** do retângulo.

### Como obter as imagens quando autorizado

Para cada `RECTANGLE` com `imageRef`, usar o **node id** correspondente:

```
GET https://api.figma.com/v1/images/dpcWPY3VTb7slaohK7USmz?ids=<NODE_ID>&format=png&scale=2
Header: X-Figma-Token: <PAT>
```

Os node ids estão em `nodes.json` → `assets.raster[].usedBy[].nodeId`.
Ex.: para o hero desktop, `70342:2673`.

⚠️ Requer PAT com escopo `file_content:read` e está sujeito ao rate limit
(`starter`, `high` tier) já documentado em [README.md](README.md).
