# Checklist de implementação vinculado ao enunciado

Fonte de requisitos: [README original](../README.md). `[x]` significa somente a entrega descrita na linha. A estrutura inicial NÃO conclui os fluxos do desafio.

## Revisão da Fase 2 — fundação visual e design system

Documentos consultados antes das alterações: `AGENTS.md`, `README.md`, todos os documentos em
`docs/figma/` solicitados e `docs/audit/README.md`/`gaps.md`.

| Item | Status | Evidência / impedimento |
| --- | --- | --- |
| Regras do `AGENTS.md` revisadas | [x] | Estrutura por pasta, imports, strict TypeScript e composition pattern aplicados |
| Tokens de cores, superfícies e estados | [x] | `src/styles.css` usa a paleta Figma âmbar/escura e estados semânticos |
| Gradientes, raios e sombras documentados | [x] | Tokens globais e inline documentados no CSS |
| Tipografia Roboto Mono | [~] | Família e fallback `Roboto Mono, monospace` configurados; nenhum arquivo de fonte local existe no repositório |
| 76 estilos tipográficos exatos | [~] | Escala principal e utilitários foram mapeados; variantes de alinhamento e todos os estilos duplicados do dump ainda não são tokens individuais |
| Breakpoints 390, 768 e 1440 | [x] | Breakpoints nomeados e aliases `sm`, `md`, `lg` configurados no tema Tailwind |
| Componentes base por pasta `index.tsx` | [x] | Button, Skeleton, Input, PasswordInput, NftCard, Modal, Sheet, Stepper, Avatar, Select, Checkbox, Radio, Toast, Badge, Pagination, TabBar, Header, Footer, Filters e SocialButton |
| Composition pattern | [x] | Modal, Header, Footer e Filters usam objeto composto; partes ficam em subpastas próprias |
| Button canônico | [x] | Implementação concorrente `src/components/ui/button.tsx` removida; variante customizada permanece em `button/index.tsx` |
| Acessibilidade da fundação | [x] | Labels, associação de erros, foco visível, foco de Modal/Sheet e `prefers-reduced-motion` revisados |
| Assets raster, vetores e logo do Figma | [ ] | Não há binários no repositório; `docs/figma/assets.md` registra que o download não foi autorizado |
| 38 entradas/componentes do Figma | [~] | Componentes de fundação foram criados; ícones e componentes específicos de telas ainda dependem de assets/textos não extraídos |
| Telas e fluxos de negócio | [ ] | Não implementados nesta fase, conforme instrução explícita |
| Typecheck | [x] | `npm run typecheck` |
| Lint | [x] | `npm run lint` |
| Build demo | [x] | `npm run build:demo` |
| Testes afetados | [x] | `npm run test:e2e`: 18 testes passando em desktop, tablet e mobile |

**Estado:** a fundação visual está validada, mas a Fase 2 não deve ser declarada integralmente
concluída enquanto os itens parciais/ausentes acima não puderem ser resolvidos sem inventar
assets, textos ou regras que não estão disponíveis no README ou no Figma documentado.

## Base desta etapa — §§2, 4, 6, 9, 10, 12

- [x] React, TypeScript estrito e Vite; aliases e organização por domínio.
- [x] TanStack Router e Query, Axios, Tailwind e componentes iniciais shadcn/ui.
- [x] Listagem e detalhe REST com MSW; contratos validados, parâmetros de URL, cancelamento e estados básicos.
- [x] Socket.IO client + binding MSW: evento público `nft.updated` seguido de reconciliação REST.
- [x] Fixtures de 24 NFTs e identidades de dois usuários (autenticação ainda ausente).
- [x] Persistência/reset do catálogo; cenários básicos de rede reproduzíveis.
- [x] Rotas de todas as telas e guarda inicial de visitante, com destino preservado.
- [x] Configuração Playwright para 390, 768 e 1440 px; testes reais da infraestrutura.
- [x] Script Lighthouse para três medições por página/perfil, mediana e relatórios.
- [x] Configuração SPA para Vercel, variáveis, lockfile e documentação inicial.

## Descoberta e detalhes — §3 (Catálogo e detalhe), §§4, 8

- [ ] Inspecionar todos os frames Figma desktop/mobile e obter imagens/fontes locais autorizadas.
- [ ] Início fiel ao Figma: destaques, catálogo e navegação; skeletons com dimensões finais.
- [x] Controles de busca, filtros combinados, ordenação e paginação na URL, histórico e refresh; reiniciar página ao filtrar.
- [x] Testar consultas fora de ordem, estados vazio/erro/atualização e recuperação.
- [x] Detalhe: galeria, informações, edições, indisponibilidade e limites inteiros de quantidade.
- [x] Favoritos autenticados persistentes, com atualização otimista e rollback.

## Carrinho — §3 (Carrinho), §§4–7

- [x] API e UI para adicionar, alterar e remover itens por NFT/edição e disponibilidade.
- [x] Carrinho persistente de visitante e merge ao autenticar sem perder itens.
- [x] Aplicar/remover cupom; inválido e expirado com respostas da API.
- [x] Cotação autoritativa: subtotal, desconto, taxa e total em strings ETH, cálculo exato.
- [x] Skeleton do resumo; informar preço/estoque alterado via socket e atualizar cotação.

## Pagamento e recibo — §3 (Pagamento e confirmação), §§5–7

- [~] Validar campos, carteiras cadastradas e rede; seleção/recusa são simuladas, sem conexão externa real.
- [x] Revisão e revalidação de preço/estoque/cupom/taxas; mudança exige nova confirmação.
- [x] Chave de idempotência persistida por tentativa; mesma chave/body recupera pedido e body diferente retorna 409.
- [x] Clique repetido e timeout após criação não duplicam compra.
- [x] Pedido pendente/confirmado/recusado com recuperação por refresh/reconexão; estados terminais imutáveis.
- [x] Recibo apenas confirmado, com snapshot imutável de itens/taxas/total e referência simulada.
- [x] Falhas preservam carrinho; confirmação retira somente quantidades efetivamente compradas.

## Conta, sessão e segurança da simulação — §3 (Conta e sessão), §§4–6

- [x] Cadastro/login/logout/sessão/expiração via REST MSW; credenciais fictícias e hash de senha com salt.
- [x] Recuperar sessão após refresh; expiração em navegação/checkout preserva contexto e informa retomada.
- [~] Proteger checkout, perfil, carteiras e pedidos também nos handlers, com 401/403; 401 e conflitos de propriedade em carteiras/pedidos estão implementados, enquanto recursos com autorização por papel ainda não existem.
- [x] Logout/troca de usuário cancela queries, encerra subscriptions privadas e limpa o cache privado antes de trocar a identidade.
- [x] Perfil, avatar, senha e carteiras principal/secundária: formulários, validações locais/API e persistência.

## Contratos, cache, mocks e eventos — §§4–7

- [~] Completar contratos tipados de todos os recursos previstos em [CONTRACTS.md](CONTRACTS.md); os recursos de favoritos e pedidos desta etapa estão tipados.
- [~] Implementar todos os handlers previstos, com 401/403/404/409/422/5xx e mensagens por campo; os cenários implementados desta etapa estão cobertos, mas ainda há recursos futuros.
- [x] DB simulada consistente e reset integral de usuários/sessões/catálogo/carrinho/favoritos/carteiras/cotações/pedidos.
- [x] Cenários: cadastro conflitante, validação, sessão expirada real, sem permissão, timeout após criar o pedido, pagamento confirmado/recusado, cupom e preço alterado durante checkout.
- [x] Cenários de falha de estado: `cart-error`, `cart-load-error`, `quote-error`, `profile-error`, `wallets-error` e `order-error`.
- [x] Isolamento por usuário e invalidações após mutations dos recursos implementados, com política de tentativas documentada.
- [x] `order.updated` com identidade/recurso/versão e filtragem no cliente.
- [x] Testar duplicatas, eventos antigos, terminalidade, cleanup e descarte de eventos da sessão anterior.
- [x] Reconciliação após conexão/reconexão e interrupção durante pedido pendente sem nova compra.
- [~] Controle determinístico de latência, desconexão e disparo/ordem de eventos está coberto; controle explícito de relógio ainda não foi necessário nos fluxos atuais.

## Fase 11 — loading, empty, error e estados

| Estado | Cobertura | Evidência |
| --- | --- | --- |
| Loading/skeleton | [x] | Home, carrinho, detalhe, checkout, perfil, carteiras e pedido; detalhe mantém galeria/resumo dimensionados |
| Empty | [x] | Catálogo sem resultados, carrinho vazio e ausência de carteira secundária |
| Error/retry | [x] | Falhas de catálogo, carrinho, cotação, favoritos, perfil, carteiras e pedido com feedback e nova tentativa |
| Success | [x] | Lista, resumo, recibo, perfil, carteira e recuperação após retry |
| Disabled | [x] | Steppers no limite/em mutation, submit durante envio, cupom vazio e ações indisponíveis |
| Validação | [x] | Formulários de autenticação, perfil e carteiras com mensagens associadas aos campos |
| API/realtime | [x] | Cenários MSW específicos e alerta de desconexão Socket.IO com reconciliação REST |
| Motion | [x] | `prefers-reduced-motion` desativa shimmer, transições e animações |

Evidência E2E: `tests/e2e/phase11-states.spec.ts`, `tests/e2e/phase10-realtime.spec.ts` e suíte completa `npm run test:e2e`.

## Interface e acessibilidade — §§1, 3, 8

- [ ] Todas as nove telas desktop/mobile; perfil, carteiras e confirmação adaptados mesmo sem frame.
- [x] Responsividade em 390/768/1440 e zoom, sem perda de conteúdo ou overflow nos fluxos implementados.
- [x] Teclado, foco visível/restaurado, foco de dialogs/drawers e navegação entre páginas nos fluxos cobertos.
- [ ] Labels, erros associados, semântica, textos alternativos, contraste e estados além da cor.
- [x] Feedback acessível em mutations/eventos; shimmer e transições respeitam `prefers-reduced-motion`.
- [ ] Links auxiliares coerentes e ações fora do escopo sem falso sucesso.
- [ ] Documentar substituições de assets e ajustes de acessibilidade em ARCHITECTURE.md.

## E2E e regressão visual — §9 (os 12 grupos obrigatórios)

- [x] 1. Busca/filtros/ordem/páginas/histórico (com cenários combinados e estado vazio).
- [x] 2. Detalhe direto/inexistente completo (galeria, limite, carrinho e 404).
- [x] 3. Cadastro/login/expiração/logout/troca de usuário.
- [x] 4. Favoritos com falha e rollback.
- [x] 5. Carrinho/quantidades/remoção/cupom/refresh/login; merge, persistência, cupom e cotação estão cobertos.
- [x] 6. Compra completa até recibo confirmado.
- [x] 7. Recusa, clique repetido e timeout recuperando mesmo pedido.
- [x] 8. Perfil/avatar/senha/carteiras e validações.
- [x] 9. Mudança de preço/estoque via socket no carrinho e checkout, com nova confirmação.
- [x] 10. Desconexão, retomada pendente e eventos antigos/duplicados via Socket.IO.
- [x] 11. Teclado/foco/dialogs/formulários.
- [x] 12. Skeletons, estados vazios, falhas de API/realtime, validação, disabled e retry cobertos em `tests/e2e/phase11-states.spec.ts` e nos testes de realtime.
- [x] Baselines versionadas de início/detalhe/carrinho/pagamento com `@visual` nos três viewports oficiais.
- [x] Executar fluxos finais em Chromium desktop/tablet/mobile; `npm run test:e2e` passou com 186 testes e 3 skipped.

## Etapa 12 — cobertura E2E e regressão visual

- [x] Fixture Playwright reseta a base MSW antes de cada teste, evitando vazamento de estado entre specs e projetos.
- [x] Erro de confirmação de senha associado ao campo correto.
- [x] Favoritos isolados ao trocar de usuário.
- [x] Carrinho vazio após remoção de todos os itens em desktop, tablet e mobile.
- [x] Regressão visual de início, detalhe, carrinho e pagamento em 1440, 768 e 390 px.
- [x] Typecheck e lint executados após as alterações.
- [x] Suíte completa: 186 passados, 3 ignorados, 189 casos totais.

## Auditoria, avaliação e entrega — §§10–12

- [ ] Executar Lighthouse na aplicação completa: início/detalhe × mobile/desktop × 3 medições.
- [ ] Metas: performance ≥90, acessibilidade ≥95, boas práticas ≥95, SEO ≥90; medianas, LCP/CLS/TBT e causas de desvios.
- [ ] Entregar relatórios HTML/JSON, versões, ambiente e condições sem simplificações exclusivas para pontuação.
- [ ] Revisar evidências dos nove critérios do §11 e todos os eliminatórios.
- [ ] Verificar checkout limpo com `npm ci`; assets locais e todos os comandos reproduzíveis.
- [ ] Publicar repositório e deploy público obrigatório com mocks/socket; testar acesso direto/refresh nas rotas publicadas.
- [ ] Preencher URLs, credenciais funcionais, reprodução de todas as falhas e limitações finais no README.

## Impedimentos e decisões pendentes

- Figma não acessível na tentativa de leitura; não foi possível validar identidade, assets ou campos exatos dos formulários.
- `git status` inicialmente não reconheceu `.git`, mas passou a funcionar na verificação posterior. Metadados preservados, sem commits nesta etapa.
- `home-desktop.pdf` apareceu durante o trabalho e foi preservado; sua inspeção visual e os demais frames/assets ficam para a etapa de interface.
- Não há URL de repositório nem destino de deploy configurado nesta etapa; publicação permanece obrigatória na entrega final.
- O enunciado permite definir contratos e biblioteca de build; Vite e os contratos propostos não substituem a stack obrigatória.
