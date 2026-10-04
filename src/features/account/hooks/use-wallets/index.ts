import { useQuery } from '@tanstack/react-query'

import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { getWallets } from '../../api'
import { splitWallets } from '../../lib/wallet-form'

// A mesma chave alimenta o pagamento: salvar ou trocar a principal aqui invalida a lista de lá.
export function useWallets() {
  const userId = useSessionUserId()
  const query = useQuery({ queryKey: keys.wallets(userId), queryFn: ({ signal }) => getWallets(signal), enabled: Boolean(userId) })
  return { query, ...splitWallets(query.data?.items ?? []) }
}
