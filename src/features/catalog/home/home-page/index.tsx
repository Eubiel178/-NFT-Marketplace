import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button, Image, Input, Pagination, Sheet, Skeleton } from '@/components'
import type { CatalogSearch } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'

import { HomeBlogCard } from '../home-blog-card'
import { HomeFeatured } from '../home-featured'
import { HomeFilters } from '../home-filters'
import { HomeHero } from '../home-hero'
import { HomeProductCard } from '../home-product-card'
import { HomePromoCard } from '../home-promo-card'

const tabs = [
  { label: 'Todos os NFTs', sort: 'recent' as const },
  { label: 'Novos lançamentos', sort: 'price-asc' as const },
  { label: 'Em alta', sort: 'price-desc' as const },
]

const defaultPriceMin = '0'
const defaultPriceMax = '2.29'

const blogPosts = [
  { date: '12 de setembro', readingTime: '6 min', title: 'Como funciona a propriedade de NFTs', description: 'Aprenda a colecionar, negociar e verificar ativos digitais.', image: '/assets/figma/neon-vessel.png', imageAlt: 'Arte digital em tons de roxo' },
  { date: '13 de setembro', readingTime: '2 min', title: '10 artistas digitais para acompanhar', description: 'Conheça criadores que moldam a cultura digital.', image: '/assets/figma/home-hero.png', imageAlt: 'Arte digital do marketplace' },
  { date: '15 de setembro', readingTime: '3 min', title: 'Raridade, atributos e procedência', description: 'Entenda raridade, procedência, direitos autorais e utilidade.', image: '/assets/figma/featured-nft.png', imageAlt: 'Obra digital em destaque' },
  { date: '15 de setembro', readingTime: '2 min', title: 'Como proteger sua carteira', description: 'Proteja sua carteira, seus ativos e sua identidade.', image: '/assets/figma/golden-beat.png', imageAlt: 'Arte digital dourada' },
] as const

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
  const routeSearch = useSearch({ strict: false }) as Partial<CatalogSearch>
  const search: CatalogSearch = { q: '', category: 'all', collection: 'all', network: 'all', sort: 'recent', priceMin: defaultPriceMin, priceMax: defaultPriceMax, page: 1, ...routeSearch }
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
        <div className="home-products-desktop">
          <aside className="home-products-sidebar">
             <HomeFilters key={`${search.priceMin}-${search.priceMax}`} collections={collections} selectedCollection={search.collection} selectedNetwork={search.network} priceMin={search.priceMin ?? defaultPriceMin} priceMax={search.priceMax ?? defaultPriceMax} onCollectionChange={(collection) => updateSearch({ collection })} onNetworkChange={(network) => updateSearch({ network })} onPriceApply={(priceMin, priceMax) => updateSearch({ priceMin, priceMax })} />
            <HomeFeatured nft={items[1] ?? items[0]} />
          </aside>
          <div className="home-products-main">
            <div className="home-toolbar">
               <div className="home-tabs" role="group" aria-label="Ordenar catálogo">
                 {tabs.map((tab) => <button key={tab.sort} type="button" aria-pressed={search.sort === tab.sort} className={search.sort === tab.sort ? 'home-tab is-active' : 'home-tab'} onClick={() => updateSearch({ sort: tab.sort })}>{tab.label}</button>)}
              </div>
              <label className="home-sort text-body-15-regular">Ordenar por:
                <select aria-label="Ordenar por" value={search.sort} onChange={(event) => updateSearch({ sort: event.target.value as CatalogSearch['sort'] })}>
                  <option value="recent">Listados recentemente</option>
                  <option value="name">Nome</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </label>
               <Button variant="filter" size="icon" className="home-tablet-filter" onClick={() => setFiltersOpen(true)} aria-label="Abrir filtros"><Image src="/assets/figma/mcp/svg/iconly-curved-filter.svg" alt="" width={20} height={20} aria-hidden="true" /></Button>
            </div>
             <p role="status" className="home-results-status sr-only">{result.isFetching ? 'Atualizando catálogo…' : `${result.data.total} NFTs encontrados`}</p>
            <ul className="home-product-grid">
              {items.slice(0, 9).map((nft, index) => <li key={`${nft.id}-${index}`}><HomeProductCard nft={nft} promo={index === 2} /></li>)}
            </ul>
            <div className="home-pagination-row">
              <Pagination currentPage={result.data.page} totalPages={pageCount} onPageChange={updatePage} showFirstLast={false} showPrevNext={false} maxVisiblePages={4} />
               <Button variant="secondary" size="icon" onClick={() => updatePage(result.data.page + 1)} disabled={result.data.page >= pageCount} aria-label="Próxima página"><Image src="/assets/figma/mcp/svg/iconly-curved-arrow-right-2.svg" alt="" width={18} height={18} aria-hidden="true" /></Button>
            </div>
          </div>
        </div>
        <div className="home-products-mobile">
           <div className="home-mobile-tabs" role="group" aria-label="Ordenar catálogo">
             {tabs.map((tab) => <button key={tab.sort} type="button" aria-pressed={search.sort === tab.sort} className={search.sort === tab.sort ? 'home-tab is-active' : 'home-tab'} onClick={() => updateSearch({ sort: tab.sort })}>{tab.label}</button>)}
          </div>
           <div className="home-mobile-product-grid">
             {(() => {
               const mobileItems = [items[0], items[1], items[2], items[6]].filter((item): item is (typeof items)[number] => item !== undefined)
               return <><ul>{mobileItems.filter((_, index) => index % 2 === 0).map((nft, index) => <li key={nft.id}><HomeProductCard nft={nft} mobile rare={index === 1} /></li>)}</ul><ul className="home-mobile-product-column-offset">{mobileItems.filter((_, index) => index % 2 === 1).map((nft) => <li key={nft.id}><HomeProductCard nft={nft} mobile /></li>)}</ul></>
             })()}
           </div>
        </div>
      </section>
      <section className="home-promos" aria-labelledby="home-promos-title">
        <h2 id="home-promos-title" className="sr-only">Explore mais</h2>
         <div className="home-promos-grid">
           <HomePromoCard title="Lançamentos gênesis de edição limitada" description="Colecione edições escassas diretamente dos criadores antes da revelação pública." image="/assets/figma/home-hero.png" imageAlt="Arte de lançamento gênesis" maskSrc="/assets/figma/promo-genesis-mask.svg" />
           <HomePromoCard title="Arte digital selecionada e muito mais" description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura." image="/assets/figma/neon-vessel.png" imageAlt="Arte digital selecionada" maskSrc="/assets/figma/promo-curated-mask.svg" />
        </div>
      </section>
      <section className="home-blog" aria-labelledby="home-blog-title">
        <div className="home-section-heading"><div><h2 id="home-blog-title" className="text-body-large-17-bold">Diário da Cunhagem</h2><p className="text-body-14-regular text-text-secondary">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p></div></div>
        <div className="home-blog-grid">{blogPosts.map((post) => <HomeBlogCard key={post.title} {...post} />)}</div>
      </section>
      <Sheet isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtros" description="Refine a visualização do catálogo." position="bottom" size="lg" showCloseButton>
         <HomeFilters key={`${search.priceMin}-${search.priceMax}`} collections={collections} selectedCollection={search.collection} selectedNetwork={search.network} priceMin={search.priceMin ?? defaultPriceMin} priceMax={search.priceMax ?? defaultPriceMax} onCollectionChange={(collection) => updateSearch({ collection })} onNetworkChange={(network) => updateSearch({ network })} onPriceApply={(priceMin, priceMax) => updateSearch({ priceMin, priceMax })} />
      </Sheet>
      <span className="sr-only">Página {result.data.page} de {pageCount}</span>
    </section>
  )
}
