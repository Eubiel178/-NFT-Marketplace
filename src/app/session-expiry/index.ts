import { persistCheckoutResume } from '@/features/checkout'
import { setUnauthorizedHandler } from '@/lib/http'
import { keys, queryClient } from '@/lib/query'
import { resetPrivateRealtime } from '@/realtime'
import { sessionOptions } from '@/shared/api/session'

// Sessão que expirou com o usuário dentro do app: guarda o contexto do pagamento,
// cancela o que está em voo e descarta dados privados e assinaturas. O cupom e a chave
// de idempotência do usuário ficam, para retomar a compra sem criar outro pedido.
// Devolve false quando não havia usuário (visitante com 401 não é sessão expirada).
export async function discardExpiredSession() {
  if (!queryClient.getQueryData(sessionOptions.queryKey)?.user) return false
  persistCheckoutResume()
  // A consulta da sessão fica de fora: o guard do router pode estar esperando por ela.
  await queryClient.cancelQueries({ predicate: (query) => query.queryKey[0] !== keys.session[0] })
  resetPrivateRealtime()
  queryClient.clear()
  queryClient.setQueryData(keys.session, { user: null })
  return true
}

// Qualquer 401 do Axios (menos login/cadastro) passa por aqui: descarta a sessão e
// manda para o login, que devolve ao destino atual depois da autenticação.
export function installSessionExpiry(goToLogin: () => void) {
  let handling = false
  setUnauthorizedHandler(() => {
    if (handling) return
    handling = true
    void discardExpiredSession()
      .then((discarded) => {
        if (discarded) goToLogin()
      })
      .finally(() => {
        handling = false
      })
  })
}
