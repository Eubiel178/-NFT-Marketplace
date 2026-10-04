import { Button, Icon } from '@/components'

export interface SearchBarProps {
  defaultValue: string
  onSearch: (value: string) => void
  onOpenFilters: () => void
}

export function SearchBar({ defaultValue, onSearch, onOpenFilters }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Icon src="/assets/figma/mcp/svg/search.svg" className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-text-secondary" />
        <input
          key={defaultValue}
          type="text"
          enterKeyHint="search"
          aria-label="Explorar coleções"
          placeholder="Explorar coleções"
          defaultValue={defaultValue}
          onChange={(event) => onSearch(event.target.value)}
          className="h-11.25 w-full rounded-10 bg-surface-card pr-4 pl-10.5 text-body-14 font-medium leading-16 text-foreground placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <Button variant="filter" onClick={onOpenFilters} aria-label="Abrir filtros" className="min-h-0 size-11.25 shrink-0 rounded-14 p-0">
        <Icon src="/assets/figma/mcp/svg/iconly-curved-filter.svg" className="text-ink" />
      </Button>
    </div>
  )
}
