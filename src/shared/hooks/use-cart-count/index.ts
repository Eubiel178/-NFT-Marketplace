import { useQuery } from '@tanstack/react-query'

import { cartOptions } from '@/shared/api/cart'
import { sessionOptions } from '@/shared/api/session'

// Total de unidades no carrinho do usuário atual (ou do visitante).
export function useCartCount() {
  const session = useQuery(sessionOptions)
  const cart = useQuery({ ...cartOptions(session.data?.user?.id ?? null), enabled: !session.isPending })
  return cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0
}
