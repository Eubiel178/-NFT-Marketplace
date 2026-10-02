# Arquitetura e estado da entrega

Esta é a **estrutura inicial**, não a solução completa. Requisitos normativos preservados no [README](README.md), rastreabilidade em [docs/CHECKLIST.md](docs/CHECKLIST.md), contratos em [docs/CONTRACTS.md](docs/CONTRACTS.md).

## Organização

- `src/app`: composição de rotas e layout provisório.
- `src/components/ui`: componentes shadcn/ui sob controle do projeto, Radix Slot/CVA; barrel existente em `src/components/index.ts`.
- `src/contracts`: esquemas de transporte e envelopes compartilhados.
- `src/features/catalog` e `src/features/session`: integrações por domínio. Criar os demais domínios quando implementados, evitando módulos vazios.
- `src/lib`: Axios, ambiente, QueryClient, precisão ETH e ciclo de vida Socket.IO.
- `src/mocks`: fixtures, banco persistido e handlers REST/socket; nenhuma resposta fictícia no cliente HTTP, hooks ou componentes.
- `tests/e2e`: smoke tests que passam pela rede MSW e cliente Socket.IO.
- `scripts`: auditoria Lighthouse. `public/mockServiceWorker.js`: worker gerado, necessário também no deploy de demonstração.

## Cache, retries e sincronização

Chaves públicas incluem todos os parâmetros: `['nfts','list',search]` e `['nfts','detail',id]`. `AbortSignal` do Query chega ao Axios. Dados ficam frescos por 30 s e são coletados após 5 min sem uso; foco da janela e conexão disparam reconciliação. Queries repetem uma vez apenas falhas de rede/5xx, nunca 4xx; mutations não têm retry automático. Sessão usa staleTime zero e sem retry.

O socket pertence ao layout raiz e tem cleanup de listeners/conexão, inclusive StrictMode. Evento de catálogo válido causa reconsulta REST; mapa de versão evita aplicar eventos conhecidos repetidos/antigos. Na reconexão todas as consultas de NFTs ficam obsoletas. Proteção completa contra respostas/eventos fora de ordem em todos os domínios ainda deve ser testada. Nenhum cache privado existe nesta etapa; o prefixo futuro `['private',userId]` está reservado. Logout deverá cancelar/remover esse cache, invalidar sessão e encerrar subscriptions antes de trocar identidade.

## Sessão, carrinho e dinheiro

O endpoint de sessão só retorna visitante, e guardas redirecionam para login preservando destino. Não há login fictício com sucesso aparente. Cadastro, credenciais, hash com salt, expiração real e autorização nos mocks estão pendentes. As duas identidades em fixtures não são contas utilizáveis ainda; nenhuma senha é armazenada.

Carrinho será persistido na DB mock, com identificador de visitante e merge definido/testado ao login. Cotação será a autoridade de preço e taxas. Helpers convertem strings ETH para wei usando BigInt (sem float); não há compra implementada. Chaves idempotentes, snapshot e transições terminais deverão residir no mock, não na UI.

## Persistência e cenários

Atualmente a DB local versionada contém somente catálogo. `POST /api/__mock/reset` restaura catálogo + cenário; recarregar encerra conexões e limpa estado transitório. Futuros recursos devem entrar no mesmo reset integral. Cada teste Playwright recebe contexto isolado. Cenários não implementados não são expostos como se estivessem disponíveis.

## UX, Figma e acessibilidade

O Figma não pôde ser consultado pela ferramenta na inspeção inicial. Cores, fonte de sistema e cartões textuais são provisórios; não representam reprodução do Figma. Ainda não houve extração/substituição de assets do arquivo. Não são usadas imagens remotas ou compra decorativa para simular funcionalidade. Todas as rotas pendentes dizem explicitamente que não foram implementadas.

Base inclui link de salto, landmark principal, foco visível, feedback semântico, skeleton shimmer e redução de movimento. Acessibilidade completa exige formularios, dialogs/drawers, foco na navegação, imagens finais e auditoria. As medidas de Lighthouse da estrutura não podem ser apresentadas como pontuação da solução final.

## Execução e deploy

Vite é a ferramenta complementar escolhida; todas as tecnologias obrigatórias têm dependência/configuração dedicada. REST, Socket.IO, Router, Query, Axios, Tailwind e componentes iniciais já têm caminho de execução. Playwright exercita a infraestrutura. Lighthouse tem script preparado, sem atestar metas finais. Build de demonstração ativa MSW inclusive em produção; build normal permite API configurada, mas não existe backend externo entregue.

Configuração Vercel prepara build e fallback SPA, sem publicar nesta etapa. Acesso público, HTTPS/socket, rotas diretas e paridade com código entregue precisam de validação após deploy. `.git` foi preservado e passou a ser reconhecido pelo Git na verificação posterior; não foi reinicializado. `home-desktop.pdf`, surgido durante o trabalho, também foi preservado e ainda precisa de inspeção na etapa visual.

MSW deve iniciar antes de importar o módulo que carrega `socket.io-client`, pois o transporte captura a implementação de WebSocket ao avaliar o módulo. Por isso `main.tsx` importa `app/render` dinamicamente após `worker.start()`. O handler `ws.link` usa a origem/namespace `/`: MSW normaliza `/socket.io/` na correspondência. Esses detalhes são cobertos pelo teste de integração do evento real.
