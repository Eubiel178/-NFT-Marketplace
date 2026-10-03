import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'

import { sessionSchema } from '@/contracts'
import { http } from '@/lib/http'
import { keys } from '@/lib/query'

export const sessionOptions = queryOptions({
  queryKey: keys.session, staleTime: 0, retry: false,
  queryFn: async ({ signal }) => sessionSchema.parse((await http.get('/session', { signal })).data),
})

export function isSessionExpired(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401
}
