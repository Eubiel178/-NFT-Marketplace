# Auditoria Visual — Figma x Implementação

**Data:** 03/10/2026

**Fonte de requisitos:** `AGENTS.md` e `README.md`.

**Referências utilizadas:** `figma/Desktop/` e `figma/Mobile/`. A pasta solicitada `docs/figma-referencia/` não existe no workspace; o uso de `figma/` foi confirmado antes da auditoria.

**Viewports:** screenshots da aplicação em 1440px e 390px. As referências mobile têm 414px; a comparação mobile considera a composição e a adaptação fluida exigida pelo README, não igualdade de coordenadas absolutas.

**Dados:** build demo com MSW, estado padrão, sem skeleton. As capturas aguardaram o conteúdo de cada rota e foram feitas com animações desabilitadas.

## Telas avaliadas

| Rota | Situação no código | Referência desktop | Referência mobile | Screenshots gerados |
|---|---|---|---|---|
| `/` | Home implementada | `figma/Desktop/Início.png` | `figma/Mobile/Início.png` | `docs/figma-auditoria/home-1440.png`, `home-390.png` |
| `/nfts/nft-1` | Tela de detalhe implementada nesta etapa | `figma/Desktop/Detalhes do NFT.png` | `figma/Mobile/Detalhes do NFT.png` | `docs/figma-auditoria/detalhes-1440.png`, `detalhes-390.png` |

As rotas `/cart`, `/checkout`, `/orders/:orderId`, `/login`, `/register`, `/profile` e `/wallets` não foram validadas: existem referências para parte delas, mas a implementação atual renderiza `PendingFeature` e não constitui uma tela implementada.

## Home — Desktop 1440px

| Região | Diferença encontrada | Valor esperado | Valor atual | Arquivo a corrigir | Gravidade |
|---|---|---|---|---|---|
| Header | O texto principal e o badge foram alinhados; permanecem diferenças menores na composição das ações. | Logo `KURIO`; nav `Início`, `Mercado`, `Criadores`, `Aprenda`; busca; carrinho com badge; botão `Entrar`. | Logo, labels da nav e badge `6` do carrinho correspondem; ícones/spacing ainda divergem. | `src/app/layout.tsx`, `src/components/ui/header/` | Baixa |
| Header — geometria | A referência usa header com conteúdo de 1200px e proporções específicas; o screenshot atual tem escala, espaçamento e hierarquia menores. | Conteúdo centralizado em 1200px, divider e alinhamentos do frame Figma. | Header funcional com `min-h-20`, mas sem a composição visual completa da referência. | `src/app/layout.tsx`, `src/components/ui/header/`, `src/styles.css` | Média |
| Hero — composição | O fundo do painel foi corrigido; permanecem diferenças no ornamento e no posicionamento fino do copy. | Hero de 450px sobre o fundo escuro, copy à esquerda e arte 450×450 à direita, com ornamento do frame. | Fundo agora usa o ink da página; arte e copy estão em grid; círculos CSS substituem o ornamento Figma. | `src/features/catalog/home/home-hero/`, `src/styles.css` | Média |
| Hero — copy | O texto foi corrigido; a quebra e o espaçamento ainda não são idênticos. | Texto da referência: `Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.` | Texto agora corresponde; largura, line-height e posição diferem visualmente. | `src/features/catalog/home/home-hero/index.tsx`, `src/styles.css` | Média |
| Hero — controles | Os indicadores de slide da referência não aparecem no hero desktop atual. | Três pontos laranja visíveis na região inferior do hero. | Os pontos só são renderizados no bloco mobile; não há pontos no bloco desktop. | `src/features/catalog/home/home-hero/index.tsx` | Média |
| Imagens do hero | A arte principal corresponde visualmente ao asset usado na referência; o ornamento não é o mesmo asset vetorial do Figma. | Arte principal do macaco em 450×450 e ornamento do frame. | Arte raster integrada; círculos decorativos reproduzidos com pseudo-elementos CSS. | `src/features/catalog/home/home-hero/`, `src/styles.css` | Média |
| Sidebar — Collections | Rótulos e contagens não correspondem. | Categorias como `Arte digital`, `Fotografia`, `Música`, `Arte 3D`, com contagens visíveis. | Coleções mockadas como `Kurio Apes`, `Sage Nomads`, `Neon Vessels`, sem contagens. | `src/features/catalog/home/home-filters/`, `src/features/catalog/home/home-page/index.tsx` | Alta |
| Sidebar — preço | Faltam os valores textuais e o estado do controle. | Slider com faixa e valores `Preço: 0,02 – 12,30 ETH`, botão `Aplicar` ativo. | Track visual sem valores; botão `Aplicar` desabilitado. | `src/features/catalog/home/home-filters/`, `src/styles.css` | Alta |
| Sidebar — rede | A lista está incompleta e sem contagens. | `Ethereum`, `Polygon`, `Solana`, cada uma com contagem. | Apenas `Ethereum` e `Polygon`, sem contagens. | `src/features/catalog/home/home-filters/`, `src/contracts/index.ts`, `src/mocks/handlers.ts` | Média |
| Featured NFT | A anatomia não reproduz integralmente o banner. | Banner 310×470 com badges, artwork, decorações e metadados conforme Figma. | Banner funcional com badges e imagem, mas sem as três decorações e com hierarquia/metadados diferentes. | `src/features/catalog/home/home-featured/`, `src/styles.css` | Média |
| Toolbar | A estrutura geral existe, mas a posição e o tratamento do sort não são iguais. | Tabs à esquerda e `Ordenar por: Listados recentemente` com chevron na posição do Figma. | Tabs e select funcionais; espaçamentos e alinhamento divergem. | `src/features/catalog/home/home-page/index.tsx`, `src/styles.css` | Média |
| Grid de cards | Os cards usam uma anatomia uniforme, enquanto a referência tem três anatomias e proporções diferentes. | 9 cards; variações de mídia/fundo; card `Neon Vessel` com preço promocional. | 9 cards; todos seguem essencialmente a mesma estrutura quadrada; promoção é uma variação simples de texto. | `src/features/catalog/home/home-product-card/`, `src/components/ui/card/`, `src/styles.css` | Alta |
| Grid — conteúdo | Nomes, preços e imagens principais dos 9 NFTs conferem visualmente com a referência. | `Emerald Ape #042`, `Sage Nomad #009`, `Neon Vessel #552`, demais itens e preços da referência. | Os nomes, preços e assets principais estão presentes. | `src/mocks/fixtures.ts` | Nenhuma diferença material observada |
| Paginação | A posição não corresponde. | Paginação alinhada à direita da área do grid, com o estado visual do Figma. | Paginação centralizada no eixo da área principal. | `src/features/catalog/home/home-page/index.tsx`, `src/styles.css` | Média |
| Promo cards | A ordem imagem/copy foi corrigida; ainda faltam as máscaras decorativas e o tratamento exato do CTA. | Imagem à esquerda e copy/CTA à direita nos cards da referência, com máscara decorativa. | Imagem agora fica à esquerda e copy à direita; não há máscara Figma e dimensões/CTA ainda divergem. | `src/features/catalog/home/home-promo-card/`, `src/styles.css` | Média |
| Blog — título | O alinhamento foi corrigido; a tipografia e o espaçamento vertical ainda diferem. | `Diário da Cunhagem` e descrição centralizados. | Título e descrição agora estão centralizados; tamanho, peso e gaps não são exatamente os mesmos. | `src/features/catalog/home/home-page/index.tsx`, `src/styles.css` | Baixa |
| Blog — cards | Estrutura próxima, mas conteúdo de metadata, tipografia e espaçamento não reproduzem integralmente o frame. | Cards de aproximadamente 268px, imagem 195px e CTA conforme referência. | Cards responsivos com conteúdo semelhante; alturas, pesos e espaçamentos variam do Figma. | `src/features/catalog/home/home-blog-card/`, `src/styles.css` | Média |
| Footer | Footer composto implementado e dimensionado; diferenças residuais ficam nos ícones sociais e na rasterização textual. | Bloco de destaques/newsletter, faixa de contato e rodapé com links, redes sociais e carteiras compatíveis. | Feature row, contato, links, redes sociais, carteiras e copyright presentes, com faixas de desktop medidas contra o frame. | `src/app/layout.tsx`, `src/components/ui/footer/`, `src/styles.css` | Baixa |
| Cores e fonte | A paleta e a família tipográfica aparentam corresponder aos tokens documentados; a igualdade exata de rasterização/letter-spacing não pode ser confirmada somente pelo screenshot. | `#140D0A`, `#F5F1EB`, `#D28A4C` e Roboto Mono. | Tokens CSS declaram esses valores e `Roboto Mono`, mas não há fonte local declarada no projeto. | `src/styles.css` | Incerto |

## Home — Mobile 390px

| Região | Diferença encontrada | Valor esperado | Valor atual | Arquivo a corrigir | Gravidade |
|---|---|---|---|---|---|
| Shell mobile | A referência tem frame mobile com raio de 40px e composição própria. | Frame arredondado em 40px, padding lateral 24px e conteúdo dentro do frame. | O screenshot atual ainda não evidencia o frame arredondado de 40px no viewport inteiro. | `src/styles.css`, `src/app/layout.tsx` | Média |
| Search bar | O controle de filtro não reproduz o ícone da referência. | Search field de 45px e botão de filtro com o ícone de sliders e gradiente da referência. | Campo de busca está presente; botão usa ícone de funil genérico. | `src/features/catalog/home/home-page/index.tsx`, `src/styles.css` | Média |
| Hero mobile | Estrutura e proporção são próximas, mas o conteúdo textual e o asset decorativo não são idênticos. | Banner de 190px, copy de duas linhas, duas artes e máscara do Figma. | Banner de 190px, copy adaptado para 390px, artes presentes e máscara SVG disponível; texto difere. | `src/features/catalog/home/home-hero/`, `src/styles.css` | Média |
| Tabs e grid — ordem/layout | A divergência crítica foi corrigida. | Tabs ocupam uma linha imediatamente abaixo do hero; grid começa abaixo das tabs em duas colunas. | Screenshot novo mostra tabs em linha própria e grid abaixo, com duas colunas. | `src/styles.css`, `src/features/catalog/home/home-page/index.tsx` | Nenhuma diferença material observada |
| Cards mobile | A ordem foi corrigida; dimensões e metadados ainda diferem do frame. | 4 cards em masonry de duas colunas; coluna direita com offset de 32px; arte fluida. | 4 cards agora aparecem abaixo das tabs; nomes/preços e raios permanecem diferentes em detalhes. | `src/features/catalog/home/home-page/index.tsx`, `src/styles.css`, `src/components/ui/card/` | Média |
| Cards mobile — ações | A referência mostra favorito no primeiro card e badge `RARO` no terceiro. | Favorito circular no card 1 e badge visível no card 3. | O código mobile não fornece `onFavorite` para os cards; o badge `RARO` é condicionado ao índice da lista, mas a composição atual dificulta a comparação e não reproduz o botão de favorito. | `src/features/catalog/home/home-page/index.tsx`, `src/features/catalog/home/home-product-card/`, `src/components/ui/card/` | Alta |
| Bottom tab bar | A navegação está presente, mas os ícones, estado central e proporções não são iguais. | Barra com notch central, cinco destinos e ação central elevada conforme referência. | Barra com cinco destinos e ação central, mas ícones/labels e dimensões visuais diferem. | `src/components/ui/tab-bar/`, `src/styles.css`, `src/app/layout.tsx` | Alta |
| Seções abaixo do grid | A omissão é compatível com a referência mobile. | Promo cards e blog não aparecem no frame mobile de referência. | Promo cards e blog estão ocultos abaixo de 640px. | `src/styles.css` | Nenhuma diferença material observada |

## Detalhes do NFT — Desktop 1440px

| Região | Diferença encontrada | Valor esperado | Valor atual | Arquivo a corrigir | Gravidade |
|---|---|---|---|---|---|
| Header | Badge do carrinho e estado `Mercado` foram implementados; ícones e microespaçamentos ainda dependem da rasterização da fonte/ícone. | Nav ativa em `Mercado`, carrinho com badge e ações do Figma. | Nav ativa, carrinho com badge `6`, busca, carrinho e `Entrar` renderizados. | `src/app/layout.tsx`, `src/components/ui/header/`, `src/styles.css` | Baixa |
| Breadcrumb | Coordenadas atuais medidas em `x=120,y=113,w=1200,h=16`; texto e região correspondem ao frame. | `Início / Mercado` acima do produto. | `Início / Mercado` em `x=120,y=113`; produto inicia em `y=130`. | `src/features/catalog/nft-detail/nft-detail-root/`, `src/styles.css` | Nenhuma diferença material observada |
| Galeria | As dimensões principais agora coincidem com o frame: thumbnails `100×100`, wrapper `444×444` em `x=248,y=130` e imagem interna `404×404` em `x=268,y=150`. | Quatro thumbnails, imagem principal em card 444×444 e ícone de ampliação. | Quatro thumbnails em `x=120,y=130`, gap vertical `16px`, card e imagem com as medidas acima. | `src/features/catalog/nft-detail/nft-detail-gallery/`, `src/styles.css` | Nenhuma diferença material observada |
| Informações do NFT | Preço e avaliação foram colocados na mesma linha. Medidas atuais: título `x=725,y=134,h=30`, preço `x=725,y=176,w=96.78,h=24`, avaliação `x=929.78,y=180,w=337.66,h=16`. | Título 28px, preço 22px, estrelas e avaliações na mesma composição do Figma, descrição, edição, token info e compartilhamento. | Todas as regiões presentes e alinhadas na coluna de `595px`; ainda pode haver diferença de largura textual causada pela fonte disponível. | `src/features/catalog/nft-detail/nft-detail-summary/`, `src/styles.css` | Baixa |
| Ações | Stepper, `COMPRAR` e `Favoritar` permanecem na mesma linha; bloco medido em `x=725,y=391.59,w=595,h=44`. | Stepper, `COMPRAR` e `Favoritar`, com estados visíveis. | Controles presentes na posição do bloco de ações; ícones continuam sendo os equivalentes disponíveis no sistema. | `src/features/catalog/nft-detail/nft-detail-summary/`, `src/styles.css` | Baixa |
| Descrição | Ordem corrigida para `Rede`, `Contrato` e `Direitos autorais`; labels e valores agora seguem o Figma. Tabs iniciam em `y=683.59` e a linha ativa do raster está em `y=698–700`. | Tabs `Detalhes do NFT` e `Avaliações de colecionadores (19)`, texto, rede, contrato e direitos autorais. | Conteúdo e ordem correspondentes; campos de contrato/direitos são apresentados em blocos verticais como no frame. | `src/features/catalog/nft-detail/nft-detail-description/`, `src/styles.css` | Nenhuma diferença material observada |
| Related products | O gap desktop foi ajustado para alinhar o topo dos cards ao raster. | Seção `Mais desta coleção` com cinco cards e carousel dots; primeira imagem inicia em `y≈1169`. | Seção em `x=120,w=1200`, primeira imagem passa de `y=1163.59` para `y≈1169.59`, cinco cards, preços e dots presentes. | `src/features/catalog/nft-detail/nft-detail-related/`, `src/styles.css` | Baixa |
| Footer | Footer composto foi implementado e medido contra as faixas de cor do frame. | Bloco editorial/newsletter, contatos, links, redes e carteiras compatíveis. | Feature row `y=1612–1862` (`250px`), contato `1862–1950` (`88px`), links `1950–2186` (`236px`) e copyright em `y=2202`; medidas coincidem com o raster. | `src/app/layout.tsx`, `src/components/ui/footer/`, `src/styles.css` | Nenhuma diferença material observada |

## Detalhes do NFT — Mobile 390px

| Região | Diferença encontrada | Valor esperado | Valor atual | Arquivo a corrigir | Gravidade |
|---|---|---|---|---|---|
| Hero e controles | Coordenadas atuais em 390px: galeria `x=0,y=0,w=390,h=506`, imagem `x=28,y=66,w=334,h=356`; no frame 414px a mesma regra produz a adaptação fluida do Figma. | Hero de 506px, botão voltar, favorito e artwork grande com raio 24px. | Hero e controles presentes; a diferença de largura é somente o viewport solicitado (`390px`) contra o frame (`414px`). | `src/features/catalog/nft-detail/nft-detail-gallery/`, `src/styles.css` | Baixa |
| Details sheet | Sheet começa exatamente em `y=392` em ambos os viewports por usar a sobreposição de `-114px` sobre a galeria de `506px`. | Sheet sobreposto ao hero, raio superior 31px, título, avaliação, descrição, edições e token info. | Sheet em `x=0,y=392,w=390`; heading, review, descrição, edições e token info presentes, sem o título extra `Sobre este NFT:` que não aparece no frame. | `src/features/catalog/nft-detail/nft-detail-summary/`, `src/styles.css` | Nenhuma diferença material observada |
| Buy bar | A altura foi fixada em `164px`, logo fica em `y=732` no frame de `896px` e em `y=680` no screenshot de `844px`. | Barra fixa inferior com quantidade, preço, `Comprar NFT` e botão de carrinho. | Quantidade com `−/1/+`, preço, botão de `196px` e carrinho presentes; a altura/posição relativa ao viewport corresponde ao frame. | `src/features/catalog/nft-detail/nft-detail-summary/`, `src/styles.css` | Baixa |
| Navegação mobile | A tab bar global foi removida desta rota. | Detalhe usa os controles do hero e buy bar; não há tab bar inferior no frame. | Não há tab bar global no detalhe mobile; buy bar permanece. | `src/app/layout.tsx`, `src/styles.css` | Nenhuma diferença material observada |
| Tipografia e espaçamento | Tokens atuais são `20px/24px` para título, `14px/24px` para descrição e `20px` para preço. O wrapping em 390px difere do frame porque a referência tem `414px`. | Título 20px, descrição 14px/24px, preço 20px e espaçamentos do sheet. | Valores tipográficos correspondentes; diferença observada é apenas a quebra adicional de uma linha no viewport de `390px`. | `src/features/catalog/nft-detail/`, `src/styles.css` | Baixa |

## Resultado final

| Tela | Fidelidade visual |
|---|---|
| Home desktop | Não fiel; possui estrutura funcional e assets corretos em parte dos cards, mas header, hero, filtros, promo cards, blog e footer divergem. |
| Home mobile | Não fiel; a ordem tabs/grid está quebrada objetivamente e há diferenças em cards, ícones e tab bar. |
| Detalhes desktop | Estrutura e medidas principais conferem com o frame; permanecem diferenças residuais de rasterização de fonte e ícones equivalentes onde a biblioteca não possui marcas sociais. |
| Detalhes mobile | Estrutura, sobreposição e buy bar conferem com o frame; o screenshot solicitado é `390×844`, enquanto a referência é `414×896`, portanto o wrapping e as coordenadas absolutas não são comparáveis sem escala. |

Nenhuma tela avaliada pode ser declarada fiel ao Figma sem ressalvas. As demais telas não foram validadas porque ainda não estão implementadas, mesmo quando possuem imagens de referência disponíveis.

## Artefatos

- `docs/figma-auditoria/home-1440.png`
- `docs/figma-auditoria/home-390.png`
- `docs/figma-auditoria/detalhes-1440.png`
- `docs/figma-auditoria/detalhes-390.png`
