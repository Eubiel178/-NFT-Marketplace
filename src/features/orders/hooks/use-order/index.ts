import { useEffect } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { keys } from '@/lib/query'
import { subscribeOrder, useRealtimeConnected } from '@/realtime'
import { sessionOptions } from '@/shared/api/session'

import { getOrder } from '../../api'

// Pedido do usuário atual. Mudanças de status chegam por order.updated; o REST só
// reconcilia ao carregar e a cada (re)conexão do socket. Quando o pedido é
// confirmado, a API já tirou do carrinho só o que foi comprado: o carrinho é relido.
export function useOrder(id: string) {
  const queryClient = useQueryClient()
  const realtimeConnected = useRealtimeConnected()
  const session = useQuery(sessionOptions)
  const userId = session.data?.user?.id ?? ''
  const order = useQuery({
    queryKey: keys.order(userId, id),
    queryFn: ({ signal }) => getOrder(id, signal),
    enabled: Boolean(userId),
  })
  const confirmed = order.data?.status === 'confirmed'

  useEffect(() => (userId ? subscribeOrder(userId, id) : undefined), [id, userId])

  useEffect(() => {
    if (confirmed) void queryClient.invalidateQueries({ queryKey: keys.cart(userId) })
  }, [confirmed, queryClient, userId])

  return { order, realtimeConnected }
}
