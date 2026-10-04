import { Button, Select, TextField } from '@/components'
import { cn } from '@/lib/utils'

import { useWalletForm } from '../../hooks/use-wallet-form'
import { ensSuffix } from '../../lib/ens'
import { networkOptions, walletTypeOptions, type WalletForm } from '../../lib/wallet-form'

// No frame, o rótulo fica a 2px do campo.
const fieldLabel = 'mb-0.5'
const selectLabel = 'mb-0.5 leading-16'
const ensOptions = [{ value: ensSuffix, label: ensSuffix }]

export interface WalletFieldsProps {
  // Nome acessível do formulário (os dois formulários ficam na mesma página).
  name: string
  initial: WalletForm
  id?: string
  primary?: boolean
  onSaved?: () => void
}

export function WalletFields({ name, initial, id, primary, onSaved }: WalletFieldsProps) {
  const { form, errors, formError, setField, submit, pending, saved } = useWalletForm({ initial, id, primary, onSaved })
  const errorId = `${name}-erro`

  return (
    <form noValidate onSubmit={submit} aria-label={name} aria-describedby={formError ? errorId : undefined}>
      <div className="grid gap-x-7 gap-y-7.75 sm:grid-cols-2">
        <TextField label="Nome de exibição" required labelClassName={fieldLabel} value={form.name} error={errors.name} onChange={(event) => setField('name', event.target.value)} />
        <TextField label="Apelido da carteira" required labelClassName={fieldLabel} value={form.alias} error={errors.alias} onChange={(event) => setField('alias', event.target.value)} />
        <Select variant="frame" label="Rede" required labelClassName={selectLabel} options={networkOptions} value={form.network} error={errors.network} onChange={(value) => setField('network', value)} />
        <TextField label="Nome do perfil" required labelClassName={fieldLabel} value={form.profileName} error={errors.profileName} onChange={(event) => setField('profileName', event.target.value)} />
        <TextField label="Endereço da carteira" required placeholder="Endereço 0x da carteira" labelClassName={fieldLabel} value={form.address} error={errors.address} onChange={(event) => setField('address', event.target.value)} />
        <TextField placeholder="ENS ou carteira secundária (opcional)" labelClassName={fieldLabel} value={form.label} error={errors.label} onChange={(event) => setField('label', event.target.value)} />
        <Select variant="frame" label="Tipo de carteira" required labelClassName={selectLabel} placeholder="Selecione uma carteira" options={walletTypeOptions} value={form.tag} error={errors.tag} onChange={(value) => setField('tag', value)} />
        <TextField label="Código de indicação" required labelClassName={fieldLabel} value={form.referralCode} error={errors.referralCode} onChange={(event) => setField('referralCode', event.target.value)} />
        <TextField label="E-mail" required type="email" autoComplete="email" labelClassName={fieldLabel} value={form.email} error={errors.email} onChange={(event) => setField('email', event.target.value)} />
        <TextField
          label="Nome ENS"
          required
          labelClassName={fieldLabel}
          value={form.ensName}
          error={errors.ensName}
          onChange={(event) => setField('ensName', event.target.value)}
          prefix={<Select aria-label="Domínio ENS" variant="frame" className="w-19.5 shrink-0 [&_button]:px-2" options={ensOptions} value={ensSuffix} onChange={() => undefined} />}
        />
      </div>
      <Button type="submit" variant="primarySolid" size="sm" className="mt-8 w-32.75 rounded-none px-0 font-bold tracking-normal whitespace-nowrap" loading={pending}>Salvar carteira</Button>
      {formError && <p id={errorId} role="alert" className="mt-4 text-caption-13 text-error">{formError}</p>}
      <p role="status" className={cn('text-body-14 text-primary', saved && 'mt-4')}>{saved ? 'Carteira salva.' : ''}</p>
    </form>
  )
}
