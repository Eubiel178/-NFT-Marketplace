import { Link } from '@tanstack/react-router'

import { Badge, Image } from '@/components'

import type { Nft } from '@/contracts'

export interface HomeFeaturedProps {
  nft: Nft
}

export function HomeFeatured({ nft }: HomeFeaturedProps) {
  return (
    <article className="home-featured">
      <div className="home-featured-labels">
        <Badge variant="featured" size="sm" className="home-featured-badge">NFT EM DESTAQUE</Badge>
        <Badge variant="limited" size="sm" className="home-featured-badge">OFERTA LIMITADA</Badge>
      </div>
      <Link to="/nfts/$nftId" params={{ nftId: nft.id }} aria-label={`Ver destaque ${nft.name}`}>
        <Image src={nft.image} alt={nft.name} width={310} height={368} className="home-featured-image" />
      </Link>
      <Image src="/assets/figma/featured-green-ring.svg" alt="" width={22} height={22} className="home-featured-green-ring" aria-hidden="true" />
      <Image src="/assets/figma/featured-glow.svg" alt="" width={45} height={45} className="home-featured-glow" aria-hidden="true" />
      <Image src="/assets/figma/featured-dot.svg" alt="" width={15} height={15} className="home-featured-dot" aria-hidden="true" />
    </article>
  )
}
