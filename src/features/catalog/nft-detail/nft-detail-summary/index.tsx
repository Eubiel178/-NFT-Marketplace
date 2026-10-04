import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'

import { Button } from '@/components'
import type { Nft } from '@/contracts'
import { addCartItem } from '@/features/cart/api'
import { sessionOptions } from '@/features/session/api'
import { keys } from '@/lib/query'

export interface NftDetailSummaryProps {
  nft: Nft
  favorite: boolean
  favoritePending: boolean
  favoriteError: boolean
  favoriteLoadError: boolean
  selectedEdition: string
  onToggleFavorite: () => void
  onEditionChange: (edition: string) => void
}

export function NftDetailSummary({ nft, favorite, favoritePending, favoriteError, favoriteLoadError, selectedEdition, onToggleFavorite, onEditionChange }: NftDetailSummaryProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useQuery(sessionOptions)
  const [quantity, setQuantity] = useState(1)
  const editions = nft.editions ?? ['1/1', '1/10', '1/50', 'ABERTA']
  const description = nft.description ?? 'Um colecionável digital verificado na Ethereum, com procedência imutável e acesso para colecionadores.'
  const attributes = nft.attributes ?? ['Raro']
  const shareUrl = typeof window === 'undefined' ? '' : encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(nft.name)
  const cartMutation = useMutation({
    mutationFn: () => addCartItem({ nftId: nft.id, editionId: selectedEdition, quantity }),
    onSuccess: (next) => queryClient.setQueryData(keys.cart(session.data?.user?.id ?? null), next),
  })
  const addToCart = (destination: '/cart' | '/checkout') => {
    cartMutation.mutate(undefined, { onSuccess: () => { void navigate({ to: destination }) } })
  }
  const unavailable = nft.available <= 0
  const atLimit = quantity >= nft.available

  return (
    <section className="nft-detail-summary" aria-labelledby="nft-detail-title">
      <div className="nft-detail-title-row">
        <h1 id="nft-detail-title">{nft.name}</h1>
        <p className="nft-detail-review"><span aria-hidden="true">★</span> 4.8 <span>(19)</span></p>
      </div>
      <div className="nft-detail-meta">
        <p className="nft-detail-price">{nft.price} ETH</p>
        <div className="nft-detail-desktop-review" aria-label={`${nft.reviews ?? 19} avaliações de colecionadores`}><span aria-hidden="true">★★★★★</span> {nft.reviews ?? 19} avaliações de colecionadores</div>
      </div>
      <h2 className="nft-detail-about-title">Sobre este NFT:</h2>
      <p className="nft-detail-summary-description">{description}</p>
      <h2>Edição:</h2>
       <div className="nft-detail-editions">{editions.map((edition) => <button type="button" className={edition === selectedEdition ? 'is-selected' : ''} key={edition} onClick={() => onEditionChange(edition)}>{edition}</button>)}</div>
         <div className="nft-detail-actions">
         <div className="nft-detail-stepper" aria-label="Quantidade">
           <button type="button" aria-label="Diminuir quantidade" disabled={quantity <= 1 || unavailable} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus aria-hidden="true" /></button>
           <span>{quantity}</span>
           <button type="button" aria-label="Aumentar quantidade" disabled={atLimit || unavailable} onClick={() => setQuantity((value) => Math.min(nft.available, value + 1))}><Plus aria-hidden="true" /></button>
         </div>
          <div className="nft-detail-cta-group">
           <Button variant="primarySolid" size="sm" onClick={() => addToCart('/cart')} disabled={unavailable} loading={cartMutation.isPending}>COMPRAR</Button>
            <Button data-favorite-trigger="true" variant="secondary" size="sm" onClick={onToggleFavorite} aria-pressed={favorite} loading={favoritePending}><Heart aria-hidden="true" className={favorite ? 'fill-primary' : undefined} /> {favorite ? 'Favoritado' : 'Favoritar'}</Button>
          </div>
        </div>
         {unavailable && <p className="auth-error" role="alert">Esta edição está indisponível.</p>}
         {favoriteLoadError && <p className="auth-error" role="alert">Não foi possível carregar seus favoritos.</p>}
         {favoriteError && <p className="auth-error" role="alert">Não foi possível atualizar os favoritos. Tente novamente.</p>}
        {cartMutation.isError && <p className="auth-error" role="alert">Não foi possível adicionar o NFT ao carrinho.</p>}
       <dl className="nft-detail-token-info">
        <div><dt>ID do token:</dt><dd>{nft.tokenId ?? '#0042'}</dd></div>
        <div><dt>Coleção:</dt><dd>{nft.collection}</dd></div>
        <div><dt>Atributos:</dt><dd>{attributes.join(', ')}</dd></div>
      </dl>
       <p className="nft-detail-share">Compartilhar este NFT: <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartilhar no LinkedIn">in</a> <a href={`mailto:?subject=${shareTitle}&body=${shareUrl}`} aria-label="Compartilhar por mensagem">✉</a> <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartilhar no Twitter">♥</a></p>
      <div className="nft-detail-mobile-buybar">
        <div>
          <span>Qtd.</span>
          <div className="nft-detail-buybar-quantity">
           <button type="button" aria-label="Diminuir quantidade" disabled={quantity <= 1 || unavailable} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus aria-hidden="true" /></button>
            <strong>{quantity}</strong>
             <button type="button" aria-label="Aumentar quantidade" disabled={atLimit || unavailable} onClick={() => setQuantity((value) => Math.min(nft.available, value + 1))}><Plus aria-hidden="true" /></button>
          </div>
          <span className="nft-detail-buybar-price">{nft.price} ETH</span>
        </div>
          <div><Button variant="primary" size="pillLg" onClick={() => addToCart('/checkout')} disabled={unavailable} loading={cartMutation.isPending}>Comprar NFT</Button><Button variant="secondary" size="iconPillLg" aria-label="Adicionar ao carrinho" onClick={() => addToCart('/cart')} disabled={unavailable} loading={cartMutation.isPending}><ShoppingCart aria-hidden="true" /></Button></div>
      </div>
    </section>
  )
}
