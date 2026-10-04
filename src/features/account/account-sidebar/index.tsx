import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface AccountSidebarProps extends Omit<ComponentProps<'aside'>, 'children'> {
  children: ReactNode
  userName: string
  logout?: ReactNode
  title?: string
}

// Painel da conta, igual em Perfil e Carteiras. Sem frame mobile: o painel vai para cima do conteúdo, com a largura toda.
export function AccountSidebar({ children, className, logout, title = 'Meu perfil', userName, ...props }: AccountSidebarProps) {
  return (
    <aside className={cn('flex flex-col bg-surface-card pt-3.5 lg:min-h-101.75', className)} {...props}>
      <h1 className="px-2.5 text-body-large-18-bold leading-6">{title}</h1>
      <span className="sr-only">{userName}</span>
      <div className="mt-1.5 grow">{children}</div>
      {logout}
    </aside>
  )
}
