import { useEffect, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { PaymentMethod } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'

import { connectWallet, disconnectWallet, getWalletConnection } from '../../api'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'rejected'

// Simulação da extensão da carteira: conectar, recusar (cenário wallet-rejected) e
// desconectar passam pelo MSW. Ao abrir o pagamento, a carteira escolhida é
// conectada com o método destacado no frame (Coinbase Wallet).
export function useWalletConnection(userId: string, walletId: string) {
  const queryClient = useQueryClient()
  const key = keys.walletConnection(userId)
  const [method, setMethod] = useState<PaymentMethod>('coinbase')
  // Até o usuário desconectar, a carteira sem conexão está prestes a ser conectada
  // automaticamente: o estado é "conectando", não "desconectada".
  const [disconnectedByUser, setDisconnectedByUser] = useState(false)
  const connection = useQuery({ queryKey: key, queryFn: ({ signal }) => getWalletConnection(signal), enabled: Boolean(userId) })
  const connect = useMutation({
    mutationFn: (input: { walletId: string; method: PaymentMethod }) => connectWallet(input.walletId, input.method),
    onSuccess: (next) => queryClient.setQueryData(key, next),
  })
  const disconnect = useMutation({
    mutationFn: (id: string) => disconnectWallet(id),
    onSuccess: () => queryClient.setQueryData(key, null),
  })

  const current = connection.data ?? null
  const connectedHere = current?.walletId === walletId
  const autoConnected = useRef(false)
  useEffect(() => {
    if (autoConnected.current || disconnectedByUser || connection.isPending || !walletId || connectedHere) return
    autoConnected.current = true
    connect.mutate({ walletId, method: current?.method ?? 'coinbase' })
  }, [connect, connectedHere, connection.isPending, current?.method, disconnectedByUser, walletId])

  const status: ConnectionStatus = connect.isPending || disconnect.isPending
    ? 'connecting'
    : connect.isError
      ? 'rejected'
      : connectedHere
        ? 'connected'
        : connection.isPending || (walletId && !disconnectedByUser)
          ? 'connecting'
          : 'disconnected'

  return {
    status,
    // Durante a tentativa (ou depois de uma recusa) vale o método escolhido, não o conectado antes.
    method: connect.isPending || connect.isError || !connectedHere || !current ? method : current.method,
    error: connect.isError ? (parseHttpError(connect.error).message ?? 'Não foi possível conectar a carteira.') : '',
    choose: (next: PaymentMethod) => {
      setMethod(next)
      connect.mutate({ walletId, method: next })
    },
    reconnect: (nextWalletId: string) => connect.mutate({ walletId: nextWalletId, method: connectedHere && current ? current.method : method }),
    disconnect: () => {
      setDisconnectedByUser(true)
      if (current) disconnect.mutate(current.walletId)
      connect.reset()
    },
  }
}
