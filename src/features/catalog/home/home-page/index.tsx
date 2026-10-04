import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button, Image, Input, Sheet, Skeleton } from '@/components'
import type { CatalogSearch } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'

import { HomeFilters } from '../home-filters'
import { HomeHero } from '../home-hero'
import { HomeBlog } from './home-blog'
import { HomeCatalogDesktop } from './home-catalog-desktop'
import { HomeCatalogMobile } from './home-catalog-mobile'
import { HomePromos } from './home-promos'
import { normalizeCatalogSearch } from './home-search-params'

const tabs = [
  { label: 'Todos os NFTs', sort: 'recent' as const },
  { label: 'Novos lançamentos', sort: 'price-asc' as const },
  { label: 'Em alta', sort: 'price-desc' as const },
]

function HomeLoading() {
  return (
    <section className="home-page home-loading" aria-label="Carregando catálogo" role="status">
      <Skeleton className="home-loading-hero" />
      <div className="home-loading-products">
        <Skeleton className="h-[470px] w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => <Skeleton key={index} className="h-[300px]" />)}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const routeSearch = useSearch({ from: '/' })
  const search: CatalogSearch = normalizeCatalogSearch(routeSearch)
  const navigate = useNavigate({ from: '/' })
  const searchDebounce = useRef<number | undefined>(undefined)
  const result = useQuery(catalogOptions(search))

  useEffect(() => {
    return () => {
      if (searchDebounce.current !== undefined) window.clearTimeout(searchDebounce.current)
    }
  }, [])

  const updateSearch = (changes: Partial<CatalogSearch>) => {
    void navigate({ search: (current) => ({ ...current, ...changes, page: changes.page ?? 1 }) })
  }

  const handleSearchChange = (value: string) => {
    if (searchDebounce.current !== undefined) window.clearTimeout(searchDebounce.current)
    searchDebounce.current = window.setTimeout(() => {
      void navigate({ search: (current) => ({ ...current, q: value, page: 1 }) })
    }, 300)
  }

  if (result.isPending) return <HomeLoading />

  if (result.isError) {
    return <section className="home-page" role="alert"><h1 className="text-heading-28-bold">Não foi possível carregar a Home</h1><p className="mt-4 text-body-14-regular">Tente novamente para carregar os destaques e o catálogo.</p><Button className="mt-6" onClick={() => void result.refetch()}>Tentar novamente</Button></section>
  }

  const items = result.data.items
  if (items.length === 0) {
    return <section className="home-page" role="status"><h1 className="text-heading-28-bold">Nenhum NFT encontrado</h1><p className="mt-4 text-body-14-regular">Ajuste sua busca ou remova os filtros para explorar o catálogo.</p></section>
  }

   const collectionLabels: Record<string, string> = {
     'Kurio Apes': 'Arte digital',
     'Sage Nomads': 'Fotografia',
     'Neon Vessels': 'Música',
     'Cosmic Blooms': 'Arte 3D',
     'Violet Nomads': 'Colecionáveis',
     'Ivory Barons': 'Generativa',
     'Golden Beats': 'Jogos',
     'Golden Signals': 'Assinaturas',
   }
   const collectionCounts: Record<string, string> = {
     'Kurio Apes': '33',
     'Sage Nomads': '12',
     'Neon Vessels': '65',
     'Cosmic Blooms': '39',
     'Violet Nomads': '23',
     'Ivory Barons': '17',
     'Golden Beats': '19',
     'Golden Signals': '13',
   }
   const collectionValues = Array.from(new Set([...items.map((item) => item.collection), ...(search.collection !== 'all' ? [search.collection] : [])])).slice(0, 8)
   const collections = collectionValues.map((value) => ({ value, label: collectionLabels[value] ?? value, count: collectionCounts[value] ?? '0' }))
  const pageCount = Math.max(1, Math.ceil(result.data.total / result.data.pageSize))
  const updatePage = (page: number) => updateSearch({ page })

  return (
    <section className="home-page" aria-labelledby="home-page-title">
      <h1 id="home-page-title" className="sr-only">Marketplace de NFTs</h1>
      <div className="home-mobile-search">
         <Input key={search.q} aria-label="Explorar coleções" placeholder="Explorar coleções" defaultValue={search.q} onChange={(event) => handleSearchChange(event.target.value)} leftIcon={<Image src="/assets/figma/mcp/svg/search.svg" alt="" width={18} height={18} aria-hidden="true" />} />
        <Button variant="filter" size="iconLg" onClick={() => setFiltersOpen(true)} aria-label="Abrir filtros"><Image src="/assets/figma/mcp/svg/iconly-curved-filter.svg" alt="" width={20} height={20} aria-hidden="true" /></Button>
      </div>
      <HomeHero artwork={items[0]} />
      <section id="home-products" className="home-products" aria-labelledby="home-products-title">
        <h2 id="home-products-title" className="sr-only">Produtos</h2>
        <HomeCatalogDesktop items={items} search={search} collections={collections} tabs={tabs} pageCount={pageCount} isFetching={result.isFetching} total={result.data.total} onUpdateSearch={updateSearch} onOpenFilters={() => setFiltersOpen(true)} onPageChange={updatePage} />
        <HomeCatalogMobile items={items} search={search} tabs={tabs} onUpdateSearch={updateSearch} />
      </section>
      <HomePromos />
      <HomeBlog />
      <Sheet isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtros" description="Refine a visualização do catálogo." position="bottom" size="lg" showCloseButton>
         <HomeFilters key={`${search.priceMin}-${search.priceMax}`} collections={collections} selectedCollection={search.collection} selectedNetwork={search.network} priceMin={search.priceMin ?? '0'} priceMax={search.priceMax ?? '2.29'} onCollectionChange={(collection) => updateSearch({ collection })} onNetworkChange={(network) => updateSearch({ network })} onPriceApply={(priceMin, priceMax) => updateSearch({ priceMin, priceMax })} />
      </Sheet>
      <span className="sr-only">Página {result.data.page} de {pageCount}</span>
    </section>
  )
}
