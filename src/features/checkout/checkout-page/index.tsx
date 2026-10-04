import { Link } from '@tanstack/react-router'

import { Button, Skeleton } from '@/components'
import type { Wallet } from '@/contracts'
import { cn } from '@/lib/utils'
import { useRealtimeConnected } from '@/realtime'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { useCheckoutData } from '../hooks/use-checkout-data'
import { useCheckoutForm } from '../hooks/use-checkout-form'
import { useCheckoutLive } from '../hooks/use-checkout-live'
import { usePendingOrder } from '../hooks/use-pending-order'
import { usePlaceOrder } from '../hooks/use-place-order'
import { useWalletConnection } from '../hooks/use-wallet-connection'
import { defaultWallet, initialForm, paymentMethods, toCollector } from '../lib/checkout-form'
import { Desktop } from './desktop'
import { Mobile } from './mobile'
import { ReviewDialog } from './review-dialog'

const page = 'mx-auto w-full max-w-content max-sm:-ml-6 max-sm:w-[calc(100%+3rem)] max-sm:px-7'

const networkLabels = { ethereum: 'Ethereum', polygon: 'Polygon' } as const

// Mesmas caixas do conteúdo carregado (formulário e resumo), sem salto de layout.
function CheckoutSkeleton({ mobile }: { mobile: boolean }) {
  return (
    <section className={cn(page, 'flex flex-col gap-4')} role="status" aria-label="Carregando pagamento">
      <Skeleton className="h-8.75 w-64" />
      {mobile ? (
        <>
          <Skeleton className="h-23.25 rounded-14" />
          <Skeleton className="h-23.25 rounded-14" />
          <Skeleton className="h-56 rounded-15" />
        </>
      ) : (
        <div className="grid gap-8.25 lg:grid-cols-[minmax(0,1fr)_25.3125rem]">
          <Skeleton className="h-168" />
          <Skeleton className="h-195" />
        </div>
      )}
    </section>
  )
}

export function CheckoutPage() {
  const data = useCheckoutData()
  const isDesktop = useMediaQuery('(width >= 40rem)')
  const checkingPending = usePendingOrder(data.userId)

  if (data.loading || checkingPending) return <CheckoutSkeleton mobile={!isDesktop} />
  if (data.failed || !data.wallets.data)
    return (
      <section className={page} role="alert">
        <h1 className="text-heading-28-bold">Não foi possível carregar o pagamento</h1>
        <Button className="mt-6" onClick={data.retry}>Tentar novamente</Button>
      </section>
    )
  if (data.lines.length === 0)
    return (
      <section className={cn(page, 'grid justify-items-center gap-4 bg-surface-card px-8 py-16 text-center')}>
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione um NFT antes de iniciar o pagamento.</p>
        <Button asChild><Link to="/cart">Voltar ao carrinho</Link></Button>
      </section>
    )

  return <CheckoutContent key={data.userId} data={data} wallets={data.wallets.data.items} isDesktop={isDesktop} />
}

interface CheckoutContentProps {
  data: ReturnType<typeof useCheckoutData>
  wallets: Wallet[]
  isDesktop: boolean
}

// Só compõe: dados, formulário, conexão da carteira e envio vêm dos hooks.
function CheckoutContent({ data, wallets, isDesktop }: CheckoutContentProps) {
  const realtimeConnected = useRealtimeConnected()
  const checkout = useCheckoutForm(initialForm({ profile: data.profile.data, email: data.user?.email, name: data.user?.name, wallet: defaultWallet(wallets) }), isDesktop)
  const connection = useWalletConnection(data.userId, checkout.form.walletId)
  const order = usePlaceOrder({ userId: data.userId, items: data.items, coupon: data.coupon, quote: data.quote.data, onFieldErrors: checkout.showApiErrors })
  const liveNotice = useCheckoutLive(data.lines, order.refreshReview)

  const wallet = wallets.find((candidate) => candidate.id === checkout.form.walletId)
  const network = checkout.form.network || wallet?.network || 'ethereum'
  const methodLabel = paymentMethods.find((candidate) => candidate.value === connection.method)?.label ?? ''

  const view = {
    lines: data.lines,
    quote: data.quote.data,
    quoteLoading: data.quote.isPending,
    quoteError: data.quote.isError,
    onRetryQuote: () => void data.quote.refetch(),
    form: checkout.form,
    errors: checkout.errors,
    wallets,
    onField: checkout.setField,
    onWallet: (next: Wallet) => {
      checkout.selectWallet(next)
      connection.reconnect(next.id)
    },
    method: connection.method,
    onMethod: connection.choose,
    connection: { status: connection.status, error: connection.error, methodLabel, onDisconnect: connection.disconnect, onConnect: () => connection.choose(connection.method) },
    liveNotice,
    canConfirm: Boolean(data.quote.data) && connection.status === 'connected' && !order.submitting,
    onConfirm: () => {
      if (checkout.validate()) order.openReview()
    },
  }

  return (
    <section
      className={page}
      data-testid="checkout"
      data-realtime-connected={realtimeConnected === null ? 'connecting' : String(realtimeConnected)}
    >
      {isDesktop ? <Desktop {...view} /> : <Mobile {...view} />}
      <ReviewDialog
        open={order.reviewing || order.review !== null}
        review={order.review}
        reviewing={order.reviewing}
        reviewError={order.reviewError}
        submitting={order.submitting}
        orderError={order.orderError}
        walletName={wallet?.name ?? ''}
        networkLabel={networkLabels[network]}
        methodLabel={methodLabel}
        collector={toCollector(checkout.form)}
        onClose={order.closeReview}
        onRetry={order.openReview}
        onSubmit={() => order.submit({ walletId: checkout.form.walletId, network, collector: toCollector(checkout.form) })}
      />
    </section>
  )
}
