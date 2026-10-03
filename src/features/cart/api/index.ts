import { cartSchema, quoteSchema, type CartItem } from '@/contracts'
import { http } from '@/lib/http'
import { keys } from '@/lib/query'
import { queryOptions } from '@tanstack/react-query'

export const cartOptions = queryOptions({
  queryKey: keys.cart,
  queryFn: async ({ signal }) => cartSchema.parse((await http.get('/cart', { signal })).data),
})

export async function addCartItem(input: CartItem) {
  return cartSchema.parse((await http.post('/cart/items', input)).data)
}

export async function updateCartItem(input: CartItem) {
  return cartSchema.parse((await http.patch(`/cart/items/${encodeURIComponent(input.nftId)}`, input)).data)
}

export async function removeCartItem(nftId: string) {
  return cartSchema.parse((await http.delete(`/cart/items/${encodeURIComponent(nftId)}`)).data)
}

export async function createQuote(items: CartItem[], coupon?: string) {
  return quoteSchema.parse((await http.post('/quote', { items, coupon })).data)
}
