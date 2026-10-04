import { Icon } from '@/components'
import type { CatalogSearch } from '@/contracts'

import { isCatalogSort } from '../../../lib/catalog-search'

export interface SortProps {
  sort: CatalogSearch['sort']
  onSortChange: (sort: CatalogSearch['sort']) => void
}

export function Sort({ sort, onSortChange }: SortProps) {
  return (
    <label className="flex items-center gap-1 text-body-15 leading-16 whitespace-nowrap">
      Ordenar por:
      <span className="relative">
        <select
          aria-label="Ordenar por"
          value={sort}
          onChange={(event) => { if (isCatalogSort(event.target.value)) onSortChange(event.target.value) }}
          className="cursor-pointer appearance-none bg-transparent pr-4 text-foreground"
        >
          <option value="recent">Listados recentemente</option>
          <option value="name">Nome</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
        </select>
        <Icon src="/assets/figma/mcp/svg/arrow-down.svg" className="pointer-events-none absolute top-1/2 right-0 size-3 -translate-y-1/2" />
      </span>
    </label>
  )
}
