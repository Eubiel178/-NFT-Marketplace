import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { Button, Skeleton } from '@/components'

import { NftDetailDescription } from '../nft-detail-description'
import { NftDetailGallery } from '../nft-detail-gallery'
import { NftDetailRelated } from '../nft-detail-related'
import { NftDetailSummary } from '../nft-detail-summary'

import type { Nft } from '@/contracts'
import { addFavorite, getFavorites, removeFavorite } from '@/features/favorites/api'
import { sessionOptions } from '@/features/session/api'
import { keys } from '@/lib/query'

export interface NftDetailRootProps {
  nft: Nft
  related: readonly Nft[]
  relatedLoading?: boolean
  relatedError?: boolean
  onRetryRelated?: () => void
}

export function NftDetailRoot({ nft, related, relatedLoading = false, relatedError = false, onRetryRelated }: NftDetailRootProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const editions = nft.editions ?? ['1/1', '1/10', '1/50', 'ABERTA']
  const defaultEdition = editions[2] ?? editions[0] ?? '1/50'
  const galleryLength = nft.gallery?.length || 4
  const [selection, setSelection] = useState({ nftId: nft.id, image: 0, edition: defaultEdition })
  const selectedImage = selection.nftId === nft.id ? selection.image : 0
  const selectedEdition = selection.nftId === nft.id && editions.includes(selection.edition) ? selection.edition : defaultEdition
  const validSelectedImage = Math.min(selectedImage, galleryLength - 1)
  const setSelectedImage = (image: number) => {
    setSelection((current) => ({ nftId: nft.id, image, edition: current.nftId === nft.id ? current.edition : defaultEdition }))
  }
  const setSelectedEdition = (edition: string) => {
    setSelection((current) => ({ nftId: nft.id, image: current.nftId === nft.id ? current.image : 0, edition }))
  }
  const session = useQuery(sessionOptions)
  const favorites = useQuery({ queryKey: keys.favorites, queryFn: ({ signal }) => getFavorites(signal), enabled: Boolean(session.data?.user) })
  const favoriteMutation = useMutation({
    mutationFn: (next: boolean) => next ? addFavorite(nft.id) : removeFavorite(nft.id),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: keys.favorites })
      const previous = queryClient.getQueryData<{ items: string[] }>(keys.favorites)
      queryClient.setQueryData(keys.favorites, { items: next ? [...(previous?.items ?? []).filter((id) => id !== nft.id), nft.id] : (previous?.items ?? []).filter((id) => id !== nft.id) })
      return { previous }
    },
    onError: (_error, _next, context) => { if (context?.previous) queryClient.setQueryData(keys.favorites, context.previous) },
    onSettled: () => { void queryClient.invalidateQueries({ queryKey: keys.favorites }) },
  })
  const toggleFavorite = () => {
    if (!session.data?.user) {
      void navigate({ to: '/login', search: { redirect: location.href, expired: false } })
      return
    }
    favoriteMutation.mutate(!(favorites.data?.items.includes(nft.id) ?? false))
  }
  const favorite = favorites.data?.items.includes(nft.id) ?? false

  return (
    <article className="nft-detail-page">
      <nav className="nft-detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span>Mercado</span>
      </nav>
      <div className="nft-detail-product">
        <NftDetailGallery nft={nft} favorite={favorite} selectedImage={validSelectedImage} onToggleFavorite={toggleFavorite} onImageChange={setSelectedImage} />
        <NftDetailSummary nft={nft} favorite={favorite} favoritePending={favoriteMutation.isPending} favoriteError={favoriteMutation.isError} favoriteLoadError={favorites.isError} selectedEdition={selectedEdition} onToggleFavorite={toggleFavorite} onEditionChange={setSelectedEdition} />
      </div>
      <NftDetailDescription nft={nft} />
      {relatedLoading ? <section className="nft-detail-related" aria-label="Carregando recomendações" role="status"><Skeleton className="h-8 w-48" /><div className="nft-detail-related-grid">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="aspect-square" />)}</div></section> : relatedError ? <section className="nft-detail-related" role="alert"><h2>Não foi possível carregar recomendações</h2><Button onClick={onRetryRelated}>Tentar novamente</Button></section> : <NftDetailRelated nfts={related} />}
    </article>
  )
}
