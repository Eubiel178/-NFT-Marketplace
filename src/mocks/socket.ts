import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import { env } from '@/lib/env'
import type { NftUpdated } from '@/contracts'

// MSW normalizes the Socket.IO transport path to its namespace ('/').
const url = new URL('/', env.socketUrl)
url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
const channel = ws.link(url.toString())
const clients = new Set<ReturnType<typeof toSocketIo>>()
export const socketHandlers = [channel.addEventListener('connection', (connection) => {
  const client = toSocketIo(connection)
  clients.add(client)
  // Version 0.2 negotiates the handshake, but does not implement heartbeat.
  const heartbeat = setInterval(() => connection.client.send('2'), 20_000)
  connection.client.addEventListener('close', () => { clearInterval(heartbeat); clients.delete(client) })
})]
export function broadcastNft(event: NftUpdated) {
  for (const client of clients) client.client.emit('nft.updated', event)
}
