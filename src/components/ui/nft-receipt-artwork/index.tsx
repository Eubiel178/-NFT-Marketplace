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
    <article className={cn('nft-receipt-artwork', className)} {...props}>
      <Image src={image} alt={imageAlt} width={70} height={70} />
      <div className="nft-receipt-artwork-copy">
        <strong>{name}</strong>
        {(tokenId || quantity !== undefined) && (
          <small>
            {tokenId && `ID do token: ${tokenId}`}
            {quantity !== undefined && ` (x ${quantity})`}
          </small>
        )}
      </div>
      <strong className="nft-receipt-artwork-total">{totalEth} ETH</strong>
    </article>
  )
}
