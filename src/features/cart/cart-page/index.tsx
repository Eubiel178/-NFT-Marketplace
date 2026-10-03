import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'

import { Button, Image, Input, Skeleton, Stepper } from '@/components'
import type { Cart, CartItem, Quote } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'
import { HomeProductCard } from '@/features/catalog/home/home-product-card'
import { sessionOptions } from '@/features/session/api'
import { fromWei, toWei } from '@/lib/eth'
import { keys } from '@/lib/query'
import { connectNftUpdates } from '@/lib/realtime'
import { cartOptions, createQuote, removeCartItem, updateCartItem } from '../api'

const couponStorageKey = 'nft-marketplace:checkout-coupon'

export function CartPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const cart = useQuery(cartOptions)
  const session = useQuery(sessionOptions)
  const related = useQuery(catalogOptions({ q: '', category: 'all', collection: 'all', network: 'all', sort: 'recent', page: 1 }))
  const [coupon, setCoupon] = useState(() => localStorage.getItem(couponStorageKey) ?? '')
  const [appliedCoupon, setAppliedCoupon] = useState(() => localStorage.getItem(couponStorageKey) ?? '')
  const [liveNotice, setLiveNotice] = useState('')
  const [realtimeConnected, setRealtimeConnected] = useState<boolean | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [optimisticallyRemoved, setOptimisticallyRemoved] = useState<string[]>([])
  const lines = (cart.data?.items ?? []).filter((line) => !optimisticallyRemoved.includes(line.nftId))
  const items = lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }))
  const mutation = useMutation({
    mutationFn: (input: CartItem) => updateCartItem(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: keys.cart })
      const previous = queryClient.getQueryData<Cart>(keys.cart)
      if (previous) queryClient.setQueryData<Cart>(keys.cart, { items: previous.items.map((line) => line.nftId === input.nftId ? { ...line, quantity: input.quantity } : line) })
      return { previous }
    },
    onError: (_error, _input, context) => { if (context?.previous) queryClient.setQueryData(keys.cart, context.previous) },
     onSettled: () => { setQuote(null); void queryClient.invalidateQueries({ queryKey: keys.cart }) },
   })
  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    scope: { id: 'cart-remove' },
    onMutate: async (nftId) => {
      await queryClient.cancelQueries({ queryKey: keys.cart })
      const previous = queryClient.getQueryData<Cart>(keys.cart)
      if (previous) queryClient.setQueryData<Cart>(keys.cart, { items: previous.items.filter((line) => line.nftId !== nftId) })
      return { previous, removed: previous?.items.find((line) => line.nftId === nftId) }
    },
    onError: (_error, _nftId, context) => {
      setOptimisticallyRemoved((current) => current.filter((id) => id !== _nftId))
      if (!context?.removed) return
      const current = queryClient.getQueryData<Cart>(keys.cart)
      queryClient.setQueryData<Cart>(keys.cart, { items: [...(current?.items ?? []), context.removed] })
    },
    onSuccess: (_next, nftId) => {
      const current = queryClient.getQueryData<Cart>(keys.cart)
      if (current) queryClient.setQueryData<Cart>(keys.cart, { items: current.items.filter((line) => line.nftId !== nftId) })
      setQuote(null)
    },
  })
  const applyCoupon = useMutation({
    mutationFn: () => createQuote(items, coupon.trim()),
    onSuccess: (next) => { const value = coupon.trim(); setAppliedCoupon(value); localStorage.setItem(couponStorageKey, value); setQuote(next) },
  })
  const itemIdsKey = items.map((item) => item.nftId).join('|')
  const baseQuote = useQuery({ queryKey: ['cart-quote', items, appliedCoupon], queryFn: () => createQuote(items, appliedCoupon || undefined), enabled: items.length > 0 && Boolean(session.data?.user) })
  const displayedQuote = quote ?? baseQuote.data
  const authenticated = Boolean(session.data?.user)
  const quoteLoading = authenticated && baseQuote.isFetching && !displayedQuote
  const goToCheckout = () => {
    if (!authenticated) {
      void navigate({ to: '/login', search: { redirect: '/checkout', expired: false } })
      return
    }
    void navigate({ to: '/checkout' })
  }
  useEffect(() => connectNftUpdates((event) => {
     if (!itemIdsKey.split('|').includes(event.resourceId)) return
      setQuote(null)
      setLiveNotice(`O preço ou a disponibilidade de ${event.nft.name} mudou. O resumo foi atualizado.`)
   }, setRealtimeConnected), [itemIdsKey])

  if (cart.isPending) return <section className="cart-page"><div className="cart-skeleton" role="status" aria-label="Carregando carrinho" /></section>
  if (cart.isError) return <section className="cart-page" role="alert"><h1>Não foi possível carregar o carrinho</h1><Button onClick={() => void cart.refetch()}>Tentar novamente</Button></section>

  return (
    <section className="cart-page" aria-label="Carrinho de NFTs">
      <nav className="cart-breadcrumb" aria-label="Breadcrumb"><Link to="/">Início</Link><span>/</span><Link to="/">Mercado</Link><span>/</span><strong>Carrinho</strong></nav>
       <div className="cart-header-mobile"><Link to="/" aria-label="Voltar"><ArrowLeft aria-hidden="true" /></Link><h1 id="cart-title-mobile">Carrinho de NFTs</h1></div>
       <h1 className="cart-title-desktop" id="cart-title">Carrinho de NFTs</h1>
       {lines.length === 0 ? <div className="cart-empty"><h2>Seu carrinho está vazio</h2><p>Descubra obras digitais para começar sua coleção.</p><Button asChild><Link to="/">Explorar NFTs</Link></Button></div> : (
         <>
         <div className="cart-layout">
          <div className="cart-items" role="list" aria-label="Itens do carrinho">
             <div className="cart-table-head"><span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span><span /></div>
            {lines.map((line) => {
              const total = `${fromWei(toWei(line.nft.price) * BigInt(line.quantity))} ETH`
               return <article className="cart-line" role="listitem" key={line.nftId}>
                 <Link to="/nfts/$nftId" params={{ nftId: line.nftId }} className="cart-line-item"><Image priority src={line.nft.image} alt={line.nft.name} width={70} height={70} /><span><strong>{line.nft.name}</strong><small>ID do token: {line.nft.tokenId ?? `#${line.nftId.replace('nft-', '').padStart(4, '0')}`}</small><em className="cart-line-mobile-total">{total}</em></span></Link>
                <span className="cart-line-price">{line.nft.price} ETH</span>
                 <Stepper value={line.quantity} max={line.nft.available} size="sm" disabled={mutation.isPending || removeMutation.isPending} ariaLabel={`Quantidade de ${line.nft.name}`} onChange={(value) => mutation.mutate({ nftId: line.nftId, editionId: line.editionId, quantity: value })} />
                 <strong className="cart-line-total">{total}</strong>
                  <Button variant="ghost" size="icon" aria-label={`Remover ${line.nft.name}`} aria-busy={removeMutation.isPending && removeMutation.variables === line.nftId} disabled={mutation.isPending} onClick={() => { setOptimisticallyRemoved((current) => current.includes(line.nftId) ? current : [...current, line.nftId]); removeMutation.mutate(line.nftId) }}><Trash2 aria-hidden="true" /></Button>
              </article>
            })}
          </div>
          <aside className="cart-summary" aria-labelledby="cart-summary-title">
            <h2 id="cart-summary-title">Resumo da carteira</h2>
             <div className="cart-coupon"><Input label="Código promocional" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Digite o código promocional..." /><Button variant="apply" size="sm" onClick={() => applyCoupon.mutate()} loading={applyCoupon.isPending} disabled={!coupon.trim()}>Aplicar</Button></div>
               {realtimeConnected === false && <p className="cart-error" role="alert">As atualizações em tempo real estão indisponíveis. O carrinho continua sincronizado ao tentar novamente.</p>}
              {!session.isPending && !authenticated && <p className="cart-notice" role="status">Entre para consultar a cotação e finalizar sua compra.</p>}
              {liveNotice && <p className="cart-notice" role="status">{liveNotice}</p>}
              {mutation.isError && <p className="cart-error" role="alert">Não foi possível atualizar a quantidade. Tente novamente.</p>}
              {removeMutation.isError && <p className="cart-error" role="alert">Não foi possível remover o item. Tente novamente.</p>}
              {applyCoupon.isError && <p className="cart-error" role="alert">Cupom inválido ou expirado.</p>}
              {baseQuote.isError && <p className="cart-error" role="alert">Não foi possível atualizar o resumo. <Button variant="link" size="sm" onClick={() => void baseQuote.refetch()}>Tentar novamente</Button></p>}
             {coupon && <Button variant="ghost" size="sm" onClick={() => { setCoupon(''); setAppliedCoupon(''); setQuote(null); localStorage.removeItem(couponStorageKey) }}>Remover cupom</Button>}
             {quoteLoading && <p className="checkout-status" role="status">Calculando resumo...</p>}
             <dl className="cart-totals" aria-busy={quoteLoading}>
               <div><dt>Subtotal</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `${displayedQuote?.subtotal ?? '—'} ETH`}</dd></div>
                <div><dt>Desconto do lançamento</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `-${displayedQuote?.discount ?? '0'} ETH`}</dd></div>
                <div><dt>Taxa de rede</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : <><span>{displayedQuote?.networkFee ?? '0.016'} ETH</span><small>Taxa estimada</small></>}</dd></div>
               <div className="cart-total"><dt>Total</dt><dd>{quoteLoading ? <Skeleton className="h-4 w-20" /> : `${displayedQuote?.total ?? '—'} ETH`}</dd></div>
            </dl>
              <Button className="cart-checkout" size="sm" disabled={session.isPending || (authenticated && (!displayedQuote || baseQuote.isFetching || baseQuote.isError)) || mutation.isPending || removeMutation.isPending} onClick={goToCheckout}>Conectar e finalizar <ArrowRight aria-hidden="true" /></Button>
            <Link className="cart-continue" to="/">Continuar explorando</Link>
          </aside>
        </div>
        <section className="cart-related" aria-labelledby="cart-related-title">
          <h2 id="cart-related-title">Colecionadores também viram</h2>
           <div className="cart-related-grid">
             {related.isPending && Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-48" />)}
              {related.isError && <p className="cart-error" role="alert">Não foi possível carregar as recomendações. <Button variant="link" size="sm" onClick={() => void related.refetch()}>Tentar novamente</Button></p>}
             {related.data?.items.slice(3, 8).map((nft) => <HomeProductCard key={nft.id} nft={nft} priority />)}
           </div>
         <div className="cart-related-dots" aria-hidden="true"><span /><span className="is-active" /><span /></div>
        </section>
        </>
      )}
    </section>
  )
}
