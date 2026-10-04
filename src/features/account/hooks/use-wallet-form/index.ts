import { useState, type FormEvent } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { saveWallet } from '../../api'
import { formField } from '../../lib/ens'
import { validateWallet, type WalletErrors, type WalletField, type WalletForm } from '../../lib/wallet-form'

interface UseWalletFormOptions {
  initial: WalletForm
  // Sem id é cadastro; com id, edição.
  id?: string
  // Cadastro que assume a principal (a anterior passa a secundária).
  primary?: boolean
  onSaved?: () => void
}

// Estado, validação e envio de um formulário de carteira. Os erros da API ficam no campo de origem.
export function useWalletForm({ initial, id, primary, onSaved }: UseWalletFormOptions) {
  const client = useQueryClient()
  const userId = useSessionUserId()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<WalletErrors>({})
  const [formError, setFormError] = useState('')

  const save = useMutation({
    mutationFn: saveWallet,
    onSuccess: () => onSaved?.(),
    onError: (error) => {
      const apiError = parseHttpError(error)
      const fields = Object.fromEntries(Object.entries(apiError.fields ?? {}).map(([field, message]) => [formField(field), message]))
      setErrors(fields)
      setFormError(apiError.message ?? 'Não foi possível salvar a carteira. Tente novamente.')
    },
    // O pagamento lê a mesma lista: invalidar mantém a seleção de carteira de lá igual à daqui.
    onSettled: () => client.invalidateQueries({ queryKey: keys.wallets(userId) }),
  })

  function setField(field: WalletField, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function replace(next: WalletForm) {
    setForm(next)
    setErrors({})
    setFormError('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save.reset()
    setFormError('')
    const result = validateWallet(form)
    setErrors(result.ok ? {} : result.errors)
    if (!result.ok) {
      setFormError('Confira os campos destacados.')
      return
    }
    save.mutate({ id, input: result.input, primary })
  }

  return { form, errors, formError, setField, replace, submit, pending: save.isPending, saved: save.isSuccess }
}
