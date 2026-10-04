import { Skeleton } from '@/components'

export function Loading() {
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
