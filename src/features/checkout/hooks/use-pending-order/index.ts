import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { keys } from '@/lib/query'
import { readUserItem } from '@/lib/user-storage'

import { getOrderByKey } from '../../api'

// Pedido já criado com a chave guardada (refresh ou queda durante o envio): segue
// para ele antes de qualquer outro estado da página, inclusive o de carrinho vazio.
export function usePendingOrder(userId: string) {
  const navigate = useNavigate()
  // Só a chave que já existia ao abrir a página: a criada agora pelo envio não é pendência.
  const [key] = useState(() => (userId ? readUserItem('checkout-idempotency', userId) : null))
  const pending = useQuery({
    queryKey: keys.orderByKey(userId, key ?? ''),
    queryFn: ({ signal }) => getOrderByKey(key ?? '', signal),
    enabled: Boolean(userId && key),
    retry: false,
  })

  useEffect(() => {
    if (pending.data) void navigate({ to: '/orders/$orderId', params: { orderId: pending.data.id } })
  }, [navigate, pending.data])

  return pending.isPending && pending.fetchStatus !== 'idle'
}
