# Design Tokens

Todos os tokens abaixo foram extraídos das **variáveis globais** do arquivo Figma
(seção `GLOBAL_VARS` do dump). Valores machine-readable em
[nodes.json](nodes.json) → `designTokens`.

> **Nenhum arquivo do projeto foi alterado.** Este documento é apenas referência para a
> Fase 1.

---

## 1. Cores — 12 tokens

O Figma **não tem** tokens de cor para `transparent`, `white`, `black` nem para estados
(`hover`, `focus`, `disabled`, `error`, `success`). Esses precisam ser criados.

| Token | Hex | Uso observado no Figma |
| --- | --- | --- |
| `Color/Ink` | `#140D0A` | Fundo de **todos** os 9 frames desktop |
| `Color/Foreground` | `#F5F1EB` | Texto principal sobre `Ink`; fundo do card 4 do Blog |
| `Color/Primary` | `#D28A4C` | CTA `EXPLORAR`, `COMPRAR`, item de paginação ativo, borda de input em foco |
| `Color/Secondary` | `#B39463` | **Não usado diretamente** — só via gradientes |
| `Color/Surface Card` | `#241612` | Cards, sidebar de filtro, inputs, modais, Tab Bar, wallet cards |
| `Color/Surface Dark` | `#38220F` | **Não aparece em nenhum nó** — declarado e não usado |
| `Color/Surface Raised` | `#2F1D15` | Botões circulares sobre imagem (favoritar, voltar, avatar) |
| `Color/Border` | `#3F2319` | Borda de thumbnails, item de paginação, radio não selecionado |
| `Color/Border Soft` | `#55321F` | Borda do circle não selecionado na seleção de wallet |
| `Text/Accent` | `#E89B55` | **Não aparece diretamente** — é a origem do gradiente `fill_928da933` |
| `Text/Secondary` | `#CFB28C` | **Não aparece diretamente** em nenhum nó |
| `Text/Coral` | `#F0805F` | **Não aparece diretamente** em nenhum nó |

⚠️ **4 dos 12 tokens de cor estão declarados e nunca usados:**
`Color/Surface Dark`, `Text/Accent`, `Text/Secondary`, `Text/Coral`.
⚠️ `Color/Secondary` (`#B39463`) só aparece como ponta de gradiente.

### Cores literais fora dos tokens

O Figma usa **1 cor literal** que deveria ser token:

| Valor | Onde | Observação |
| --- | --- | --- |
| `#0A0604` (com alfa em sombras) | 5 efeitos de sombra | É a cor base de todas as sombras |

⚠️ Nenhuma cor fora dos 12 tokens foi encontrada em `fills`/`strokes` de nós nomeados —
o design é **100% tokenizado** em cores.

---

## 2. Gradientes — 4 globais + 5 inline

### Globais (variáveis do Figma)

| Alias | CSS | Uso |
| --- | --- | --- |
| `fill_928da933` | `linear-gradient(145deg, rgba(210,138,76,0.3) 0%, rgba(210,138,76,0) 100%)` | Glow decorativo 45×45 do `Featured NFT Banner` |
| `fill_af2f5fc9` | `linear-gradient(135deg, #241612 0%, #2F1D15 100%)` | Fundo do card mobile, hero do detalhe mobile |
| `fill_4399d4cf` | `linear-gradient(137deg, rgba(210,138,76,1) 0%, rgba(210,138,76,0.8) 100%)` | **CTA principal de checkout** |
| `fill_73ba89d3` | `linear-gradient(144deg, #241612 0%, #241612 100%)` | Item de carrinho mobile em foco |

⚠️ `fill_73ba89d3` é **visualmente um sólido** (mesma cor nos dois stops) —
provavelmente resto de um gradiente não limpo.

### Inline (5 — não foram tokenizados no Figma)

| Onde | CSS | Medidas |
| --- | --- | --- |
| `Featured NFT Banner` `#70410:3791` (fundo) | `linear-gradient(180deg, rgba(210,138,76,0.1) 0%, rgba(210,138,76,0.03) 100%)` | 310 × 470 |
| `RECTANGLE` `#70410:3799` (**stroke**, não fill) | `linear-gradient(141deg, rgba(70,163,88,1) 0%, rgba(70,163,88,0) 100%)` | 22×22, 2px, `opacity: 0.2`, `radius: 7px` |
| Botão de filtro mobile `#70410:4122` | `linear-gradient(137deg, rgba(210,138,76,0.45) 0%, rgba(210,138,76,1) 100%)` | 45×45, `radius: 14px` |
| Notch da Tab Bar `ELLIPSE #15:5507` | `linear-gradient(180deg, rgba(210,138,76,0.4) 0%, rgba(210,138,76,1) 100%)` | 65×65 |
| Botão "Aplicar" do cupom `#70410:4215` | `linear-gradient(144deg, rgba(210,138,76,0.54) 0%, rgba(210,138,76,1) 100%)` | 97×50, `radius: 40px` |

⚠️ **5 gradientes inline** que deveriam ser tokens — 4 deles usam `Color/Primary`
com alfa variável (0.03, 0.4, 0.45, 0.54, 0.1).
⚠️ **O botão de filtro mobile e o "Aplicar" do cupom mobile usam gradiente Primary,
enquanto os botões desktop são sólidos** — ver tabela abaixo.

### Cor fora dos tokens: `#46A358` (verde)

Aparece **apenas** no stroke do círculo decorativo `#70410:3799`, dentro do
`Featured NFT Banner`. Não está declarado como token global.

- Hex: `rgb(70,163,88)` → **`#46A358`**
- Usos: 1 (`rgba(70,163,88,1)`) + 1 (`rgba(70,163,88,0)` no segundo stop)

⚠️ É a **única cor do design que não está tokenizada** e não tem nome.
Como é usada em um elemento de destaque/oferta, provavelmente deveria existir um token
semântico (`Color/Accent` ou `Color/Rarity`) — mas **não é possível confirmar a intenção**
pelo dump.

### Inconsistência de CTA / botões

| Contexto | Fill | Raio |
| --- | --- | --- |
| Hero desktop `EXPLORAR` | `Color/Primary` sólido | 6px |
| Detalhe desktop `COMPRAR` | `Color/Primary` sólido | 6px |
| Hero mobile `EXPLORAR` | **sem fill** (só texto + ícone) | — |
| Botão de filtro mobile | gradiente Primary `0.45 → 1` | 14px |
| "Aplicar" cupom mobile | gradiente Primary `0.54 → 1` | 40px |
| Comprar NFT (detalhe mobile) | `fill_4399d4cf` (gradiente) | 40px |
| Confirmar compra (pagamento mobile) | `fill_4399d4cf` (gradiente) | 40px |
| Conectar e finalizar (carrinho mobile) | `fill_4399d4cf` (gradiente) | 40px |
| Conectar e finalizar (carrinho desktop) | `layout_5841ee2b` (alias) | 3px |

⚠️ **O CTA principal tem 3 tratamentos diferentes** (sólido 6px, gradiente 40px, sem fill)
e outros 2 botões mobile usam gradientes Primary com alfa diferente.
Precisa ser unificado em 1 componente `Button variant="primary"`.

---

## 3. Tipografia

**76 estilos de texto** declarados como variáveis globais. Todos usam
`fontFamily: Roboto Mono` — **fonte única**, sem fallback declarado.

### Pesos

| Peso | Estilos | Uso |
| --- | --- | --- |
| `700` (Bold) | 29 | Títulos, CTA, preços, labels |
| `400` (Regular) | 34 | Corpo, parágrafos, captions, placeholders |
| `500` (Medium) | 13 | Labels de formulário, tabs, review |

### Escala de tamanho

16 tamanhos distintos: `9, 10, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 24, 28, 32, 43`

⚠️ A escala **não é uniforme** — há 6 tamanhos ímpares consecutivos (`13,15,17,21`)
misturados com pares (`12,14,16,18,20,22`). Isso é sinal de que os estilos foram
criados ad-hoc, não de uma escala tipográfica real.

### Line heights

5 valores em uso: `10, 15, 16, 18, 20, 22, 24, 30, 40, 45, auto` (11 distintos).
⚠️ `lh 40` e `lh 45` aparecem com `Body/15` — provavelmente line-height acidental
em vez de altura de container.

### Letter spacing

| Valor | Estilos |
| --- | --- |
| (não definido) | 72 |
| `0.1em` | 3 — `Body/14 Bold · lh auto`, `Body/14 Medium · lh 16`, `Display/32 Bold` |
| `0.0111em` | 1 — `Tiny/9 Bold` |

⚠️ `0.1em` é **muito** amplo para Roboto Mono (10% do tamanho). Só 3 estilos usam.
⚠️ `Display/32 Bold` tem `ls 0.1em` mas `Display/43 Bold` **não tem** → o único par
de display tem tracking inconsistente.

### Mapa de estilos por função

| Família | Tamanhos | Onde é usado |
| --- | --- | --- |
| `Display` | 32, 43 | Título do hero desktop (`Display/43 Bold`), ícones/variantes |
| `Heading` | 24, 28 | Título do NFT no detalhe desktop (`Heading/28 Bold`) |
| `Title` | 20, 21, 22 | `Title/22 Bold` (preço no detalhe desktop), `Title/20 Bold` (títulos de seção e sheet mobile), `Title/20 Medium` (abas do modal), `Title/21 Regular` (item de menu) |
| `Body Large` | 16, 17, 18 | Nomes e preços de NFT (`16 Bold`), seção "Detalhes do NFT" (`17 Bold`), preço promocional (`18 Bold`) |
| `Body` | 14, 15 | Corpo (`14 Regular · lh 24`), labels (`15 Bold`), breadcrumb (`15 Bold`) |
| `Caption` | 12, 13 | Placeholders (`12 Regular`), badges (`12 Bold`, `13 Medium`) |
| `Tiny` | 9, 10 | `Tiny/9 Bold` (ls 0.0111em), `Tiny/10 Medium` |

⚠️ **7 tamanhos para corpo de texto** (`12,13,14,15,16,17,18`) — o design mistura
`Body/14` e `Body Large/16` para o **mesmo** papel (nome de NFT aparece como
`Body Large/16` no grid e `Body/15` no carrinho).

### Estilos sem nome

| Estilo | Tamanho | Peso | Problema |
| --- | --- | --- | --- |
| `style_125a5a15` | 12px | 500 | Nome não descritivo |
| `style_7b9d1ac4` | 18px | 400 | Nome não descritivo |
| `textStyle` | 12px | 400 | Nome literal `textStyle` |

⚠️ São **estilos órfãos** (não há nó que os referencie por nome legível).

### Lista completa dos 76 estilos

Ordenados por tamanho. Formato: `tamanho · peso · nome · alinhamento`

| px | Peso | Nome | Align |
| --- | --- | --- | --- |
| 9 | 700 | `Tiny/9 Bold` (ls 0.0111em) | LEFT |
| 10 | 500 | `Tiny/10 Medium` | LEFT |
| 12 | 400 | `textStyle` | LEFT |
| 12 | 500 | `style_125a5a15` | LEFT |
| 12 | 700 | `Caption/12 Bold` | LEFT |
| 12 | 400 | `Caption/12 Regular · lh 16` | LEFT |
| 12 | 400 | `Caption/12 Regular · lh 16 (70321:362)` | CENTER |
| 12 | 400 | `Caption/12 Regular · lh 18` | LEFT |
| 13 | 500 | `Caption/13 Medium` | CENTER |
| 13 | 500 | `Caption/13 Medium (70321:360)` | LEFT |
| 13 | 400 | `Caption/13 Regular · lh 16` | CENTER |
| 13 | 400 | `Caption/13 Regular · lh 16 (70321:359)` | LEFT |
| 13 | 400 | `Caption/13 Regular · lh 22` | LEFT |
| 14 | 700 | `Body/14 Bold · lh 16` | LEFT |
| 14 | 700 | `Body/14 Bold · lh 16 (70321:354)` | CENTER |
| 14 | 700 | `Body/14 Bold · lh 20` | LEFT |
| 14 | 700 | `Body/14 Bold · lh 24` | LEFT |
| 14 | 700 | `Body/14 Bold · lh auto` (ls 0.1em) | LEFT |
| 14 | 700 | `Body/14 Bold · lh auto · ls 0%` | LEFT |
| 14 | 500 | `Body/14 Medium · lh 16` (ls 0.1em) | LEFT |
| 14 | 500 | `Body/14 Medium · lh 16 · ls 0%` | CENTER |
| 14 | 500 | `Body/14 Medium · lh 16 · ls 0% (70321:347)` | LEFT |
| 14 | 500 | `Body/14 Medium · lh 20` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 15` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 16` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 16 (70321:351)` | CENTER |
| 14 | 400 | `Body/14 Regular · lh 22` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 22 (70321:348)` | CENTER |
| 14 | 400 | `Body/14 Regular · lh 24` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 24 (70321:346)` | RIGHT |
| 14 | 400 | `Body/14 Regular · lh 30` | LEFT |
| 14 | 400 | `Body/14 Regular · lh 30 (70321:350)` | CENTER |
| 15 | 700 | `Body/15 Bold · lh 15` | LEFT |
| 15 | 700 | `Body/15 Bold · lh 16` | LEFT |
| 15 | 700 | `Body/15 Bold · lh 16 (70321:340)` | CENTER |
| 15 | 700 | `Body/15 Bold · lh 40` | RIGHT |
| 15 | 500 | `Body/15 Medium` | LEFT |
| 15 | 400 | `Body/15 Regular · lh 15` | LEFT |
| 15 | 400 | `Body/15 Regular · lh 16` | LEFT |
| 15 | 400 | `Body/15 Regular · lh 40` | LEFT |
| 15 | 400 | `Body/15 Regular · lh 40 (70321:338)` | RIGHT |
| 15 | 400 | `Body/15 Regular · lh 45` | LEFT |
| 16 | 700 | `Body Large/16 Bold · lh 16` | LEFT |
| 16 | 700 | `Body Large/16 Bold · lh 16 (70321:334)` | CENTER |
| 16 | 700 | `Body Large/16 Bold · lh 20` | LEFT |
| 16 | 700 | `Body Large/16 Bold · lh auto` | LEFT |
| 16 | 500 | `Body Large/16 Medium · lh 16` | LEFT |
| 16 | 500 | `Body Large/16 Medium · lh auto` | LEFT |
| 16 | 400 | `Body Large/16 Regular · lh 10` | LEFT |
| 16 | 400 | `Body Large/16 Regular · lh 16` | LEFT |
| 16 | 400 | `Body Large/16 Regular · lh 16 (70321:332)` | RIGHT |
| 16 | 400 | `Body Large/16 Regular · lh auto` | LEFT |
| 17 | 700 | `Body Large/17 Bold` | LEFT |
| 17 | 700 | `Body Large/17 Bold (70321:325)` | CENTER |
| 17 | 400 | `Body Large/17 Regular · lh 10` | LEFT |
| 17 | 400 | `Body Large/17 Regular · lh 16` | LEFT |
| 18 | 700 | `Body Large/18 Bold · lh 16` | LEFT |
| 18 | 700 | `Body Large/18 Bold · lh 16 (70321:319)` | RIGHT |
| 18 | 700 | `Body Large/18 Bold · lh 24` | RIGHT |
| 18 | 500 | `Body Large/18 Medium` | LEFT |
| 18 | 400 | `Body Large/18 Regular` | LEFT |
| 18 | 400 | `Body Large/18 Regular (70321:320)` | RIGHT |
| 18 | 400 | `style_7b9d1ac4` | LEFT |
| 20 | 700 | `Title/20 Bold · lh 16` | LEFT |
| 20 | 700 | `Title/20 Bold · lh 16 (70321:317)` | RIGHT |
| 20 | 500 | `Title/20 Medium` | LEFT |
| 20 | 400 | `Title/20 Regular · lh 10` | LEFT |
| 21 | 400 | `Title/21 Regular` | LEFT |
| 22 | 700 | `Title/22 Bold` | LEFT |
| 22 | 400 | `Title/22 Regular` | RIGHT |
| 22 | 400 | `Title/22 Regular (70321:311)` | LEFT |
| 24 | 700 | `Heading/24 Bold` | CENTER |
| 24 | 700 | `Heading/24 Bold (70321:307)` | LEFT |
| 28 | 700 | `Heading/28 Bold` | LEFT |
| 32 | 700 | `Display/32 Bold` (ls 0.1em) | CENTER |
| 43 | 700 | `Display/43 Bold` | LEFT |

⚠️ **20 dos 76 estilos** são variantes de alinhamento (`LEFT`/`CENTER`/`RIGHT`) do **mesmo**
par tamanho/peso — isso é ruído de estilo, não necessidade de design.
Ex.: `Body/14 Regular · lh 16` (LEFT), `(70321:351)` (CENTER), `(70321:346)` (RIGHT).

**Recomendação:** reduzir para ~16 tokens (Display, Heading, Title, Body Large, Body,
Caption, Tiny × 2 pesos), com `text-align` como propriedade, não como estilo separado.

---

## 4. Espaçamento

### Gaps (frequência no Figma)

| Gap | Ocorrências | Uso típico |
| --- | --- | --- |
| `10px` | 53 | Gap padrão interno de cards, promo, blog, tab bar |
| `12px` | 18 | Gap padrão de seções (Products, Cart, Details) |
| `16px` | 10 | Gap raiz dos frames mobile, gap de grid de blog |
| `8px` | 6 | Stepper, paginação, grid do carrinho |
| `32px` | 4 | Grid de relacionados, gap entre linhas do blog |
| `48px` | 3 | Coluna filtros × grid, gap entre linhas do grid (72px no desktop real) |
| `20px` | 3 | Gap entre abas |
| `6px` | 3 | Gap entre nome e preço no card |
| `24px` | 3 | Gap de seções internas, padding de grid |
| `4px` | 2 | Gap raiz do carrinho mobile |
| `40px` | 2 | Gap do footer, gap do menu |
| `44px` | 1 | Gap da coluna de texto do hero |
| `88px` | 1 | Gap entre linhas do grid de produtos (desktop) |
| `72px` | 1 | Gap entre linhas (Related Products) |
| `28px` | 1 | Gap do rodapé da linha de thumbnails |
| `-114px` | 1 | **Overlap do sheet sobre o hero (detalhe mobile)** |

**Escala de spacing:** `4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 44, 48, 72, 88`

⚠️ `44`, `72`, `88` e `-114` são **fora** de qualquer escala de 4px.
`88 = 2 × 44` e `72 = 3 × 24`. Sugestão: manter `4,6,8,12,16,24,32,48,64,88`.

### Paddings de frame raiz

| Frame | Padding |
| --- | --- |
| 9 frames desktop | `24px 120px` (Login/Cadastro: `24px 120px 0px`) |
| 6 frames mobile | `40px 24px 0px`, `32px 0px 0px`, `32px 28px`, `80px 28px 24px`, `—` (detalhe, usa gap negativo) |

### Paddings de componente mais comuns

| Padding | Onde |
| --- | --- |
| `0px 16px` | Avatar, item de blog |
| `16px` | Thumbnail/main image do detalhe |
| `20px` | `Filters`, item de blog |
| `24px` | Modais, `Promo Input`, sheet mobile |
| `0px 80px` | Bloco de redes sociais (desktop) |
| `10px 36px 10px 28px` | CTA `EXPLORAR` desktop |
| `20px 44px 20px 48px` | `Comprar NFT` mobile |
| `24px 24px 36px` | Buy Bar mobile |
| `20px 44px 48px` | `Transaction Details` |
| `32px 24px 24px` | `Details Sheet` mobile |
| `12px 129px 12px 12px` | Input de busca mobile (padding direito para o botão de filtro) |
| `0px 8px 140px 133px` | Botão de favoritar dentro do card mobile |

⚠️ `0px 8px 140px 133px` é um **hack de posicionamento** (empurrar o botão para o
canto inferior direito) — deve virar posicionamento absoluto real.

---

## 5. Raios

**21 valores distintos** em uso. Top 10 por frequência:

| Raio | Ocorrências | Uso |
| --- | --- | --- |
| `40px` | 12 | Frame mobile, Tab Bar, CTA de checkout, Buy Bar, `Payment Summary` |
| `6px` | 11 | CTA desktop, thumbnail, main image, badge de review |
| `0px` | 10 | Wrapper de badge, `layout` sem raio |
| `10px` | 9 | Input de busca mobile, inputs de login/cadastro mobile |
| `14px` | 9 | Botão de filtro mobile, avatar upload, card mobile |
| `15px` | 7 | Arte de NFT no grid |
| `16px` | 7 | Input de busca mobile, pill de edição, artwork mobile, hero mobile |
| `14px` (variante `"14px"`) | 4 | — |
| `24px` | 3 | Arte principal do detalhe, hero artwork, `Mobile NFT Artwork` |
| `13px` | 3 | Arte de NFT em card |

Lista completa: `0, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 17.5, 18, 20, 22, 24, 25, 29, 31, 32, 40`

⚠️ **25 valores** para raio. `17.5px` e `31px` são derivados (`35/2`, `31` do sheet).
⚠️ `29px` aparece em "badge/avatar sobreposto ao NFT em destaque" — raio arbitrário.
⚠️ Raio `0px` explícito em 10 nós (badges com `layout` wrapper).

**Escala de raio sugerida:** `0, 4, 6, 8, 10, 16, 20, 24, 32, 40` (10 valores).

### Raios por contexto

| Elemento | Raio |
| --- | --- |
| Frame mobile | `40px` (topo, para simular notch) |
| Tab Bar | `40px 40px 0 0` |
| Buy Bar (detalhe mobile) | `40px 40px 0 0` |
| Payment Summary (carrinho mobile) | `40px 40px 0 0` |
| Details Sheet (detalhe mobile) | `31px 31px 0 0` |
| Sign Up Modal | `8px` |
| Card NFT mobile | `20px` |
| Card NFT desktop | `8px`–`17px` (inconsistente) |
| CTA principal mobile | `40px` (pill) |
| CTA principal desktop | `6px` |
| Item de paginação | `4px` |
| Botão circular 35px | `17.5px` |
| Avatar upload 50px | `25px` |
| Pill de avaliação | `32px` |
| Button de busca | `10px` |

---

## 6. Sombras — 2 tokens + 3 inline

| Alias | CSS | Uso |
| --- | --- | --- |
| `effect_12da039e` | `0 6px 20px 0 rgba(10,6,4,0.45)` | Item de carrinho mobile em foco |
| `effect_e368b9ba` | `0 0 20px 0 rgba(10,6,4,0.45)` | Buy Bar do detalhe mobile |
| *(inline)* | `0 -10px 30px 0 rgba(10,6,4,0.45)` | Tab Bar mobile (elevação para cima) |
| *(inline)* | `0 20px 20px 0 rgba(10,6,4,0.45)` | Wallet card "Reserva" (selecionada) |
| *(inline)* | `0 0 40px 0 rgba(10,6,4,0.45)` | Opção "Coinbase Wallet" (selecionada) |

⚠️ **Todas as 5 sombras usam a mesma cor** `#0A0604` com alfa `0.45`. Diferem só em
offset/blur. Faltam tokens de sombra para:
- foco de input (`border` Primary já é usado)
- hover de card
- modal (`Sign In/Sign Up` **não tem sombra** — só o scrim)

⚠️ As duas sombras de wallet selecionada (`0 20px 20px` e `0 0 40px`) têm **offsets
conflitantes** para o mesmo estado visual "selecionado".

---

## 7. Movimento (ausente)

⚠️ **O Figma não tem nenhuma propriedade de transição, duração ou easing.**
Não é possível extrair:
- duração de hover/press
- curva de animação de modal (fade, scale, slide)
- comportamento do bottom sheet (drag)
- timing de skeleton/loading

Tudo isso precisa ser **definido na Fase 1** como decisão de projeto, não extraído.

---

## 8. Ícones

- **25 componentes de ícone** declarados (ver [components.md](components.md#2-ícones-25-componentes)).
- Fontes de ícone: `Iconly/Curved`, `Iconly/Bold`, `Iconly/Light-Outline`,
  `Iconly/Two-tone` + ícones avulsos (`heart 1`, `shopping 1`, `Search`, `Shop`, `User`,
  `X`, `Back`, `Message`, `Linkedin`, `Twitter`, `Frame`, `Vector`, `Group`,
  `thank-you 1`, `Mask Group`, `Star`).
- **84 ocorrências** de vetores nomeados no arquivo.

⚠️ Iconly tem **4 pesos** em uso (`Curved`, `Bold`, `Light-Outline`, `Two-tone`) —
o mesmo ícone conceitual existe em pesos diferentes:
`Arrow - Down 2` (Two-tone) vs `Arrow-Down` (Curved);
`Hide` (Curved) vs `Hide` (Light-Outline);
`Star` (Bold) em todos os lugares.

⚠️ Ícones avulsos com nome de layer do Figma (`Vector`, `Frame`, `Vector 13 (Stroke)`,
`Vector 37 (Stroke)`, `Vector 139 (Stroke)`, `Ellipse 2 (Stroke)`) **não são reutilizáveis**
— precisam ser renomeados no Figma antes da implementação.

---

## 9. Resumo de pendências de token

| # | Pendência | Impacto |
| --- | --- | --- |
| 1 | Criar tokens de estado (`hover`, `focus`, `disabled`, `error`, `success`) | Bloqueia a Fase 1 — o design não tem nenhum |
| 2 | Reduzir 76 → ~16 estilos de texto | Ruído alto; 20 são só `text-align` |
| 3 | Definir escala de spacing (remover `44`, `72`, `88`, `-114`) | Consistência |
| 4 | Reduzir 25 → ~10 raios | Consistência |
| 5 | Tokenizar as 5 sombras + criar sombra de modal | Estados de UI |
| 6 | Unificar CTA em 1 componente (sólido/gradiente/sem-fill) | Inconsistência visível |
| 7 | Remover ou usar os 4 tokens de cor órfãos | Hygiene |
| 8 | Definir tokens de movimento (duração/easing) | Ausente no Figma |
| 9 | Renomear ícones com nome de layer | Bloqueia reuso |
| 10 | Declarar fallback de fonte (`Roboto Mono, monospace`) | Robustez |