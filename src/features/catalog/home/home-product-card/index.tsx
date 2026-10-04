import { Link } from '@tanstack/react-router'

import type { Nft } from '@/contracts'

import { NftCard } from '../nft-card'

export interface HomeProductCardProps {
  nft: Nft
  mobile?: boolean
  rare?: boolean
  promo?: boolean
  priority?: boolean
}

export function HomeProductCard({ nft, mobile = false, rare = false, promo = false, priority = false }: HomeProductCardProps) {
  const Card = mobile ? NftCard.Mobile : NftCard.Desktop

  return (
    <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="home-product-card-link" aria-label={nft.name}>
      <Card
        image={nft.image}
        imageAlt={nft.name}
        name={nft.name}
        price={nft.price}
        originalPrice={promo ? '2.29' : undefined}
        hasDiscount={promo}
        showRareBadge={rare}
        priority={priority}
        className={mobile ? 'home-product-card-mobile' : 'home-product-card-desktop'}
      />
    </Link>
  )
}
