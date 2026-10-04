import { useEffect, useRef } from 'react'

import { useNavigate, useSearch } from '@tanstack/react-router'

import type { CatalogSearch } from '@/contracts'

import { withCatalogDefaults } from '../../lib/catalog-search'

const searchDelay = 300

// Estado do catálogo na URL: filtros reiniciam a paginação e a busca digitada
// espera o usuário parar de digitar antes de navegar.
export function useCatalogSearch() {
  const routeSearch = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const searchTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(searchTimer.current), [])

  const updateSearch = (changes: Partial<CatalogSearch>) => {
    void navigate({ search: (current) => ({ ...current, ...changes, page: changes.page ?? 1 }) })
  }

  const updateQuery = (q: string) => {
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => updateSearch({ q }), searchDelay)
  }

  return { search: withCatalogDefaults(routeSearch), updateSearch, updateQuery }
}
