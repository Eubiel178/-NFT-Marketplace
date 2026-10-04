import type { Nft } from '@/contracts'
import { cn } from '@/lib/utils'

import { isEditionSoldOut } from '../../lib/nft-detail'

export interface EditionsProps {
  nft: Nft
  selected: string | undefined
  onSelect: (edition: string) => void
}

export function Editions({ nft, selected, onSelect }: EditionsProps) {
  return (
    <fieldset>
      <legend className="text-body-15-bold">Edição:</legend>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {(nft.editions ?? []).map((edition) => {
          const soldOut = isEditionSoldOut(nft, edition)
          return (
            <button
              key={edition}
              type="button"
              aria-pressed={edition === selected}
              aria-label={soldOut ? `${edition} (esgotada)` : edition}
              disabled={soldOut}
              onClick={() => onSelect(edition)}
              className={cn(
                'h-7.25 rounded-full border border-border px-1.25 text-body-14 leading-16 text-text-secondary',
                edition === selected && 'border-primary font-bold text-text-accent',
                soldOut && 'cursor-not-allowed text-text-secondary/50 line-through',
              )}
            >
              {edition}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
