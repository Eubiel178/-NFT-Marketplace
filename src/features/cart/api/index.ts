import { cartSchema, type CartItem } from '@/contracts'
import { http } from '@/lib/http'

export async function addCartItem(input: CartItem) {
  return cartSchema.parse((await http.post('/cart/items', input)).data)
}

export async function updateCartItem(input: CartItem) {
  return cartSchema.parse((await http.patch(`/cart/items/${encodeURIComponent(input.nftId)}`, input)).data)
}

export async function removeCartItem(item: { nftId: string; editionId: string }) {
  return cartSchema.parse((await http.delete(`/cart/items/${encodeURIComponent(item.nftId)}`, { params: { editionId: item.editionId } })).data)
}
