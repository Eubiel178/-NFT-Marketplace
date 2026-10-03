import type { ReactNode } from 'react'

export interface MobileLayoutProps {
  children: ReactNode
  tabBar?: ReactNode
}

export function MobileLayout({ children, tabBar }: MobileLayoutProps) {
  return (
    <div className={tabBar ? 'mobile-layout has-tab-bar' : 'mobile-layout'}>
      <main id="main" tabIndex={-1} className="layout-main container-content">
        {children}
      </main>
      {tabBar && <div className="mobile-tab-bar">{tabBar}</div>}
    </div>
  )
}
