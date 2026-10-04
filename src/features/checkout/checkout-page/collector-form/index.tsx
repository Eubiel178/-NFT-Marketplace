import { Select } from '@/components'
import type { Wallet } from '@/contracts'
import { cn } from '@/lib/utils'

import { ensSuffixes, type CheckoutErrors, type CheckoutField, type CheckoutForm } from '../../lib/checkout-form'
import { TextAreaField } from '../text-area-field'
import { TextField } from '../text-field'

export interface CollectorFormProps {
  form: CheckoutForm
  errors: CheckoutErrors
  wallets: readonly Wallet[]
  onField: <Field extends CheckoutField>(field: Field, value: CheckoutForm[Field]) => void
  onWallet: (wallet: Wallet) => void
}

// Rótulo e gatilho do Select no estilo dos campos do frame (sem fundo, 40px).
const selectFrame = '[&_button]:h-10 [&_button]:rounded-none [&_button]:bg-transparent [&_button]:px-3 [&_button]:text-text-secondary [&_label]:mb-1.75 [&_label]:text-body-15 [&_label]:font-normal [&_label]:tracking-normal [&_label]:text-foreground'

const networks = [
  { value: '', label: 'Selecione uma rede' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
]

export function CollectorForm({ form, errors, wallets, onField, onWallet }: CollectorFormProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-body-large-18-bold leading-24">Perfil do colecionador</legend>
      <div className="mt-3.5 grid grid-cols-2 gap-x-6 gap-y-4.5">
        <TextField label="Nome de exibição" required value={form.displayName} error={errors.displayName} onChange={(event) => onField('displayName', event.target.value)} />
        <TextField label="Nome de usuário" required value={form.username} error={errors.username} onChange={(event) => onField('username', event.target.value)} />
        <div className={selectFrame}>
          <Select label="Rede" required options={networks} value={form.network} error={errors.network} onChange={(value) => onField('network', value === 'polygon' || value === 'ethereum' ? value : '')} />
        </div>
        <TextField label="Nome do perfil" required value={form.profileName} error={errors.profileName} onChange={(event) => onField('profileName', event.target.value)} />
        <TextField label="Endereço da carteira" required placeholder="Endereço 0x da carteira" value={form.walletAddress} error={errors.walletAddress} readOnly={!form.useOtherWallet} onChange={(event) => onField('walletAddress', event.target.value)} />
        <TextField placeholder="ENS ou carteira secundária (opcional)" value={form.ens} error={errors.ens} onChange={(event) => onField('ens', event.target.value)} />
        <div className={selectFrame}>
          <Select
            label="Tipo de carteira"
            required
            placeholder="Selecione uma carteira"
            options={wallets.map((wallet) => ({ value: wallet.id, label: wallet.name }))}
            value={form.walletId}
            error={errors.walletId}
            onChange={(id) => {
              const wallet = wallets.find((candidate) => candidate.id === id)
              if (wallet) onWallet(wallet)
            }}
          />
        </div>
        <TextField label="Código de indicação" required value={form.referralCode} error={errors.referralCode} onChange={(event) => onField('referralCode', event.target.value)} />
        <TextField label="E-mail" required type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => onField('email', event.target.value)} />
        <div className={cn(selectFrame, '[&_button]:w-19.5 [&_button]:px-2')}>
          <Select label="Nome ENS" required options={ensSuffixes.map((suffix) => ({ value: suffix, label: suffix }))} value={form.ensSuffix} onChange={(value) => onField('ensSuffix', value)} />
        </div>
      </div>
      <label className="mt-6 flex w-fit cursor-pointer items-center gap-2 text-body-15 leading-16">
        <input
          type="checkbox"
          checked={form.useOtherWallet}
          onChange={(event) => onField('useOtherWallet', event.target.checked)}
          className="size-4 cursor-pointer appearance-none rounded-full border-2 border-primary checked:bg-primary checked:shadow-[inset_0_0_0_0.125rem_var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        Usar outra carteira?
      </label>
      <div className="mt-6.25">
        <TextAreaField label="Observação do colecionador (opcional)" value={form.note} error={errors.note} onChange={(event) => onField('note', event.target.value)} />
      </div>
    </fieldset>
  )
}
