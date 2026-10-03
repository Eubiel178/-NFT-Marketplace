# Pendências da Implementação

**Escopo validado:** Etapas 9, 10, 11 e 12 — responsividade, fluxos e estados das rotas implementadas

## Etapa 9

As rotas implementadas foram auditadas em 390px, 414px, 768px e 1440px:

- Home (`/`)
- Detalhe (`/nfts/:id`)
- Login (`/login`)
- Cadastro (`/register`)
- Carrinho (`/cart`)
- Checkout (`/checkout`)
- Confirmação (`/orders/:id`)
- Perfil (`/profile`)
- Carteiras (`/wallets`)

Validações concluídas:

- Playwright visual oficial em 390px, 768px e 1440px.
- Execução auxiliar em 414px, largura dos frames mobile do Figma.
- Asserção E2E de ausência de overflow horizontal em todas as telas auditadas.
- Correção da quebra das ações do avatar no Perfil em 768px.
- `npm run typecheck` aprovado.
- `npm run lint` aprovado.
- `git diff --check` aprovado.

## Pendências

- Nenhuma pendência funcional conhecida nos fluxos exigidos pelo README.
- Ainda não existe frame de tablet no Figma; 768px segue a adaptação documentada em `responsive.md`.
- Alguns assets ornamentais do Figma continuam indisponíveis localmente.
- A fixture do carrinho possui 3 itens, enquanto o frame do Figma mostra 4.
- Perfil, Carteiras e Confirmação não possuem frames mobile no Figma; seus layouts mobile são inferidos a partir do README e de `responsive.md`.

## Etapa 10

Fluxos exigidos pelo README validados com REST via Axios, mocks MSW e eventos Socket.IO:

- Autenticação, cadastro, logout, expiração, refresh e troca de usuário.
- Catálogo, busca, filtros, ordenação, paginação, histórico e detalhe direto/404.
- Favoritos persistentes, falha de mutation e rollback.
- Carrinho, merge de visitante, quantidades, remoção, cupom, cotação e persistência.
- Checkout, carteiras, rede, revalidação de cotação, idempotência e clique repetido.
- Compra confirmada, recusada, pendente, timeout, reconexão e recibo por snapshot.
- Atualizações `nft.updated` e `order.updated`, com deduplicação e versões antigas.
- Perfil, avatar, senha, carteiras principal/secundária e validações.
- Skeletons, estados vazios/erro/sucesso, retry, teclado, foco e movimento reduzido.

Resultado da suíte completa anterior: `162 passed`, `3 skipped`, nos projetos Chromium desktop, tablet e mobile.

## Etapa 11

Estados exigidos pelo README revisados e validados:

- Loading/skeleton com dimensões preservadas em catálogo, detalhe, carrinho, cotação, perfil, carteiras e pedido.
- Empty para catálogo sem resultados, carrinho vazio e ausência de carteira secundária.
- Erros de API com feedback acessível e retry onde a consulta permite recuperação.
- Disabled durante mutations, limites de quantidade, ausência de dados obrigatórios e cotação desatualizada.
- Foco visível, foco restaurado em Sheet e navegação por teclado em filtros e Select.
- Pedido pendente, confirmado e recusado, incluindo recuperação após refresh e desconexão realtime.
- Falhas de autenticação e sessão expirada preservando o destino do checkout.
- Reconexão realtime invalidando carrinho e cotações ativas; estado inicial não é anunciado como desconectado antes da primeira conexão.
- `prefers-reduced-motion` desativa shimmer, transições e animações.

O resumo do carrinho agora usa skeleton durante a primeira cotação e mantém o valor anterior durante atualizações em segundo plano. A suíte E2E da Etapa 11 inclui essa cobertura em `tests/e2e/phase11-states.spec.ts`.

## Etapa 12

Além dos estados da etapa anterior, foram validados:

- Fixture Playwright com reset do MSW antes de cada teste para isolamento entre casos e viewports.
- Erro de confirmação de senha associado ao campo e favoritos isolados entre usuários.
- Carrinho vazio após remover todos os itens em desktop, tablet e mobile.
- Baselines visuais de início, detalhe, carrinho e pagamento em 1440, 768 e 390 px.
- Suíte completa: `186 passed`, `3 skipped`, `189` casos totais.

Os snapshots ficam em `tests/e2e/visual-regression.spec.ts-snapshots/` e os cenários em `tests/e2e/visual-regression.spec.ts`.

## Desvios Registrados

- O Figma usa 414px no mobile; o README exige 390px nos testes. Ambos foram validados.
- O ornamento vetorial do hero desktop foi reproduzido com CSS.
- O logo usa texto, pois não há asset de logo disponível no arquivo Figma.

## Próximas Etapas

- A auditoria Lighthouse e o deploy público permanecem fora da Etapa 10 e não foram executados nesta etapa.
