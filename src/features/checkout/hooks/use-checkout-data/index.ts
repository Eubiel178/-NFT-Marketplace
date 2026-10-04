import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { getProfile, getWallets } from '@/features/account'
import { keys } from '@/lib/query'
import { readUserItem } from '@/lib/user-storage'
import { cartOptions } from '@/shared/api/cart'
import { createQuote } from '@/shared/api/quote'
import { isSessionExpired, sessionOptions } from '@/shared/api/session'

import { getWalletConnection } from '../../api'

// Tudo que o pagamento lê da API: sessão, carrinho, carteiras, perfil e cotação.
export function useCheckoutData() {
  const navigate = useNavigate()
  const session = useQuery(sessionOptions)
  const user = session.data?.user ?? null
  const userId = user?.id ?? ''
  const cart = useQuery({ ...cartOptions(userId), enabled: Boolean(userId) })
  const wallets = useQuery({ queryKey: keys.wallets(userId), queryFn: ({ signal }) => getWallets(signal), enabled: Boolean(userId) })
  // A carteira conectada é a escolhida ao abrir o pagamento, então a conexão é lida antes do formulário.
  const connection = useQuery({ queryKey: keys.walletConnection(userId), queryFn: ({ signal }) => getWalletConnection(signal), enabled: Boolean(userId) })
  const profile = useQuery({ queryKey: keys.profile(userId), queryFn: ({ signal }) => getProfile(signal), enabled: Boolean(userId) })
  const [coupon] = useState(() => (userId ? (readUserItem('checkout-coupon', userId) ?? '') : ''))
  const lines = cart.data?.items ?? []
  const items = lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }))
  const quote = useQuery({
    queryKey: keys.checkoutQuote(userId, items, coupon),
    queryFn: () => createQuote(items, coupon || undefined),
    enabled: items.length > 0,
  })

  const expired = [session.error, cart.error, wallets.error, quote.error].some(isSessionExpired)
  useEffect(() => {
    if (expired) void navigate({ to: '/login', search: { redirect: '/checkout', expired: true } })
  }, [expired, navigate])

  return {
    user,
    userId,
    cart,
    lines,
    items,
    wallets,
    profile,
    connection,
    coupon,
    quote,
    loading: cart.isPending || wallets.isPending || profile.isPending || connection.isPending,
    failed: cart.isError || wallets.isError,
    retry: () => {
      void cart.refetch()
      void wallets.refetch()
      void profile.refetch()
    },
  }
}
