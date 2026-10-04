import { Button, PasswordInput, Select, TextField } from '@/components'
import type { Profile } from '@/contracts'
import { cn } from '@/lib/utils'

import { useProfileForm } from '../../hooks/use-profile-form'
import { ensSuffix } from '../../lib/ens'
import { AvatarField } from '../avatar-field'

// No frame, o rótulo fica 17px acima dos campos do perfil e 12px acima dos campos de senha.
const fieldLabel = 'mb-4.25'
const passwordLabel = 'mb-3 text-body-15 leading-16 font-normal tracking-normal text-foreground'
const passwordInput = 'rounded-none bg-transparent'
const ensOptions = [{ value: ensSuffix, label: ensSuffix }]

export function ProfileForm({ profile }: { profile: Profile }) {
  const { form, errors, formError, setField, submit, pending, saved } = useProfileForm(profile)

  return (
    <form noValidate onSubmit={submit} aria-labelledby="profile-title" aria-describedby={formError ? 'profile-error' : undefined}>
      <h2 id="profile-title" className="text-body-large-16-bold">Perfil do colecionador</h2>
      <div className="mt-9.5 grid gap-x-7 gap-y-7.5 sm:grid-cols-2">
        <TextField label="Nome de exibição" required labelClassName={fieldLabel} autoComplete="name" value={form.displayName} error={errors.displayName} onChange={(event) => setField('displayName', event.target.value)} />
        <TextField label="Nome de usuário" required labelClassName={fieldLabel} autoComplete="username" value={form.username} error={errors.username} onChange={(event) => setField('username', event.target.value)} />
        <TextField label="E-mail" required type="email" labelClassName={fieldLabel} autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setField('email', event.target.value)} />
        <TextField
          label="Nome ENS"
          required
          labelClassName={fieldLabel}
          value={form.ensName}
          error={errors.ensName}
          onChange={(event) => setField('ensName', event.target.value)}
          prefix={<Select aria-label="Domínio ENS" variant="frame" className="w-19.5 shrink-0 [&_button]:px-2" options={ensOptions} value={ensSuffix} onChange={() => undefined} />}
        />
        <TextField label="Apelido da carteira" required labelClassName={fieldLabel} value={form.walletAlias} error={errors.walletAlias} onChange={(event) => setField('walletAlias', event.target.value)} />
        <AvatarField avatar={profile.avatar} className="sm:-mt-1.75" />
      </div>
      <h3 className="mt-8 text-body-large-16-bold">Alterar senha</h3>
      <div className="mt-5.75 grid gap-x-7 sm:grid-cols-2">
        <div className="flex flex-col gap-y-5.75">
          <PasswordInput size="sm" label="Senha atual" autoComplete="current-password" labelClassName={passwordLabel} inputClassName={passwordInput} value={form.currentPassword} error={errors.currentPassword} onChange={(event) => setField('currentPassword', event.target.value)} />
          <PasswordInput size="sm" label="Nova senha" autoComplete="new-password" labelClassName={passwordLabel} inputClassName={passwordInput} value={form.newPassword} error={errors.newPassword} onChange={(event) => setField('newPassword', event.target.value)} />
          <PasswordInput size="sm" label="Confirmar nova senha" autoComplete="new-password" labelClassName={passwordLabel} inputClassName={passwordInput} value={form.confirmPassword} error={errors.confirmPassword} onChange={(event) => setField('confirmPassword', event.target.value)} />
        </div>
      </div>
      <Button type="submit" variant="primarySolid" size="sm" className="mt-8 w-32.75 rounded-none px-0 font-bold tracking-normal" loading={pending}>Salvar</Button>
      {formError && <p id="profile-error" role="alert" className="mt-4 text-caption-13 text-error">{formError}</p>}
      <p role="status" className={cn('text-body-14 text-primary', saved && 'mt-4')}>{saved ? 'Alterações salvas.' : ''}</p>
    </form>
  )
}
