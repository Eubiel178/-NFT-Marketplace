import { Image } from '@/components'

export interface CardProps {
  date: string
  readingTime: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export function Card({ date, readingTime, title, description, image, imageAlt }: CardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-8 bg-surface-card">
      <Image src={image} alt={imageAlt} width={268} height={195} className="h-48.75 w-full object-cover" />
      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <p className="text-caption-12 font-medium leading-16 text-text-secondary">{date}&nbsp;&nbsp;|&nbsp;&nbsp;Leitura de {readingTime}</p>
        <h3 className="mt-2 text-body-large-16-bold leading-22">{title}</h3>
        <p className="mt-1.5 text-caption-12 leading-16 text-text-secondary">{description}</p>
        <a href="#home-products" className="mt-2 text-caption-12-bold text-text-accent">Ler mais →</a>
      </div>
    </article>
  )
}
