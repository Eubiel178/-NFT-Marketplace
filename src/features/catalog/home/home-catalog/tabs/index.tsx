import type { CatalogSearch } from '@/contracts'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Todos os NFTs', sort: 'recent' },
  { label: 'Novos lançamentos', sort: 'price-asc' },
  { label: 'Em alta', sort: 'price-desc' },
] as const

export interface TabsProps {
  sort: CatalogSearch['sort']
  onSortChange: (sort: CatalogSearch['sort']) => void
}

export function Tabs({ sort, onSortChange }: TabsProps) {
  return (
    <div role="group" aria-label="Ordenar catálogo" className="flex gap-4.5 overflow-x-auto [scrollbar-width:none] sm:gap-5">
      {tabs.map((tab) => (
        <button
          key={tab.sort}
          type="button"
          aria-pressed={sort === tab.sort}
          onClick={() => onSortChange(tab.sort)}
          className={cn(
            'shrink-0 border-b-2 border-transparent pb-0.5 text-body-14 leading-16 whitespace-nowrap text-foreground sm:text-body-15 sm:font-medium',
            sort === tab.sort && 'border-primary text-body-15 font-bold text-text-accent sm:font-medium',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
