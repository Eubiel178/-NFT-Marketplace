import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import type { Session } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys, queryClient } from '@/lib/query'
import { clearUserItems } from '@/lib/user-storage'
import { resetPrivateRealtime } from '@/realtime'

import { login, register } from '../../api'
import { emptyAuthValues, safeRedirect, validateAuth, type AuthErrors, type AuthField, type AuthMode } from '../../lib/auth-form'

// Ações do frame fora do escopo do enunciado: o clique só informa, sem simular sucesso.
export type UnavailableAction = 'google' | 'facebook' | 'password-recovery'

const unavailableMessages: Record<UnavailableAction, string> = {
  google: 'Entrar com Google não está disponível. Use seu email e senha.',
  facebook: 'Entrar com Facebook não está disponível. Use seu email e senha.',
  'password-recovery': 'A recuperação de senha não está disponível nesta versão.',
}

// Login e cadastro: validação por campo antes do envio, erros da API associados aos
// campos, troca de sessão sem restos do usuário anterior e retorno ao fluxo de origem.
// A senha só existe no estado do formulário; o MSW guarda apenas o hash.
export function useAuthForm(mode: AuthMode, redirect: string | undefined) {
  const navigate = useNavigate()
  const [values, setValues] = useState(emptyAuthValues)
  const [clientErrors, setClientErrors] = useState<AuthErrors>({})
  const [notice, setNotice] = useState('')

  const mutation = useMutation({
    mutationFn: () => (mode === 'login' ? login({ email: values.email, password: values.password }) : register(values)),
    onSuccess: async (session) => {
      await queryClient.cancelQueries()
      const previousUserId = queryClient.getQueryData<Session>(keys.session)?.user?.id
      if (previousUserId && previousUserId !== session.user?.id) clearUserItems(previousUserId)
      resetPrivateRealtime()
      queryClient.clear()
      queryClient.setQueryData(keys.session, session)
      await navigate({ to: safeRedirect(redirect) })
    },
  })

  const apiError = parseHttpError(mutation.error)
  const errors: AuthErrors = { ...apiError.fields, ...clientErrors }

  return {
    values,
    errors,
    // Erro sem campo (ex.: credenciais inválidas) fica no formulário.
    formError: mutation.isError && !apiError.fields ? (apiError.message ?? 'Não foi possível continuar. Tente novamente.') : '',
    pending: mutation.isPending,
    setField: (field: AuthField, value: string) => {
      setValues((current) => ({ ...current, [field]: value }))
      setClientErrors((current) => ({ ...current, [field]: undefined }))
    },
    submit: () => {
      const next = validateAuth(mode, values)
      setClientErrors(next)
      if (Object.keys(next).length > 0) return
      mutation.reset()
      mutation.mutate()
    },
    notice,
    chooseUnavailable: (action: UnavailableAction) => setNotice(unavailableMessages[action]),
  }
}
