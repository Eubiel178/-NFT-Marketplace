import { useQuery } from '@tanstack/react-query'

import { Button, Skeleton } from '@/components'
import type { CatalogSearch } from '@/contracts'
import { parseHttpError } from '@/lib/http'

import { catalogOptions, nftOptions } from './api'
import { HomePage } from './home'
import { NftDetail } from './nft-detail'

export { HomePage }

export const CatalogPage = HomePage

export function NftPage({ id }: { id: string }) {
  const result = useQuery(nftOptions(id))
  const related = useQuery(catalogOptions({ q: '', category: 'all', collection: 'all', network: 'all', sort: 'recent', page: 1 } satisfies CatalogSearch))
  if (result.isPending) return <section className="nft-detail-page nft-detail-loading" role="status" aria-label="Carregando NFT"><div className="nft-detail-product"><Skeleton className="nft-detail-loading-gallery" /><div className="nft-detail-loading-summary"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-6 w-1/3" /><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-2/3" /></div></div></section>
  if (result.isError) return <section role="alert"><h1>{parseHttpError(result.error).status === 404 ? 'NFT não encontrado' : 'Falha ao carregar NFT'}</h1><Button onClick={() => void result.refetch()}>Tentar novamente</Button></section>
  return <NftDetail.Root nft={result.data} related={related.data?.items.slice(3, 8) ?? []} relatedLoading={related.isPending} relatedError={related.isError} onRetryRelated={() => void related.refetch()} />
}
