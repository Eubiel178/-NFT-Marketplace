import type { Quote } from '@/contracts'

export function quotesMatch(first: Quote, second: Quote) {
  return (
    first.subtotal === second.subtotal &&
    first.discount === second.discount &&
    first.networkFee === second.networkFee &&
    first.total === second.total &&
    first.items.length === second.items.length &&
    first.items.every((item, index) => {
      const other = second.items[index]
      return item.nftId === other?.nftId && item.editionId === other.editionId && item.quantity === other.quantity && item.price === other.price
    })
  )
}

// O que mudou entre a cotação vista e a revalidada, para pedir nova confirmação.
export function describeQuoteChange(previous: Quote, next: Quote) {
  const changes: string[] = []
  for (const item of next.items) {
    const before = previous.items.find((candidate) => candidate.nftId === item.nftId && candidate.editionId === item.editionId)
    const name = item.name ?? item.nftId
    if (!before) changes.push(`${name} entrou na compra`)
    else if (before.price !== item.price) changes.push(`${name}: preço de ${before.price} para ${item.price} ETH`)
    else if (before.quantity !== item.quantity) changes.push(`${name}: quantidade de ${before.quantity} para ${item.quantity}`)
  }
  for (const item of previous.items) {
    if (!next.items.some((candidate) => candidate.nftId === item.nftId && candidate.editionId === item.editionId)) changes.push(`${item.name ?? item.nftId} saiu da compra (indisponível)`)
  }
  if (previous.discount !== next.discount) changes.push(`desconto de ${previous.discount} para ${next.discount} ETH`)
  if (previous.networkFee !== next.networkFee) changes.push(`taxa de rede de ${previous.networkFee} para ${next.networkFee} ETH`)
  if (previous.total !== next.total) changes.push(`total de ${previous.total} para ${next.total} ETH`)
  return changes
}
