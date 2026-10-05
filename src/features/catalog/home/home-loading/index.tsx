import { Skeleton } from '@/components'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { Mobile } from '../home-hero/mobile'

// No mobile o hero (texto e máscara) não depende da API: aparece já, com a busca e a arte
// como skeletons das mesmas dimensões, para nada se mover quando o catálogo chega.
export function Loading() {
  const isMobile = useMediaQuery('(width < 40rem)')
  const hasSidebar = useMediaQuery('(width >= 64rem)')
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
  // A partir de sm: as mesmas caixas da página carregada (hero com a margem do hero, barra
  // de busca abaixo de lg, filtros e destaque a partir de lg, abas, grade 3×3 e paginação),
  // para o catálogo não deslocar nada quando os dados chegam.
  return (
    <section aria-label="Carregando catálogo" role="status" className="flex flex-col gap-24">
      {!hasSidebar && <Skeleton className="h-11.25 w-full rounded-10" />}
      <Skeleton className="mt-2 -mb-2 h-112.5" />
      <div>
        <div className="lg:flex lg:items-start lg:gap-12">
          {hasSidebar && (
            <div className="flex w-77.5 shrink-0 flex-col gap-6">
              <Skeleton className="h-197.75" />
              <Skeleton className="h-117.5" />
            </div>
          )}
          <div className="min-w-0 flex-1 lg:pt-0.75">
            <div className="flex items-center justify-between gap-6">
              <Skeleton className="h-7 w-93.25" />
              <Skeleton className="h-6 w-44" />
            </div>
            <div className="mt-7 grid grid-cols-3 gap-x-8.5 gap-y-[4.5625rem]">
              {Array.from({ length: 9 }, (_, index) => <Skeleton key={index} className="h-88" />)}
            </div>
          </div>
        </div>
        <div className="mt-14.75 flex justify-end">
          <Skeleton className="h-8.75 w-70.5" />
        </div>
      </div>
    </section>
  )
}
