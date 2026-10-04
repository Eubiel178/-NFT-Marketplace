import { Image } from '@/components'
import type { CartLine } from '@/contracts'

import { lineTotal } from '../../lib/order-line'

export function OrderLines({ lines }: { lines: readonly CartLine[] }) {
  return (
    <section aria-labelledby="checkout-items-title">
      <h2 id="checkout-items-title" className="text-body-large-18-bold leading-24">Seus NFTs</h2>
      <div aria-hidden="true" className="mt-2 flex justify-between border-b border-border pb-3 text-body-15-bold">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      <ul aria-label="NFTs da compra" className="mt-3 flex flex-col gap-3">
        {lines.map((line) => (
          <li key={`${line.nftId}:${line.editionId}`} className="flex h-17.5 items-center bg-surface-card pr-4.5 pl-1">
            <Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} className="mr-1.5 size-17.5 shrink-0 rounded-6 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-large-16-bold">{line.nft.name}</p>
              <p className="text-caption-13 leading-16 text-text-secondary">ID do token: {line.nft.tokenId}</p>
            </div>
            <span className="ml-1.5 shrink-0 text-caption-12 text-text-secondary">(x {line.quantity})</span>
            <strong className="ml-0.5 shrink-0 -translate-y-0.75 text-title-20-bold text-text-accent">{lineTotal(line)} ETH</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
