import { useEffect, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { ArrowLeft, Check } from 'lucide-react'

import { Button, Image, Input, Select } from '@/components'
import type { Quote } from '@/contracts'
import { cartOptions, createQuote } from '@/features/cart/api'
import { getWallets } from '@/features/account/api'
import { isSessionExpired, sessionOptions } from '@/features/session/api'
import { fromWei, toWei } from '@/lib/eth'
import { connectNftUpdates } from '@/lib/realtime'
import { createOrder, getOrderByKey } from '../api'

const idempotencyStorageKey = 'nft-marketplace:checkout-idempotency'
const couponStorageKey = 'nft-marketplace:checkout-coupon'

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
  const cart = useQuery(cartOptions)
  const wallets = useQuery({ queryKey: ['wallets'], queryFn: ({ signal }) => getWallets(signal) })
  const [walletId, setWalletId] = useState('')
  const [network, setNetwork] = useState('ethereum')
  const [name, setName] = useState(session.data?.user?.name ?? '')
  const [email, setEmail] = useState(session.data?.user?.email ?? '')
  const [walletAddress, setWalletAddress] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'walletconnect' | 'metamask' | 'coinbase'>('coinbase')
  const [coupon] = useState(() => localStorage.getItem(couponStorageKey) ?? '')
  const [quoteStale, setQuoteStale] = useState(false)
  const [liveNotice, setLiveNotice] = useState('')
  const [realtimeConnected, setRealtimeConnected] = useState<boolean | null>(null)
  const staleQuoteId = useRef<string | undefined>(undefined)
  const orderSubmissionStarted = useRef(false)
  const walletsRef = useRef<HTMLFieldSetElement>(null)
  const [idempotencyKey] = useState(() => {
    const existing = localStorage.getItem(idempotencyStorageKey)
    if (existing) return existing
    const next = crypto.randomUUID()
    localStorage.setItem(idempotencyStorageKey, next)
    return next
  })
  const lines = cart.data?.items ?? []
  const items = lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }))
  const quoteQueryKey = ['checkout-quote', items, coupon] as const
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
  useEffect(() => connectNftUpdates((event) => {
    if (!itemIdsKey.split('|').includes(event.resourceId)) return
    staleQuoteId.current = quote.data?.id
    setQuoteStale(true)
    setAccepted(false)
    setLiveNotice(`O preço ou a disponibilidade de ${event.nft.name} mudou. Revise a cotação antes de confirmar.`)
   }, setRealtimeConnected), [itemIdsKey, quote.data?.id])
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
        return await createOrder({ quoteId: latestQuote.id, quoteVersion: latestQuote.version, walletId: selectedWalletId, network: network as 'ethereum' | 'polygon', idempotencyKey })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 504) return getOrderByKey(idempotencyKey)
        throw error
      }
    },
    onSuccess: (order) => { localStorage.removeItem(idempotencyStorageKey); void navigate({ to: '/orders/$orderId', params: { orderId: order.id } }) },
    onError: (error) => {
      orderSubmissionStarted.current = false
      if (error instanceof Error && error.name === 'QUOTE_STALE' || axios.isAxiosError(error) && error.response?.status === 409) {
        setQuoteStale(true)
        setAccepted(false)
        void quote.refetch()
      }
    },
  })
  const canSubmit = Boolean(quote.data && selectedQuoteId && selectedWalletId && selectedWalletAddress && (name || session.data?.user?.name) && (email || session.data?.user?.email) && accepted && !quoteStale && !quote.isFetching && !orderMutation.isPending)
  const changePaymentMethod = (method: 'walletconnect' | 'metamask' | 'coinbase') => {
    setPaymentMethod(method)
    setNetwork(method === 'walletconnect' ? 'polygon' : 'ethereum')
  }
  const focusWallets = () => {
    walletsRef.current?.scrollIntoView({ block: 'center' })
    walletsRef.current?.querySelector<HTMLInputElement>('input')?.focus()
  }

  if (cart.isPending || wallets.isPending) return <section className="checkout-page"><div className="checkout-skeleton" role="status" aria-label="Carregando pagamento" /></section>
  if (cart.isError || wallets.isError) return <section className="checkout-page" role="alert"><h1>Não foi possível carregar o pagamento</h1><Button onClick={() => { void cart.refetch(); void wallets.refetch() }}>Tentar novamente</Button></section>
  if (lines.length === 0) return <section className="checkout-page cart-empty"><h1>Seu carrinho está vazio</h1><p>Adicione um NFT antes de iniciar o pagamento.</p><Button asChild><Link to="/cart">Voltar ao carrinho</Link></Button></section>

  return (
    <section className="checkout-page" aria-labelledby="checkout-title" data-realtime-connected={realtimeConnected === null ? 'connecting' : String(realtimeConnected)}>
      <div className="checkout-heading"><Link to="/cart" aria-label="Voltar para o carrinho"><ArrowLeft aria-hidden="true" /></Link><h1 id="checkout-title">Pagamento com carteira</h1></div>
      <div className="checkout-grid">
        <form id="checkout-form" className="checkout-form" onSubmit={(event) => { event.preventDefault(); if (canSubmit && !orderSubmissionStarted.current) { orderSubmissionStarted.current = true; orderMutation.mutate() } }}>
           <fieldset><legend>Dados do colecionador</legend><div className="checkout-fields"><Input label="Nome de exibição" required value={name || session.data?.user?.name || ''} onChange={(event) => setName(event.target.value)} /><Input label="Nome de usuário" required defaultValue="ana-kurio" /><Select label="Rede" required options={[{ value: 'ethereum', label: 'Ethereum' }, { value: 'polygon', label: 'Polygon' }]} value={network} onChange={setNetwork} /><Input label="Nome do perfil" required defaultValue="Ana Demo" /><Input label="Endereço da carteira" required value={walletAddress || selectedWallet?.address || ''} onChange={(event) => setWalletAddress(event.target.value)} placeholder="Endereço 0x da carteira" /><Input label="ENS ou carteira secundária (opcional)" placeholder="ENS ou carteira secundária (opcional)" /><Select label="Tipo de carteira" required options={wallets.data?.items.map((wallet) => ({ value: wallet.id, label: wallet.name })) ?? []} value={selectedWalletId} onChange={setWalletId} /><Input label="Código de indicação" /><Input label="E-mail" required type="email" value={email || session.data?.user?.email || ''} onChange={(event) => setEmail(event.target.value)} /><Input label="Nome ENS" placeholder="Nome ENS" /></div><label className="checkout-other-wallet"><input type="checkbox" /> Usar outra carteira?</label><label className="checkout-note"><span>Observação do colecionador (opcional)</span><textarea /></label></fieldset>
         </form>
         <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
           <h2 id="checkout-summary-title">Revisão da compra</h2>
             {realtimeConnected === false && <p className="checkout-error" role="alert">A conexão em tempo real foi interrompida. A cotação será revalidada antes do envio.</p>}
            {quote.isError && <p className="checkout-error" role="alert">Não foi possível carregar a cotação. <Button variant="link" size="sm" onClick={() => void quote.refetch()}>Tentar novamente</Button></p>}
            {quote.isFetching && <p className="checkout-status" role="status">Atualizando cotação...</p>}
            {!orderMutation.isError && (liveNotice || quoteStale) && <p className="checkout-error" role="alert">{liveNotice || 'A cotação mudou. Revise a compra antes de confirmar.'}</p>}
           {orderMutation.isError && <p className="checkout-error" role="alert">{orderMutation.error instanceof Error && orderMutation.error.name === 'QUOTE_STALE' || axios.isAxiosError(orderMutation.error) && orderMutation.error.response?.status === 409 ? 'A cotação mudou. Revise a compra antes de confirmar.' : 'Não foi possível confirmar o pedido. Revise os dados e tente novamente.'}</p>}
           <div className="checkout-wallet-status"><span>Carteira conectada</span><button type="button" onClick={focusWallets}>Trocar carteira</button></div>
          <div className="checkout-items"><div className="checkout-items-heading"><strong>Seus NFTs</strong><strong>Subtotal</strong></div>{lines.map((line) => <article className="checkout-item" key={line.nftId}><Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} /><div><strong>{line.nft.name}</strong><small>ID do token: {line.nft.tokenId ?? `#${line.nftId.replace('nft-', '').padStart(4, '0')}`} (x {line.quantity})</small></div><strong>{fromWei(toWei(line.nft.price) * BigInt(line.quantity))} ETH</strong></article>)}</div>
           <p className="checkout-disclaimer">Tem um código promocional? Aplique aqui</p>
           <dl className="checkout-totals"><div><dt>Subtotal</dt><dd>{quote.data?.subtotal ?? '—'} ETH</dd></div><div><dt>Desconto do lançamento</dt><dd>(-) {quote.data?.discount ?? '0'} ETH</dd></div><div><dt>Taxa de rede</dt><dd><span>{quote.data?.networkFee ?? '0.016'} ETH</span><small>Taxa estimada</small></dd></div><div className="checkout-total"><dt>Total</dt><dd>{quote.data?.total ?? '—'} ETH</dd></div></dl>
            <fieldset ref={walletsRef} className="checkout-wallets"><legend>Carteiras cadastradas</legend>{wallets.data?.items.length === 0 ? <p className="checkout-error" role="status">Você ainda não cadastrou uma carteira. <Link to="/wallets">Cadastrar carteira</Link></p> : wallets.data.items.map((wallet) => <label className={wallet.id === selectedWalletId ? 'checkout-wallet is-selected' : 'checkout-wallet'} key={wallet.id}><input type="radio" name="wallet" value={wallet.id} checked={wallet.id === selectedWalletId} onChange={() => setWalletId(wallet.id)} /><span><strong>{wallet.name}</strong><small>{wallet.ens || wallet.address}<br />{wallet.label}</small></span>{wallet.id === selectedWalletId && <Check aria-hidden="true" />}</label>)}</fieldset>
           <div className="checkout-payment-methods"><h3>Carteira e rede</h3><div><button type="button" className={paymentMethod === 'walletconnect' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'walletconnect'} onClick={() => changePaymentMethod('walletconnect')}>W<br /><small>WalletConnect</small></button><button type="button" className={paymentMethod === 'metamask' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'metamask'} onClick={() => changePaymentMethod('metamask')}>M<br /><small>MetaMask</small></button><button type="button" className={paymentMethod === 'coinbase' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'coinbase'} onClick={() => changePaymentMethod('coinbase')}>◈<br /><small>Coinbase Wallet</small></button></div></div>
           <label className="checkout-consent"><input type="checkbox" checked={accepted} onChange={(event) => { setAccepted(event.target.checked); if (event.target.checked) { setQuoteStale(false); setLiveNotice('') } }} /> Confirmo que os dados e a carteira selecionada estão corretos.</label>
          <Button form="checkout-form" type="submit" size="pillLg" loading={orderMutation.isPending} disabled={!canSubmit}>Confirmar compra</Button>
        </aside>
      </div>
    </section>
  )
}
