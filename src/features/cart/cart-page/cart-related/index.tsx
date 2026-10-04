import { Button, Skeleton } from '@/components'
import type { Nft } from '@/contracts'
import { CatalogCard } from '@/features/catalog'
import { cn } from '@/lib/utils'

interface CartRelatedProps {
  isPending: boolean
  isError: boolean
  items: Nft[]
  onRetry: () => void
}

export function CartRelated({ isPending, isError, items, onRetry }: CartRelatedProps) {
  return (
    <section aria-labelledby="cart-related-title" className="mt-12 grid gap-6 max-sm:hidden">
      <h2 id="cart-related-title" className="m-0 border-b border-border pb-3 text-body-large-18 text-primary">Colecionadores também viram</h2>
      <div className="grid grid-cols-5 gap-4">
        {isPending && Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-48" />)}
        {isError && <p className="m-0 text-caption-13 text-error" role="alert">Não foi possível carregar as recomendações. <Button variant="link" size="sm" onClick={onRetry}>Tentar novamente</Button></p>}
        {items.slice(3, 8).map((nft) => <CatalogCard key={nft.id} nft={nft} priority />)}
      </div>
      <div className="flex justify-center gap-2" aria-hidden="true">
        {[false, true, false].map((active, index) => <span key={index} className={cn('block size-2.5 rounded-full border border-primary', active && 'bg-primary')} />)}
      </div>
    </section>
  )
}
