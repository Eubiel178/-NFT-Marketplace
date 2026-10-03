import { Link } from '@tanstack/react-router'

import { CarouselDots, Image } from '@/components'

import type { Nft } from '@/contracts'

export interface NftDetailRelatedProps {
  nfts: readonly Nft[]
}

export function NftDetailRelated({ nfts }: NftDetailRelatedProps) {
  return (
    <section className="nft-detail-related" aria-labelledby="nft-detail-related-title">
      <div className="nft-detail-related-heading"><h2 id="nft-detail-related-title">Mais desta coleção</h2></div>
      <div className="nft-detail-related-grid">
        {nfts.slice(0, 5).map((nft) => <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="nft-detail-related-card" key={nft.id}><Image src={nft.image} alt={nft.name} width={212} height={212} /><strong>{nft.name}</strong><span>{nft.price} ETH</span></Link>)}
      </div>
        <CarouselDots activeIndex={1} className="nft-detail-related-dots" />
    </section>
  )
}
