import { Skeleton } from '@/components'

// Mesmas caixas da página carregada: título, descrição, cinco linhas de campos, botão e a seção secundária.
export function WalletsSkeleton() {
  return (
    <div role="status" aria-label="Carregando carteiras">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <div className="mt-9.5 grid gap-x-7 gap-y-7.75 sm:grid-cols-2">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index}>
            <Skeleton className="mb-0.5 h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-10 w-32.75" />
      <Skeleton className="mt-8 h-4 w-48" />
      <Skeleton className="mt-2.75 h-4 w-80 max-w-full" />
    </div>
  )
}
