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
    <div role="group" aria-label="Ordenar catálogo" className="flex overflow-x-auto [scrollbar-width:none] sm:gap-5">
      {tabs.map((tab) => (
        <button
          key={tab.sort}
          type="button"
          aria-pressed={sort === tab.sort}
          onClick={() => onSortChange(tab.sort)}
          className={cn(
            'relative shrink-0 pb-1 text-body-14 leading-16 whitespace-nowrap text-foreground last:ml-3.5 sm:border-b-2 sm:border-transparent sm:pb-0.5 sm:text-body-15 sm:font-medium sm:last:ml-0',
            sort === tab.sort && 'text-body-15 font-bold text-text-accent after:absolute after:top-5.5 after:right-1.5 after:left-0 after:h-0.5 after:bg-primary sm:border-primary sm:font-medium sm:after:hidden',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
