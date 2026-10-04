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
