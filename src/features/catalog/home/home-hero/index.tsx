import { Link } from '@tanstack/react-router'

import { Button, Image } from '@/components'

import type { Nft } from '@/contracts'

export interface HomeHeroProps {
  artwork: Nft
}

export function HomeHero({ artwork }: HomeHeroProps) {
  return (
    <>
      <section className="home-hero-desktop" aria-labelledby="home-hero-title">
        <div className="home-hero-content">
          <div className="home-hero-copy">
            <p className="text-body-14-medium">Bem-vindo à Kurio</p>
            <h1 id="home-hero-title" className="text-display-43-bold">SEJA DONO DO FUTURO<br />DA ARTE DIGITAL</h1>
            <p className="text-body-14-regular home-hero-description">Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.</p>
            <Button asChild variant="primarySolid" size="sm" className="home-hero-cta">
              <a href="#home-products">EXPLORAR</a>
            </Button>
          </div>
          <Link to="/nfts/$nftId" params={{ nftId: artwork.id }} className="home-hero-image-link" aria-label={`Ver ${artwork.name}`}>
            <Image src={artwork.image} alt={artwork.name} width={450} height={450} priority className="home-hero-image" />
          </Link>
        </div>
        <Image src="/assets/figma/desktop-hero-seal.svg" alt="" width={40} height={8} className="home-hero-seal" aria-hidden="true" />
      </section>
      <section className="home-hero-mobile" aria-labelledby="home-mobile-hero-title">
        <Image src="/assets/figma/mobile-hero-mask.svg" alt="" fill className="home-mobile-hero-mask" aria-hidden="true" />
        <div className="home-mobile-hero-copy">
          <p className="text-body-14-bold">Bem-vindo à Kurio</p>
          <h1 id="home-mobile-hero-title" className="text-body-14-bold">SEJA DONO DA<br />CULTURA DIGITAL</h1>
          <p className="text-caption-12-regular">Descubra NFTs selecionados de criadores do mundo todo.</p>
          <a href="#home-products" className="home-mobile-hero-cta">EXPLORAR <Image src="/assets/figma/mcp/svg/iconly-curved-arrow-right.svg" alt="" width={16} height={16} aria-hidden="true" /></a>
        </div>
        <Link to="/nfts/$nftId" params={{ nftId: artwork.id }} className="home-mobile-hero-artwork" aria-label={`Ver ${artwork.name}`}>
          <Image src={artwork.image} alt={artwork.name} width={138} height={138} priority />
          <Image src="/assets/figma/featured-nft.png" alt="" width={58} height={58} className="home-mobile-hero-secondary" aria-hidden="true" />
        </Link>
        <div className="home-hero-dots" aria-label="Slide 1 de 3"><span className="is-active" /><span /><span /></div>
      </section>
    </>
  )
}
