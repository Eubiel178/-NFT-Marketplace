import { Link } from '@tanstack/react-router'

import { Button, CarouselDots, Image, Skeleton } from '@/components'
import type { Nft } from '@/contracts'

export interface RelatedProps {
  nfts: readonly Nft[]
  loading: boolean
  error: boolean
  onRetry: () => void
}

export function Related({ nfts, loading, error, onRetry }: RelatedProps) {
  return (
    <section aria-labelledby="nft-related-title">
      <h2 id="nft-related-title" className="border-b border-border pb-1.5 text-body-large-17-bold leading-24 text-text-accent">Mais desta coleção</h2>
      {error ? (
        <div role="alert" className="mt-8 flex items-center gap-4">
          <p>Não foi possível carregar recomendações.</p>
          <Button onClick={onRetry}>Tentar novamente</Button>
        </div>
      ) : (
        <ul aria-busy={loading} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6.5">
          {loading
            ? Array.from({ length: 5 }, (_, index) => <li key={index}><Skeleton className="h-63.75" /></li>)
            : nfts.map((nft) => (
                <li key={nft.id}>
                  <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="block text-foreground">
                    <span className="flex aspect-[219/255] items-center bg-surface-card p-0.75">
                      <Image src={nft.image} alt={nft.name} width={212} height={212} className="aspect-square w-full rounded-12 object-cover" />
                    </span>
                    <span className="mt-3 block truncate text-body-15 leading-18">{nft.name}</span>
                    <span className="block text-body-large-16-bold leading-16 text-text-accent">{nft.price} ETH</span>
                  </Link>
                </li>
              ))}
        </ul>
      )}
      <CarouselDots activeIndex={1} className="mt-8" />
    </section>
  )
}
