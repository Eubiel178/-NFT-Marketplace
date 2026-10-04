import type { CartLine } from '@/contracts'
import { fromWei, toWei } from '@/lib/eth'

// Total da linha em ETH, calculado em wei (inteiro), sem float.
export function lineTotal(line: CartLine) {
  return fromWei(toWei(line.nft.price) * BigInt(line.quantity))
}

// Estoque do NFT é compartilhado entre as edições: a linha pode crescer até o
// que sobra depois das outras edições do mesmo NFT no carrinho.
export function maxQuantity(line: CartLine, lines: readonly CartLine[]) {
  const others = lines
    .filter((other) => other.nftId === line.nftId && other.editionId !== line.editionId)
    .reduce((total, other) => total + other.quantity, 0)
  return Math.max(line.quantity, line.nft.available - others)
}

export function lineKey(line: { nftId: string; editionId: string }) {
  return `${line.nftId}:${line.editionId}`
}
