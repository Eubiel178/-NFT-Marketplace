import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'

import type { Favorites } from '@/contracts'
import { keys } from '@/lib/query'
import { sessionOptions } from '@/shared/api/session'

import { addFavorite, getFavorites, removeFavorite } from '../../api'

// Favorito com atualização otimista: a UI muda na hora e volta ao estado
// anterior se a API falhar. Visitante é levado ao login e volta para cá.
export function useFavorite(nftId: string) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const session = useQuery(sessionOptions)
  const userId = session.data?.user?.id ?? ''
  const favoritesKey = keys.favorites(userId)
  const favorites = useQuery({ queryKey: favoritesKey, queryFn: ({ signal }) => getFavorites(signal), enabled: Boolean(userId) })

  const mutation = useMutation({
    mutationFn: (next: boolean) => (next ? addFavorite(nftId) : removeFavorite(nftId)),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: favoritesKey })
      const previous = queryClient.getQueryData<Favorites>(favoritesKey)
      const others = (previous?.items ?? []).filter((id) => id !== nftId)
      queryClient.setQueryData<Favorites>(favoritesKey, { items: next ? [...others, nftId] : others })
      return { previous }
    },
    onError: (_error, _next, context) => {
      if (context?.previous) queryClient.setQueryData(favoritesKey, context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoritesKey })
    },
  })

  const favorite = favorites.data?.items.includes(nftId) ?? false

  const toggle = () => {
    if (!session.data?.user) {
      void navigate({ to: '/login', search: { redirect: location.href, expired: false } })
      return
    }
    mutation.mutate(!favorite)
  }

  return { favorite, toggle, isPending: mutation.isPending, isError: mutation.isError, loadError: favorites.isError }
}
