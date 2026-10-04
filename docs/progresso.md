# Progresso — migração das páginas para Tailwind e fidelidade ao Figma

Ordem: preparação → Início → Detalhes do NFT → Carrinho → Pagamento → Confirmação de Pedido → Login → Cadastro → Perfil do Colecionador → Carteiras.
Ao retomar, continue da primeira etapa não concluída. Pausas obrigatórias depois de Início e de Pagamento.

Método de contagem: `wc -l src/css/styles.css` e classes distintas que aparecem em seletores (comentários removidos, regras `@` ignoradas no início do seletor).

| Etapa | Situação | Linhas antes → depois | Classes antes → depois | Commit |
| --- | --- | --- | --- | --- |
| Preparação (Badge + tipografia) | concluída | 3.574 → 3.031 | 308 → 203 | ver git log |
| Início | feita com ressalvas (ver abaixo) | 3.031 → 2.323 | 203 → 137 | ver git log |
| Detalhes do NFT | pendente | | | |
| Carrinho | pendente | | | |
| Pagamento | pendente | | | |
| Confirmação de Pedido | pendente | | | |
| Login | pendente | | | |
| Cadastro | pendente | | | |
| Perfil do Colecionador | pendente | | | |
| Carteiras | pendente | | | |

## Preparação

- Badge: `rounded-[4px]`, `rounded-[6px]`, `rounded-[8px]` e `min-w-[68px]` viraram `rounded-4`, `rounded-6`, `rounded-8` (tokens) e `min-w-17` (4,25rem).
- 30 estilos compostos de tipografia viraram tokens de texto no `@theme` (decisão em `ARCHITECTURE.md`); 76 classes `.figma-*` sem uso removidas.
- Snapshot de estilos computados (9 telas × 1440/390): 0 diferenças.

## Início

- Lógica fora dos componentes: estado da URL e busca com debounce em `features/catalog/hooks/use-catalog-search`; padrões de busca, número de páginas e rótulo de ETH ("0,02") como funções puras em `features/catalog/lib`. A página só compõe.
- Uma versão no DOM: catálogo, abas, cards e paginação são um único grid responsivo. Só o hero (textos e composição diferentes no Figma) e a sidebar de filtros (vira drawer abaixo de `lg`) escolhem a versão por `useMediaQuery` (`shared/hooks/use-media-query`), e a outra não é renderizada.
- Filtros vêm dos facets de `GET /api/nfts` (MSW); rótulos e contagens saíram do componente.
- CSS: 61 classes `home-*` removidas, mais 4 classes que já não eram usadas antes (`catalog-filters-sidebar`, `catalog-layout`, `catalog-main`) e `.text-right` (duplicava o utilitário do Tailwind). `account-select-like` foi removida por engano pelo script e restaurada.
- Ainda restam `home-product-card-*` e `home-rare-badge`: são do card antigo usado em "Você também pode gostar" do carrinho e saem na etapa do Carrinho.
- Medidas em `docs/figma-medidas.md` (seção Início).
- Snapshot de estilos computados das outras 8 telas (1440 e 390) contra o início da sessão: carrinho, pagamento, perfil, carteiras e recibo com 0 diferenças; detalhe muda só a largura do valor "Coleção" (dado novo: "Arte digital" no lugar de "Kurio Apes"); login e cadastro mudam só dentro do fundo decorativo, que reutiliza o hero da Início (em 390 esse fundo é `display: none` antes e depois).
- Specs com `--project=chromium-desktop` e `--project=chromium-mobile` (os projetos se chamam assim no `playwright.config.ts`): `foundation`, `home-visual`, `phase7-marketplace`, `phase2-layout`, `phase12-accessibility` → 36 passaram, 2 pulados por regra do próprio teste. `visual-regression` falha em home (mudança intencional) e em detalhe, carrinho e pagamento (baselines anteriores à Fase 2); regeneração fica para a Fase 4, por decisão do usuário.
- Testes: seletores por classe trocados por papel/nome (`list` "NFTs do catálogo", `status`), e o filtro de coleção usa "Fotografia" no lugar de "Coleção 01", que deixou de existir nas fixtures. As asserções são as mesmas.

### Ressalvas

- Hero desktop (versão do usuário, em revisão por ele): 8px acima e ~30px à esquerda do Figma.
- Preço dos cards nas linhas 1 e 3: −3px e +3px. O Figma não é consistente (nome→preço é 28px na linha 1 e 22px nas linhas 2 e 3); 2 tentativas.
- Abas no mobile: "Novos lançamentos" +18px e "Em alta" −8px. No Figma as duas primeiras abas se encostam (gap −1px) e a terceira tem 18px; o app usa 18px entre todas.
- Paginação: o app mostra "1 2 3 4 … 32 >" (32 páginas reais); o Figma mostra "1 2 3 4 >". Os botões medem 35×35 como no Figma; o bloco fica 13px mais largo à esquerda.
- Mobile: o conteúdo fica 14px acima do frame, porque o frame tem a área da barra de status do aparelho acima da busca. As medidas abaixo descontam esse deslocamento.
