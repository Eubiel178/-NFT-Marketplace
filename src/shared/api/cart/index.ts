import { queryOptions } from '@tanstack/react-query'

import { cartSchema } from '@/contracts'
import { http } from '@/lib/http'
import { keys } from '@/lib/query'

export function cartOptions(userId: string | null) {
  return queryOptions({
    queryKey: keys.cart(userId),
    queryFn: async ({ signal }) => cartSchema.parse((await http.get('/cart', { signal })).data),
  })
}
