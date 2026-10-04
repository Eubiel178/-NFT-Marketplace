import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'

import { Button, Image, Stepper } from '@/components'
import type { CartLine as CartLineData } from '@/contracts'
import { cn } from '@/lib/utils'

import { lineTotal } from '../../lib/cart-line'

// Colunas da tabela do carrinho (cabeçalho e linhas) a partir de sm.
export const cartColumns = 'sm:grid sm:grid-cols-[minmax(11.875rem,1fr)_5rem_6.875rem_5rem_2.5rem] sm:items-center sm:gap-2 lg:grid-cols-[minmax(13.75rem,1fr)_5.625rem_8.4375rem_5.625rem_2.5rem] lg:gap-4'

interface CartLineProps {
  line: CartLineData
  max: number
  quantityPending: boolean
  removePending: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartLine({ line, max, quantityPending, removePending, onQuantityChange, onRemove }: CartLineProps) {
  const total = `${lineTotal(line)} ETH`

  return (
    <article role="listitem" aria-label={line.nft.name} className={cn(cartColumns, 'relative mt-3 block min-h-25 rounded-12 bg-surface-card sm:min-h-17.5 sm:rounded-none sm:px-2 lg:px-4')}>
      <Link to="/nfts/$nftId" params={{ nftId: line.nftId }} className="grid min-h-25 grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 sm:flex sm:min-h-0 sm:gap-4">
        <Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} className="size-25 rounded-12 object-cover sm:size-17.5 sm:rounded-6" />
        <span className="grid gap-1">
          <strong className="text-body-15">{line.nft.name}</strong>
          <small className="text-caption-12 text-text-secondary">ID do token: {line.nft.tokenId}</small>
          <em className="text-body-large-16 font-bold text-text-accent not-italic sm:hidden">{total}</em>
        </span>
      </Link>
      <span data-testid="cart-line-price" className="text-body-large-16 max-sm:hidden">{line.nft.price} ETH</span>
      <Stepper
        value={line.quantity}
        max={max}
        size="sm"
        disabled={quantityPending || removePending}
        ariaLabel={`Quantidade de ${line.nft.name}`}
        onChange={onQuantityChange}
        className="max-sm:absolute max-sm:right-3 max-sm:bottom-3 max-sm:h-8 max-sm:gap-0 max-sm:border-0 max-sm:bg-transparent max-sm:[&_button]:size-6 max-sm:[&_button]:min-h-6 max-sm:[&_button]:rounded-full max-sm:[&_output]:w-6"
      />
      <strong className="text-body-large-16 max-sm:hidden">{total}</strong>
      <Button variant="ghost" size="icon" aria-label={`Remover ${line.nft.name}`} aria-busy={removePending} disabled={quantityPending} onClick={onRemove} className="max-sm:absolute max-sm:top-1 max-sm:right-1">
        <Trash2 aria-hidden="true" />
      </Button>
    </article>
  )
}
