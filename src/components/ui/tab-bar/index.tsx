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
    <nav className={cn('tab-bar fixed bottom-0 left-0 right-0 z-50', 'safe-bottom', className)} role="navigation" aria-label="Navegação principal">
      <ul className="relative z-10 flex h-[95px] items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.id, tab.href)
          if (tab.id === 'action') {
            return <li key={tab.id}><Link to={tab.href} className="relative flex flex-col items-center justify-center w-[60px] h-[60px] bg-gradient-cta-checkout rounded-full shadow-cart-focus transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label={active ? 'Ação principal (atual)' : 'Ação principal'}><img src={tab.asset} alt="" width={27} height={24} aria-hidden="true" /></Link></li>
          }
          return <li key={tab.id} className="flex flex-col items-center justify-center flex-1"><Link to={tab.href} className={cn('flex flex-col items-center justify-center gap-1', 'text-caption-12-regular transition-colors duration-200', active ? 'text-primary' : 'text-text-secondary hover:text-text', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background', 'rounded-md px-2 py-1')} aria-current={active ? 'page' : undefined} aria-label={active ? `${tab.label} (atual)` : tab.label}><img src={tab.asset} alt="" width={20} height={20} aria-hidden="true" /><span className="text-tiny-10-medium">{tab.label}</span></Link></li>
        })}
      </ul>
    </nav>
  )
}
