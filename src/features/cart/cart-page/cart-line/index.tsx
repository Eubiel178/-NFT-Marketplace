import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'

import { Button, Image, Stepper } from '@/components'
import type { CartLine as CartLineData } from '@/contracts'
import { fromWei, toWei } from '@/lib/eth'

interface CartLineProps {
  line: CartLineData
  quantityMutationPending: boolean
  removeMutationPending: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartLine({ line, quantityMutationPending, removeMutationPending, onQuantityChange, onRemove }: CartLineProps) {
  const total = `${fromWei(toWei(line.nft.price) * BigInt(line.quantity))} ETH`

  return (
    <article className="cart-line" role="listitem">
      <Link to="/nfts/$nftId" params={{ nftId: line.nftId }} className="cart-line-item"><Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} /><span><strong>{line.nft.name}</strong><small>ID do token: {line.nft.tokenId ?? `#${line.nftId.replace('nft-', '').padStart(4, '0')}`}</small><em className="cart-line-mobile-total">{total}</em></span></Link>
      <span className="cart-line-price">{line.nft.price} ETH</span>
      <Stepper value={line.quantity} max={line.nft.available} size="sm" disabled={quantityMutationPending || removeMutationPending} ariaLabel={`Quantidade de ${line.nft.name}`} onChange={onQuantityChange} />
      <strong className="cart-line-total">{total}</strong>
      <Button variant="ghost" size="icon" aria-label={`Remover ${line.nft.name}`} aria-busy={removeMutationPending} disabled={quantityMutationPending} onClick={onRemove}><Trash2 aria-hidden="true" /></Button>
    </article>
  )
}
