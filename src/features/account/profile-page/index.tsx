import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { Button, Image, Input, PasswordInput } from '@/components'
import { apiErrorSchema } from '@/contracts'
import { keys } from '@/lib/query'

import { AccountShell } from '../account-shell'
import { getProfile, updateAvatar, updatePassword, updateProfile } from '../api'

export function ProfilePage() {
  const queryClient = useQueryClient()
  const profile = useQuery({ queryKey: keys.profile, queryFn: ({ signal }) => getProfile(signal) })
  const avatarInput = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const profileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const value = (name: string) => String(formData.get(name) ?? '')
      const currentPassword = value('currentPassword')
      const newPassword = value('newPassword')
      const confirmPassword = value('confirmPassword')
      if ((currentPassword || newPassword || confirmPassword) && (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword)) throw new Error('Confira os campos de senha e confirme a nova senha.')
      const next = await updateProfile({ displayName: value('displayName'), username: value('username'), bio: value('bio'), ens: value('ens'), website: value('website') })
      if (currentPassword) await updatePassword({ currentPassword, newPassword, confirmPassword })
      return next
    },
   onSuccess: (next) => { setFormError(''); setFieldErrors({}); queryClient.setQueryData(keys.profile, next) },
   onError: (error) => {
     const apiError = axios.isAxiosError(error) ? apiErrorSchema.safeParse(error.response?.data).data : undefined
     setFieldErrors(apiError?.fields ?? {})
     setFormError(apiError?.message ?? (error instanceof Error ? error.message : 'Não foi possível salvar as alterações.'))
   },
  })
  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: (next) => queryClient.setQueryData(keys.profile, next),
    onError: () => setFormError('Não foi possível atualizar o avatar.'),
  })
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => { if (typeof reader.result === 'string') avatarMutation.mutate(reader.result) })
    reader.readAsDataURL(file)
  }
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormError(''); setFieldErrors({}); profileMutation.mutate(new FormData(event.currentTarget)) }
  if (profile.isPending) return <section className="account-page"><div className="checkout-skeleton" role="status" aria-label="Carregando perfil" /></section>
  if (profile.isError) return <section className="account-page" role="alert"><h1>Não foi possível carregar o perfil</h1><Button onClick={() => void profile.refetch()}>Tentar novamente</Button></section>
  return <AccountShell><h2>Perfil do colecionador</h2><form className="account-form" onSubmit={submit}><div className="account-fields"><Input name="displayName" label="Nome de exibição" defaultValue={profile.data.displayName} required error={fieldErrors.displayName} /><Input name="username" label="Nome de usuário" defaultValue={profile.data.username} required error={fieldErrors.username} /><Input name="bio" label="Bio" defaultValue={profile.data.bio} error={fieldErrors.bio} /><SelectLike label="ENS" name="ens" defaultValue={profile.data.ens} error={fieldErrors.ens} /><Input name="website" label="Website" defaultValue={profile.data.website} error={fieldErrors.website} /><div className="avatar-field"><span>Avatar</span><div>{profile.data.avatar ? <Image src={profile.data.avatar} alt="Avatar do perfil" width={50} height={50} className="avatar-image" /> : <div className="avatar-placeholder">AD</div>}<input ref={avatarInput} type="file" accept="image/*" className="sr-only" aria-label="Selecionar avatar" onChange={handleAvatarChange} /><Button type="button" variant="secondary" size="sm" onClick={() => avatarInput.current?.click()} loading={avatarMutation.isPending}>Alterar</Button><Button type="button" variant="link" size="sm" onClick={() => avatarMutation.mutate(null)} disabled={!profile.data.avatar || avatarMutation.isPending}>Remover</Button></div></div></div><h3>Alterar senha</h3><div className="account-password-fields"><PasswordInput name="currentPassword" label="Senha atual" error={fieldErrors.currentPassword} /><PasswordInput name="newPassword" label="Nova senha" error={fieldErrors.newPassword} /><PasswordInput name="confirmPassword" label="Confirmar nova senha" error={fieldErrors.confirmPassword} /></div><Button type="submit" loading={profileMutation.isPending}>Salvar</Button>{formError && <p className="auth-error" role="alert">{formError}</p>}{profileMutation.isSuccess && !formError && <p className="account-success" role="status">Alterações salvas.</p>}</form></AccountShell>
}

function SelectLike({ label, name, defaultValue, error }: { label: string; name: string; defaultValue?: string; error?: string }) {
  const errorId = `${name}-error`
  return <label className="account-select-like"><span>{label}</span><select name={name} defaultValue={defaultValue} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? errorId : undefined}><option value="">Selecione uma opção</option><option value="ana.kurio.eth">ana.kurio.eth</option><option value="nova.kurio.eth">nova.kurio.eth</option></select>{error && <span id={errorId} className="auth-error" role="alert">{error}</span>}</label>
}
