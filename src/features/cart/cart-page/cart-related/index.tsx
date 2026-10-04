import { Button, Skeleton } from '@/components'
import type { Nft } from '@/contracts'
import { CatalogProductCard } from '@/features/catalog/product-card'

interface CartRelatedProps {
  isPending: boolean
  isError: boolean
  items: Nft[]
  onRetry: () => void
}

export function CartRelated({ isPending, isError, items, onRetry }: CartRelatedProps) {
  return (
    <section className="cart-related" aria-labelledby="cart-related-title">
      <h2 id="cart-related-title">Colecionadores também viram</h2>
      <div className="cart-related-grid">
        {isPending && Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-48" />)}
        {isError && <p className="cart-error" role="alert">Não foi possível carregar as recomendações. <Button variant="link" size="sm" onClick={onRetry}>Tentar novamente</Button></p>}
        {items.slice(3, 8).map((nft) => <CatalogProductCard key={nft.id} nft={nft} priority />)}
      </div>
      <div className="cart-related-dots" aria-hidden="true"><span /><span className="is-active" /><span /></div>
    </section>
  )
}
