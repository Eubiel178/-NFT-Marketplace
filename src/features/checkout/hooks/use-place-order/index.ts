import { useRef, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import type { CartItem, Collector, Network, Quote } from '@/contracts'
import { isAxiosTimeout, parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { readUserItem, removeUserItem, writeUserItem } from '@/lib/user-storage'
import { createQuote } from '@/shared/api/quote'

import { createOrder, getOrderByKey } from '../../api'
import { describeQuoteChange } from '../../lib/quote-change'

interface PlaceOrderInput {
  userId: string
  items: CartItem[]
  coupon: string
  quote: Quote | undefined
  onFieldErrors: (fields: Record<string, string>) => void
}

export interface Review {
  quote: Quote
  changes: string[]
}

// Chave de idempotência por usuário: a mesma em cliques repetidos e reenvios
// depois de timeout; só é trocada quando o pedido é criado.
function useIdempotencyKey(userId: string) {
  const [key] = useState(() => {
    const saved = readUserItem('checkout-idempotency', userId)
    if (saved) return saved
    const created = crypto.randomUUID()
    writeUserItem('checkout-idempotency', userId, created)
    return created
  })
  return key
}

const isTimeout = (error: unknown) => {
  const details = parseHttpError(error)
  return details.code === 'ORDER_TIMEOUT' || details.status === 504 || isAxiosTimeout(error)
}

// Revisão antes do envio, revalidação da cotação e envio único do pedido.
export function usePlaceOrder({ userId, items, coupon, quote, onFieldErrors }: PlaceOrderInput) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const idempotencyKey = useIdempotencyKey(userId)
  const [review, setReview] = useState<Review | null>(null)
  const sending = useRef(false)

  const revalidate = useMutation({
    mutationFn: () => createQuote(items, coupon || undefined),
    onSuccess: (next) => {
      const seen = review?.quote ?? quote
      queryClient.setQueryData(keys.checkoutQuote(userId, items, coupon), next)
      setReview({ quote: next, changes: seen ? describeQuoteChange(seen, next) : [] })
    },
  })

  const order = useMutation({
    mutationFn: async (input: { quote: Quote; walletId: string; network: Network; collector: Collector }) => {
      try {
        return await createOrder({ quoteId: input.quote.id, quoteVersion: input.quote.version, walletId: input.walletId, network: input.network, collector: input.collector, idempotencyKey })
      } catch (error) {
        if (isTimeout(error)) return getOrderByKey(idempotencyKey)
        throw error
      }
    },
    onSuccess: (created) => {
      removeUserItem('checkout-idempotency', userId)
      void navigate({ to: '/orders/$orderId', params: { orderId: created.id } })
    },
    onError: (error) => {
      const details = parseHttpError(error)
      if (details.code === 'QUOTE_STALE') revalidate.mutate()
      if (details.code === 'VALIDATION_ERROR' && details.fields) {
        setReview(null)
        onFieldErrors(details.fields)
      }
    },
    onSettled: () => {
      sending.current = false
    },
  })

  const details = parseHttpError(order.error)
  const orderError = !order.isError
    ? ''
    : details.code === 'QUOTE_STALE'
      ? 'A cotação mudou. Confira os novos valores e confirme de novo.'
      : isTimeout(order.error)
        ? 'A confirmação demorou. Tente de novo: o mesmo pedido será recuperado.'
        : (details.message ?? 'Não foi possível confirmar o pedido. Revise os dados e tente novamente.')

  return {
    review,
    reviewing: revalidate.isPending,
    reviewError: revalidate.isError,
    // Cada revisão começa limpa: o erro de um envio anterior não vale para a nova cotação.
    openReview: () => {
      order.reset()
      revalidate.mutate()
    },
    // Mudança vinda do nft.updated com a revisão aberta: revalida e exige nova confirmação.
    refreshReview: () => {
      if (review) revalidate.mutate()
    },
    closeReview: () => {
      setReview(null)
      order.reset()
    },
    submit: (input: { walletId: string; network: Network; collector: Collector }) => {
      if (!review || sending.current || revalidate.isPending) return
      sending.current = true
      order.mutate({ ...input, quote: review.quote })
    },
    submitting: order.isPending,
    orderError,
  }
}
