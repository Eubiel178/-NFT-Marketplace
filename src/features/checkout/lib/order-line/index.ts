import type { CartLine } from '@/contracts'
import { fromWei, toWei } from '@/lib/eth'

// Total da linha em wei (inteiro), sem float.
export function lineTotal(line: CartLine) {
  return fromWei(toWei(line.nft.price) * BigInt(line.quantity))
}
