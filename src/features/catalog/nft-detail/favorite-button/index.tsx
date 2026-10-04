import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface FavoriteButtonProps {
  favorite: boolean
  pending: boolean
  onToggle: () => void
  variant: 'labeled' | 'round'
}

// "Favoritar" com texto no desktop; círculo com coração na barra do topo do mobile.
export function FavoriteButton({ favorite, pending, onToggle, variant }: FavoriteButtonProps) {
  if (variant === 'round') {
    return (
      <button type="button" data-favorite-trigger="true" aria-pressed={favorite} aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} disabled={pending} onClick={onToggle} className="grid size-8.75 place-items-center rounded-full border border-border bg-surface-raised text-primary">
        <Heart aria-hidden="true" className={cn('size-4', favorite && 'fill-current')} />
      </button>
    )
  }
  return (
    <button type="button" data-favorite-trigger="true" aria-pressed={favorite} disabled={pending} onClick={onToggle} className="flex h-10.25 w-35.5 items-center justify-center gap-2 rounded-4 border border-primary text-body-15 font-medium leading-16 text-foreground disabled:opacity-60">
      <Heart aria-hidden="true" className={cn('size-5 text-primary', favorite && 'fill-current')} />
      {favorite ? 'Favoritado' : 'Favoritar'}
    </button>
  )
}
