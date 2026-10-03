import { Image } from '@/components'

export interface HomePromoCardProps {
  title: string
  description: string
  image: string
  imageAlt: string
  maskSrc: string
}

export function HomePromoCard({ title, description, image, imageAlt, maskSrc }: HomePromoCardProps) {
  return (
      <article className="home-promo-card">
       <Image src={image} alt={imageAlt} width={292} height={250} className="home-promo-image" />
       <Image src={maskSrc} alt="" width={65} height={116} className="home-promo-mask" aria-hidden="true" />
       <div className="home-promo-copy">
        <h2 className="text-body-large-18-bold">{title}</h2>
        <p className="text-body-14-regular">{description}</p>
         <a href="#home-products" className="home-promo-link">EXPLORAR <Image src="/assets/figma/mcp/svg/iconly-curved-arrow-right-2.svg" alt="" width={16} height={16} aria-hidden="true" /></a>
      </div>
      </article>
  )
}
