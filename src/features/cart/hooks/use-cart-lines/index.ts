import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Cart, CartItem, CartLine } from '@/contracts'
import { keys } from '@/lib/query'
import { cartOptions } from '@/shared/api/cart'

import { removeCartItem, updateCartItem } from '../../api'
import { lineKey } from '../../lib/cart-line'

const sameLine = (line: CartItem, target: CartItem) => lineKey(line) === lineKey(target)

// Linhas do carrinho com alteração e remoção otimistas e rollback em caso de falha.
export function useCartLines(userId: string | null) {
  const queryClient = useQueryClient()
  const cartKey = keys.cart(userId)
  const cart = useQuery(cartOptions(userId))

  const snapshot = async () => {
    await queryClient.cancelQueries({ queryKey: cartKey })
    return queryClient.getQueryData<Cart>(cartKey)
  }

  const update = useMutation({
    mutationFn: (item: CartItem) => updateCartItem(item),
    onMutate: async (item) => {
      const previous = await snapshot()
      if (previous) queryClient.setQueryData<Cart>(cartKey, { items: previous.items.map((line) => (sameLine(line, item) ? { ...line, quantity: item.quantity } : line)) })
      return { previous }
    },
    onError: (_error, _item, context) => {
      if (context?.previous) queryClient.setQueryData(cartKey, context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey })
    },
  })

  const remove = useMutation({
    mutationFn: (item: CartItem) => removeCartItem(item),
    scope: { id: 'cart-remove' },
    onMutate: async (item) => {
      const previous = await snapshot()
      if (previous) queryClient.setQueryData<Cart>(cartKey, { items: previous.items.filter((line) => !sameLine(line, item)) })
      return { removed: previous?.items.find((line) => sameLine(line, item)) }
    },
    onError: (_error, _item, context) => {
      if (!context?.removed) return
      const current = queryClient.getQueryData<Cart>(cartKey)
      queryClient.setQueryData<Cart>(cartKey, { items: [...(current?.items ?? []), context.removed] })
    },
    onSuccess: (next) => {
      queryClient.setQueryData<Cart>(cartKey, next)
    },
  })

  const lines: CartLine[] = cart.data?.items ?? []
  const items: CartItem[] = lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }))

  return {
    cart,
    lines,
    items,
    changeQuantity: (line: CartLine, quantity: number) => update.mutate({ nftId: line.nftId, editionId: line.editionId, quantity }),
    removeLine: (line: CartLine) => remove.mutate({ nftId: line.nftId, editionId: line.editionId, quantity: line.quantity }),
    updating: update.isPending,
    removingKey: remove.isPending && remove.variables ? lineKey(remove.variables) : null,
    removing: remove.isPending,
    updateError: update.isError,
    removeError: remove.isError,
  }
}
