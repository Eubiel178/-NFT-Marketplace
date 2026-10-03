# Auditoria de Reconciliação Figma

**Data:** 02/10/2026  
**Atualização MCP:** 03/10/2026  
**Objetivo:** reconciliar o resultado real do MCP com `AGENTS.md`, `README.md` e a
documentação existente em `docs/figma/`, antes de qualquer implementação.

## Fontes consultadas

- `AGENTS.md`: fonte de regras do projeto e precedência.
- `README.md`: única fonte de requisitos funcionais; exige avaliação em 390, 768 e
  1440px e estados de carregamento, vazio, erro, sucesso e pedido pendente.
- Documentação existente em `docs/figma/`.
- MCP `figma_get_figma_data` no arquivo `uQ6atpUj4ge4FrxQfA80gJ`, com o output salvo em:
  `C:\Users\dev12\.local\share\opencode\tool-output\tool_0ffa36500001XvmjnoZz4kv6G3`
- MCP `figma_get_figma_data` no arquivo `Ff0SksUi7UFtPWUO8kyNtw`, com o output salvo em:
  `C:\Users\dev12\.local\share\opencode\tool-output\tool_0ffae8acf00132MsJs0L2nZSLu`

O `README.md` aponta para `Ff0SksUi7UFtPWUO8kyNtw`; a Fase 0 documentada usa
`dpcWPY3VTb7slaohK7USmz`; esta auditoria usa `uQ6atpUj4ge4FrxQfA80gJ`. O MCP também
foi consultado diretamente para `Ff0SksUi7UFtPWUO8kyNtw`. Os dumps de `Ff0...` e `uQ6...`
expõem a mesma árvore visual consultada, com os mesmos IDs de nós e textos; diferem no
nome do arquivo e nas component keys. Isso comprova equivalência do conteúdo exposto,
mas não prova que um fileKey seja o canônico do outro.

## Classificação

1. Confirmado pelo Figma
2. Confirmado pelo README
3. Apenas documentação existente
4. Informação não disponível
5. Conflito que precisa de decisão

## Reconciliação

| Item | Evidência MCP atual | Evidência README/documentação | Classificação | Resultado sem inferência |
| --- | --- | --- | --- | --- |
| Componentes: 32 vs. 21 | O bloco `COMPONENTS` de `uQ6...` lista 21 entradas e 2 `COMPONENT_SETS`: `Header Row` e `Social Button`. O dump de `Ff0...` expõe a mesma estrutura consultada. | `components.md` documenta 32 `COMPONENT`, 2 sets e 4 variantes, totalizando 38 entradas; `nodes.json` registra esses números. | 1, 3 e 5 para a fonte canônica | O MCP confirma 21 entradas para os dumps consultados. Os 32 componentes são o inventário da documentação/Fase 0. O conteúdo visual exposto é equivalente entre `Ff0...` e `uQ6...`, mas a fonte canônica não é determinada pelas keys.
| Cores: 12 vs. 10 | `GLOBAL_VARS` do MCP atual lista 10 tokens de cor: `Color/Ink`, `Color/Primary`, `Color/Surface Card`, `Color/Border`, `Color/Foreground`, `Text/Secondary`, `Color/Surface Dark`, `Text/Accent`, `Color/Secondary` e `Color/Surface Raised`. | `design-tokens.md` documenta 12, incluindo `Color/Border Soft` e `Text/Coral`. | 1, 3 e 5 para a fonte canônica | Para o MCP atual, 10 tokens de cor estão comprovados. `Color/Border Soft` e `Text/Coral` não estão disponíveis nesse output. Não foram criados valores substitutos.
| `Text/Accent` | O MCP atual usa `Text/Accent` em fills de textos, incluindo preços e aba ativa. | `design-tokens.md` afirma que não aparece diretamente. | 1 e 3 | A afirmação de uso direto pelo Figma atual está confirmada; a afirmação de ausência é histórica e não deve ser usada para o arquivo atual.
| `Text/Secondary` | O MCP atual usa `Text/Secondary` em textos visíveis, incluindo descrições e metadados. | `design-tokens.md` afirma que não aparece diretamente. | 1 e 3 | A afirmação de uso direto pelo Figma atual está confirmada; a ausência documentada não reconcilia com o MCP atual.
| `Color/Surface Dark` | O MCP atual usa `Color/Surface Dark` no frame `EL-40961243`. | `design-tokens.md` afirma que o token foi declarado e não usado. | 1 e 3 | O uso direto no MCP atual está confirmado.
| `Golden Frequency #071` vs. `Golden Signal #160` | O MCP atual contém dois cards distintos na terceira linha. `Golden Frequency #071`: x=291, y=1152, `0.59 ETH`, artwork `fill_02276ad0`, `imageRef 2986a7cb16d09de8970824d2dd58bf0bb021702c`. `Golden Signal #160`: x=582, y=1152, `0.39 ETH`, artwork `fill_d003b2ae`, `imageRef 87580f2def9af0ce13f4b6f6ce17bb2449bcfc16`. A consulta direta de `70342:2827` confirma a mesma linha e os mesmos cards. | 1 e 3 | O Figma resolve a ambiguidade: são dois NFTs/cards diferentes, não alternativas para o mesmo card. A documentação está incorreta ao registrar `Golden Signal #160` na posição de `Golden Frequency #071`. O Figma não define um identificador de backend para esses cards.
| Frames mobile com `Color/Ink` | Os seis frames mobile do MCP atual declaram `fills: Color/Ink`: Início, Detalhes, Carrinho, Pagamento, Login e Cadastro. | `pages.md` e `nodes.json` da Fase 0 registram os frames mobile sem fill. | 1 e 3 | Para o MCP atual, `Color/Ink` está confirmado nos seis frames mobile. A afirmação de ausência de fill é histórica.
| Frame tablet de 768px | O MCP atual contém 9 frames desktop de 1440px e 6 mobile de 414px; não há frame tablet. | `README.md` exige avaliação em 390, 768 e 1440px. | 1 e 2 | A ausência visual de 768px e a exigência de 768px são simultaneamente confirmadas. O comportamento visual de tablet não está definido.
| Loading | Nenhum frame, variante ou nó de loading/skeleton foi identificado no output MCP atual. | `README.md` exige estados de carregamento e skeleton com shimmer. | 1, 2, 4 e 5 | O estado é requisito do README, mas não tem desenho Figma confirmado. O tratamento visual precisa de decisão posterior.
| Erro | Nenhum estado visual de erro de tela ou formulário foi identificado no output MCP atual. | `README.md` exige falhas, erros de validação e feedback de erro. | 1, 2, 4 e 5 | O requisito funcional existe, mas sua aparência não está disponível no Figma.
| Empty state | Não foi identificado estado vazio de catálogo, carrinho ou favoritos no output MCP atual. | `README.md` exige resultados vazios e recuperação de consultas. | 1, 2, 4 e 5 | O estado funcional é exigido, mas o layout visual não está disponível.
| Foco | Não foi identificado estado visual de foco completo para os componentes no output MCP atual. | `AGENTS.md` exige foco visível; `README.md` exige navegação e controle de foco. | 1, 2, 4 e 5 | A exigência de acessibilidade é confirmada, mas não há especificação Figma suficiente para o tratamento completo.
| Disabled | Não foi identificado estado visual disabled no output MCP atual. | `README.md` não define uma aparência disabled específica. | 1 e 4 | A ausência de desenho foi registrada; não há requisito visual ou valor confirmado para preencher a lacuna.
| Transação pendente | O MCP atual mostra apenas confirmação bem-sucedida; não há estado pendente ou recusado desenhado. | `README.md` exige pedido pendente, confirmado e recusado, inclusive após refresh/reconexão. | 1, 2, 4 e 5 | Os estados funcionais são obrigatórios, mas o Figma não fornece o layout de pendência/recusa.
| Aliases `EL-*` | O MCP atual usa `template=EL-*` em subárvores de instâncias; o bloco `COMPONENTS` expõe apenas `id`, `key` e `name`. Consultas diretas por node ID de instância, como `I70522:3240;70504:3015` e `I70485:382;70485:317`, recuperam filhos, textos, fills e propriedades em alguns casos. | A documentação já registra aliases, mas também descreve estruturas internas e textos como se fossem plenamente confirmados. | 1, 3 e 4 | O MCP permite recuperar uma subárvore quando existe um node ID de instância consultável. O alias `EL-*` isolado não é um node ID consultável; subárvores que continuam alias permanecem desconhecidas. Não preencher aliases por inferência.

## Resumo

### Confirmado

- O MCP atual confirma 21 entradas de componentes, 10 tokens de cor, uso direto de
  `Text/Accent`, `Text/Secondary` e `Color/Surface Dark`.
- O MCP atual confirma os seis frames mobile com `Color/Ink`.
- O Figma atual confirma 9 frames desktop em 1440px e 6 mobile em 414px, sem frame tablet.
- O MCP atual contém dois cards distintos: `Golden Frequency #071` por `0.59 ETH` com
  `imageRef 2986a7cb...`, e `Golden Signal #160` por `0.39 ETH` com
  `imageRef 87580f2d...`.
- Consultas diretas de instâncias recuperam subárvores internas quando o node ID é
  fornecido; aliases `EL-*` isolados não são suficientes.

### Divergente

- A documentação da Fase 0 registra 32 componentes e 12 cores.
- A documentação registra ausência de uso direto dos três tokens, ausência de fill nos
  frames mobile e um nome incorreto para o card da coluna x=291 na terceira linha.
- Essas afirmações não correspondem ao output MCP atual.

### Desconhecido

- A relação formal entre os três fileKeys (`Ff0...`, `dpc...` e `uQ6...`) e qual deles
  deve ser tratado como fonte visual canônica.
- Textos, estados e subárvores internas que continuam escondidos atrás de aliases `EL-*`
  mesmo após consulta por node ID.
- Aparência de loading, erro, empty, foco, disabled e transação pendente.
- Layout responsivo intermediário de 768px.

### Precisa de decisão

- Qual fileKey deve ser a fonte visual canônica.
- Nenhuma decisão de conteúdo é necessária entre `Golden Frequency #071` e
  `Golden Signal #160`: o Figma os representa como cards distintos. Ainda é necessário
  definir como o backend/README identificará esses cards, caso isso seja exigido fora do
  layout.
- Como desenhar estados exigidos pelo README que não existem no Figma.
- Como representar tablet, foco, disabled e transação pendente sem inventar uma
  decisão como se fosse uma especificação do Figma.

## Alterações desta auditoria

- Adicionado este relatório de reconciliação.
- Atualizado apenas o índice e a seção de fontes de `docs/figma/README.md`.
- Nenhum código, asset, Figma ou dado de negócio foi alterado.

## Consulta MCP adicional

### FileKeys e component keys

O MCP retornou os três arquivos sem erro. Os nomes/canvas foram:

| FileKey | Nome | Canvas |
| --- | --- | --- |
| `Ff0SksUi7UFtPWUO8kyNtw` | `Frontend Challenge` | `Marketplace de NFTs GreenMint` (`0:1`) |
| `dpcWPY3VTb7slaohK7USmz` | `Frontend Challenge (Copy)` | `Marketplace de NFTs GreenMint` (`0:1`) |
| `uQ6atpUj4ge4FrxQfA80gJ` | `Frontend Challenge (Copy)` | `Marketplace de NFTs GreenMint` (`0:1`) |

Para os componentes solicitados, os IDs são estáveis, mas as keys variam entre os
fileKeys. Exemplos comprovados:

| Componente | ID | key `uQ6...` | key `Ff0...` |
| --- | --- | --- | --- |
| Header With Divider | `70504:3017` | `4752e564eb07db487041309b138072cd5acaf6df` | `795d49c997b97e680b0e9c9f840da3edd1125642` |
| Filters | `70485:381` | `e49a2cdea2d2bed3cbfdae8e990ff0883ab0b7c6` | `229fe8e080e6d008438c4c4871935d3bac822e41` |
| Checkout Page | `70504:3190` | `de6fbe7539917f65bd4ff8aeea086290b06315d2` | `d3bfac181c5cb1640ac8cf5c1aacad6c125981d0` |
| Marketplace Page | `70504:3297` | `f18443135553eb614eaf728b585dd0a917572347` | `8501d0b85cfb2b3f116ea39db1acd5bd407110c1` |
| Header Row | `70486:560` | `36c22d4b4ddbd4e5b23ec047a19a1ec14c455341` | `8fcbec44f9ba84ac95a5402c37bb7b6eae61fe3b` |
| Social Button | `70483:263` | `34b341f7688555928051a6cb6964e7aaa42d1fa2` | `0b4a07d235e431eed9e9931708f44ae1140186af` |

Conclusão: o Figma permite confirmar equivalência do conteúdo exposto, mas não fornece
uma relação que torne um fileKey inequivocamente canônico. O `README.md` continua sendo
a fonte obrigatória de requisitos; a escolha do snapshot visual deve ser formalizada
antes de usar keys em integrações.

### Estados e responsividade

Consultas diretas aos nós `70504:3017`, `I70522:3240;70504:3015`,
`I70485:382;70485:317`, `I70522:3240;70504:3015;70486:511` e `70342:2827`
confirmaram:

- `Header Row` expõe a propriedade `Badge Count: '6'` e filhos da instância.
- `Filters` expõe textos, slider, faixa `0,02 - 12,30 ETH`, botão `Aplicar`, redes e
  contagens quando consultado pela instância.
- `Nav` expõe textos, layout Auto Layout e underline ativo.
- A linha de produtos expõe separadamente os cards `Golden Beat`, `Golden Frequency` e
  `Golden Signal`.
- Não foram encontradas variants, properties ou frames para loading, skeleton, erro,
  empty, foco, disabled ou transação pendente.
- O Figma expõe Auto Layout (`row`/`column`, `fill`/`hug`/`fixed`, gaps, padding,
  alinhamento) nos frames 1440 e 414, mas não expõe frame, variant ou constraint que
  determine o comportamento em 768px.

### Informações impossíveis de obter pelo MCP nesta consulta

- Uma relação oficial entre `Ff0...`, `dpc...` e `uQ6...` que declare um deles como
  canonical ou como cópia do outro.
- Conteúdo interno de aliases `EL-*` sem um node ID de instância que possa ser
  consultado diretamente.
- Estados não desenhados no arquivo, incluindo loading, erro, empty, foco, disabled e
  transação pendente.
- Regras de breakpoint, reflow e constraints para 768px.
