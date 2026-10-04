import { Badge, Image } from '@/components'
import { cn } from '@/lib/utils'

import type { NftCardProps } from '../nft-card-types'

interface NftCardViewProps extends NftCardProps {
  variant: 'desktop' | 'mobile'
}

export function NftCardView({
  image,
  imageAlt,
  name,
  price,
  originalPrice,
  hasDiscount,
  showRareBadge = false,
  priority = false,
  className,
  variant,
}: NftCardViewProps) {
  return (
    <article
      className={cn(
        'relative flex flex-col',
        variant === 'desktop'
          ? [
              'bg-surface-card',
              'rounded-[15px]',
              'overflow-hidden',
              'transition-shadow duration-200 hover:shadow-cart-focus',
            ]
          : ['bg-(image:--gradient-card-mobile)', 'rounded-[20px]', 'p-[12px_4px_20px]', 'gap-[10px]', 'w-full'],
        className,
      )}
    >
      <div className={cn('relative', variant === 'desktop' ? 'aspect-square overflow-hidden' : undefined)}>
        <Image
          src={image}
          alt={imageAlt}
          fill={variant === 'desktop'}
          width={variant === 'desktop' ? undefined : 168}
          height={variant === 'desktop' ? undefined : 168}
          className={cn(
            variant === 'desktop'
              ? 'object-cover transition-transform duration-300 hover:scale-105'
              : 'h-auto max-h-[168px] w-full aspect-square object-cover rounded-[16px]',
          )}
          sizes={variant === 'desktop' ? '(max-width: 768px) 168px, (max-width: 1023px) 210px, 250px' : undefined}
          priority={priority}
        />
        {showRareBadge && (
          <Badge
            variant="rare"
            className={cn('absolute top-2 left-2', variant === 'mobile' && 'home-rare-badge')}
          >
            RARO
          </Badge>
        )}
      </div>
      <div className={cn('flex flex-col gap-2', variant === 'desktop' ? 'p-4' : 'w-full')}>
        <div className="flex items-center justify-between gap-2">
          <h3 className={cn(variant === 'desktop' ? 'text-body-large-16-bold' : 'text-body-15-bold', 'truncate')}>
            {name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-body-large-16-bold">{price} ETH</span>
          {originalPrice && hasDiscount && (
            <span className="text-body-large-16-regular text-text-secondary">
              {originalPrice} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
