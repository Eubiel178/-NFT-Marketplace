# Componentes

**38 entradas** declaradas no Figma, distribuídas assim:

| Tipo | Quantidade |
| --- | --- |
| `COMPONENT` | 32 |
| `COMPONENT_SET` | 2 |
| `COMPONENT_VARIANT` | 4 |

⚠️ **Limitação importante:** a API de arquivos devolve os componentes com apenas
`id`, `key`, `name` e `type`. **Não é possível extrair a árvore interna** de um componente
pelo dump integral. Tudo que segue abaixo vem de:

1. campos `id`/`key`/`name`/`type` do dump;
2. como cada componente **aparece instanciado** dentro das 15 telas (nome da instância,
   `componentId` explícito quando presente);
3. medidas e estilos dos **nós visíveis** nas telas.

Portanto, a "estrutura interna" abaixo só é detalhada onde a instância **expandiu** seus
nós no dump. Onde aparece apenas `template=EL-*`, isso é sinalizado.

Todos os `key` estão em [nodes.json](nodes.json) → `components[]`.

---

## 1. Componentes estruturais

Os 7 componentes que formam layout. Nenhum deles tem `key` diferente do próprio id nos
dados extraídos (consulte `nodes.json`).

### `Header With Divider` — `70504:3017`

- **Tipo:** `COMPONENT`
- **Usado em:** todas as 5 telas desktop que têm navegação —
  Início `2:2`, Detalhes `10:244`, Carrinho `11:1278`, Pagamento `11:2862`,
  Confirmação `11:4385`, **e também** Login `9:115`, Cadastro `9:1022`,
  Perfil `9:1238`, Carteiras `9:1670` (através de `Marketplace Page`)
- **Estrutura observada** (da tela `2:2`):

```
Header With Divider            [INSTANCE] #70522:3240   template=EL-4ee4fa3f
├── Header Row                 [INSTANCE]  template=EL-0c9fdd92
│   ├── Logo                   [FRAME]  template=EL-f866e5d5
│   ├── navegação (4 itens)    template=EL-*
│   ├── LINE "Active Underline"
│   ├── Search Icon
│   ├── Cart (ícone + badge + contador)
│   └── Login (botão + Iconly/Curved/Logout)
└── LINE divisória
```

- Medida: **1200px** (= `1440 − 2×120`), largura fixa, preenchendo a área de conteúdo.
- ⚠️ Rótulos da navegação, do badge e do botão de login **não extraídos**.

### `Header Row` — `70486:560` (`COMPONENT_SET`)

- **Variantes:**

| Variante | Id | Usada em |
| --- | --- | --- |
| `Active=Home` | `70486:529` | Início `2:2` |
| `Active=Market` | `70486:555` | Detalhes `10:244`, Carrinho `11:1278`, Pagamento `11:2862`, Confirmação `11:4385` |

- ⚠️ Só existem **2** variantes. Telas como Perfil e Carteiras reutilizam a mesma
  `Header Row`, mas **não há `Active=Profile` / `Active=Wallet`** — nenhuma tela tem
  um item de nav marcado como ativo além de Home e Market.
- A variante ativa é sinalizada por uma `LINE` de 2px (`strokeWeight: 2px`) sob o item.

### `Footer` — `70491:1286`

- **Usado em:** Início `2:2`, Detalhes `10:244`, Carrinho `11:1278`,
  Pagamento `11:2862`, Confirmação `11:4385`
- **Estrutura observada:**

```
Footer                         [INSTANCE] #70492:696
├── 3 colunas de links
│   ├── título                 template=EL-bc02c57d
│   ├── 2–3 links              template=EL-*
│   └── RECTANGLE divisor
├── coluna de newsletter (4º bloco)
├── RECTANGLE divisor
└── barra inferior
    ├── Logo
    ├── 4 links                template=EL-*
    └── redes sociais
        ├── Facebook            template=EL-*
        ├── Instagram          template=EL-*
        ├── Twitter            template=EL-*
        ├── Linkedin           template=EL-*
        └── Union              template=EL-*
```

- ⚠️ **Todo** o texto do Footer é alias `EL-*`. Títulos, links, texto do newsletter e
  placeholder do campo de e-mail estão documentados em [pages.md](pages.md#1-desktop--início--22)
  apenas como contagem de nós.

### `Filters` — `70485:381`

- **Usado em:** Início `2:2` (instância `70485:382`) e dentro de `Marketplace Page`
  (Login `9:115`, Cadastro `9:1022`)
- **Medidas:** 310px de largura, `padding: 20px`, `fills: Color/Surface Card`
- **Estrutura observada:**

```
Filters                        [INSTANCE] #70485:382   componentId=70485:381
├── Collections Filter         [FRAME]  9×10px
│   ├── 8× (ELLIPSE + rótulo + contagem)
├── Price Filter
│   ├── Slider
│   │   ├── 2× ELLIPSE
│   │   └── 2× LINE
│   ├── rótulo de faixa ⚠️
│   └── Apply Button ⚠️
└── Network Filter
    └── 3× (rótulo + contagem)
```

- ⚠️ Rótulos de filtro, valores do slider e nome do botão "Aplicar" **não extraídos**.
- ⚠️ **O design não mostra filtro de wallet/tipo/categoria além de Collections, Price e Network.**

### `Checkout Page` — `70504:3190`

- **Usado em:** Pagamento `11:2862` (instância `70522:3321`) e
  Confirmação `11:4385` (instância `70522:3496`)
- **Função:** página de conteúdo que serve de **fundo** para overlays
  (`Page Content (behind overlay)`).
- Estrutura:

```
Checkout Page                  [INSTANCE]
├── Header With Divider        template=EL-*
├── Page Content (behind overlay)   ← único nome legível
│   └── o overlay é irmão deste nó, não filho
└── Footer                     template=EL-*
```

- ⚠️ Só o nome `Page Content (behind overlay)` é legível. Todo o restante da página de
  checkout é alias `EL-*`.
- ⚠️ O overlay de pagamento (tela 4) **não é um componente** — é uma árvore solta dentro
  da tela. Só o overlay de confirmação é nomeado (`Order Confirmation Modal`).

### `Marketplace Page` — `70504:3297`

- **Usado em:** Login `9:115` (instância `70522:3671`) e Cadastro `9:1022` (instância `70522:3841`)
- **Função:** página de marketplace completa usada **somente como fundo** atrás dos modais
  de autenticação. Não é a Home.
- **Estrutura observada:**

```
Marketplace Page               [INSTANCE]   template=EL-7c2a5d08
├── Header With Divider
├── Main Banner
├── Short By
└── Products
    ├── Filters
    └── 11× NFT Auth Artwork 1–11   template=EL-*
```

- ⚠️ `Short By` é o nome de um grupo do design — provavelmente "Shop by [categoria]",
  mas o conteúdo é alias. Não é possível confirmar.
- ⚠️ As 11 artworks usam `NFT Auth Artwork 1..11` — **nomes de arte diferentes dos
  usados na Home** (que usa `NFT Collection Artwork 01/02/04`).
- ⚠️ `Marketplace Page` **não tem variant set** — mas o design precisa de 2 estados
  (o da Home e o "shop by"). O Figma só expõe uma versão.

### `Password Input` — `70504:2973`

- **Usado em:** Login `9:115`, Cadastro `9:1022` (por nome, dentro do template de modal)
  e Perfil `9:1238` (instância visível, 3× para "Alterar senha")
- **Estrutura observada** (via Perfil):

```
Password Input                [INSTANCE]   template=EL-8f2f1080
├── rótulo                    ⚠️ "Senha atual" / "Nova senha" / "Confirmar nova senha"
└── input
    ├── valor mascarado "**********"
    └── Iconly/Light-Outline/Hide   #9:1592   (17×15.8)
```

- No modal de Login (`9:115`) a **estrutura é diferente**: o `Password Input` aparece com
  `layout_ff84fc38` (padding `12px 16px`, altura 40px), `radius: 5px` e
  **`stroke: fill_982f3e54` (=#D28A4C, ou seja `Color/Primary`)** — borda laranja,
  enquanto o email usa o template padrão.
- ⚠️ **Os dois "Hide" são componentes diferentes:**
  `Iconly/Curved/Hide` `9:964` (login/cadastro, 20×20) e
  `Iconly/Light-Outline/Hide` `9:1592` (perfil, 17×15.8).
- ⚠️ Altura do input: **40px** no desktop, **50px** no mobile (`layout_329f2220`).
- ⚠️ Sem estado de "erro" ou "força da senha" no design.

### `Mobile Social Block` — `70504:2994`

- **Usado em:** Login `16:1022` (instância `70522:3186`) e Cadastro `16:1228` (instância `70522:3213`)
- **Estrutura observada:**

```
Mobile Social Block            [INSTANCE]
├── LINE
├── TEXT (separador)           ⚠️ ("Ou entre com")
├── LINE
└── 2× Social Button
    ├── google 1               template=EL-40488527
    └── facebook 1             template=EL-16148383
```

- ⚠️ O texto do separador **não extraído**.
- ⚠️ **Não há ícone de Apple / Twitter / GitHub** — só Google e Facebook.
- ⚠️ O **desktop** usa `Social Button` diretamente (não este componente), e o Figma
  **não define** se o separador diz "Ou entre com" ou "Ou cadastre-se com" (varia por tela).

### `Social Button` — `70483:263` (`COMPONENT_SET`)

- **Variantes:**

| Variante | Id | Usada em |
| --- | --- | --- |
| `Provider=Google` | `70483:256` | Login `9:115` (`70484:260`), Cadastro `9:1022` (`70484:276`) |
| `Provider=Facebook` | `70483:262` | Login `9:115` (`70484:240`), Cadastro `9:1022` (`70484:245`) |

- No desktop: `#70402:3572` (Login) e `#70402:3596` (Cadastro), ambos
  `padding: 0px 80px`, `gap: 12px` (Login) e `gap: 16px` (Cadastro).
- ⚠️ **Só 2 provedores.** O mobile usa os mesmos ícones mas via template `EL-*`
  (`EL-40488527`, `EL-16148383`), **não** as variantes do set.
  → **Desktop e mobile usam botões de rede social diferentes.**

---

## 2. Ícones (25 componentes)

Todos `COMPONENT` sem variantes. Nenhum tem props — são apenas vetores.

### Navegação / setas (6)

| Id | Nome | Usado em | Medidas |
| --- | --- | --- | --- |
| `4:153` | `Iconly/Two-tone/Arrow - Down 2` | Início `2:2` (sort) | 16×16 |
| `4:149` | `Iconly/Two-tone/Arrow - Down 2` | ⚠️ **não instanciado em nenhuma tela** | — |
| `9:1589` | `Arrow-Down` | Perfil `9:1238`, Carteiras `9:1670`, e dentro do overlay de Pagamento `11:2862` | 18×18 |
| `4:393` | `Iconly/Curved/Arrow - Right 2` | Início `2:2` (paginação), e os dois Promo Cards | 16×16 |
| `5:100` | `Iconly/Curved/Arrow - Right` | Mobile Início `14:5226` (CTA hero) | 16×16 |
| `15:5746` | `Iconly/Curved/Arrow - Left 2` | Detalhes mobile `15:5536` (botão voltar) | 20×20 |

⚠️ **`4:153` e `4:149` têm o mesmo nome e provavelmente o mesmo desenho** — componente
duplicado no Figma. Só `4:153` é usado.
⚠️ **Três** ícones de seta para a direita/baixo com nomes quase idênticos
(`Arrow - Right 2`, `Arrow - Right`, `Arrow-Down`, `Arrow - Down 2`) — padronizar.

### Interface (9)

| Id | Nome | Usado em | Medidas |
| --- | --- | --- | --- |
| `2:36` | `Iconly/Curved/Logout` | Login `9:115` (botão Login do header), Perfil `9:1238` (Sair), Carteiras `9:1670` (Sair) | 20×20 |
| `9:947` | `X` | Confirmação `11:4385`, Login `9:115`, Cadastro `9:1022` | 18×18 / 18×17.35 |
| `11:1192` | `Iconly/Bold/Star` | Detalhes mobile `15:5536`; no desktop a avaliação usa `Iconly/Bold/Star` via template `EL-e487a1a2` | 18×18 |
| `15:5331` | `Search` | Início mobile `14:5226` | 18.33×18.33 |
| `15:5313` | `Iconly/Curved/Filter` | Início mobile `14:5226` (botão de filtro) | 20×20 |
| `9:964` | `Iconly/Curved/Hide` | Login/Cadastro mobile `16:1022`/`16:1228`, Login/Cadastro desktop | 20×20 |
| `9:1592` | `Iconly/Light-Outline/Hide` | Perfil `9:1238` (3×) | 17×15.8 |
| `9:1550` | `Iconly/Curved/Image 2` | Perfil `9:1238` (upload de avatar) | 24×24 |
| `23:1373` | `Iconly/Curved/Wallet` | Pagamento mobile `16:748` (opção Coinbase Wallet) | 24×24 |

⚠️ `Iconly/Curved/Hide` e `Iconly/Light-Outline/Hide` são **o mesmo conceito com
estilos diferentes** — deveria ser unificado em um único componente.

### Conta / perfil (7)

| Id | Nome | Usado em |
| --- | --- | --- |
| `9:1443` | `User` | Perfil `9:1238` (sidebar) |
| `15:5522` | `User` | Tab Bar mobile `14:5226` |
| `9:1651` | `Iconly/Light-Outline/Location` | Perfil `9:1238`, Carteiras `9:1670` |
| `9:1467` | `Iconly/Curved/Activity` | Perfil `9:1238`, Carteiras `9:1670` |
| `9:1477` | `Iconly/Curved/Download` | Perfil `9:1238`, Carteiras `9:1670` |
| `9:1487` | `Iconly/Curved/Danger Triangle` | Perfil `9:1238`, Carteiras `9:1670` |
| `11:1248` | `Message` | Detalhes `10:244` (compartilhar) |

⚠️ **`User` existe duas vezes** (`9:1443` e `15:5522`) — desktop e mobile.
Provavelmente o mesmo vetor duplicado.

### Ações de item (3)

| Id | Nome | Usado em | Medidas |
| --- | --- | --- | --- |
| `11:2030` | `Iconly/Curved/Delete` | Carrinho mobile `16:360` (só o item 3) | 24×24 |
| `15:5516` | `Iconly/Bold/Home` | Tab Bar mobile `14:5226` | 20×20 |
| `15:5524` | `Shop` | Tab Bar mobile `14:5226`, Detalhes mobile `15:5536` (botão carrinho) | 20×20 |

⚠️ **`Iconly/Curved/Delete` só aparece em UM item do carrinho mobile** (o item 3, que
também é o selecionado). No desktop **não há ícone de remover em nenhum item** —
só o stepper. → **Inconsistência: não há como remover item do carrinho no desktop.**

---

## 3. Componentes que **não existem** no Figma

Identificados por reuso de `template=EL-*` em telas diferentes. **Estes são os
primeiros candidatos a组件ização:**

| Padrão repetido | Onde aparece | `template` |
| --- | --- | --- |
| Card de NFT do grid | Início desktop, Detalhes, Carrinho (×2) | `EL-58c59944`, `EL-ffd4256b`, `EL-b4be263e`, `EL-a0112c2b`, `EL-312a8cc3` |
| Card de NFT mobile | Início mobile | `EL-5569641f` |
| Promo Card | Início desktop (×2) | `EL-1655bc96` |
| Blog Card | Início desktop (×4) | `EL-e19c9b12` |
| Pagination item | Início desktop (4×) | `EL-47e13f90` |
| Input de texto (email/username/address) | Login, Cadastro, Perfil, Carteiras, Carrinho | `EL-5323f1d1`, `EL-8f2f1080`, `EL-6f779a3e`, `EL-5ac9eff6` |
| Avatar / upload | Perfil `9:1238` | inline |
| Slider | Filtro de preço | inline |
| Badge de raridade "RARO" | Início mobile | inline |
| Radio/checkbox (wallet, carteira secundária) | Pagamento mobile, Carteiras | `EL-29748c50`, `EL-8b1099bd`, inline |
| Botão primário (CTA) | 12 telas | `EL-99483cc9`, `layout_5841ee2b`, `layout_66f02499`, `layout_71d785bb` |
| `Add Button` (stepper) | Detalhes, Carrinho, Detalhes mobile | `EL-9e206f71` |
| Carousel dots | Detalhes, Carrinho | `EL-eda14dc5`, `EL-ad3672e9` |
| `NFT Receipt Artwork` (item de resumo) | Pagamento (×3), Confirmação (×3) | template idêntico nos dois lugares |

⚠️ **O botão primário tem 4 "layouts" diferentes** (`EL-99483cc9`, `layout_5841ee2b`,
`layout_66f02499`, `layout_71d785bb`) com raios distintos (3px, 5px, 10px, 40px) →
**não há um componente `Button` no Figma.**

---

## 4. Recomendações de componentização (Fase 1)

1. **`Button`** com variantes `primary` / `secondary` / `ghost` e `size: sm (40px) | md (50px) | lg (60px)`.
   Unificar os 4 layouts existentes.
2. **`Input`** com variantes `text` / `password` / `select` / `promo`, `size: sm (40px) | md (50px)`,
   e estados `default` / `focus` (borda Primary) / `error`.
3. **`NftCard`** com variantes de tamanho (`sm` 212px, `md` 250px, `lg` mobile 168px)
   e `hasDiscount`.
4. **`Header`** com `active: 'home' | 'market' | null`, `cartCount`, `user`.
5. **`TabBar`** com `active: 'home' | 'cart' | 'action' | 'shop' | 'user'`.
6. **`Modal`** com `size: sm (500px) | md (578px)`, `variant: auth | confirm`.
7. **`WalletSelector`** — unificar o padrão de seleção mobile (ícone filled vs. circle)
   e o grid de 3 opções.
8. **`Stepper`** — unificar `Add Button` + contador (desktop 49.5px, mobile ~50px).
9. **Promover `Filters`, `Footer`, `Header With Divider`, `Checkout Page`, `Marketplace Page`
   para variações documentadas** — hoje só `Header Row` e `Social Button` têm variants.
10. **Eliminar duplicatas de ícone:** `4:149`, `15:5522` vs. `9:1443`,
    `9:964` vs. `9:1592`, `4:393` vs. `5:100`.