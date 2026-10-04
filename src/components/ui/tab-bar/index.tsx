import { useLocation, Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

export interface TabBarProps { className?: string }

const tabs = [
  { id: 'home', label: 'Início', asset: '/assets/figma/mcp/svg/iconly-bold-home.svg', href: '/' },
  { id: 'cart', label: 'Carrinho', asset: '/assets/figma/mcp/svg/tab-bar-shop-vector.svg', href: '/cart' },
  { id: 'action', label: '', asset: '/assets/figma/mcp/svg/mobile-nav-group.svg', href: '/checkout' },
  { id: 'shop', label: 'Mercado', asset: '/assets/figma/mcp/svg/shop-tab.svg', href: '/' },
  { id: 'user', label: 'Conta', asset: '/assets/figma/mcp/svg/tab-bar-home-vector.svg', href: '/profile' },
] as const

export function TabBar({ className }: TabBarProps) {
  const location = useLocation()
  const isActive = (id: (typeof tabs)[number]['id'], href: string) => {
    if (id === 'shop') return location.pathname.startsWith('/nfts')
    return href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)
  }

  return (
    <nav className={cn('pointer-events-none fixed inset-x-0 bottom-0 z-50 h-31.5 bg-transparent pt-7.75 pb-[env(safe-area-inset-bottom,0)]', "before:absolute before:inset-x-0 before:top-7.75 before:bottom-0 before:z-0 before:rounded-t-40 before:bg-surface-card before:shadow-tab-bar before:content-['']", "after:absolute after:top-0 after:left-1/2 after:z-1 after:size-16.25 after:-translate-x-1/2 after:rounded-full after:bg-(image:--gradient-tab-bar-notch) after:content-['']", className)} role="navigation" aria-label="Navegação principal">
      <ul className="pointer-events-auto relative z-10 flex h-23.75 items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.id, tab.href)
          if (tab.id === 'action') {
            return <li key={tab.id} className="min-w-0 max-sm:flex-1"><Link to={tab.href} className="relative z-2 flex size-15 flex-col items-center justify-center max-sm:-mt-4 bg-(image:--gradient-cta-checkout) rounded-full shadow-cart-focus transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink" aria-label={active ? 'Ação principal (atual)' : 'Ação principal'}><img src={tab.asset} alt="" width={27} height={24} aria-hidden="true" /></Link></li>
          }
          return <li key={tab.id} className="flex min-w-0 flex-1 flex-col items-center justify-center"><Link to={tab.href} className={cn('flex flex-col items-center justify-center gap-1 max-sm:gap-0', 'text-caption-12 font-normal leading-16 transition-colors duration-200', active ? 'text-primary' : 'text-text-secondary hover:text-foreground', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink', 'rounded-6 px-2 py-1')} aria-current={active ? 'page' : undefined} aria-label={active ? `${tab.label} (atual)` : tab.label}><img src={tab.asset} alt="" width={20} height={20} aria-hidden="true" /><span className="text-tiny-10 font-medium leading-auto max-sm:hidden">{tab.label}</span></Link></li>
        })}
      </ul>
    </nav>
  )
}
