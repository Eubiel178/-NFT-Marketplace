import { useState } from 'react'

import { Button, Filters } from '@/components'

export interface HomeFiltersProps {
  collections: readonly { value: string; label: string; count: string }[]
  selectedCollection: string
  selectedNetwork: 'all' | 'ethereum' | 'polygon'
  priceMin: string
  priceMax: string
  onCollectionChange: (collection: string) => void
  onNetworkChange: (network: 'all' | 'ethereum' | 'polygon') => void
  onPriceApply: (priceMin: string, priceMax: string) => void
}

export function HomeFilters({ collections, selectedCollection, selectedNetwork, priceMin, priceMax, onCollectionChange, onNetworkChange, onPriceApply }: HomeFiltersProps) {
  const [draftPriceMin, setDraftPriceMin] = useState(priceMin)
  const [draftPriceMax, setDraftPriceMax] = useState(priceMax)

  return (
    <Filters.Root className="home-filters" aria-label="Filtros do catálogo">
       <Filters.Group title="Coleções">
         {collections.map((collection) => (
           <button key={collection.value} type="button" className="home-filter-option" aria-pressed={selectedCollection === collection.value} onClick={() => onCollectionChange(selectedCollection === collection.value ? 'all' : collection.value)}>
             <span className={selectedCollection === collection.value ? 'home-filter-dot is-active' : 'home-filter-dot'} aria-hidden="true" />
             <span>{collection.label}</span>
             <span className="home-filter-count">({collection.count})</span>
           </button>
        ))}
      </Filters.Group>
       <Filters.Group title="Faixa de preço" className="border-t border-border pt-5">
        <div className="home-price-filter" aria-label="Faixa de preço">
          <div className="home-price-track">
            <input aria-label="Preço mínimo" type="range" min="0" max="2.29" step="0.01" value={draftPriceMin} onChange={(event) => setDraftPriceMin(event.target.value)} />
            <input aria-label="Preço máximo" type="range" min="0" max="2.29" step="0.01" value={draftPriceMax} onChange={(event) => setDraftPriceMax(event.target.value)} />
          </div>
          <output className="text-caption-12-regular text-text-secondary">{`${draftPriceMin} - ${draftPriceMax} ETH`}</output>
        </div>
        <Button variant="primarySolid" size="sm" className="home-filter-apply" disabled={draftPriceMin === priceMin && draftPriceMax === priceMax} onClick={() => onPriceApply(draftPriceMin, draftPriceMax)}>Aplicar</Button>
      </Filters.Group>
       <Filters.Group title="Rede" className="border-t border-border pt-5">
        {(['ethereum', 'polygon'] as const).map((network) => (
          <button key={network} type="button" className="home-filter-option" aria-pressed={selectedNetwork === network} onClick={() => onNetworkChange(selectedNetwork === network ? 'all' : network)}>
            <span className={selectedNetwork === network ? 'home-filter-dot is-active' : 'home-filter-dot'} aria-hidden="true" />
            <span>{network === 'ethereum' ? 'Ethereum' : 'Polygon'}</span>
          </button>
        ))}
      </Filters.Group>
    </Filters.Root>
  )
}
