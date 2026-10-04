import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Image } from '../image'

export interface NftReceiptArtworkProps extends Omit<ComponentProps<'div'>, 'children'> {
  image?: string
  imageAlt: string
  name: string
  tokenId?: string
  quantity: number
  totalEth: string | null
}

// Linha do recibo: as três colunas seguem o cabeçalho "NFTs | Edições | Subtotal"
// (receiptColumns), com a imagem e o nome dentro da primeira.
export const receiptColumns = 'grid grid-cols-[minmax(0,1fr)_4.5rem_6.25rem] items-center gap-x-6 max-sm:grid-cols-[minmax(0,1fr)_3.5rem_5rem] max-sm:gap-x-2'

export function NftReceiptArtwork({ className, image, imageAlt, name, quantity, tokenId, totalEth, ...props }: NftReceiptArtworkProps) {
  return (
    <div className={cn(receiptColumns, className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        {image ? (
          <Image priority src={image} alt={imageAlt} width={70} height={70} className="size-17.5 shrink-0 rounded-6 object-cover max-sm:size-12" />
        ) : (
          <span aria-hidden="true" className="size-17.5 shrink-0 rounded-6 bg-surface-raised max-sm:size-12" />
        )}
        <div className="grid min-w-0 gap-1">
          <strong data-testid="receipt-name" className="text-body-15-bold leading-20 text-foreground max-sm:text-body-14 max-sm:font-bold">{name}</strong>
          {tokenId && <span className="text-caption-13 leading-16 text-text-secondary max-sm:text-caption-12">ID do token: {tokenId}</span>}
        </div>
      </div>
      <span data-testid="receipt-quantity" className="text-center text-body-14 text-text-secondary">(x {quantity})</span>
      <strong data-testid="receipt-total" className="text-right text-body-large-18-bold whitespace-nowrap text-text-accent max-sm:text-body-15-bold">
        {totalEth ? `${totalEth} ETH` : '—'}
      </strong>
    </div>
  )
}
