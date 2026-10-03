import { cn } from '@/lib/utils'

import { Badge } from '../badge'
import { Button } from '../button'
import { Image } from '../image'

export interface NftCardProps {
  image: string;
  imageAlt: string;
  name: string;
  price: string;
  originalPrice?: string;
  edition?: string;
  hasDiscount?: boolean;
  showRareBadge?: boolean;
  isPromo?: boolean;
  isMobile?: boolean;
  showAction?: boolean;
  priority?: boolean;
  onClick?: () => void;
  onFavorite?: () => void;
  favorite?: boolean;
  className?: string;
}

export function NftCard({
  image,
  imageAlt,
  name,
  price,
  originalPrice,
  edition,
  hasDiscount,
  showRareBadge = false,
  isPromo = false,
  isMobile = false,
  showAction = false,
  priority = false,
  onClick,
  onFavorite,
  favorite = false,
  className,
}: NftCardProps) {
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onClick()
  }

  if (isMobile) {
    return (
      <article
        className={cn(
          "relative flex flex-col",
          "bg-gradient-card-mobile",
          "rounded-[20px]",
          "p-[12px_4px_20px]",
          "gap-[10px]",
          "w-full",
          className,
        )}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleCardKeyDown}
      >
        <div className="relative">
          <Image
            src={image}
            alt={imageAlt}
            width={168}
            height={168}
            className="h-auto max-h-[168px] w-full aspect-square object-cover rounded-[16px]"
            loading={priority ? 'eager' : 'lazy'}
          />
          {onFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="absolute right-2 bottom-2 p-1 bg-surface-raised/80 backdrop-blur-sm border border-border rounded-full transition-colors hover:bg-surface-raised"
              aria-label={
                favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              aria-pressed={favorite}
            >
              <svg
                className={cn(
                  "h-5 w-5 transition-colors",
                  favorite
                    ? "fill-primary text-primary"
                    : "fill-none stroke-text",
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
          {showRareBadge && (
            <Badge variant="rare" className={cn('absolute top-2 left-2', isMobile && 'home-rare-badge')}>
              RARO
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-body-15-bold truncate">{name}</h3>
            {edition && (
              <span className="text-caption-12-regular text-text-secondary whitespace-nowrap">
                Edição: {edition}
              </span>
            )}
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
        {showAction && <Button variant="primary" size="lg" className="w-full" onClick={onClick}>
          {isPromo ? 'EXPLORAR' : 'COMPRAR'}
        </Button>}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "relative flex flex-col",
        "bg-surface-card",
        "rounded-[15px]",
        "overflow-hidden",
        "transition-shadow duration-200 hover:shadow-cart-focus",
        className,
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 168px, (max-width: 1023px) 210px, 250px"
          priority={priority}
        />
        {onFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute right-2 bottom-2 p-1 bg-surface-raised/80 backdrop-blur-sm border border-border rounded-full transition-colors hover:bg-surface-raised"
            aria-label={
              favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            aria-pressed={favorite}
          >
            <svg
              className={cn(
                "h-5 w-5 transition-colors",
                favorite
                  ? "fill-primary text-primary"
                  : "fill-none stroke-text",
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
        {showRareBadge && (
          <Badge variant="rare" className="absolute top-2 left-2">
            RARO
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-body-large-16-bold truncate">{name}</h3>
          {edition && (
            <span className="text-caption-12-regular text-text-secondary whitespace-nowrap">
              Edição: {edition}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-body-large-16-bold">{price} ETH</span>
          {originalPrice && hasDiscount && (
              <span className="text-body-large-16-regular text-text-secondary">
              {originalPrice} ETH
            </span>
          )}
        </div>
        {showAction && <Button variant="primary" size="lg" className="w-full mt-auto" onClick={onClick}>
          COMPRAR
        </Button>}
      </div>
    </article>
  );
}
