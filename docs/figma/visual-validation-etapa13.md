# Validacao Visual - Etapa 13

## Escopo

Comparacao das rotas implementadas em 390, 414, 768 e 1440 px contra os frames e a documentacao disponiveis em `docs/figma/`.

## Diferencas encontradas antes das correcoes

### Corrigiveis

- Carrinho mobile: o resumo usa largura estendida e somente padding esquerdo, fazendo os valores de subtotal, desconto e total encostarem ou serem cortados na borda direita em 390 e 414 px. O frame mobile mantem esses valores dentro da area interna do resumo.
- Checkout mobile: os metodos de carteira sao renderizados em tres colunas compactas com letras e um simbolo grafico. O frame mobile apresenta as opcoes empilhadas verticalmente, em botoes largos, com a identificacao visual de cada carteira.

### Limitacoes e desvios mantidos

- A fixture do carrinho possui tres itens, enquanto o frame do Figma mostra quatro; a diferenca e de dados de teste, nao de layout.
- O Figma usa 414 px no mobile e o README exige validacao em 390 px; 390 e uma adaptacao responsiva sem frame correspondente.
- Nao ha frame de tablet no Figma; 768 px segue a adaptacao descrita em `responsive.md`.
- Nao ha fonte local Roboto Mono nem todos os assets ornamentais/logotipos equivalentes no repositorio; esses pontos nao serao alterados por aproximacao.
- Perfil, Carteiras e Confirmacao nao possuem frames mobile no Figma; seus layouts seguem os requisitos do README e a documentacao responsiva.

## Criterio de correcao

Somente as duas diferencas marcadas como corrigiveis serao alteradas nesta etapa. Nao sera feito redesign, troca global de icones ou mudanca de fixture apenas para igualar a quantidade visual do frame.
