import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { CatalogSearch } from '@/contracts'

export const keys = {
  catalog: (search: CatalogSearch) => ['nfts', 'list', search] as const,
  nft: (id: string) => ['nfts', 'detail', id] as const,
  session: ['session'] as const,
  cart: ['cart'] as const,
  favorites: ['favorites'] as const,
  profile: ['profile'] as const,
  wallets: ['wallets'] as const,
  order: (id: string) => ['orders', id] as const,
  user: (userId: string) => ['private', userId] as const,
}
export const queryClient = new QueryClient({ defaultOptions: {
  queries: {
    staleTime: 30_000, gcTime: 300_000, refetchOnWindowFocus: true,
    retry: (count, error) => count < 1 && (!axios.isAxiosError(error) || !error.response || error.response.status >= 500),
  },
  mutations: { retry: false },
} })
