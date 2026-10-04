import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components'
import type { Cart, CartItem, Quote } from '@/contracts'
import { catalogOptions } from '@/features/catalog/api'
import { sessionOptions } from '@/features/session/api'
import { keys } from '@/lib/query'
import { connectNftUpdates } from '@/lib/realtime'
import { cartOptions, createQuote, removeCartItem, updateCartItem } from '../api'
import { CartLine } from './cart-line'
import { CartRelated } from './cart-related'
import { CartSummary } from './cart-summary'

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
  const lines = cart.data?.items ?? []
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
              {lines.map((line) => <CartLine key={line.nftId} line={line} quantityMutationPending={mutation.isPending} removeMutationPending={removeMutation.isPending && removeMutation.variables === line.nftId} onQuantityChange={(quantity) => mutation.mutate({ nftId: line.nftId, editionId: line.editionId, quantity })} onRemove={() => removeMutation.mutate(line.nftId)} />)}
          </div>
           <CartSummary
             coupon={coupon}
             onCouponChange={setCoupon}
             onApplyCoupon={() => applyCoupon.mutate()}
             applyCouponPending={applyCoupon.isPending}
             realtimeConnected={realtimeConnected}
             authenticated={authenticated}
             sessionPending={session.isPending}
             liveNotice={liveNotice}
             quantityMutationError={mutation.isError}
             removeMutationError={removeMutation.isError}
             applyCouponError={applyCoupon.isError}
             quoteError={baseQuote.isError}
             onRetryQuote={() => void baseQuote.refetch()}
             hasCoupon={Boolean(coupon)}
             onRemoveCoupon={() => { setCoupon(''); setAppliedCoupon(''); setQuote(null); localStorage.removeItem(couponStorageKey) }}
             quoteLoading={quoteLoading}
             displayedQuote={displayedQuote}
             checkoutDisabled={session.isPending || (authenticated && (!displayedQuote || baseQuote.isFetching || baseQuote.isError)) || mutation.isPending || removeMutation.isPending}
             onCheckout={goToCheckout}
           />
        </div>
         <CartRelated isPending={related.isPending} isError={related.isError} items={related.data?.items ?? []} onRetry={() => void related.refetch()} />
        </>
      )}
    </section>
  )
}
