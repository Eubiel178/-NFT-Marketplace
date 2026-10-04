import type { CartItem, Network, PaymentMethod } from '@/contracts'
import { paymentMethods } from '@/features/checkout'
import { fromWei, toWei } from '@/lib/eth'

// Data do recibo como no frame: "29 Jul, 2026".
export function formatOrderDate(value: string) {
  const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).formatToParts(new Date(value))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((candidate) => candidate.type === type)?.value ?? ''
  return `${part('day')} ${part('month')}, ${part('year')}`
}

// Subtotal do item com o preço do snapshot do pedido, em wei (sem float).
export function receiptLineTotal(item: CartItem) {
  return item.price ? fromWei(toWei(item.price) * BigInt(item.quantity)) : null
}

export const networkLabels: Record<Network, string> = { ethereum: 'Ethereum', polygon: 'Polygon' }

// Explorador da rede em que a transação foi registrada.
const explorers: Record<Network, { name: string; origin: string }> = {
  ethereum: { name: 'Etherscan', origin: 'https://etherscan.io' },
  polygon: { name: 'Polygonscan', origin: 'https://polygonscan.com' },
}

export function transactionExplorer(network: Network, transactionRef: string | null) {
  const explorer = explorers[network]
  return { name: explorer.name, href: transactionRef ? `${explorer.origin}/tx/${encodeURIComponent(transactionRef)}` : explorer.origin }
}

export function paymentMethodLabel(method: PaymentMethod) {
  return paymentMethods.find((candidate) => candidate.value === method)?.label ?? method
}
