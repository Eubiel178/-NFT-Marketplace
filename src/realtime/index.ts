import { useSyncExternalStore } from 'react'

import { io } from 'socket.io-client'

import { nftSchema, orderUpdatedSchema, type Nft, type NftUpdated, type Order } from '@/contracts'
import { env } from '@/lib/env'
import { keys, queryClient } from '@/lib/query'

// Um único socket por aba. Eventos só invalidam queries: o REST continua sendo a
// fonte da verdade, e o payload do evento nunca é copiado para o cache.
const socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })

const versions = new Map<string, number>()
// eventIds já processados: o mesmo evento reenviado é descartado mesmo com versão mais nova.
const seenEventIds = new Set<string>()
const maxSeenEventIds = 500
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

// Registra o eventId e informa se ele ainda não tinha sido visto. A memória é limitada: o mais antigo sai primeiro.
function isNewEvent(eventId: string) {
  if (seenEventIds.has(eventId)) return false
  seenEventIds.add(eventId)
  if (seenEventIds.size > maxSeenEventIds) {
    const oldest = seenEventIds.values().next().value
    if (oldest !== undefined) seenEventIds.delete(oldest)
  }
  return true
}

function reconcileNfts() {
  void queryClient.invalidateQueries({ queryKey: keys.nfts })
  void queryClient.invalidateQueries({ queryKey: keys.carts })
  void queryClient.invalidateQueries({ queryKey: keys.cartQuotes })
  void queryClient.invalidateQueries({ queryKey: keys.checkoutQuotes })
}

function subscribeOrderOnServer({ userId, orderId }: { userId: string; orderId: string }) {
  socket.emit('order.subscribe', { userId, orderId })
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
  if (!isNewEvent(event.eventId)) return
  const cached = queryClient.getQueryData<Nft>(keys.nft(event.resourceId))
  if (!acceptVersion(`nft:${event.resourceId}`, event.version, cached?.version)) return
  reconcileNfts()
  for (const listener of nftListeners) listener(event)
}

function onOrderUpdated(payload: unknown) {
  const parsed = orderUpdatedSchema.safeParse(payload)
  if (!parsed.success) return
  const { eventId, userId, resourceId, version } = parsed.data
  // Só pedidos assinados nesta sessão, do usuário que assinou, são aceitos.
  const subscription = orderSubscriptions.get(resourceId)
  if (!subscription || subscription.userId !== userId) return
  if (!isNewEvent(eventId)) return
  const cached = queryClient.getQueryData<Order>(keys.order(userId, resourceId))
  if (!acceptVersion(`order:${resourceId}`, version, cached?.version)) return
  void queryClient.invalidateQueries({ queryKey: keys.order(userId, resourceId) })
}

export function startRealtime() {
  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('nft.updated', onNftUpdated)
  socket.on('order.updated', onOrderUpdated)
  socket.connect()
  return () => {
    socket.off('connect', onConnect)
    socket.off('disconnect', onDisconnect)
    socket.off('nft.updated', onNftUpdated)
    socket.off('order.updated', onOrderUpdated)
    socket.disconnect()
  }
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
    if (socket.connected) subscribeOrderOnServer({ userId, orderId })
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
  versions.clear()
  seenEventIds.clear()
  if (socket.connected || socket.active) {
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
