# Validação da estrutura inicial

Data: 02/10/2026. Ambiente: Windows 10 x64, Node.js 24.18.0, npm 11.16.0. Versões exatas e transitivas no `package-lock.json`.

## Verificações realizadas

| Verificação | Resultado |
| --- | --- |
| `npm ci --ignore-scripts` | Passou: 368 pacotes instalados pelo lockfile; 0 vulnerabilidades reportadas |
| `npm ls --depth=0` | Passou, sem dependências inválidas |
| `npm run typecheck` | Passou, TypeScript 6.0.3 estrito |
| `npm run lint` | Passou, ESLint 10.11.0, sem warnings |
| `npm run build:demo` | Passou, inclusive durante o E2E; worker MSW presente no build |
| `npm run test:e2e` | **18 testes passaram**, um worker, 29 s; Playwright 1.63.0 e Chromium |
| `node --check scripts/lighthouse.mjs` | Passou |
| `npm run audit:lighthouse` | Passou: 12 medições da estrutura, HTML/JSON e medianas |

Relatório Playwright local: `playwright-report/index.html`, abrir com `npm run test:report`. Traces e screenshots são retidos em falhas; a última execução passou. Os relatórios gerados estão no `.gitignore`; o relatório final da solução deverá ser disponibilizado como artefato de entrega.

Os seis testes foram executados em 1440×900, 768×1024 e 390×844: catálogo REST/detalhe direto/404; parâmetros de URL; guarda privada e rota inexistente; evento Socket.IO com reconsulta REST e persistência; skeleton/erro/recuperação; link de salto e ausência de overflow na estrutura. **Isso não representa cobertura dos doze fluxos finais do README.**

## Correções encontradas pela validação

- Removido `baseUrl` depreciado no TypeScript 6; alias definido por paths relativos.
- Separados componentes da configuração de rotas para Fast Refresh.
- MSW fixado em 2.15.0 para satisfazer peer dependency do binding Socket.IO 0.2.0; usada a API publicada `toSocketIo`.
- Bootstrap dinâmico garante que MSW intercepte WebSocket antes da importação de Socket.IO. Handler considera normalização do namespace feita pelo MSW. Teste aguarda conexão real antes de emitir evento.
- Teste de teclado aguarda montagem da aplicação antes de pressionar Tab.
- Divisão natural do bootstrap removeu o aviso inicial de chunk acima de 500 kB; isso não substitui otimização da aplicação final.

O sandbox inicialmente bloqueou cache npm e limpeza do servidor filho do Playwright. Instalação e suíte completa foram concluídas com execução autorizada fora do sandbox. `npm ci` precisou ser repetido após encerrar o servidor que bloqueava a DLL nativa do Tailwind no Windows. O `postinstall` opcional do MSW não foi executado; o worker foi gerado explicitamente por `npx msw init public --save` e entregue em `public/`.

## Auditoria inicial da infraestrutura

Lighthouse 13.5.0, Chromium 153 headless instalado pelo Playwright, build demo otimizado em `http://127.0.0.1:4173`, cenário padrão, três medições por página/perfil. Mobile usa preset Lighthouse padrão; desktop usa preset oficial com viewport 1440×900, user agent desktop e throttling correspondente. Mocks, REST e Socket.IO permaneceram ativos. Os relatórios completos registram condições, ambiente e versões em `reports/lighthouse/`; `summary.json` contém medianas, LCP, CLS e TBT.

| Página / perfil | Performance | Acessibilidade | Boas práticas | SEO | LCP (ms) | CLS | TBT (ms) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início / mobile | 98 | 100 | 100 | 91 | 2121 | 0 | 65,5 |
| Início / desktop | 100 | 100 | 100 | 91 | 495 | 0,0024 | 0 |
| Detalhe / mobile | 97 | 100 | 100 | 91 | 2384 | 0,0152 | 81 |
| Detalhe / desktop | 100 | 100 | 100 | 91 | 565 | 0,0080 | 0 |

**Resultados exclusivos da estrutura provisória.** Não atestam as metas da entrega: imagens/fontes do Figma e fluxos completos ainda não existem e deverão participar de uma nova auditoria. Não foi criada uma versão especial da aplicação para melhorar pontuações. Os pequenos deslocamentos do detalhe reforçam a pendência de adequar skeletons às dimensões finais. A validação do script também identificou e corrigiu o user agent desktop antes das medições acima.

## Pendências de validação

Ver [checklist](CHECKLIST.md): fluxos de compra/conta, falhas avançadas, isolamento real entre usuários, regressão visual e baselines, auditoria da aplicação completa e deploy público. Nenhuma pontuação ou passagem de smoke tests equivale à conclusão desses requisitos.
