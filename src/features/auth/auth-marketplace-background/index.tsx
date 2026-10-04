import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components'
import type { CatalogSearch } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'
import { Hero } from '@/features/catalog/home/home-hero'

const backgroundSearch = {
  q: '',
  category: 'all',
  collection: 'all',
  network: 'all',
  sort: 'recent',
  page: 1,
} satisfies CatalogSearch

export function AuthMarketplaceBackground() {
  const backgroundCatalog = useQuery({
    ...catalogOptions(backgroundSearch),
  })
  const backgroundArtwork = backgroundCatalog.data?.items[0]

  return (
    <div className="auth-marketplace-background" aria-hidden="true" inert>
      <div className="mx-auto flex min-h-full w-full max-w-content flex-col gap-24">
        {backgroundArtwork ? <Hero artwork={backgroundArtwork} /> : <Skeleton className="h-112.5" />}
        <Skeleton className="h-117.5 w-full" />
      </div>
    </div>
  )
}
