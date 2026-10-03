import { Image } from '@/components'

export interface HomeBlogCardProps {
  date: string
  readingTime: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export function HomeBlogCard({ date, readingTime, title, description, image, imageAlt }: HomeBlogCardProps) {
  return (
    <article className="home-blog-card">
      <Image src={image} alt={imageAlt} width={268} height={195} className="home-blog-image" />
      <div className="home-blog-copy">
        <p className="text-caption-12-regular text-text-secondary">{date} | {readingTime}</p>
        <h3 className="text-body-large-16-bold">{title}</h3>
        <p className="text-body-14-regular text-text-secondary">{description}</p>
        <a href="#home-products" className="home-blog-link">LER MAIS</a>
      </div>
    </article>
  )
}
