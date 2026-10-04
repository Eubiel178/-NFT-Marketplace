import type { Nft } from '@/contracts'

export function isEditionSoldOut(nft: Nft, edition: string) {
  return nft.soldOutEditions?.includes(edition) ?? false
}

// Edição destacada no Figma (1/50, a terceira) quando estiver disponível; senão a primeira à venda.
export function initialEdition(nft: Nft) {
  const editions = nft.editions ?? []
  const available = editions.filter((edition) => !isEditionSoldOut(nft, edition))
  const featured = editions[2]
  return featured && available.includes(featured) ? featured : available[0]
}

// Quantidade inteira entre 1 e o estoque do NFT.
export function clampQuantity(quantity: number, available: number) {
  return Math.min(Math.max(1, Math.trunc(quantity)), Math.max(1, available))
}

// Frase para o aviso ao vivo quando o nft.updated muda preço ou estoque.
export function describeNftChange(previous: Nft, next: Nft) {
  const changes: string[] = []
  if (previous.price !== next.price) changes.push(`preço atualizado para ${next.price} ETH`)
  if (previous.available !== next.available) {
    changes.push(next.available > 0 ? `${next.available} unidades disponíveis` : 'esgotado')
  }
  if (changes.length === 0) return ''
  const text = changes.join(', ')
  return `${next.name}: ${text}.`
}

// Estrelas cheias a partir da nota "4.8": a parte inteira, sem float.
export function filledStars(rating: string) {
  const whole = Number(rating.split('.')[0])
  return Array.from({ length: 5 }, (_, index) => index < whole)
}
