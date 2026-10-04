import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { CartItem, CatalogSearch } from '@/contracts'

// Dados privados levam o usuário na key: o cache de uma sessão nunca atende outra.
export const keys = {
  nfts: ['nfts'] as const,
  catalog: (search: CatalogSearch) => ['nfts', 'list', search] as const,
  nft: (id: string) => ['nfts', 'detail', id] as const,
  session: ['session'] as const,
  carts: ['cart'] as const,
  cart: (userId: string | null) => ['cart', userId ?? 'visitor'] as const,
  cartQuotes: ['cart-quote'] as const,
  cartQuote: (userId: string, items: CartItem[], coupon: string) => ['cart-quote', userId, items, coupon] as const,
  checkoutQuotes: ['checkout-quote'] as const,
  checkoutQuote: (userId: string, items: CartItem[], coupon: string) => ['checkout-quote', userId, items, coupon] as const,
  favorites: (userId: string) => ['favorites', userId] as const,
  profile: (userId: string) => ['profile', userId] as const,
  wallets: (userId: string) => ['wallets', userId] as const,
  order: (userId: string, id: string) => ['orders', userId, id] as const,
  orderByKey: (userId: string, idempotencyKey: string) => ['orders', userId, 'by-key', idempotencyKey] as const,
  walletConnection: (userId: string) => ['wallet-connection', userId] as const,
}
export const queryClient = new QueryClient({ defaultOptions: {
  queries: {
    staleTime: 30_000, gcTime: 300_000, refetchOnWindowFocus: true,
    retry: (count, error) => count < 1 && (!axios.isAxiosError(error) || !error.response || error.response.status >= 500),
  },
  mutations: { retry: false },
} })
