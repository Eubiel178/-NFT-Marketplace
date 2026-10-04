import type { CatalogSearch, Nft } from '@/contracts'

import { HomeProductCard } from '../../home-product-card'

interface HomeCatalogMobileProps {
  items: Nft[]
  search: CatalogSearch
  tabs: readonly { label: string; sort: CatalogSearch['sort'] }[]
  onUpdateSearch: (changes: Partial<CatalogSearch>) => void
}

export function HomeCatalogMobile({ items, search, tabs, onUpdateSearch }: HomeCatalogMobileProps) {
  const mobileItems = [items[0], items[1], items[2], items[6]].filter((item): item is Nft => item !== undefined)

  return (
    <div className="home-products-mobile">
      <div className="home-mobile-tabs" role="group" aria-label="Ordenar catálogo">
        {tabs.map((tab) => <button key={tab.sort} type="button" aria-pressed={search.sort === tab.sort} className={search.sort === tab.sort ? 'home-tab is-active' : 'home-tab'} onClick={() => onUpdateSearch({ sort: tab.sort })}>{tab.label}</button>)}
      </div>
      <div className="home-mobile-product-grid">
        <ul>{mobileItems.filter((_, index) => index % 2 === 0).map((nft, index) => <li key={nft.id}><HomeProductCard nft={nft} mobile rare={index === 1} /></li>)}</ul>
        <ul className="home-mobile-product-column-offset">{mobileItems.filter((_, index) => index % 2 === 1).map((nft) => <li key={nft.id}><HomeProductCard nft={nft} mobile /></li>)}</ul>
      </div>
    </div>
  )
}
