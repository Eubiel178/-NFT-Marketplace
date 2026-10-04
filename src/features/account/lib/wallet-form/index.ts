import { walletInputSchema, walletTypes, type Wallet, type WalletInput } from '@/contracts'

import { formField, joinEns, splitEns } from '../ens'

export interface WalletForm {
  name: string
  alias: string
  network: string
  profileName: string
  address: string
  label: string
  tag: string
  referralCode: string
  email: string
  ensName: string
}

export type WalletField = keyof WalletForm
export type WalletErrors = Partial<Record<WalletField, string>>
export type WalletValidation = { ok: true; input: WalletInput } | { ok: false; errors: WalletErrors }

export const emptyWalletForm: WalletForm = {
  name: '',
  alias: '',
  network: '',
  profileName: '',
  address: '',
  label: '',
  tag: '',
  referralCode: '',
  email: '',
  ensName: '',
}

export const networkOptions = [
  { value: '', label: 'Selecione uma rede' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
]

export const walletTypeOptions = [{ value: '', label: 'Selecione uma carteira' }, ...walletTypes.map((type) => ({ value: type, label: type }))]

export function toWalletForm(wallet: Wallet): WalletForm {
  return {
    name: wallet.name,
    alias: wallet.alias,
    network: wallet.network,
    profileName: wallet.profileName,
    address: wallet.address,
    label: wallet.label,
    tag: wallet.tag,
    referralCode: wallet.referralCode,
    email: wallet.email,
    ensName: splitEns(wallet.ens),
  }
}

// Mesma regra do MSW (walletInputSchema).
export function validateWallet(form: WalletForm): WalletValidation {
  const { ensName, ...rest } = form
  const result = walletInputSchema.safeParse({ ...rest, ens: joinEns(ensName) })
  if (result.success) return { ok: true, input: result.data }
  const errors: WalletErrors = {}
  for (const issue of result.error.issues) errors[formField(String(issue.path[0])) as WalletField] ??= issue.message
  return { ok: false, errors }
}

export function splitWallets(wallets: readonly Wallet[]) {
  return { primary: wallets.find((wallet) => wallet.primary), secondary: wallets.filter((wallet) => !wallet.primary) }
}

// A principal é única: a escolhida vira principal e a anterior passa a secundária.
export function promotePrimary(wallets: readonly Wallet[], id: string): Wallet[] {
  return wallets.map((wallet) => ({ ...wallet, primary: wallet.id === id }))
}
