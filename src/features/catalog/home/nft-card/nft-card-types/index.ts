export interface NftCardProps {
  image: string
  imageAlt: string
  name: string
  price: string
  originalPrice?: string
  hasDiscount?: boolean
  showRareBadge?: boolean
  priority?: boolean
  className?: string
}
