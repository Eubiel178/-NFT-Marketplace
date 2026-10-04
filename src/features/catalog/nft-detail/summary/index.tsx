import { Button, Icon } from '@/components'
import type { Nft } from '@/contracts'
import { useFavorite } from '@/features/favorites'
import { cn } from '@/lib/utils'

import { useNftPurchase } from '../../hooks/use-nft-purchase'
import { filledStars } from '../../lib/nft-detail'
import { Editions } from '../editions'
import { FavoriteButton } from '../favorite-button'
import { Quantity } from '../quantity'
import { TokenInfo } from '../token-info'

const shareIcons = [
  { label: 'LinkedIn', icon: '/assets/figma/mcp/svg/linkedin.svg', href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
  { label: 'mensagem', icon: '/assets/figma/mcp/svg/message.svg', href: (url: string, title: string) => `mailto:?subject=${title}&body=${url}` },
  { label: 'Twitter', icon: '/assets/figma/mcp/svg/twitter.svg', href: (url: string, title: string) => `https://twitter.com/intent/tweet?text=${title}&url=${url}` },
] as const

export function Summary({ nft }: { nft: Nft }) {
  const purchase = useNftPurchase(nft)
  const favorite = useFavorite(nft.id)
  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(nft.name)

  return (
    <section aria-labelledby="nft-title" className="min-w-0 flex-1 lg:pt-1">
      <h1 id="nft-title" className="text-heading-28-bold leading-30">{nft.name}</h1>
      <div className="mt-3 flex items-center justify-between gap-4 border-b border-border pb-3">
        <p data-testid="nft-price" className="text-title-22-bold leading-24 text-text-accent">{nft.price} ETH</p>
        {nft.rating && (
          <p className="flex items-center gap-1 text-body-15 leading-16">
            <span className="flex gap-0.75" aria-hidden="true">
              {filledStars(nft.rating).map((filled, index) => (
                <Icon key={index} src="/assets/figma/mcp/svg/iconly-bold-star.svg" className={cn('size-4', filled ? 'text-primary' : 'text-text-secondary')} />
              ))}
            </span>
            <span className="sr-only">Nota {nft.rating} de 5,</span>
            {nft.reviews} avaliações de colecionadores
          </p>
        )}
      </div>
      <h2 className="mt-3 text-body-15-bold">Sobre este NFT:</h2>
      {nft.description && <p className="mt-3 text-body-14-regular text-text-secondary">{nft.description}</p>}
      <div className="mt-2">
        <Editions nft={nft} selected={purchase.edition} onSelect={purchase.selectEdition} />
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-4">
        <Quantity size="lg" quantity={purchase.quantity} canDecrease={purchase.canDecrease} canIncrease={purchase.canIncrease} onDecrease={purchase.decrease} onIncrease={purchase.increase} />
        <div className="flex gap-0.75">
          <Button variant="primarySolid" onClick={() => purchase.addToCart('/cart')} disabled={purchase.soldOut} loading={purchase.isAdding} className="min-h-0 h-10.25 w-30.75 rounded-4 text-body-14 font-bold">COMPRAR</Button>
          <FavoriteButton variant="labeled" favorite={favorite.favorite} pending={favorite.isPending} onToggle={favorite.toggle} />
        </div>
      </div>
      <div className="mt-3" aria-live="polite">
        {purchase.soldOut && <p role="alert" className="mb-2 text-caption-13 text-error">Esta edição está esgotada.</p>}
        {purchase.addError && <p role="alert" className="mb-2 text-caption-13 text-error">Não foi possível adicionar o NFT ao carrinho.</p>}
        {favorite.loadError && <p role="alert" className="mb-2 text-caption-13 text-error">Não foi possível carregar seus favoritos.</p>}
        {favorite.isError && <p role="alert" className="mb-2 text-caption-13 text-error">Não foi possível atualizar os favoritos. Tente novamente.</p>}
      </div>
      <TokenInfo nft={nft} />
      <p className="mt-2.75 flex items-center gap-2 text-body-15-bold">
        Compartilhar este NFT:
        {shareIcons.map((share) => (
          <a key={share.label} href={share.href(shareUrl, shareTitle)} target="_blank" rel="noreferrer" aria-label={`Compartilhar por ${share.label}`} className="text-foreground">
            <Icon src={share.icon} className="size-4" />
          </a>
        ))}
      </p>
    </section>
  )
}
