import { useState } from 'react'

import { Button } from '@/components'
import type { Wallet } from '@/contracts'

import { emptyWalletForm, toWalletForm } from '../../lib/wallet-form'
import { WalletFields } from '../wallet-fields'

// Edita a carteira principal. "Adicionar" cadastra outra que assume o lugar dela (a anterior vira secundária).
export function PrimarySection({ primary }: { primary: Wallet | undefined }) {
  const [adding, setAdding] = useState(false)
  // Sem principal cadastrada, o formulário já é de cadastro.
  const current = adding ? undefined : primary

  return (
    <section aria-labelledby="primary-wallet-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 id="primary-wallet-title" className="text-body-large-16-bold">Carteira principal</h3>
          <p className="mt-2 text-caption-13 leading-4 text-text-secondary">Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.</p>
        </div>
        {primary && (
          <Button type="button" variant="link" size="sm" className="h-auto min-h-0 p-0 text-body-large-16-bold tracking-normal" onClick={() => setAdding((value) => !value)}>
            {adding ? 'Cancelar' : 'Adicionar'}
          </Button>
        )}
      </div>
      <div className="mt-9.5">
        <WalletFields
          key={current?.id ?? 'new'}
          name="Carteira principal"
          initial={current ? toWalletForm(current) : emptyWalletForm}
          id={current?.id}
          primary={adding || undefined}
          onSaved={() => setAdding(false)}
        />
      </div>
    </section>
  )
}
