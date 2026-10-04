import { useEffect, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components'
import type { Network, Quote } from '@/contracts'
import { getWallets } from '@/features/account/api'
import { createQuote } from '@/features/cart/api'
import { isAxiosTimeout, parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { readUserItem, removeUserItem, writeUserItem } from '@/lib/user-storage'
import { subscribeNftUpdates, useRealtimeConnected } from '@/realtime'
import { cartOptions } from '@/shared/api/cart'
import { isSessionExpired, sessionOptions } from '@/shared/api/session'
import { createOrder, getOrderByKey } from '../api'
import { CheckoutCustomerFields } from './checkout-customer-fields'
import { CheckoutSummary } from './checkout-summary'

function quotesMatch(first: Quote, second: Quote) {
  return first.subtotal === second.subtotal && first.discount === second.discount && first.networkFee === second.networkFee && first.total === second.total && first.items.every((item, index) => {
    const other = second.items[index]
    return item.nftId === other?.nftId && item.editionId === other.editionId && item.quantity === other.quantity && item.price === other.price
  }) && first.items.length === second.items.length
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useQuery(sessionOptions)
  const userId = session.data?.user?.id ?? ''
  const cart = useQuery({ ...cartOptions(userId), enabled: Boolean(userId) })
  const wallets = useQuery({ queryKey: keys.wallets(userId), queryFn: ({ signal }) => getWallets(signal), enabled: Boolean(userId) })
  const [walletId, setWalletId] = useState('')
  const [network, setNetwork] = useState<Network>('ethereum')
  const [name, setName] = useState(session.data?.user?.name ?? '')
  const [email, setEmail] = useState(session.data?.user?.email ?? '')
  const [walletAddress, setWalletAddress] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'walletconnect' | 'metamask' | 'coinbase'>('coinbase')
  const [coupon] = useState(() => readUserItem('checkout-coupon', userId) ?? '')
  const [quoteStale, setQuoteStale] = useState(false)
  const [liveNotice, setLiveNotice] = useState('')
  const realtimeConnected = useRealtimeConnected()
  const staleQuoteId = useRef<string | undefined>(undefined)
  const orderSubmissionStarted = useRef(false)
  const walletsRef = useRef<HTMLFieldSetElement>(null)
  const [idempotencyKey] = useState(() => {
    const existing = readUserItem('checkout-idempotency', userId)
    if (existing) return existing
    const next = crypto.randomUUID()
    writeUserItem('checkout-idempotency', userId, next)
    return next
  })
  const lines = cart.data?.items ?? []
  const items = lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }))
  const quoteQueryKey = keys.checkoutQuote(userId, items, coupon)
  const quote = useQuery({ queryKey: quoteQueryKey, queryFn: () => createQuote(items, coupon || undefined), enabled: items.length > 0 })
  const selectedWalletId = walletId || wallets.data?.items[1]?.id || wallets.data?.items[0]?.id || ''
  const selectedWallet = wallets.data?.items.find((wallet) => wallet.id === selectedWalletId)
  const selectedQuoteId = quote.data?.id || ''
  const selectedWalletAddress = walletAddress || selectedWallet?.address || ''
  const sessionExpired = isSessionExpired(session.error) || isSessionExpired(cart.error) || isSessionExpired(wallets.error) || isSessionExpired(quote.error)
  useEffect(() => {
    if (sessionExpired) void navigate({ to: '/login', search: { redirect: '/checkout', expired: true } })
  }, [navigate, sessionExpired])
  const itemIdsKey = items.map((item) => item.nftId).join('|')
  useEffect(() => subscribeNftUpdates((event) => {
    if (!itemIdsKey.split('|').includes(event.resourceId)) return
    staleQuoteId.current = quote.data?.id
    setQuoteStale(true)
    setAccepted(false)
    setLiveNotice(`O preço ou a disponibilidade de ${event.nft.name} mudou. Revise a cotação antes de confirmar.`)
   }), [itemIdsKey, quote.data?.id])
  const orderMutation = useMutation({
    mutationFn: async () => {
      const currentQuote = quote.data
      const latestQuote = await createQuote(items, coupon || undefined)
      if (!currentQuote || !quotesMatch(currentQuote, latestQuote)) {
        queryClient.setQueryData(quoteQueryKey, latestQuote)
        staleQuoteId.current = latestQuote.id
        setQuoteStale(true)
        setAccepted(false)
        const error = new Error('QUOTE_STALE')
        error.name = 'QUOTE_STALE'
        throw error
      }
      try {
        return await createOrder({ quoteId: latestQuote.id, quoteVersion: latestQuote.version, walletId: selectedWalletId, network, idempotencyKey })
      } catch (error) {
        const errorDetails = parseHttpError(error)
        if (errorDetails.code === 'ORDER_TIMEOUT' || errorDetails.status === 504 || isAxiosTimeout(error)) return getOrderByKey(idempotencyKey)
        throw error
      }
    },
    onSuccess: (order) => { removeUserItem('checkout-idempotency', userId); void navigate({ to: '/orders/$orderId', params: { orderId: order.id } }) },
    onError: (error) => {
      orderSubmissionStarted.current = false
      if (error instanceof Error && error.name === 'QUOTE_STALE' || parseHttpError(error).code === 'QUOTE_STALE') {
        setQuoteStale(true)
        setAccepted(false)
        void quote.refetch()
      }
    },
  })
  const orderErrorDetails = parseHttpError(orderMutation.error)
  const orderErrorIsQuoteStale = (orderMutation.error instanceof Error && orderMutation.error.name === 'QUOTE_STALE') || orderErrorDetails.code === 'QUOTE_STALE'
  const orderErrorIsIdempotencyConflict = orderErrorDetails.code === 'IDEMPOTENCY_CONFLICT'
  const orderErrorIsWalletRequired = orderErrorDetails.code === 'WALLET_REQUIRED'
  const orderErrorIsTimeout = orderErrorDetails.code === 'ORDER_TIMEOUT' || orderErrorDetails.status === 504 || isAxiosTimeout(orderMutation.error)
  const orderErrorMessage = orderMutation.isError
    ? orderErrorIsQuoteStale
      ? 'A cotação mudou. Revise a compra antes de confirmar.'
      : orderErrorIsIdempotencyConflict
        ? orderErrorDetails.message ?? 'A chave de idempotência já foi usada com outro pedido.'
        : orderErrorIsWalletRequired
          ? orderErrorDetails.message ?? 'Selecione uma carteira cadastrada.'
          : orderErrorIsTimeout
            ? orderErrorDetails.message ?? 'A confirmação demorou. O pedido será recuperado automaticamente.'
            : 'Não foi possível confirmar o pedido. Revise os dados e tente novamente.'
    : undefined
  const canSubmit = Boolean(quote.data && selectedQuoteId && selectedWalletId && selectedWalletAddress && (name || session.data?.user?.name) && (email || session.data?.user?.email) && accepted && !quoteStale && !quote.isFetching && !orderMutation.isPending)
  const changePaymentMethod = (method: 'walletconnect' | 'metamask' | 'coinbase') => {
    setPaymentMethod(method)
    setNetwork(method === 'walletconnect' ? 'polygon' : 'ethereum')
  }
  const focusWallets = () => {
    walletsRef.current?.scrollIntoView({ block: 'center' })
    walletsRef.current?.querySelector<HTMLInputElement>('input')?.focus()
  }
  const changeAcceptance = (nextAccepted: boolean) => {
    setAccepted(nextAccepted)
    if (nextAccepted) {
      setQuoteStale(false)
      setLiveNotice('')
    }
  }

  if (cart.isPending || wallets.isPending) return <section className="checkout-page"><div className="checkout-skeleton" role="status" aria-label="Carregando pagamento" /></section>
  if (cart.isError || wallets.isError) return <section className="checkout-page" role="alert"><h1>Não foi possível carregar o pagamento</h1><Button onClick={() => { void cart.refetch(); void wallets.refetch() }}>Tentar novamente</Button></section>
  if (lines.length === 0) return <section className="checkout-page cart-empty"><h1>Seu carrinho está vazio</h1><p>Adicione um NFT antes de iniciar o pagamento.</p><Button asChild><Link to="/cart">Voltar ao carrinho</Link></Button></section>

  return (
    <section className="checkout-page" aria-labelledby="checkout-title" data-realtime-connected={realtimeConnected === null ? 'connecting' : String(realtimeConnected)}>
      <div className="checkout-heading"><Link to="/cart" aria-label="Voltar para o carrinho"><ArrowLeft aria-hidden="true" /></Link><h1 id="checkout-title">Pagamento com carteira</h1></div>
      <div className="checkout-grid">
        <form id="checkout-form" className="checkout-form" onSubmit={(event) => { event.preventDefault(); if (canSubmit && !orderSubmissionStarted.current) { orderSubmissionStarted.current = true; orderMutation.mutate() } }}>
          <CheckoutCustomerFields
            nameValue={name || session.data?.user?.name || ''}
            onNameChange={setName}
            network={network}
            onNetworkChange={setNetwork}
            walletAddressValue={walletAddress || selectedWallet?.address || ''}
            onWalletAddressChange={setWalletAddress}
            walletOptions={wallets.data?.items.map((wallet) => ({ value: wallet.id, label: wallet.name })) ?? []}
            selectedWalletId={selectedWalletId}
            onWalletChange={setWalletId}
            emailValue={email || session.data?.user?.email || ''}
            onEmailChange={setEmail}
          />
        </form>
        <CheckoutSummary
          realtimeConnected={realtimeConnected}
          liveNotice={liveNotice}
          quoteStale={quoteStale}
          quote={quote.data}
          quoteIsError={quote.isError}
          quoteIsFetching={quote.isFetching}
          onRetryQuote={() => void quote.refetch()}
          orderErrorMessage={orderErrorMessage}
          lines={lines}
          wallets={wallets.data?.items ?? []}
          selectedWalletId={selectedWalletId}
          onWalletChange={setWalletId}
          walletsRef={walletsRef}
          onFocusWallets={focusWallets}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={changePaymentMethod}
          accepted={accepted}
          onAcceptedChange={changeAcceptance}
          canSubmit={canSubmit}
          orderIsPending={orderMutation.isPending}
        />
      </div>
    </section>
  )
}
