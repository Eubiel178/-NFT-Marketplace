import { useState, type FormEvent } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PasswordChange, Profile, ProfileInput } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { updatePassword, updateProfile } from '../../api'
import { formField } from '../../lib/ens'
import { clearPasswords, toProfileForm, validateProfile, type ProfileErrors, type ProfileField } from '../../lib/profile-form'

interface SaveProfile {
  input: ProfileInput
  password: PasswordChange | null
}

// Edição dos dados pessoais e da senha. A senha só existe neste estado: nunca vai para o armazenamento do navegador.
export function useProfileForm(profile: Profile) {
  const client = useQueryClient()
  const userId = useSessionUserId()
  const [form, setForm] = useState(() => toProfileForm(profile))
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [formError, setFormError] = useState('')

  const save = useMutation({
    mutationFn: async ({ input, password }: SaveProfile) => {
      const next = await updateProfile(input)
      client.setQueryData(keys.profile(userId), next)
      if (password) await updatePassword(password)
      return next
    },
    onSuccess: () => setForm(clearPasswords),
    onError: (error) => {
      const apiError = parseHttpError(error)
      const fields = Object.fromEntries(Object.entries(apiError.fields ?? {}).map(([field, message]) => [formField(field), message]))
      setErrors(fields)
      setFormError(Object.keys(fields).length > 0 ? '' : (apiError.message ?? 'Não foi possível salvar as alterações.'))
    },
    // O nome e o e-mail da sessão mudam junto com o perfil.
    onSettled: () => client.invalidateQueries({ queryKey: keys.session }),
  })

  function setField(field: ProfileField, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save.reset()
    setFormError('')
    const result = validateProfile(form)
    setErrors(result.ok ? {} : result.errors)
    if (result.ok) save.mutate({ input: result.input, password: result.password })
  }

  return { form, errors, formError, setField, submit, pending: save.isPending, saved: save.isSuccess }
}
