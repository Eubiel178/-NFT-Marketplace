import { useSyncExternalStore } from 'react'

import type { Socket } from 'socket.io-client'

import { nftSchema, orderUpdatedSchema, type Nft, type NftUpdated, type Order } from '@/contracts'
import { env } from '@/lib/env'
import { keys, queryClient } from '@/lib/query'

// Um único socket por aba. Eventos só invalidam queries: o REST continua sendo a
// fonte da verdade, e o payload do evento nunca é copiado para o cache.
// O socket.io-client captura o WebSocket ao ser avaliado, então só é carregado em
// startRealtime(), depois de o MSW estar ativo (isso permite baixar o resto da
// aplicação em paralelo com o worker). Até lá `socket` é nulo e as assinaturas ficam
// registradas: onConnect envia todas.
let socket: Socket | null = null

const versions = new Map<string, number>()
const nftListeners = new Set<(event: NftUpdated) => void>()
const connectionListeners = new Set<() => void>()
const orderSubscriptions = new Map<string, { userId: string; orderId: string; count: number }>()
let connected: boolean | null = null
let hasConnected = false

function setConnected(next: boolean) {
  connected = next
  for (const listener of connectionListeners) listener()
}

// Aceita apenas versões mais novas que a última vista no socket e no cache:
// duplicatas e eventos antigos são descartados sem efeito.
function acceptVersion(resource: string, version: number, cachedVersion: number | undefined) {
  const latest = Math.max(versions.get(resource) ?? 0, cachedVersion ?? 0)
  if (version <= latest) return false
  versions.set(resource, version)
  return true
}

function reconcileNfts() {
  void queryClient.invalidateQueries({ queryKey: keys.nfts })
  void queryClient.invalidateQueries({ queryKey: keys.carts })
  void queryClient.invalidateQueries({ queryKey: keys.cartQuotes })
  void queryClient.invalidateQueries({ queryKey: keys.checkoutQuotes })
}

function subscribeOrderOnServer({ userId, orderId }: { userId: string; orderId: string }) {
  socket?.emit('order.subscribe', { userId, orderId })
  void queryClient.invalidateQueries({ queryKey: keys.order(userId, orderId) })
}

function onConnect() {
  const reconnecting = hasConnected
  hasConnected = true
  setConnected(true)
  if (reconnecting) reconcileNfts()
  for (const subscription of orderSubscriptions.values()) subscribeOrderOnServer(subscription)
}

function onDisconnect() {
  setConnected(false)
}

function onNftUpdated(event: NftUpdated) {
  const parsed = nftSchema.safeParse(event?.nft)
  if (!parsed.success || parsed.data.id !== event.resourceId || parsed.data.version !== event.version) return
  const cached = queryClient.getQueryData<Nft>(keys.nft(event.resourceId))
  if (!acceptVersion(`nft:${event.resourceId}`, event.version, cached?.version)) return
  reconcileNfts()
  for (const listener of nftListeners) listener(event)
}

function onOrderUpdated(payload: unknown) {
  const parsed = orderUpdatedSchema.safeParse(payload)
  if (!parsed.success) return
  const { userId, resourceId, version } = parsed.data
  // Só pedidos assinados nesta sessão, do usuário que assinou, são aceitos.
  const subscription = orderSubscriptions.get(resourceId)
  if (!subscription || subscription.userId !== userId) return
  const cached = queryClient.getQueryData<Order>(keys.order(userId, resourceId))
  if (!acceptVersion(`order:${resourceId}`, version, cached?.version)) return
  void queryClient.invalidateQueries({ queryKey: keys.order(userId, resourceId) })
}

export async function startRealtime() {
  if (socket) return
  const { io } = await import('socket.io-client')
  const created = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
  socket = created
  created.on('connect', onConnect)
  created.on('disconnect', onDisconnect)
  created.on('nft.updated', onNftUpdated)
  created.on('order.updated', onOrderUpdated)
  created.connect()
}

export function subscribeNftUpdates(listener: (event: NftUpdated) => void) {
  nftListeners.add(listener)
  return () => { nftListeners.delete(listener) }
}

export function subscribeOrder(userId: string, orderId: string) {
  const current = orderSubscriptions.get(orderId)
  if (current && current.userId === userId) current.count += 1
  else {
    orderSubscriptions.set(orderId, { userId, orderId, count: 1 })
    if (socket?.connected) subscribeOrderOnServer({ userId, orderId })
  }
  return () => {
    const subscription = orderSubscriptions.get(orderId)
    if (!subscription || subscription.userId !== userId) return
    subscription.count -= 1
    if (subscription.count === 0) orderSubscriptions.delete(orderId)
  }
}

// Logout e troca de usuário: descarta assinaturas privadas e reabre a conexão,
// para que o servidor também esqueça as assinaturas da sessão anterior.
export function resetPrivateRealtime() {
  orderSubscriptions.clear()
  for (const resource of versions.keys()) if (resource.startsWith('order:')) versions.delete(resource)
  if (socket && (socket.connected || socket.active)) {
    socket.disconnect()
    socket.connect()
  }
}

function subscribeConnection(listener: () => void) {
  connectionListeners.add(listener)
  return () => { connectionListeners.delete(listener) }
}

function getConnected() {
  return connected
}

export function useRealtimeConnected() {
  return useSyncExternalStore(subscribeConnection, getConnected, getConnected)
}
