# Progresso — migração das páginas para Tailwind e fidelidade ao Figma

Ordem: preparação → Início → Detalhes do NFT → Carrinho → Pagamento → Confirmação de Pedido → Login → Cadastro → Perfil do Colecionador → Carteiras.
Ao retomar, continue da primeira etapa não concluída. Pausas obrigatórias depois de Início e de Pagamento.

Método de contagem: `wc -l src/css/styles.css` e classes distintas que aparecem em seletores (comentários removidos, regras `@` ignoradas no início do seletor).

| Etapa | Situação | Linhas antes → depois | Classes antes → depois | Commit |
| --- | --- | --- | --- | --- |
| Preparação (Badge + tipografia) | concluída | 3.574 → 3.031 | 308 → 203 | ver git log |
| Início | pendente | | | |
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
