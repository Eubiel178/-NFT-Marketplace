import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components'
import type { CatalogSearch } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'
import { HomeHero } from '@/features/catalog/home/home-hero'

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
      <div className="home-page home-loading">
        {backgroundArtwork ? (
          <HomeHero artwork={backgroundArtwork} />
        ) : (
          <section className="home-hero-desktop">
            <Skeleton className="home-loading-hero" />
          </section>
        )}
        <div className="home-loading-products">
          <Skeleton className="h-[470px] w-full" />
        </div>
      </div>
    </div>
  )
}
