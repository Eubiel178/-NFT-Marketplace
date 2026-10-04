import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { useQuery } from '@tanstack/react-query'
import { Download, Heart, LogOut, MapPin, ShoppingCart, SquareActivity, TriangleAlert, UserRound } from 'lucide-react'

import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { sessionOptions } from '@/shared/api/session'
import { useLogout } from '@/shared/hooks/use-logout'

import { AccountSidebar } from '../account-sidebar'

const menu = [
  { label: 'Dados do perfil', icon: UserRound, to: '/profile' as const },
  { label: 'Carteiras', icon: MapPin, to: '/wallets' as const },
  { label: 'Atividade', icon: ShoppingCart },
  { label: 'Lista de interesse', icon: Heart },
  { label: 'Ofertas', icon: SquareActivity },
  { label: 'Arquivos baixados', icon: Download },
  { label: 'Suporte', icon: TriangleAlert },
]

const itemClass = 'flex h-11.25 items-center gap-4 border-l-6 border-transparent pr-4 pl-2.5 text-body-15 leading-16 text-primary'

export function AccountShell({ children }: { children: ReactNode }) {
  const session = useQuery(sessionOptions)
  const logoutMutation = useLogout()
  return (
    <section className="mx-auto flex w-full max-w-content flex-col gap-7 lg:mt-8 lg:grid lg:grid-cols-[19.375rem_minmax(0,1fr)] lg:items-start">
      <AccountSidebar
        userName={session.data?.user?.name ?? 'Colecionador'}
        aria-label="Navegação da conta"
        logout={
          <Button
            variant="ghost"
            className="h-12 w-full justify-start gap-4 rounded-none border-t border-border py-0 pr-4 pl-4 text-body-15-bold text-primary"
            onClick={() => logoutMutation.mutate()}
            loading={logoutMutation.isPending}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        }
      >
        <nav className="grid">
          {menu.map(({ label, icon: Icon, to }) =>
            to ? (
              <Link
                key={label}
                to={to}
                className={cn(itemClass, 'aria-[current=page]:border-primary aria-[current=page]:text-text-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary')}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            ) : (
              <span key={label} className={itemClass}>
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </span>
            ),
          )}
        </nav>
      </AccountSidebar>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
