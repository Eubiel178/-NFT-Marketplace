import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Image } from '../image'

export interface NftReceiptArtworkProps extends Omit<ComponentProps<'article'>, 'children'> {
  image: string
  imageAlt: string
  name: string
  tokenId?: string
  quantity?: number
  totalEth: string
}

export function NftReceiptArtwork({ className, image, imageAlt, name, quantity, tokenId, totalEth, ...props }: NftReceiptArtworkProps) {
  return (
    <article className={cn('grid min-h-22 grid-cols-[4.375rem_minmax(0,1fr)_auto] items-center gap-3 bg-surface-card p-2', className)} {...props}>
      <Image src={image} alt={imageAlt} width={70} height={70} className="size-17.5 rounded-6 object-cover" />
      <div className="grid min-w-0 gap-1">
        <strong className="truncate">{name}</strong>
        {(tokenId || quantity !== undefined) && (
          <small className="truncate text-caption-12 text-text-secondary">
            {tokenId && `ID do token: ${tokenId}`}
            {quantity !== undefined && ` (x ${quantity})`}
          </small>
        )}
      </div>
      <strong className="whitespace-nowrap text-text-accent">{totalEth} ETH</strong>
    </article>
  )
}
