import { collectorSchema, type Collector, type Network, type PaymentMethod, type Profile, type Wallet } from '@/contracts'

export interface CheckoutForm {
  displayName: string
  username: string
  profileName: string
  network: Network | ''
  walletAddress: string
  ens: string
  walletId: string
  referralCode: string
  email: string
  ensSuffix: string
  useOtherWallet: boolean
  note: string
}

export type CheckoutField = keyof CheckoutForm
export type CheckoutErrors = Partial<Record<CheckoutField, string>>

export const paymentMethods: ReadonlyArray<{ value: PaymentMethod; label: string; mark: string }> = [
  { value: 'walletconnect', label: 'WalletConnect', mark: 'W' },
  { value: 'metamask', label: 'MetaMask', mark: 'M' },
  { value: 'coinbase', label: 'Coinbase Wallet', mark: '' },
]

export const ensSuffixes = ['.eth'] as const

// Carteira inicial: a principal, ou a primeira cadastrada.
export function defaultWallet(wallets: readonly Wallet[]) {
  return wallets.find((wallet) => wallet.primary) ?? wallets[0]
}

export function initialForm(input: { profile?: Profile; email?: string; name?: string; wallet?: Wallet }): CheckoutForm {
  return {
    displayName: input.profile?.displayName ?? input.name ?? '',
    username: input.profile?.username ?? '',
    profileName: input.profile?.displayName ?? input.name ?? '',
    network: input.wallet?.network ?? '',
    walletAddress: input.wallet?.address ?? '',
    ens: input.profile?.ens ?? '',
    walletId: input.wallet?.id ?? '',
    referralCode: '',
    email: input.email ?? '',
    ensSuffix: '.eth',
    useOtherWallet: false,
    note: '',
  }
}

export function toCollector(form: CheckoutForm): Collector {
  return {
    displayName: form.displayName,
    username: form.username,
    profileName: form.profileName,
    email: form.email,
    walletAddress: form.walletAddress,
    ens: form.ens,
    referralCode: form.referralCode,
    note: form.note,
  }
}

// Mesma regra do MSW (collectorSchema) mais os campos obrigatórios do layout
// desktop (asterisco no frame): rede, tipo de carteira e código de indicação.
export function validateCheckout(form: CheckoutForm, layoutFields: boolean): CheckoutErrors {
  const errors: CheckoutErrors = {}
  const result = collectorSchema.safeParse(toCollector(form))
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]) as CheckoutField
      errors[field] ??= issue.message
    }
  }
  if (!form.walletId) errors.walletId = 'Selecione uma carteira'
  if (layoutFields) {
    if (!form.network) errors.network = 'Selecione uma rede'
    if (!form.referralCode.trim()) errors.referralCode ??= 'Informe o código de indicação'
  }
  return errors
}
