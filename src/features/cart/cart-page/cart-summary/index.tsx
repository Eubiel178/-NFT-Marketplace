import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button, Input, Skeleton } from '@/components'
import type { Quote } from '@/contracts'

interface CartSummaryProps {
  coupon: string
  onCouponChange: (coupon: string) => void
  onApplyCoupon: () => void
  applyCouponPending: boolean
  realtimeConnected: boolean | null
  authenticated: boolean
  liveNotice: string
  quantityMutationError: boolean
  removeMutationError: boolean
  applyCouponError: boolean
  quoteError: boolean
  onRetryQuote: () => void
  hasCoupon: boolean
  onRemoveCoupon: () => void
  quoteLoading: boolean
  displayedQuote: Quote | undefined
  checkoutDisabled: boolean
  onCheckout: () => void
}

export function CartSummary({
  coupon,
  onCouponChange,
  onApplyCoupon,
  applyCouponPending,
  realtimeConnected,
  authenticated,
  liveNotice,
  quantityMutationError,
  removeMutationError,
  applyCouponError,
  quoteError,
  onRetryQuote,
  hasCoupon,
  onRemoveCoupon,
  quoteLoading,
  displayedQuote,
  checkoutDisabled,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title">Resumo da carteira</h2>
      <div className="cart-coupon"><Input label="Código promocional" value={coupon} onChange={(event) => onCouponChange(event.target.value)} placeholder="Digite o código promocional..." /><Button variant="apply" size="sm" onClick={onApplyCoupon} loading={applyCouponPending} disabled={!coupon.trim()}>Aplicar</Button></div>
      {realtimeConnected === false && <p className="cart-error" role="alert">As atualizações em tempo real estão indisponíveis. O carrinho continua sincronizado ao tentar novamente.</p>}
      {!authenticated && <p className="cart-notice" role="status">Entre para consultar a cotação e finalizar sua compra.</p>}
      {liveNotice && <p className="cart-notice" role="status">{liveNotice}</p>}
      {quantityMutationError && <p className="cart-error" role="alert">Não foi possível atualizar a quantidade. Tente novamente.</p>}
      {removeMutationError && <p className="cart-error" role="alert">Não foi possível remover o item. Tente novamente.</p>}
      {applyCouponError && <p className="cart-error" role="alert">Cupom inválido ou expirado.</p>}
      {quoteError && <p className="cart-error" role="alert">Não foi possível atualizar o resumo. <Button variant="link" size="sm" onClick={onRetryQuote}>Tentar novamente</Button></p>}
      {hasCoupon && <Button variant="ghost" size="sm" onClick={onRemoveCoupon}>Remover cupom</Button>}
      {quoteLoading && <p className="checkout-status" role="status">Calculando resumo...</p>}
      <dl className="cart-totals" aria-busy={quoteLoading}>
        <div><dt>Subtotal</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `${displayedQuote?.subtotal ?? '—'} ETH`}</dd></div>
        <div><dt>Desconto do lançamento</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `-${displayedQuote?.discount ?? '0'} ETH`}</dd></div>
        <div><dt>Taxa de rede</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : <><span>{displayedQuote?.networkFee ?? '0.016'} ETH</span><small>Taxa estimada</small></>}</dd></div>
        <div className="cart-total"><dt>Total</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `${displayedQuote?.total ?? '—'} ETH`}</dd></div>
      </dl>
      <Button className="cart-checkout" size="sm" disabled={checkoutDisabled} onClick={onCheckout}>Conectar e finalizar <ArrowRight aria-hidden="true" /></Button>
      <Link className="cart-continue" to="/">Continuar explorando</Link>
    </aside>
  )
}
