import { orderSchema, quoteSchema } from '@/contracts'
import { http } from '@/lib/http'

export async function createOrder(input: { quoteId: string; quoteVersion: number; walletId: string; network: 'ethereum' | 'polygon'; idempotencyKey: string }) {
  return orderSchema.parse((await http.post('/orders', { quoteId: input.quoteId, quoteVersion: input.quoteVersion, walletId: input.walletId, network: input.network }, { headers: { 'Idempotency-Key': input.idempotencyKey } })).data)
}

export async function getOrderByKey(idempotencyKey: string) {
  return orderSchema.parse((await http.get(`/orders/by-key/${encodeURIComponent(idempotencyKey)}`)).data)
}

export const parseQuote = (value: unknown) => quoteSchema.parse(value)
