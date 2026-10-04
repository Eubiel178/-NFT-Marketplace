import { useMutation, useQueryClient } from '@tanstack/react-query'

import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { setPrimaryWallet, type WalletList } from '../../api'
import { promotePrimary } from '../../lib/wallet-form'

// Troca a principal com atualização otimista: as duas carteiras mudam na tela na hora e voltam ao que eram se a API recusar.
export function useSetPrimaryWallet() {
  const client = useQueryClient()
  const userId = useSessionUserId()
  const queryKey = keys.wallets(userId)

  const mutation = useMutation({
    mutationFn: setPrimaryWallet,
    onMutate: async (id: string) => {
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData<WalletList>(queryKey)
      if (previous) client.setQueryData<WalletList>(queryKey, { items: promotePrimary(previous.items, id) })
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) client.setQueryData(queryKey, context.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
  })

  return {
    promote: (id: string) => mutation.mutate(id),
    pendingId: mutation.isPending ? mutation.variables : undefined,
    error: mutation.isError ? (parseHttpError(mutation.error).message ?? 'Não foi possível trocar a carteira principal.') : '',
  }
}
