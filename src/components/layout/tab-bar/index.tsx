import { Link, useLocation } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

import { Icon } from '../../ui/icon'

const tabClass = 'absolute top-6.5 grid size-11 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'

function tabColor(active: boolean) {
  return active ? 'text-text-accent' : 'text-text-secondary'
}

// Barra do Figma (asset tab-bar-background.svg) em três partes: as laterais
// esticam e o recorte central mantém a curva original em qualquer largura.
// Os ícones seguem as posições medidas no frame de 414px: os da esquerda
// ancorados à esquerda, os da direita à direita e o botão de ação no centro.
export function TabBar() {
  const { pathname } = useLocation()
  const homeActive = pathname === '/'
  const cartActive = pathname.startsWith('/cart')
  const profileActive = pathname.startsWith('/profile') || pathname.startsWith('/wallets')

  return (
    <nav aria-label="Navegação principal" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="relative h-23.25">
        <div aria-hidden="true" className="absolute inset-0 flex drop-shadow-tab-bar">
          <div className="flex-1 rounded-tl-29 bg-surface-card" />
          <svg className="h-full w-[9.48125rem] shrink-0 fill-surface-card" viewBox="0 0 151.7 93" preserveAspectRatio="none">
            <path d="M151.7 0C137.94 0 125.72 8.2 119.87 20.65C112.11 37.17 95.31 48.62 75.85 48.62C56.39 48.62 39.59 37.18 31.83 20.65C25.98 8.2 13.75 0 0 0V93H151.7Z" />
          </svg>
          <div className="flex-1 rounded-tr-29 bg-surface-card" />
        </div>

        <ul className="pointer-events-auto">
          <li>
            <Link to="/" aria-label="Início" aria-current={homeActive ? 'page' : undefined} className={cn(tabClass, 'left-6', tabColor(homeActive))}>
              <Icon src="/assets/figma/mcp/svg/iconly-bold-home.svg" />
            </Link>
          </li>
          <li>
            <button type="button" disabled aria-label="Favoritos (indisponível)" className={cn(tabClass, 'left-24', tabColor(false))}>
              <Icon src="/assets/figma/mcp/svg/tab-bar-shop-vector.svg" className="h-4.5 w-5" />
            </button>
          </li>
          <li>
            <Link
              to="/checkout"
              aria-label="Ação principal"
              className="absolute -top-8.5 left-1/2 grid size-16.25 -translate-x-1/2 place-items-center rounded-full bg-(image:--gradient-tab-bar-notch) focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <img src="/assets/figma/mcp/svg/mobile-nav-group.svg" alt="" width={27} height={24} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link to="/cart" aria-label="Carrinho" aria-current={cartActive ? 'page' : undefined} className={cn(tabClass, 'right-22.5', tabColor(cartActive))}>
              <Icon src="/assets/figma/mcp/svg/tab-bar-user-vector.svg" className="h-4.25 w-4.5" />
            </Link>
          </li>
          <li>
            <Link to="/profile" aria-label="Perfil" aria-current={profileActive ? 'page' : undefined} className={cn(tabClass, 'right-7', tabColor(profileActive))}>
              <Icon src="/assets/figma/mcp/svg/tab-bar-home-vector.svg" className="h-4.25 w-3.5" />
            </Link>
          </li>
        </ul>
      </div>
      <div aria-hidden="true" className="h-[env(safe-area-inset-bottom,0px)] bg-surface-card" />
    </nav>
  )
}
