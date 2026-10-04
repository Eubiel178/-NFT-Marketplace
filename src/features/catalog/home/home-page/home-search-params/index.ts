import type { CatalogSearch } from '@/contracts'

const defaultCatalogSearch: CatalogSearch = {
  q: '',
  category: 'all',
  collection: 'all',
  network: 'all',
  sort: 'recent',
  priceMin: '0',
  priceMax: '2.29',
  page: 1,
}

export function normalizeCatalogSearch(search: CatalogSearch): CatalogSearch {
  return { ...defaultCatalogSearch, ...search }
}

export function isCatalogSort(value: string): value is CatalogSearch['sort'] {
  return value === 'recent' || value === 'name' || value === 'price-asc' || value === 'price-desc'
}
