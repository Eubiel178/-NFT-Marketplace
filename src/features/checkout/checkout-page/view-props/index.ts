import type { CartLine, PaymentMethod, Quote, Wallet } from '@/contracts'

import type { CheckoutErrors, CheckoutField, CheckoutForm } from '../../lib/checkout-form'
import type { ConnectionStatusProps } from '../connection-status'

// O que as duas versões do pagamento (desktop e mobile) recebem da página.
export interface CheckoutViewProps {
  lines: readonly CartLine[]
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  onRetryQuote: () => void
  form: CheckoutForm
  errors: CheckoutErrors
  wallets: readonly Wallet[]
  onField: <Field extends CheckoutField>(field: Field, value: CheckoutForm[Field]) => void
  onWallet: (wallet: Wallet) => void
  method: PaymentMethod
  onMethod: (method: PaymentMethod) => void
  connection: ConnectionStatusProps
  liveNotice: string
  canConfirm: boolean
  onConfirm: () => void
}
