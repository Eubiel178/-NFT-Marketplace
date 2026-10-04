import { queryOptions } from '@tanstack/react-query'

import { catalogSchema, nftSchema, type CatalogSearch } from '@/contracts'
import { http } from '@/lib/http'
import { keys } from '@/lib/query'

export const catalogOptions = (search: CatalogSearch) => queryOptions({
  queryKey: keys.catalog(search),
  queryFn: async ({ signal }) => catalogSchema.parse((await http.get('/nfts', { params: search, signal })).data),
})

export const nftOptions = (id: string) => queryOptions({
  queryKey: keys.nft(id),
  queryFn: async ({ signal }) => nftSchema.parse((await http.get(`/nfts/${encodeURIComponent(id)}`, { signal })).data),
})
