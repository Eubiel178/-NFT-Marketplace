import { Link } from '@tanstack/react-router'

import { Button, Image } from '@/components'

import { ConnectionStatus } from '../connection-status'
import { MobileMethods } from '../methods'
import type { CheckoutViewProps } from '../view-props'
import { WalletCards } from '../wallet-cards'

// Frame mobile: carteiras cadastradas, método de conexão, total e botão fixo no rodapé.
export function Mobile({ quote, quoteLoading, quoteError, onRetryQuote, form, errors, wallets, onWallet, method, onMethod, connection, liveNotice, canConfirm, onConfirm }: CheckoutViewProps) {
  const fieldErrors = Object.values(errors)
  return (
    <div className="pt-1.75 pb-28">
      <div className="flex min-h-8.75 items-center gap-6.25">
        <Link to="/cart" aria-label="Voltar para o carrinho" className="block size-8.75 shrink-0 rounded-full">
          <Image src="/assets/figma/mcp/svg/back.svg" alt="" width={35} height={35} className="size-full" />
        </Link>
        <h1 className="text-title-20-bold leading-24">Pagamento com carteira</h1>
      </div>
      <div className="mt-6.5 flex items-center justify-between">
        <h2 className="text-body-large-16-bold">Carteira conectada</h2>
        <a href="#checkout-wallets" className="text-body-14 font-bold leading-16 text-text-accent">Trocar carteira</a>
      </div>
      <div className="mt-4">
        <WalletCards wallets={wallets} selectedId={form.walletId} onSelect={onWallet} />
      </div>
      <h2 className="mt-4 text-body-large-16-bold">Carteira e rede</h2>
      <div className="mt-4">
        <MobileMethods value={method} onChange={onMethod} disabled={connection.status === 'connecting'} />
      </div>
      <p className="mt-4.25 flex items-baseline justify-end gap-7.5 text-body-large-16-bold">
        Total:
        <span data-testid="checkout-total" className="text-title-20-bold text-text-accent">{quoteLoading ? '…' : `${quote?.total ?? '—'} ETH`}</span>
      </p>
      <div className="mt-2">
        <ConnectionStatus {...connection} />
      </div>
      <p role="alert" className="text-caption-13 text-error empty:hidden">{liveNotice}</p>
      {quoteError && (
        <p role="alert" className="text-caption-13 text-error">
          Não foi possível carregar a cotação.{' '}
          <Button variant="link" size="sm" className="min-h-0 p-0 text-caption-13" onClick={onRetryQuote}>Tentar novamente</Button>
        </p>
      )}
      {fieldErrors.length > 0 && (
        <div role="alert" className="mt-2 text-caption-13 text-error">
          <p>Complete seu perfil antes de pagar:</p>
          <ul className="list-disc pl-5">{fieldErrors.map((error) => <li key={error}>{error}</li>)}</ul>
          <Link to="/profile" className="underline">Editar perfil</Link>
        </div>
      )}
      <div className="fixed inset-x-7 bottom-8 z-40">
        <Button variant="primary" disabled={!canConfirm} onClick={onConfirm} className="min-h-0 h-15 w-full rounded-40 text-body-15-bold">Confirmar compra</Button>
      </div>
    </div>
  )
}
