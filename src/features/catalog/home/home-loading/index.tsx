import { Skeleton } from '@/components'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { Mobile } from '../home-hero/mobile'

// No mobile o hero (texto e máscara) não depende da API: aparece já, com a busca e a arte
// como skeletons das mesmas dimensões, para nada se mover quando o catálogo chega.
export function Loading() {
  const isMobile = useMediaQuery('(width < 40rem)')
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-11.25 w-full rounded-10" />
        <Mobile />
        <section aria-label="Carregando catálogo" role="status" className="grid grid-cols-2 gap-4">
          {Array.from({ length: 9 }, (_, index) => <Skeleton key={index} className="h-75" />)}
        </section>
      </div>
    )
  }
  return (
    <section aria-label="Carregando catálogo" role="status" className="flex flex-col gap-4 sm:gap-24">
      <Skeleton className="h-47.5 sm:h-112.5" />
      <div className="grid gap-12">
        <Skeleton className="h-117.5 w-full max-sm:hidden" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => <Skeleton key={index} className="h-75" />)}
        </div>
      </div>
    </section>
  )
}
