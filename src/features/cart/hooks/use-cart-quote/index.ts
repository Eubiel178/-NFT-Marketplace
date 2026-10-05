import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { CartItem } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { readUserItem, removeUserItem, writeUserItem } from '@/lib/user-storage'
import { createQuote } from '@/shared/api/quote'

// Cotação do carrinho (visitante incluído) e cupom. O cupom só vale depois que a
// API aceita; o motivo da recusa (inválido ou expirado) vem da própria API.
export function useCartQuote(userId: string | null, items: CartItem[]) {
  const queryClient = useQueryClient()
  const owner = userId ?? 'visitor'
  const [saved] = useState(() => (userId ? (readUserItem('checkout-coupon', userId) ?? '') : ''))
  const [coupon, setCoupon] = useState(saved)
  const [applied, setApplied] = useState(saved)

  const quote = useQuery({
    queryKey: keys.cartQuote(owner, items, applied),
    queryFn: () => createQuote(items, applied || undefined),
    enabled: items.length > 0,
  })

  const apply = useMutation({
    mutationFn: (code: string) => createQuote(items, code),
    onSuccess: (next, code) => {
      queryClient.setQueryData(keys.cartQuote(owner, items, code), next)
      setApplied(code)
      toast.success(`Cupom ${code} aplicado`)
      if (userId) writeUserItem('checkout-coupon', userId, code)
    },
  })

  const removeCoupon = () => {
    setCoupon('')
    setApplied('')
    apply.reset()
    if (userId) removeUserItem('checkout-coupon', userId)
  }

  return {
    coupon,
    setCoupon,
    applyCoupon: () => apply.mutate(coupon.trim()),
    applying: apply.isPending,
    couponError: apply.isError ? (parseHttpError(apply.error).message ?? 'Não foi possível aplicar o cupom.') : '',
    hasCoupon: Boolean(applied),
    removeCoupon,
    quote,
  }
}
