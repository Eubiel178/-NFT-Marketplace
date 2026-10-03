# Fase 0 — Especificação do Figma

Inventário completo do design de referência extraído do Figma. **Esta pasta é documentação
apenas. Nenhum arquivo aqui é código, rota, componente ou dependência do projeto.**

## Ordem de leitura

| Documento | Conteúdo |
| --- | --- |
| [pages.md](pages.md) | As 15 telas da Fase 0, seção por seção, com estados e comportamento esperado |
| [components.md](components.md) | Inventário da Fase 0: 32 componentes, 2 component sets e 4 variantes |
| [design-tokens.md](design-tokens.md) | Inventário da Fase 0: 12 cores, gradientes, sombras, estilos de texto, raios e espaçamentos |
| [assets.md](assets.md) | 4 imagens raster, 40 vetores nomeados e como exportá-los |
| [responsive.md](responsive.md) | Breakpoints presentes, ausentes e as decisões que faltam |
| [flows.md](flows.md) | Navegação entre telas e estados de overlay |
| [requirements-mapping.md](requirements-mapping.md) | Figma vs. `AGENTS.md`/`README.md`, com conflitos explícitos |
| [reconciliation.md](reconciliation.md) | Auditoria de reconciliação entre o MCP atual, o `README.md` e esta documentação |
| [nodes.json](nodes.json) | Índice machine-readable: telas, componentes, tokens, assets |

## Fonte

| Campo | Valor |
| --- | --- |
| Arquivo da Fase 0 documentada | `Frontend Challenge (Copy)` |
| `fileKey` da Fase 0 | `dpcWPY3VTb7slaohK7USmz` |
| URL da Fase 0 | https://www.figma.com/design/dpcWPY3VTb7slaohK7USmz/Frontend-Challenge--Copy-?node-id=0-1 |
| Arquivo usado na reconciliação | `Frontend Challenge (Copy)` |
| `fileKey` da reconciliação | `uQ6atpUj4ge4FrxQfA80gJ` |
| URL da reconciliação | https://www.figma.com/design/uQ6atpUj4ge4FrxQfA80gJ/Frontend-Challenge--Copy-?m=auto&fuid=1135636578486294764 |
| Canvas | `Marketplace de NFTs GreenMint` (`0:1`) |
| Pages | 1 |

> **Conflito de fonte.** O `README.md` do projeto aponta para o arquivo **original**
> `Ff0SksUi7UFtPWUO8kyNtw`. A Fase 0 foi executada sobre a **cópia** `dpcWPY3VTb7slaohK7USmz`,
> solicitada explicitamente. A auditoria posterior foi executada sobre a cópia
> `uQ6atpUj4ge4FrxQfA80gJ`. As diferenças entre as fontes estão classificadas em
> [reconciliation.md](reconciliation.md).

> **Precedência da auditoria.** Os números e estados do MCP atual só substituem os dados
> derivados da Fase 0 quando a auditoria os identifica como confirmados. Nenhum conflito
> de conteúdo foi resolvido por inferência.

## Hierarquia de precedência

1. `AGENTS.md` — regras do projeto, sempre vigentes.
2. `README.md` — requisitos, stack e fluxos oficiais.
3. **Figma** — referência visual. Onde o Figma e o `README.md` divergem, o `README.md` vence.
4. Estes documentos — especificação derivada do Figma, gerada na Fase 0.

Este Figma **não** define requisitos funcionais. Onde o design sugere comportamento mas o
`README.md` não descreve a regra, isso está marcado como **inferência** e precisa de confirmação.

## Como os dados foram extraídos

Extração via MCP `figma-developer-mcp@0.13.2`, ferramenta `get_figma_data`, **uma única chamada**:

```json
{ "fileKey": "dpcWPY3VTb7slaohK7USmz" }
```

Sem `nodeId` e sem `depth`, a ferramenta usa o endpoint `GET /v1/files/:key` e devolve o
arquivo inteiro — inclusive `GLOBAL_VARS`, `ELEMENTS`, `COMPONENTS` e a árvore `NODES`.

Resultado: **322.222 caracteres / 7.867 linhas**.

| Métrica | Valor |
| --- | --- |
| Chamadas à API Figma | 15 |
| Sucesso | 7 (6 em `/nodes` + 1 arquivo completo) |
| Bloqueadas por `429` | 8 (todas em `/nodes`) |
| Telas | 15 (9 desktop, 6 mobile) |
| Nós na árvore | 2.376 |
| Tipos de nó | 988 FRAME, 825 TEXT, 187 RECTANGLE, 173 IMAGE-SVG, 55 GROUP, 52 LINE, 51 ELLIPSE, 39 INSTANCE, 6 COMPONENT, 1 CANVAS |

### Limitação conhecida e relevante

O endpoint `/v1/files/:key/nodes` responde `429 Too Many Requests`
(`X-Figma-Plan-Tier: starter`, `X-Figma-Rate-Limit-Type: high`, `Retry-After ≈ 399687s`).
Um novo PAT **na mesma conta não resolve** — a cota é por usuário/plano.

Consequência: quando o MCP renderiza a subárvore de uma instância de componente, ele substitui
os dados por um alias `template=EL-xxxxxx`, e o bloco `ELEMENTS` **não** inclui o texto original.
A seção `COMPONENTS` traz apenas `id`, `key` e `name`.

Portanto, **textos que existem somente dentro de componentes não foram recuperados** — principalmente:

- rótulos da navegação do header;
- todos os links e textos do rodapé;
- rótulos de coleções, preços e redes dentro de `Filters`;
- textos do overlay de `Checkout Page` (usado por Pagamento e Confirmação);
- rótulos dos campos e placeholders dos modais de Login e Cadastro;
- títulos das linhas de tabela do carrinho.

Isso está sinalizado item a item em [pages.md](pages.md) e [components.md](components.md).
Estrutura, dimensions, fills, raios, estilos de texto e `imageRef` **estão** completos.

## Naming no Figma vs. naming do projeto

O Figma chama o marketplace de **Kurio** / **Kurio Editions**, e o canvas se chama
`GreenMint`. São nomes de design, não de produto. Os nomes canônicos do projeto estão em
`README.md` e prevalecem.

## Idioma

Todo o texto do Figma está em **português do Brasil**. Mantido assim nos documentos, exceto
quando o termo técnico é melhor em inglês.
