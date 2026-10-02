# Checklist de implementação vinculado ao enunciado

Fonte de requisitos: [README original](../README.md). `[x]` significa somente a entrega descrita na linha. A estrutura inicial NÃO conclui os fluxos do desafio.

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
- [ ] Controles de busca, filtros combinados, ordenação e paginação na URL, histórico e refresh; reiniciar página ao filtrar.
- [ ] Testar consultas fora de ordem, estados vazio/erro/atualização e recuperação.
- [ ] Detalhe: galeria, informações, edições, indisponibilidade e limites inteiros de quantidade.
- [ ] Favoritos autenticados persistentes, com atualização otimista e rollback.

## Carrinho — §3 (Carrinho), §§4–7

- [ ] API e UI para adicionar, alterar e remover itens por NFT/edição e disponibilidade.
- [ ] Carrinho persistente de visitante e merge ao autenticar sem perder itens.
- [ ] Aplicar/remover cupom; inválido e expirado com respostas da API.
- [ ] Cotação autoritativa: subtotal, desconto, taxa e total em strings ETH, cálculo exato.
- [ ] Skeleton do resumo; informar preço/estoque alterado via socket e atualizar cotação.

## Pagamento e recibo — §3 (Pagamento e confirmação), §§5–7

- [ ] Validar campos, carteiras cadastradas e rede; conectar/recusar/desconectar na simulação.
- [ ] Revisão e revalidação de preço/estoque/cupom/taxas; mudança exige nova confirmação.
- [ ] Chave de idempotência persistida por tentativa; mesma chave/body recupera pedido e body diferente retorna 409.
- [ ] Clique repetido e timeout após criação não duplicam compra.
- [ ] Pedido pendente/confirmado/recusado com recuperação por refresh/reconexão; estados terminais imutáveis.
- [ ] Recibo apenas confirmado, com snapshot imutável de itens/taxas/total e referência simulada.
- [ ] Falhas preservam carrinho; confirmação retira somente quantidades efetivamente compradas.

## Conta, sessão e segurança da simulação — §3 (Conta e sessão), §§4–6

- [ ] Cadastro/login/logout/sessão/expiração via REST MSW; credenciais fictícias e hash de senha com salt.
- [ ] Recuperar sessão após refresh; expiração em navegação/checkout preserva contexto e informa retomada.
- [ ] Proteger checkout, perfil, carteiras, favoritos e pedidos também nos handlers, com 401/403.
- [ ] Logout/troca de usuário cancela requests, limpa cache privado e subscriptions anteriores.
- [ ] Perfil, avatar, senha e carteiras principal/secundária: formulários, validações locais/API e persistência.

## Contratos, cache, mocks e eventos — §§4–7

- [ ] Completar contratos tipados de todos os recursos previstos em [CONTRACTS.md](CONTRACTS.md).
- [ ] Implementar todos os handlers previstos, com 401/403/404/409/422/5xx e mensagens por campo.
- [ ] DB simulada consistente e reset integral de usuários/sessões/catálogo/carrinho/cupons/carteiras/pedidos/eventos.
- [ ] Cenários: cadastro conflitante, validação, sessão expirada real, sem permissão, cupom inválido/expirado, preço alterado, edição esgotada, timeout após criar pedido, pagamento confirmado/recusado.
- [ ] Completar isolamento por usuário, invalidações após mutations e política de tentativas documentada.
- [ ] `order.updated` autenticado; envelopes com identidade/recurso/versão para ambos os eventos.
- [ ] Testar duplicatas, eventos antigos, terminalidade, cleanup e descarte de eventos da sessão anterior.
- [ ] Reconciliação completa após reconexão; interrupção durante pedido pendente sem nova compra.
- [ ] Controle determinístico de relógio, latência, desconexão e disparo/ordem de eventos em testes.

## Interface e acessibilidade — §§1, 3, 8

- [ ] Todas as nove telas desktop/mobile; perfil, carteiras e confirmação adaptados mesmo sem frame.
- [ ] Responsividade em 390/768/1440 e zoom, sem perda de conteúdo ou overflow.
- [ ] Teclado, foco visível/restaurado, foco de dialogs/drawers e navegação entre páginas.
- [ ] Labels, erros associados, semântica, textos alternativos, contraste e estados além da cor.
- [ ] Feedback acessível em mutations/eventos; shimmer com movimento reduzido em todos os componentes dependentes de dados.
- [ ] Links auxiliares coerentes e ações fora do escopo sem falso sucesso.
- [ ] Documentar substituições de assets e ajustes de acessibilidade em ARCHITECTURE.md.

## E2E e regressão visual — §9 (os 12 grupos obrigatórios)

- [ ] 1. Busca/filtros/ordem/páginas/histórico (atualmente somente parâmetros diretos testados).
- [ ] 2. Detalhe direto/inexistente completo (smoke inicial disponível).
- [ ] 3. Cadastro/login/expiração/logout/troca de usuário.
- [ ] 4. Favoritos com falha e rollback.
- [ ] 5. Carrinho/quantidades/remoção/cupom/refresh/login.
- [ ] 6. Compra completa até recibo confirmado.
- [ ] 7. Recusa, clique repetido e timeout recuperando mesmo pedido.
- [ ] 8. Perfil/avatar/senha/carteiras e validações.
- [ ] 9. Mudança de preço/estoque via socket no checkout (smoke no detalhe disponível).
- [ ] 10. Eventos antigos/duplicados, desconexão e retomada pendente.
- [ ] 11. Teclado/foco/dialogs/formulários (somente link de salto testado).
- [ ] 12. Skeletons/falhas/retry em todos os fluxos (smoke do catálogo/detalhe disponível).
- [ ] Baselines versionadas de início/detalhe/carrinho/pagamento com `@visual`; ainda não criar referências de UI provisória.
- [ ] Executar fluxos finais em Chromium desktop/mobile; entregar HTML e traces de falhas e isolamento integral.

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
