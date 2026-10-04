import type { RefObject } from 'react'

import { Button, Image } from '@/components'
import type { CartLine, Quote, Wallet } from '@/contracts'
import { fromWei, toWei } from '@/lib/eth'

import { CheckoutPaymentMethods } from '../checkout-payment-methods'
import type { CheckoutPaymentMethod } from '../checkout-payment-methods'
import { CheckoutWalletList } from '../checkout-wallet-list'

interface CheckoutSummaryProps {
  realtimeConnected: boolean | null
  liveNotice: string
  quoteStale: boolean
  quote: Quote | undefined
  quoteIsError: boolean
  quoteIsFetching: boolean
  onRetryQuote: () => void
  orderErrorMessage?: string
  lines: CartLine[]
  wallets: Wallet[]
  selectedWalletId: string
  onWalletChange: (walletId: string) => void
  walletsRef: RefObject<HTMLFieldSetElement | null>
  onFocusWallets: () => void
  paymentMethod: CheckoutPaymentMethod
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void
  accepted: boolean
  onAcceptedChange: (accepted: boolean) => void
  canSubmit: boolean
  orderIsPending: boolean
}

export function CheckoutSummary({
  realtimeConnected,
  liveNotice,
  quoteStale,
  quote,
  quoteIsError,
  quoteIsFetching,
  onRetryQuote,
  orderErrorMessage,
  lines,
  wallets,
  selectedWalletId,
  onWalletChange,
  walletsRef,
  onFocusWallets,
  paymentMethod,
  onPaymentMethodChange,
  accepted,
  onAcceptedChange,
  canSubmit,
  orderIsPending,
}: CheckoutSummaryProps) {
  return (
    <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
      <h2 id="checkout-summary-title">Revisão da compra</h2>
      {realtimeConnected === false && <p className="checkout-error" role="alert">A conexão em tempo real foi interrompida. A cotação será revalidada antes do envio.</p>}
      {quoteIsError && <p className="checkout-error" role="alert">Não foi possível carregar a cotação. <Button variant="link" size="sm" onClick={onRetryQuote}>Tentar novamente</Button></p>}
      {quoteIsFetching && <p className="checkout-status" role="status">Atualizando cotação...</p>}
      {orderErrorMessage === undefined && (liveNotice || quoteStale) && <p className="checkout-error" role="alert">{liveNotice || 'A cotação mudou. Revise a compra antes de confirmar.'}</p>}
      {orderErrorMessage !== undefined && <p className="checkout-error" role="alert">{orderErrorMessage}</p>}
      <div className="checkout-wallet-status"><span>Carteira conectada</span><button type="button" onClick={onFocusWallets}>Trocar carteira</button></div>
      <div className="checkout-items">
        <div className="checkout-items-heading"><strong>Seus NFTs</strong><strong>Subtotal</strong></div>
        {lines.map((line) => <article className="checkout-item" key={line.nftId}><Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} /><div><strong>{line.nft.name}</strong><small>ID do token: {line.nft.tokenId ?? `#${line.nftId.replace('nft-', '').padStart(4, '0')}`} (x {line.quantity})</small></div><strong>{fromWei(toWei(line.nft.price) * BigInt(line.quantity))} ETH</strong></article>)}
      </div>
      <p className="checkout-disclaimer">Tem um código promocional? Aplique aqui</p>
      <dl className="checkout-totals"><div><dt>Subtotal</dt><dd>{quote?.subtotal ?? '—'} ETH</dd></div><div><dt>Desconto do lançamento</dt><dd>(-) {quote?.discount ?? '0'} ETH</dd></div><div><dt>Taxa de rede</dt><dd><span>{quote?.networkFee ?? '0.016'} ETH</span><small>Taxa estimada</small></dd></div><div className="checkout-total"><dt>Total</dt><dd>{quote?.total ?? '—'} ETH</dd></div></dl>
      <CheckoutWalletList wallets={wallets} selectedWalletId={selectedWalletId} onWalletChange={onWalletChange} walletsRef={walletsRef} />
      <CheckoutPaymentMethods paymentMethod={paymentMethod} onPaymentMethodChange={onPaymentMethodChange} />
      <label className="checkout-consent"><input type="checkbox" checked={accepted} onChange={(event) => onAcceptedChange(event.target.checked)} /> Confirmo que os dados e a carteira selecionada estão corretos.</label>
      <Button form="checkout-form" type="submit" size="pillLg" loading={orderIsPending} disabled={!canSubmit}>Confirmar compra</Button>
    </aside>
  )
}
