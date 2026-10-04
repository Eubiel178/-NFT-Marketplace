import { io } from 'socket.io-client'
import { nftSchema, orderUpdatedSchema, type NftUpdated, type Nft, type OrderUpdated } from '@/contracts'
import { env } from './env'
import { keys, queryClient } from './query'

const privateDisconnectors = new Set<() => void>()

export function connectCatalog(onConnection: (connected: boolean) => void) {
  const socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
  const versions = new Map<string, number>()
  function reconcile() { void queryClient.invalidateQueries({ queryKey: ['nfts'] }) }
  function onNft(event: NftUpdated) {
    const parsed = nftSchema.safeParse(event?.nft)
    if (!parsed.success || parsed.data.id !== event.resourceId || parsed.data.version !== event.version) return
    const cached = queryClient.getQueryData<Nft>(keys.nft(event.resourceId))
    const latest = Math.max(versions.get(event.resourceId) || 0, cached?.version || 0)
    if (event.version <= latest) return
    versions.set(event.resourceId, event.version)
    // Re-fetch authoritative REST resources instead of copying event payloads to UI.
    reconcile()
    void queryClient.invalidateQueries({ queryKey: keys.cart })
    void queryClient.invalidateQueries({ queryKey: ['cart-quote'] })
  }
  function onConnect() { onConnection(true); reconcile() }
  function onDisconnect() { onConnection(false) }
  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('nft.updated', onNft)
  socket.connect()
  return () => { socket.off('connect', onConnect); socket.off('disconnect', onDisconnect); socket.off('nft.updated', onNft); socket.disconnect(); versions.clear() }
}

export function connectNftUpdates(onUpdate: (event: NftUpdated) => void, onConnection?: (connected: boolean) => void) {
  const socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
  const versions = new Map<string, number>()
  let hasConnected = false
  function reconcile() {
    void queryClient.invalidateQueries({ queryKey: keys.cart })
    void queryClient.invalidateQueries({ queryKey: ['cart-quote'] })
    void queryClient.invalidateQueries({ queryKey: ['checkout-quote'] })
  }
  function onNft(event: NftUpdated) {
    const parsed = nftSchema.safeParse(event?.nft)
    if (!parsed.success || parsed.data.id !== event.resourceId || parsed.data.version !== event.version) return
    const cached = queryClient.getQueryData<Nft>(keys.nft(event.resourceId))
    const latest = Math.max(versions.get(event.resourceId) || 0, cached?.version || 0)
    if (event.version <= latest) return
    versions.set(event.resourceId, event.version)
    reconcile()
    onUpdate(event)
  }
  function onConnect() {
    const reconnecting = hasConnected
    hasConnected = true
    onConnection?.(true)
    if (reconnecting) reconcile()
  }
  function onDisconnect() { onConnection?.(false) }
  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('nft.updated', onNft)
  socket.connect()
  return () => { socket.off('connect', onConnect); socket.off('disconnect', onDisconnect); socket.off('nft.updated', onNft); socket.disconnect(); versions.clear() }
}

export function connectOrder(userId: string, orderId: string, onConnection?: (connected: boolean) => void) {
  const socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
  const versions = new Map<string, number>()
  function reconcile() { void queryClient.invalidateQueries({ queryKey: keys.order(orderId) }) }
  function onConnect() {
    socket.emit('order.subscribe', { userId, orderId })
    onConnection?.(true)
    reconcile()
  }
  function onDisconnect() { onConnection?.(false) }
  function onOrder(event: OrderUpdated) {
    const parsed = orderUpdatedSchema.safeParse(event)
    if (!parsed.success || parsed.data.userId !== userId || parsed.data.resourceId !== orderId) return
    const cached = queryClient.getQueryData<{ version?: number }>(keys.order(orderId))
    const latest = Math.max(versions.get(orderId) ?? 0, cached?.version ?? 0)
    if (parsed.data.version <= latest) return
    versions.set(orderId, parsed.data.version)
    reconcile()
  }
  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('order.updated', onOrder)
  socket.connect()
  const cleanup = () => {
    socket.off('connect', onConnect)
    socket.off('disconnect', onDisconnect)
    socket.off('order.updated', onOrder)
    socket.disconnect()
    versions.clear()
    privateDisconnectors.delete(cleanup)
  }
  privateDisconnectors.add(cleanup)
  return cleanup
}

export function disconnectPrivateSubscriptions() {
  for (const cleanup of [...privateDisconnectors]) cleanup()
}
