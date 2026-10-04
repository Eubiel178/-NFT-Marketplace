import { Skeleton } from '@/components'

// Mesmas caixas do formulário carregado: rótulo, campo de 40px, avatar, senha e botão.
export function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Carregando perfil">
      <Skeleton className="h-4 w-52" />
      <div className="mt-9.5 grid gap-x-7 gap-y-7.5 sm:grid-cols-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index}>
            <Skeleton className="mb-4.25 h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="sm:-mt-1.75">
          <Skeleton className="mb-2.5 h-4 w-16" />
          <div className="flex items-center gap-6">
            <Skeleton className="size-12.5 rounded-full" />
            <Skeleton className="h-10 w-24.5" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-8 h-4 w-32" />
      <div className="mt-5.75 grid gap-x-7 sm:grid-cols-2">
        <div className="flex flex-col gap-y-5.75">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Skeleton className="mb-3 h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="mt-8 h-10 w-32.75" />
    </div>
  )
}
