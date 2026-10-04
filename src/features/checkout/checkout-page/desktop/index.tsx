import { Link } from '@tanstack/react-router'

import { Button } from '@/components'

import { CollectorForm } from '../collector-form'
import { ConnectionStatus } from '../connection-status'
import { DesktopMethods } from '../methods'
import { OrderLines } from '../order-lines'
import { Totals } from '../totals'
import type { CheckoutViewProps } from '../view-props'

// Frame desktop: trilha, perfil do colecionador à esquerda; NFTs, totais e carteira à direita.
export function Desktop({ lines, quote, quoteLoading, quoteError, onRetryQuote, form, errors, wallets, onField, onWallet, method, onMethod, connection, liveNotice, canConfirm, onConfirm }: CheckoutViewProps) {
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mt-2 flex gap-2 text-body-15-bold">
        <Link to="/">Início</Link>
        <span aria-hidden="true">/</span>
        <Link to="/cart">Mercado</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Pagamento</span>
      </nav>
      <h1 className="sr-only">Pagamento com carteira</h1>
      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25.3125rem] lg:gap-8.25">
        <form id="checkout-form" noValidate onSubmit={(event) => { event.preventDefault(); onConfirm() }}>
          <CollectorForm form={form} errors={errors} wallets={wallets} onField={onField} onWallet={onWallet} />
        </form>
        <aside aria-label="Resumo do pagamento" className="flex min-w-0 flex-col">
          <OrderLines lines={lines} />
          <Totals quote={quote} loading={quoteLoading} />
          <h2 className="mt-1.75 text-center text-body-large-18-bold leading-24">Carteira e rede</h2>
          <div className="mt-3.75">
            <DesktopMethods value={method} onChange={onMethod} disabled={connection.status === 'connecting'} />
          </div>
          <p role="alert" className="text-caption-13 text-error empty:hidden">{liveNotice}</p>
          {quoteError && (
            <p role="alert" className="text-caption-13 text-error">
              Não foi possível carregar a cotação.{' '}
              <Button variant="link" size="sm" className="min-h-0 p-0 text-caption-13" onClick={onRetryQuote}>Tentar novamente</Button>
            </p>
          )}
          <Button form="checkout-form" type="submit" variant="primarySolid" disabled={!canConfirm} className="mt-6 min-h-0 h-11.25 rounded-6 text-body-15-bold">Confirmar compra</Button>
          <div className="mt-2">
            <ConnectionStatus {...connection} />
          </div>
        </aside>
      </div>
    </>
  )
}
