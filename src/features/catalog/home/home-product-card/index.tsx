import { Link } from '@tanstack/react-router'

import { NftCard } from '@/components'

import type { Nft } from '@/contracts'

export interface HomeProductCardProps {
  nft: Nft
  mobile?: boolean
  rare?: boolean
  promo?: boolean
  priority?: boolean
}

export function HomeProductCard({ nft, mobile = false, rare = false, promo = false, priority = false }: HomeProductCardProps) {
  return (
    <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="home-product-card-link" aria-label={nft.name}>
      <NftCard
        image={nft.image}
        imageAlt={nft.name}
        name={nft.name}
        price={nft.price}
        originalPrice={promo ? '2.29' : undefined}
        hasDiscount={promo}
        showRareBadge={rare}
        isMobile={mobile}
        priority={priority}
        className={mobile ? 'home-product-card-mobile' : 'home-product-card-desktop'}
      />
    </Link>
  )
}
