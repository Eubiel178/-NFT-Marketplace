import { useQuery } from '@tanstack/react-query'

import { catalogOptions, Hero, withCatalogDefaults } from '@/features/catalog'

const backgroundSearch = withCatalogDefaults({})

// Fundo do frame desktop: o hero da Início, reutilizado sem nenhuma alteração e na
// mesma posição (primeiro bloco do <main>). É decorativo: fora da árvore de
// acessibilidade e inerte para teclado e mouse.
export function AuthMarketplaceBackground() {
  const catalog = useQuery(catalogOptions(backgroundSearch))
  const artwork = catalog.data?.items[0]

  return (
    <div data-testid="auth-background" aria-hidden="true" inert className="pointer-events-none select-none">
      {artwork && <Hero artwork={artwork} />}
    </div>
  )
}
