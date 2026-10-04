import { Link } from '@tanstack/react-router'

import { Icon, Image } from '@/components'
import type { Nft } from '@/contracts'

import { Dots } from '../dots'

export function Mobile({ artwork }: { artwork: Nft }) {
  return (
    <section aria-labelledby="home-hero-title" className="relative h-47.5 overflow-hidden rounded-31">
      <Image src="/assets/figma/mobile-hero-mask.svg" alt="" fill aria-hidden="true" />
      <div className="relative flex w-[54%] max-w-47.5 flex-col items-start pt-1.5 pl-4">
        <p className="text-caption-12 font-medium leading-16">Bem-vindo à Kurio</p>
        <h1 id="home-hero-title" className="mt-1.5 text-body-large-18-bold leading-30 tracking-tight">SEJA DONO DA<br />CULTURA DIGITAL</h1>
        <p className="mt-1.5 text-caption-12 leading-18 text-text-secondary">Descubra NFTs selecionados de criadores do mundo todo.</p>
        <a href="#home-products" className="mt-1 inline-flex items-center gap-3 text-caption-12-bold text-text-accent">
          EXPLORAR <Icon src="/assets/figma/mcp/svg/iconly-curved-arrow-right.svg" className="size-4" />
        </a>
      </div>
      <Link to="/nfts/$nftId" params={{ nftId: artwork.id }} aria-label={`Ver ${artwork.name}`} className="absolute top-2.5 right-4 size-34.5">
        <Image src={artwork.image} alt={artwork.name} width={138} height={138} priority className="size-full rounded-16 object-cover" />
        <Image src="/assets/figma/featured-nft.png" alt="" width={58} height={58} aria-hidden="true" className="absolute top-22.25 left-3.5 size-14.5 rounded-16 object-cover" />
      </Link>
      <Dots className="absolute bottom-2 left-1/2 -translate-x-1/2" />
    </section>
  )
}
