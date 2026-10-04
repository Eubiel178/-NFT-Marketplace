import type { CatalogSearch } from '@/contracts'

// Sem faixa de preço: o catálogo só filtra por preço quando a URL pede.
const defaultCatalogSearch: CatalogSearch = {
  q: '',
  category: 'all',
  collection: 'all',
  network: 'all',
  sort: 'recent',
  page: 1,
}

export function withCatalogDefaults(search: Partial<CatalogSearch>): CatalogSearch {
  return { ...defaultCatalogSearch, ...search }
}

export function isCatalogSort(value: string): value is CatalogSearch['sort'] {
  return value === 'recent' || value === 'name' || value === 'price-asc' || value === 'price-desc'
}

export function pageCountOf(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize))
}
