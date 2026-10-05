import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { keys } from '@/lib/query'
import { readUserItem, removeUserItem } from '@/lib/user-storage'

import { getOrderByKey, getPendingOrders } from '../../api'

// Pedido que já existe: (1) o criado com a chave guardada (refresh ou queda durante o envio)
// e (2) qualquer pedido pendente do usuário na API, que sobrevive a refresh e a outra aba.
// O pagamento segue para ele antes de qualquer outro estado, inclusive o de carrinho vazio;
// confirmado e recusado são terminais e liberam um novo pagamento.
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

  // Sempre relido ao abrir: o cache de um pedido criado ou resolvido há pouco não vale.
  const open = useQuery({
    queryKey: keys.pendingOrders(userId),
    queryFn: ({ signal }) => getPendingOrders(signal),
    enabled: Boolean(userId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
  })

  // Chave de um pedido que já terminou não vale mais: apaga, para o próximo pagamento usar uma nova.
  const keyedStatus = pending.data?.status
  useEffect(() => {
    if (keyedStatus && keyedStatus !== 'pending') removeUserItem('checkout-idempotency', userId)
  }, [keyedStatus, userId])

  const target = (keyedStatus === 'pending' ? pending.data?.id : undefined) ?? open.data?.[0]?.id
  useEffect(() => {
    if (target) void navigate({ to: '/orders/$orderId', params: { orderId: target } })
  }, [navigate, target])

  const checking = (query: { isPending: boolean; fetchStatus: string }) => query.isPending && query.fetchStatus !== 'idle'
  return checking(pending) || checking(open)
}
