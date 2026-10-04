import { z } from 'zod'

import { orderSchema, walletConnectionSchema, type Collector, type Network, type PaymentMethod } from '@/contracts'
import { http } from '@/lib/http'

export interface OrderInput {
  quoteId: string
  quoteVersion: number
  walletId: string
  network: Network
  collector: Collector
  idempotencyKey: string
}

export async function createOrder({ idempotencyKey, ...body }: OrderInput) {
  return orderSchema.parse((await http.post('/orders', body, { headers: { 'Idempotency-Key': idempotencyKey } })).data)
}

export async function getOrderByKey(idempotencyKey: string, signal?: AbortSignal) {
  return orderSchema.parse((await http.get(`/orders/by-key/${encodeURIComponent(idempotencyKey)}`, { signal })).data)
}

export async function getWalletConnection(signal?: AbortSignal) {
  return z.object({ connection: walletConnectionSchema.nullable() }).parse((await http.get('/wallets/connection', { signal })).data).connection
}

export async function connectWallet(walletId: string, method: PaymentMethod) {
  return walletConnectionSchema.parse((await http.post(`/wallets/${encodeURIComponent(walletId)}/connect`, { method })).data)
}

export async function disconnectWallet(walletId: string) {
  await http.post(`/wallets/${encodeURIComponent(walletId)}/disconnect`)
}
