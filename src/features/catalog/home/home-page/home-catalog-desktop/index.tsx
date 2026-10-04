import { Button, Image, Pagination } from '@/components'
import type { CatalogSearch, Nft } from '@/contracts'

import { HomeFeatured } from '../../home-featured'
import { HomeFilters } from '../../home-filters'
import { HomeProductCard } from '../../home-product-card'
import { isCatalogSort } from '../home-search-params'

interface HomeCatalogDesktopProps {
  items: Nft[]
  search: CatalogSearch
  collections: readonly { value: string; label: string; count: string }[]
  tabs: readonly { label: string; sort: CatalogSearch['sort'] }[]
  pageCount: number
  isFetching: boolean
  total: number
  onUpdateSearch: (changes: Partial<CatalogSearch>) => void
  onOpenFilters: () => void
  onPageChange: (page: number) => void
}

export function HomeCatalogDesktop({ items, search, collections, tabs, pageCount, isFetching, total, onUpdateSearch, onOpenFilters, onPageChange }: HomeCatalogDesktopProps) {
  return (
    <div className="home-products-desktop">
      <aside className="home-products-sidebar">
        <HomeFilters
          key={`${search.priceMin}-${search.priceMax}`}
          collections={collections}
          selectedCollection={search.collection}
          selectedNetwork={search.network}
          priceMin={search.priceMin ?? '0'}
          priceMax={search.priceMax ?? '2.29'}
          onCollectionChange={(collection) => onUpdateSearch({ collection })}
          onNetworkChange={(network) => onUpdateSearch({ network })}
          onPriceApply={(priceMin, priceMax) => onUpdateSearch({ priceMin, priceMax })}
        />
        <HomeFeatured nft={items[1] ?? items[0]} />
      </aside>
      <div className="home-products-main">
        <div className="home-toolbar">
          <div className="home-tabs" role="group" aria-label="Ordenar catálogo">
            {tabs.map((tab) => <button key={tab.sort} type="button" aria-pressed={search.sort === tab.sort} className={search.sort === tab.sort ? 'home-tab is-active' : 'home-tab'} onClick={() => onUpdateSearch({ sort: tab.sort })}>{tab.label}</button>)}
          </div>
          <label className="home-sort text-body-15-regular">Ordenar por:
            <select aria-label="Ordenar por" value={search.sort} onChange={(event) => { const sort = event.target.value; if (isCatalogSort(sort)) onUpdateSearch({ sort }) }}>
              <option value="recent">Listados recentemente</option>
              <option value="name">Nome</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </label>
          <Button variant="filter" size="icon" className="home-tablet-filter" onClick={onOpenFilters} aria-label="Abrir filtros"><Image src="/assets/figma/mcp/svg/iconly-curved-filter.svg" alt="" width={20} height={20} aria-hidden="true" /></Button>
        </div>
        <p role="status" className="home-results-status sr-only">{isFetching ? 'Atualizando catálogo…' : `${total} NFTs encontrados`}</p>
        <ul className="home-product-grid">
          {items.slice(0, 9).map((nft, index) => <li key={`${nft.id}-${index}`}><HomeProductCard nft={nft} promo={index === 2} /></li>)}
        </ul>
        <div className="home-pagination-row">
          <Pagination currentPage={search.page} totalPages={pageCount} onPageChange={onPageChange} showFirstLast={false} showPrevNext={false} maxVisiblePages={4} />
          <Button variant="secondary" size="icon" onClick={() => onPageChange(search.page + 1)} disabled={search.page >= pageCount} aria-label="Próxima página"><Image src="/assets/figma/mcp/svg/iconly-curved-arrow-right-2.svg" alt="" width={18} height={18} aria-hidden="true" /></Button>
        </div>
      </div>
    </div>
  )
}
