import { Link } from '@tanstack/react-router'

import { Badge, Image } from '@/components'
import type { Nft } from '@/contracts'

export interface CatalogCardProps {
  nft: Nft
  priority?: boolean
}

// Card do catálogo: moldura com gradiente e cantos de 20px no mobile, moldura
// reta de 258×300 a partir de sm (frames do Figma).
export function CatalogCard({ nft, priority = false }: CatalogCardProps) {
  return (
    <Link to="/nfts/$nftId" params={{ nftId: nft.id }} aria-label={nft.name} className="group block min-w-0 text-foreground">
      <div className="relative rounded-20 bg-(image:--gradient-card-mobile) px-1 pt-3 pb-5 sm:flex sm:h-75 sm:items-center sm:rounded-none sm:bg-surface-card sm:bg-none sm:p-1">
        <Image
          src={nft.image}
          alt={nft.name}
          width={250}
          height={250}
          priority={priority}
          className="aspect-square w-full rounded-16 object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
        {nft.rare && <Badge variant="rare" size="sm" className="absolute top-4 left-0 rounded-none sm:hidden">RARO</Badge>}
      </div>
      <div className="mt-2.25 px-2 sm:mt-2 sm:px-0">
        <h3 className="truncate text-body-15 leading-20 sm:text-body-large-16 sm:leading-24">{nft.name}</h3>
        <p className="text-body-large-16-bold text-text-accent sm:mt-1 sm:text-body-large-18-bold">
          {nft.price} ETH
          {nft.originalPrice && <span className="ml-2 font-normal text-text-secondary">{nft.originalPrice} ETH</span>}
        </p>
      </div>
    </Link>
  )
}
