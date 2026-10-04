import { useMutation } from '@tanstack/react-query'

import { keys, queryClient } from '@/lib/query'
import { clearUserItems } from '@/lib/user-storage'
import { resetPrivateRealtime } from '@/realtime'
import { logout, sessionOptions } from '@/shared/api/session'

// Encerra a sessão e descarta tudo que pertence a ela: queries em andamento,
// assinaturas em tempo real, cupom/idempotência guardados e o cache.
export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      const userId = queryClient.getQueryData(sessionOptions.queryKey)?.user?.id
      await queryClient.cancelQueries()
      resetPrivateRealtime()
      if (userId) clearUserItems(userId)
      queryClient.clear()
      queryClient.setQueryData(keys.session, { user: null })
      window.location.assign('/')
    },
  })
}
