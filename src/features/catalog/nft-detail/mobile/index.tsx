import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { Button, Icon, Image } from '@/components'
import type { Nft } from '@/contracts'
import { useFavorite } from '@/features/favorites'

import { useNftPurchase } from '../../hooks/use-nft-purchase'
import { Description } from '../description'
import { Editions } from '../editions'
import { FavoriteButton } from '../favorite-button'
import { Quantity } from '../quantity'
import { TokenInfo } from '../token-info'

export interface MobileProps {
  nft: Nft
  related: ReactNode
}

// Frame mobile: barra do topo, imagem, folha com o resumo e barra de compra fixa.
export function Mobile({ nft, related }: MobileProps) {
  const purchase = useNftPurchase(nft)
  const favorite = useFavorite(nft.id)

  return (
    <article className="-m-6 min-h-dvh bg-surface-card pb-48">
      <div className="flex items-center justify-between pt-6 pr-6.25 pl-7">
        <Link to="/" aria-label="Voltar para o início" className="block size-8.75 rounded-full">
          <Image src="/assets/figma/mcp/svg/back.svg" alt="" width={35} height={35} className="size-full" />
        </Link>
        <FavoriteButton variant="round" favorite={favorite.favorite} pending={favorite.isPending} onToggle={favorite.toggle} />
      </div>
      <Image src={nft.gallery?.[0] ?? nft.image} alt={nft.name} width={361} height={361} priority className="mt-2 ml-7 aspect-square w-[calc(100%-3.3125rem)] rounded-t-24 object-cover" />
      <section aria-labelledby="nft-title" className="relative -mt-8 rounded-t-31 bg-surface-card px-6 pt-7.5 pb-8 shadow-buy-bar">
        <div className="flex items-center justify-between gap-3">
          <h1 id="nft-title" className="text-title-20-bold leading-24">{nft.name}</h1>
          {nft.rating && (
            <p className="-mt-1 mr-0.5 flex h-6.75 shrink-0 items-center gap-0.5 rounded-full border border-primary px-1.5 text-caption-12 leading-16">
              <Icon src="/assets/figma/mcp/svg/iconly-bold-star.svg" className="size-3.5 text-primary" />
              <span className="font-bold">{nft.rating}</span>
              <span className="text-text-secondary">({nft.reviews})</span>
              <span className="sr-only">avaliações</span>
            </p>
          )}
        </div>
        {nft.description && <p className="mt-3 text-body-14-regular text-text-secondary">{nft.description}</p>}
        <div className="mt-3">
          <Editions nft={nft} selected={purchase.edition} onSelect={purchase.selectEdition} />
        </div>
        <div className="mt-2"><TokenInfo nft={nft} /></div>
        <div aria-live="polite">
          {purchase.soldOut && <p role="alert" className="mt-3 text-caption-13 text-error">Esta edição está esgotada.</p>}
          {purchase.addError && <p role="alert" className="mt-3 text-caption-13 text-error">Não foi possível adicionar o NFT ao carrinho.</p>}
          {favorite.loadError && <p role="alert" className="mt-3 text-caption-13 text-error">Não foi possível carregar seus favoritos.</p>}
          {favorite.isError && <p role="alert" className="mt-3 text-caption-13 text-error">Não foi possível atualizar os favoritos. Tente novamente.</p>}
        </div>
      </section>
      <div className="flex flex-col gap-12 px-6 pt-6">
        <Description nft={nft} />
        {related}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-5 rounded-t-40 bg-surface-card px-6 pt-5 pb-9 shadow-buy-bar">
        <div className="flex items-center gap-3.5">
          <span className="text-caption-13 text-text-secondary">Qtd.</span>
          <Quantity size="sm" quantity={purchase.quantity} canDecrease={purchase.canDecrease} canIncrease={purchase.canIncrease} onDecrease={purchase.decrease} onIncrease={purchase.increase} />
          <p data-testid="nft-price" className="ml-auto text-title-20-bold leading-24 text-text-accent">{nft.price} ETH</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => purchase.addToCart('/checkout')} disabled={purchase.soldOut} loading={purchase.isAdding} className="min-h-0 h-15 w-49 rounded-40 text-body-15 font-medium">Comprar NFT</Button>
          <Button variant="secondary" aria-label="Adicionar ao carrinho" onClick={() => purchase.addToCart('/cart')} disabled={purchase.soldOut} loading={purchase.isAdding} className="min-h-0 size-15 rounded-full bg-surface-raised p-0 text-primary">
            <Icon src="/assets/figma/mcp/svg/shopping.svg" className="size-5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
