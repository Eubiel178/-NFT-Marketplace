import { Button, Icon, Image } from '@/components'

export interface CardProps {
  title: string
  description: string
  image: string
  imageAlt: string
  maskSrc: string
}

export function Card({ title, description, image, imageAlt, maskSrc }: CardProps) {
  return (
    <article className="relative flex h-62.5 overflow-hidden rounded-6 bg-surface-card">
      <div className="relative w-71.75 shrink-0">
        <Image src={image} alt={imageAlt} width={287} height={250} className="size-full rounded-16 object-cover" />
        <Image src={maskSrc} alt="" width={65} height={116} aria-hidden="true" className="absolute top-1/2 left-0 h-29 w-16.25 -translate-y-1/2" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-end pt-9.5 pr-7.5 pl-2 text-right">
        <h3 className="text-body-large-18-bold leading-24 whitespace-pre-line">{title}</h3>
        <p className="mt-2 max-h-18 overflow-hidden text-body-14-regular text-text-secondary">{description}</p>
        <Button asChild variant="primarySolid" size="sm" className="mt-auto mb-11.5 min-h-10 w-35 font-medium">
          <a href="#home-products">Explorar <Icon src="/assets/figma/mcp/svg/iconly-curved-arrow-right.svg" className="size-4" /></a>
        </Button>
      </div>
    </article>
  )
}
