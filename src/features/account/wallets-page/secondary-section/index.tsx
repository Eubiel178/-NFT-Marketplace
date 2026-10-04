import { Button } from '@/components'
import type { Wallet } from '@/contracts'

import { useSecondaryEditor } from '../../hooks/use-secondary-editor'
import { useSetPrimaryWallet } from '../../hooks/use-set-primary-wallet'
import { WalletFields } from '../wallet-fields'

export interface SecondarySectionProps {
  primary: Wallet | undefined
  secondary: Wallet[]
}

export function SecondarySection({ primary, secondary }: SecondarySectionProps) {
  const editor = useSecondaryEditor(primary)
  const setPrimary = useSetPrimaryWallet()

  return (
    <section aria-labelledby="secondary-wallet-title" className="mt-8">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 id="secondary-wallet-title" className="text-body-large-16-bold">Carteira secundária</h3>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-body-14 leading-16">
            <input
              type="checkbox"
              checked={editor.sameAsPrimary}
              disabled={!primary}
              onChange={(event) => editor.copyPrimary(event.target.checked)}
              className="size-4 cursor-pointer appearance-none rounded-full border-2 border-primary checked:bg-primary checked:shadow-[inset_0_0_0_0.125rem_var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
            Igual à carteira principal
          </label>
          <Button type="button" variant="link" size="sm" className="h-auto min-h-0 p-0 text-body-large-16-bold tracking-normal" onClick={editor.add}>Adicionar</Button>
        </div>
      </div>
      {secondary.length === 0 && !editor.open && <p className="mt-2.75 text-caption-13 leading-4 text-text-secondary">Você ainda não adicionou uma carteira secundária.</p>}
      {secondary.length > 0 && (
        <ul aria-label="Carteiras secundárias" className="mt-4 flex flex-col gap-3">
          {secondary.map((wallet) => (
            <li key={wallet.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border border-border px-5.5 py-3">
              <div className="flex min-w-0 flex-col">
                <strong className="text-body-15-bold">{wallet.name}</strong>
                <span className="truncate text-caption-13 leading-5 text-text-secondary">{wallet.ens || wallet.address}</span>
              </div>
              <div className="flex items-center gap-5">
                <Button type="button" variant="link" size="sm" className="h-auto min-h-0 p-0" aria-label={`Editar ${wallet.name}`} onClick={() => editor.edit(wallet)}>Editar</Button>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto min-h-0 p-0"
                  aria-label={`Tornar ${wallet.name} a carteira principal`}
                  loading={setPrimary.pendingId === wallet.id}
                  disabled={setPrimary.pendingId !== undefined}
                  onClick={() => setPrimary.promote(wallet.id)}
                >
                  Tornar principal
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {setPrimary.error && <p role="alert" className="mt-3 text-caption-13 text-error">{setPrimary.error}</p>}
      {editor.open && (
        <div className="mt-9.5">
          <WalletFields key={editor.formKey} name="Carteira secundária" initial={editor.initial} id={editor.editingId} onSaved={editor.close} />
        </div>
      )}
    </section>
  )
}
