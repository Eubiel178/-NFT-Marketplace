import { Activity, Download, Heart, LogOut, MapPin, ShoppingBag, TriangleAlert, UserRound } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components'
import { logout } from '@/features/auth/api'
import { sessionOptions } from '@/features/session/api'
import { disconnectPrivateSubscriptions } from '@/lib/realtime'
import { keys, queryClient } from '@/lib/query'

import { AccountSidebar } from '../account-sidebar'

const menu = [
  { label: 'Dados do perfil', icon: UserRound, to: '/profile' as const },
  { label: 'Carteiras', icon: MapPin, to: '/wallets' as const },
  { label: 'Atividade', icon: Activity },
  { label: 'Lista de interesse', icon: Heart },
  { label: 'Ofertas', icon: ShoppingBag },
  { label: 'Arquivos baixados', icon: Download },
  { label: 'Suporte', icon: TriangleAlert },
]

export function AccountShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const session = useQuery(sessionOptions)
  const logoutMutation = useMutation({ mutationFn: logout, onSuccess: async () => { await queryClient.cancelQueries(); disconnectPrivateSubscriptions(); queryClient.clear(); queryClient.setQueryData(keys.session, { user: null }); window.location.assign('/') } })
  return <section className="account-page"><AccountSidebar userName={session.data?.user?.name ?? 'Colecionador'} aria-label="Navegação da conta" logout={<Button variant="ghost" className="account-logout" onClick={() => logoutMutation.mutate()} loading={logoutMutation.isPending}><LogOut aria-hidden="true" />Sair</Button>}><nav>{menu.map(({ label, icon: Icon, to }) => to ? <Link className={location.pathname === to ? 'is-active' : ''} to={to} key={label}><Icon aria-hidden="true" />{label}</Link> : <span className="account-sidebar-action" key={label}><Icon aria-hidden="true" />{label}</span>)}</nav></AccountSidebar><div className="account-content">{children}</div></section>
}
