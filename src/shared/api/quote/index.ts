import { quoteSchema, type CartItem } from '@/contracts'
import { http } from '@/lib/http'

// Cotação é a autoridade de preço: carrinho e pagamento usam a mesma chamada.
export async function createQuote(items: CartItem[], coupon?: string) {
  return quoteSchema.parse((await http.post('/quote', { items, coupon })).data)
}
