import { Heart } from 'lucide-react'

import { useFavorite } from '@/features/favorites'
import { cn } from '@/lib/utils'

// Coração do card no frame mobile; no desktop o favorito fica no detalhe.
export function Favorite({ nftId, name }: { nftId: string; name: string }) {
  const { favorite, toggle, isPending } = useFavorite(nftId)

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      disabled={isPending}
      onClick={toggle}
      className="absolute top-3 right-2.5 grid size-7 place-items-center rounded-full border border-border bg-surface-raised text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
    >
      <Heart aria-hidden="true" className={cn('size-3.5', favorite && 'fill-current')} strokeWidth={2} />
    </button>
  )
}
