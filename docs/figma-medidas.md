# Medidas contra o Figma — layout global

Data: 04/10/2026. Referências: `figma/Desktop/Início.png` (1440×3668) e `figma/Mobile/Início.png` (414×896).

## Método

- **Captura do app:** build de demonstração (`npm run build:demo`), Chromium do Playwright, `deviceScaleFactor` 1, fonte Roboto Mono carregada (`document.fonts.ready`).
- **Header:** página inicial em 1440×900, com 6 unidades no carrinho do visitante, para o badge mostrar o mesmo "6" do Figma.
- **Footer:** página inteira em 1440. A posição vertical é relativa ao topo do bloco do footer, porque a altura da página (Fase 3) desloca o footer: no Figma o bloco começa em y=3034, no app em y=2945.
- **Tab bar:** viewport de 414×896, a mesma do frame, e conferência visual em 390×844.
- **Comparação:** cada bloco é medido nas duas imagens pela caixa dos pixels visíveis (pixels que diferem da cor de fundo da região em mais de 40–60 na soma RGB, ou próximos de uma cor-alvo, no caso do badge e do ícone do carrinho). Assim a comparação é de tinta contra tinta, não de caixa CSS contra imagem.
- **Critério:** |Δ| ≤ 2px em x, y, largura e altura. **Todos os blocos abaixo atendem.**

## Header (1440)

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| logo | 120,36 48x11 | 120,36 48x11 | 0 | 0 | 0 | 0 |
| nav-inicio | 497,29 56x13 | 497,29 56x13 | 0 | 0 | 0 | 0 |
| nav-underline | 496,66 58x2 | 496,66 58x2 | 0 | 0 | 0 | 0 |
| nav-mercado | 595,29 66x13 | 594,29 67x13 | -1 | 0 | 1 | 0 |
| nav-criadores | 702,29 86x13 | 701,29 86x13 | -1 | 0 | 0 | 0 |
| nav-aprenda | 829,29 66x16 | 827,29 67x16 | -2 | 0 | 1 | 0 |
| search | 1113,31 20x21 | 1113,31 20x20 | 0 | 0 | 0 | -1 |
| cart+badge | 1161,29 31x25 | 1160,29 31x24 | -1 | 0 | 0 | -1 |
| badge | 1176,30 16x15 | 1176,30 15x16 | 0 | 0 | -1 | 1 |
| cart-icon | 1161,30 20x23 | 1161,30 20x22 | 0 | 0 | 0 | -1 |
| button | 1220,24 100x35 | 1219,24 101x35 | -1 | 0 | 1 | 0 |
| button-text | 1230,32 80x18 | 1229,32 80x18 | -1 | 0 | 0 | 0 |
Linha inferior: y=68, 1px, de x=120 a x=1320 nas duas imagens. A cor do Figma (`#432c1a`) é `primary` a 25% sobre `ink`; no app, `border-primary/25` dá `#442c1a`.

## Footer (1440, y relativo ao topo do bloco)

Faixas (perfil vertical em x=130), idênticas nas duas imagens: destaques 250px, contato 88px, links 236px.

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| w-circulo | 168,32 74x74 | 168,32 74x74 | 0 | 0 | 0 | 0 |
| w-titulo | 168,120 214x17 | 168,120 214x17 | 0 | 0 | 0 | 0 |
| w-texto | 169,152 183x79 | 169,152 184x79 | 0 | 0 | 1 | 0 |
| divisor-1 | 416,32 2x202 | 416,32 1x202 | 0 | 0 | -1 | 0 |
| c-circulo | 433,32 75x74 | 434,32 74x74 | 1 | 0 | -1 | 0 |
| c-titulo | 434,120 214x17 | 434,120 214x17 | 0 | 0 | 0 | 0 |
| c-texto | 434,151 184x80 | 434,151 184x80 | 0 | 0 | 0 | 0 |
| divisor-2 | 682,32 2x202 | 682,32 1x202 | 0 | 0 | -1 | 0 |
| d-circulo | 699,32 75x74 | 700,32 74x74 | 1 | 0 | -1 | 0 |
| d-titulo | 699,120 224x17 | 700,120 224x17 | 1 | 0 | 0 | 0 |
| d-texto | 700,151 184x77 | 701,151 184x78 | 1 | 0 | 0 | 1 |
| divisor-3 | 948,32 1x202 | 948,32 1x202 | 0 | 0 | 0 | 0 |
| news-titulo | 965,33 237x34 | 965,33 237x34 | 0 | 0 | 0 | 0 |
| news-campo | 978,80 312x40 | 979,80 311x40 | 1 | 0 | -1 | 0 |
| news-texto | 965,138 288x54 | 965,138 288x55 | 0 | 0 | 0 | 1 |
| contato-kurio | 152,288 48x12 | 152,288 48x13 | 0 | 0 | 0 | 1 |
| contato-texto | 455,277 215x34 | 455,277 215x34 | 0 | 0 | 0 | 0 |
| contato-email | 758,288 142x12 | 758,288 143x12 | 0 | 0 | 1 | 0 |
| contato-fone | 1060,288 134x12 | 1061,289 134x11 | 1 | 1 | 0 | -1 |
| links-1-titulo | 153,371 107x18 | 152,371 108x18 | -1 | 0 | 1 | 0 |
| links-1 | 152,403 151x132 | 152,403 151x132 | 0 | 0 | 0 | 0 |
| links-2-titulo | 455,371 172x18 | 455,371 172x18 | 0 | 0 | 0 | 0 |
| links-2 | 455,403 167x132 | 455,403 168x132 | 0 | 0 | 1 | 0 |
| links-3-titulo | 758,371 85x18 | 758,371 86x18 | 0 | 0 | 1 | 0 |
| links-3 | 758,403 100x132 | 758,403 101x132 | 0 | 0 | 1 | 0 |
| redes-titulo | 1061,371 139x15 | 1061,371 140x15 | 0 | 0 | 1 | 0 |
| redes-icones | 1059,405 192x32 | 1059,405 192x32 | 0 | 0 | 0 | 0 |
| carteiras-titulo | 1060,469 226x18 | 1061,470 226x18 | 1 | 1 | 0 | 0 |
| carteiras-chip | 1060,496 228x26 | 1061,497 228x26 | 1 | 1 | 0 | 0 |
| copyright | 531,589 375x14 | 531,589 376x14 | 0 | 0 | 1 | 0 |
Os divisores 1 e 2 do Figma ficam em meio pixel (2px mais claros, `#654227`/`#915e36`). No app são 1px nítidos em `primary`, na mesma posição.

## Tab bar (414×896)

| Bloco | Figma | App | Δ |
| --- | --- | --- | --- |
| topo da barra (x=20, dentro do canto) | y=803 | y=803 | 0 |
| fundo do recorte (x=207) | y=850 | y=850 | 0 |
| círculo de ação (topo, x=207) | y=770 | y=770 | 0 |
| círculo de ação (borda esquerda, y=826) | x=185 | x=185 | 0 |
| ícone de scan | 185,785 44×34 | 185,785 44×34 | 0 |
| início (ativo, `text-accent`) | 38,842 16×18 | 38,843 16×17 | y +1, h −1 |
| favoritos | 108,842 20×18 | 108,842 20×18 | 0 |
| carrinho | 293,842 18×18 | 293,843 18×17 | y +1, h −1 |
| perfil | 357,842 14×18 | 357,843 14×17 | y +1, h −1 |

Em 390px não há frame. As laterais da barra esticam e o recorte e os cantos mantêm a forma (ver `ARCHITECTURE.md`).

## Limitações conhecidas

- A borda direita do círculo de ação não é comparável pela cor: o círculo é translúcido e, no Figma, deixa ver uma imagem laranja atrás dele.
- O "Enviar" e os ícones sociais usam os glifos atuais (SVG inline). Os ícones de Facebook, Instagram e YouTube não estão entre os assets baixados do Figma. As caixas (32×32, cantos de 5px) e a linha de ícones batem com o Figma.

## Prova de que o resto das telas não mudou (item 8)

Captura dos estilos computados de todos os elementos dentro de `<main>` (posição relativa à caixa de conteúdo do `<main>` e 20 propriedades de estilo) em 9 telas: início, login, cadastro, detalhe, carrinho, carteiras, perfil, checkout e recibo. A comparação foi feita entre o commit `f04d80d` (antes da fase) e o estado final, em 1440 e 390:

- **390px:** 0 elementos diferentes nas 9 telas.
- **1440px:** só o próprio `<main>` difere, de 1440px de largura com padding de 120px para 1296px com padding de 48px. O conteúdo continua em x=120, com 1200px. Nenhum elemento interno mudou.

# Medidas contra o Figma — Início

Data: 04/10/2026. Referências: `figma/Desktop/Início.png` (1440×3668) e `figma/Mobile/Início.png` (414×896). Mesmo método do layout global: caixa dos pixels visíveis de cada bloco nas duas imagens (página inteira em 1440; mobile em 414×896, a largura do frame, com conferência visual em 390). No mobile o app fica 14px acima do frame inteiro (o frame tem a área da barra de status acima da busca), e as linhas mobile descontam esse deslocamento.

## Desktop (1440)

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| hero: imagem | 870,101 450x450 | 870,101 450x450 | 0 | 0 | 0 | 0 |
| hero: linhas de tinta (bem-vindo, título ×2, texto ×3, botão, pontos) | y 146, 189, 259, 318, 342, 366, 416, 500 | y 146, 188, 258, 318, 342, 366, 416, 500 | | ≤1 | | |
| hero: texto e botão (x) | 160–161 | 160–161 | 0 | | | |
| hero: pontos | 720,500 40x8 | 720,500 40x8 | 0 | 0 | 0 | 0 |
| filtros: "Coleções" | 140,668 86x18 | 140,668 86x18 | 0 | 0 | 0 | 0 |
| filtros: 1ª coleção | 152,709 244x16 | 152,709 244x16 | 0 | 0 | 0 | 0 |
| filtros: 9ª coleção | 153,1029 243x16 | 152,1029 244x16 | −1 | 0 | 1 | 0 |
| filtros: "Faixa de preço" | 141,1096 150x18 | 141,1096 150x18 | 0 | 0 | 0 | 0 |
| filtros: slider | 152,1123 258x21 | 152,1123 258x21 | 0 | 0 | 0 | 0 |
| filtros: "Preço: 0,02 - 12,30 ETH" | 153,1161 206x15 | 153,1161 206x15 | 0 | 0 | 0 | 0 |
| filtros: "Aplicar" | 152,1188 92x36 | 152,1190 91x36 | 0 | 2 | −1 | 0 |
| filtros: "Rede" | 141,1265 42x15 | 140,1265 43x15 | −1 | 0 | 1 | 0 |
| filtros: "Solana (86)" | 153,1386 255x16 | 152,1386 256x16 | −1 | 0 | 1 | 0 |
| NFT em destaque | 120,1456 310x470 | 120,1454 310x470 | 0 | −2 | 0 | 0 |
| destaque: imagem | 121,1560 308x366 | 121,1558 308x366 | 0 | −2 | 0 | 0 |
| abas + ordenação | 478,650 841x20 | 478,648 840x22 | 0 | −2 | −1 | 2 |
| card 1 | 478,697 258x300 | 478,698 258x300 | 0 | 1 | 0 | 0 |
| card 2 | 770,697 258x300 | 770,698 258x300 | 0 | 1 | 0 | 0 |
| card 3 | 1062,697 258x300 | 1062,698 258x300 | 0 | 1 | 0 | 0 |
| card 4 (linha 2) | 478,1125 258x300 | 478,1123 258x300 | 0 | −2 | 0 | 0 |
| card 7 (linha 3) | 478,1547 258x300 | 478,1548 258x300 | 0 | 1 | 0 | 0 |
| nome, linha 1 | 479,1011 152x16 | 479,1012 152x16 | 0 | 1 | 0 | 0 |
| preço, linha 1 | 479,1039 85x13 | 479,1036 85x14 | 0 | **−3** | 0 | 1 |
| nome, linha 2 | 478,1439 163x13 | 478,1437 163x13 | 0 | −2 | 0 | 0 |
| preço, linha 2 | 479,1461 85x13 | 479,1461 85x14 | 0 | 0 | 0 | 1 |
| nome, linha 3 | 478,1861 153x13 | 478,1862 153x13 | 0 | 1 | 0 | 0 |
| preço, linha 3 | 479,1883 85x13 | 479,1886 85x14 | 0 | **3** | 0 | 1 |
| paginação ("1 2 3 4") | 1113,1985 157x35 | 1100,1983 170x35 | **−13** | −2 | **13** | 0 |
| promo 1 | 120,2116 586x250 | 120,2114 586x250 | 0 | −2 | 0 | 0 |
| promo 1: título | 471,2158 204x42 | 471,2157 205x42 | 0 | −1 | 1 | 0 |
| promo 2: título | 900,2150 300x52 | 900,2150 300x52 | 0 | 0 | 0 | 0 |
| promo: botão "Explorar" (linhas de tinta) | y 2280–2319 | y 2278–2317 | | −2 | | 0 |
| "Diário da Cunhagem" | 570,2470 301x27 | 570,2468 301x27 | 0 | −2 | 0 | 0 |
| subtítulo do diário (linhas de tinta) | y 2514–2527 | y 2514–2527 | | 0 | | 0 |
| card do diário 1 | 120,2569 268x369 | 120,2569 268x369 | 0 | 0 | 0 | 0 |
| card do diário 4 | 996,2569 268x369 | 996,2569 268x369 | 0 | 0 | 0 | 0 |
| card do diário: linhas de texto | 2780, 2796, 2820, 2842, 2870, 2885, 2909 | 2780, 2796, 2820, 2843, 2870, 2885, 2910 | | ≤1 | | |
| início do footer | y 3034 | y 3034 | | 0 | | |

## Mobile (414, app deslocado −14px)

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| busca | 24,40 313x45 | 24,38 313x45 | 0 | −2 | 0 | 0 |
| botão de filtros | 345,40 45x45 | 345,38 45x45 | 0 | −2 | 0 | 0 |
| hero | 24,101 366x190 | 24,99 366x190 | 0 | −2 | 0 | 0 |
| hero: arte | 232,108 145x145 | 232,108 145x145 | 0 | 0 | 0 | 0 |
| hero: arte secundária | 242,195 70x70 | 242,195 70x70 | 0 | 0 | 0 | 0 |
| aba "Todos os NFTs" (texto) | 24,309 | 24,309 | 0 | 0 | | |
| aba "Todos os NFTs" (sublinhado) | 24,325 110x2 | 24,325 111x2 | 0 | 0 | 1 | 0 |
| aba "Novos lançamentos" | 141,309 139x14 | 141,309 143x14 | 0 | 0 | 4 (texto) | 0 |
| aba "Em alta" | 298,309 57x12 | 298,309 58x12 | 0 | 0 | 1 | 0 |
| coração do card 1 | 161,355 28x28 | 161,355 28x28 | 0 | 0 | 0 | 0 |
| card 1 (moldura, topo) | y 343 | y 343 | | 0 | | |
| card 2 (moldura, topo) | y 375 | y 375 | | 0 | | |
| card 3 (moldura, topo) | y 611 | y 611 | | 0 | | |
| card 4 (moldura, topo) | y 643 | y 643 | | 0 | | |
| nome, card 1 | 33,555 142x7 | 33,555 142x7 | 0 | 0 | 0 | 0 |
| preço, card 1 | 33,566 142x20 | 33,566 143x20 | 0 | 0 | 1 | 0 |
| nome, card 2 | 224,587 133x7 | 223,587 135x7 | −1 | 0 | 2 | 0 |
| preço, card 2 | 224,599 122x19 | 224,599 122x19 | 0 | 0 | 0 | 0 |

Em 390 (sem frame): colunas de 163px (x 24–186 e 203–365), gutter de 24px e gap de 16px; a segunda coluna desce 32px como no frame.

Diferenças acima de 2px e o motivo estão em `docs/progresso.md` (seção Início, "Ressalvas").

# Medidas contra o Figma — Detalhes do NFT

Data: 04/10/2026. Referências: `figma/Desktop/Detalhes do NFT.png` (1440×2246) e `figma/Mobile/Detalhes do NFT.png` (414×896). Mesmo método: caixa e linhas de tinta nas duas imagens. Desktop: página inteira em 1440. Mobile: captura só da viewport em 414×896 (a barra de compra é fixa); o app fica 1px abaixo do frame inteiro.

## Desktop (1440)

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| trilha "Início / Mercado" | 121,103 143x13 | 121,103 141x13 | 0 | 0 | −2 | 0 |
| miniatura 1 | 120,129 100x100 | 120,129 100x100 | 0 | 0 | 0 | 0 |
| moldura da imagem | 248,131 444x444 | 248,131 444x444 | 0 | 0 | 0 | 0 |
| título | 727,137 266x27 | 726,137 267x27 | −1 | 0 | 1 | 0 |
| estrelas + avaliações | 946,182 373x16 | 946,180 374x17 | 0 | −2 | 1 | 1 |
| edições | 725,358 208x29 | 725,358 209x29 | 0 | 0 | 1 | 0 |
| seletor de quantidade | 726,401 101x48 | 725,401 101x48 | −1 | 0 | 0 | 0 |
| COMPRAR | 1052,400 123x41 | 1052,401 123x41 | 0 | 1 | 0 | 0 |
| Favoritar | 1176,400 144x41 | 1178,401 142x41 | 2 | 1 | −2 | 0 |
| resumo: linhas de tinta | 137, 181, 209, 226, 257, 281, 306, 333, 358, 400, 467, 499, 529, 560 | 137, 179, 211, 226, 258, 282, 306, 334, 358, 401, 467, 499, 529, 560 | | ≤2 | | |
| detalhes: linhas de tinta | 674, 698, 719, 743, 791, 815, 851, 875, 911, 935, 971, 995 | 674, 698, 719, 743, 791, 815, 851, 875, 912, 935, 971, 995 | | ≤1 | | |
| "Mais desta coleção" + linha | 1111, 1136 | 1111, 1136 | | 0 | | |
| card relacionado 1 | 120,1169 219x255 | 120,1169 219x255 | 0 | 0 | 0 | 0 |
| nome do relacionado | 120,1440 153x13 | 120,1439 153x13 | 0 | −1 | 0 | 0 |
| preço do relacionado | 121,1458 75x12 | 121,1456 76x13 | 0 | −2 | 1 | 1 |
| pontos | 694,1504 52x12 | 694,1502 52x12 | 0 | −2 | 0 | 0 |
| início do footer | y 1612 | y 1612 | | 0 | | |

## Mobile (414×896)

| Bloco | Figma (x,y w×h) | App (x,y w×h) | Δx | Δy | Δw | Δh |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| voltar | 28,23 35x35 | 28,24 35x35 | 0 | 1 | 0 | 0 |
| favorito | 354,23 35x35 | 354,24 35x35 | 0 | 1 | 0 | 0 |
| imagem | 28,66 361x324 | 28,67 361x323 | 0 | 1 | 0 | −1 |
| título | 25,430 190x20 | 25,431 190x19 | 0 | 1 | 0 | −1 |
| nota "4.8 (19)" | 307,424 81x27 | 306,423 82x27 | −1 | −1 | 1 | 0 |
| descrição (1ª linha) | y 469 | y 468 | | −1 | | |
| "Qtd." + seletor | 24,752 120x30 | 24,751 121x28 | 0 | −1 | 1 | −2 |
| preço | 295,760 94x16 | 295,758 94x15 | 0 | −2 | 0 | −1 |
| Comprar NFT | 24,802 196x60 | 24,800 196x60 | 0 | −2 | 0 | 0 |
| carrinho | 232,802 60x60 | 232,800 60x60 | 0 | −2 | 0 | 0 |
| abaixo da descrição (Edição, edições, ID, Coleção, Atributos) | 548, 570, 614, 646, 676 | 548, 572, 615, 647, 677 | | 0…+2 | | |

Com o `shortDescription` (texto do frame mobile) a descrição tem 3 linhas, como no frame. Em 390 a composição é a mesma, com a imagem e as colunas encolhendo.

# Medidas contra o Figma — Login e Cadastro

Data: 04/10/2026. Referências: `figma/Desktop/Login.png` e `Cadastro.png` (1440×1981), `figma/Mobile/Login.png` e `Cadastro.png` (414×896). Caixas por `getBoundingClientRect` em 1440 e 390 (no mobile, o eixo vertical é comparado direto; o horizontal usa a margem de 28px do frame).

## Login — desktop (1440)

| Bloco | Figma | App | Δ |
| --- | --- | --- | ---: |
| cartão | 470,160 500×600 (faixa laranja de 10px) | 470,160 500×600 | 0 |
| fechar (centro) | 949,180 | 949,180 | 0 |
| abas "Entrar \| Criar conta" (centro) | 219 | 219 | 0 |
| subtítulo (linhas) | 276 / 292 | 276 / 292 | 0 |
| campos | 550,324 340×40 e 550,376 | 550,324 340×40 e 550,376 | 0 |
| "Esqueceu a senha?" (centro, borda direita) | 436, 890 | 436, 890 | 0 |
| "Entrar" | 550,469 340×44 | 550,469 340×44 | 0 |
| "Ou continue com" (centro) | 545 | 545 | 0 |
| sociais | 566 / 618 (40) | 565 / 617 (40) | −1 |

## Cadastro — desktop (1440)

| Bloco | Figma | App | Δ |
| --- | --- | --- | ---: |
| cartão | 470,158 500×656 | 470,160 500×655 | +2 / −1 |
| campos | 322, 374, 426, 478 (40) | 324, 376, 428, 480 (40) | +2 |
| "Criar perfil" | 542 (45) | 544 (44) | +2 |
| "Ou continue com" (centro) | 619 | 620 | +1 |
| sociais | 643 / 699 | 644 / 700 | +1 |

## Login e Cadastro — mobile (390 × frame 414)

| Bloco | Figma (y) | App (y) | Δ |
| --- | --- | --- | ---: |
| logo "KURIO" (centro) | 148 | 148,5 | 0 |
| título (centro) | 265 | 264 | −1 |
| campos (50 de altura) | 312, 374 (+436, 498 no cadastro) | 311, 373 (+435, 497) | −1 |
| "Esqueceu a senha?" (centro) | 444 | 443 | −1 |
| botão (60) | 492 (cadastro 588) | 491 (587) | −1 |
| "Ou continue com" (centro) | 600 (696) | 599 (695) | −1 |
| sociais | 620 / 676 (716 / 772) | 619 / 675 (715 / 771) | −1 |
| "Novo na Kurio?" / "Já tem uma conta?" (centro) | 767 (862) | 766 (862) | ≤1 |
| largura dos campos | 358 (frame de 414, margem 28) | 334 (tela de 390, margem 28) | largura da tela |

O hero do fundo fica em 160,144 tanto no Login quanto na Início. No frame do Login, o texto do hero está mais abaixo (y 157). A diferença vem do header atual (45px de altura, contra 68 no frame) e da composição própria do frame; o hero não foi alterado.
