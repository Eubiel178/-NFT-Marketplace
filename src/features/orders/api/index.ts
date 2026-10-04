import { orderSchema, type Order } from '@/contracts'
import { http } from '@/lib/http'

export async function getOrder(id: string, signal?: AbortSignal): Promise<Order> {
  return orderSchema.parse((await http.get(`/orders/${encodeURIComponent(id)}`, { signal })).data)
}
