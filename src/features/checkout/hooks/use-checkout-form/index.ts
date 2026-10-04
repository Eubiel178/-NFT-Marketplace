import { useState } from 'react'

import type { Wallet } from '@/contracts'

import { validateCheckout, type CheckoutErrors, type CheckoutField, type CheckoutForm } from '../../lib/checkout-form'

// Valores e erros do formulário. Depois da primeira tentativa de envio, cada
// alteração revalida o campo, para o erro sumir assim que for corrigido.
export function useCheckoutForm(initial: CheckoutForm, layoutFields: boolean) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [attempted, setAttempted] = useState(false)

  const update = (next: CheckoutForm) => {
    setForm(next)
    if (attempted) setErrors(validateCheckout(next, layoutFields))
  }

  return {
    form,
    errors,
    setField: <Field extends CheckoutField>(field: Field, value: CheckoutForm[Field]) => update({ ...form, [field]: value }),
    // Trocar de carteira traz a rede e o endereço dela, a menos que o colecionador use outra.
    selectWallet: (wallet: Wallet) => update({ ...form, walletId: wallet.id, network: wallet.network, walletAddress: form.useOtherWallet ? form.walletAddress : wallet.address }),
    validate: () => {
      const next = validateCheckout(form, layoutFields)
      setAttempted(true)
      setErrors(next)
      return Object.keys(next).length === 0
    },
    showApiErrors: (fields: Record<string, string>) => {
      setAttempted(true)
      setErrors((current) => ({ ...current, ...fields }))
    },
  }
}
