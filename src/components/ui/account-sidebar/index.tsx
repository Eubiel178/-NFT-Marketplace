import type { ComponentProps, ReactNode } from 'react'

import { UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface AccountSidebarProps extends Omit<ComponentProps<'aside'>, 'children'> {
  children: ReactNode
  userName: string
  logout?: ReactNode
  title?: string
}

export function AccountSidebar({ children, className, logout, title = 'Meu perfil', userName, ...props }: AccountSidebarProps) {
  return (
    <aside className={cn('account-sidebar', className)} {...props}>
      <h1>{title}</h1>
      <div className="account-user">
        <UserRound aria-hidden="true" />
        <span>{userName}</span>
      </div>
      {children}
      {logout}
    </aside>
  )
}
