import { io } from 'socket.io-client'
import { nftSchema, type NftUpdated, type Nft } from '@/contracts'
import { env } from './env'
import { keys, queryClient } from './query'

// Public catalog only. Private subscriptions are intentionally not enabled yet.
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
  }
  function onConnect() { onConnection(true); reconcile() }
  function onDisconnect() { onConnection(false) }
  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('nft.updated', onNft)
  socket.connect()
  return () => { socket.off('connect', onConnect); socket.off('disconnect', onDisconnect); socket.off('nft.updated', onNft); socket.disconnect(); versions.clear() }
}
