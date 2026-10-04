import { Icon, RadioGroup, WalletSelector } from '@/components'
import type { PaymentMethod } from '@/contracts'
import { cn } from '@/lib/utils'

import { paymentMethods } from '../../lib/checkout-form'

export interface MethodsProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  disabled: boolean
}

const isMethod = (value: string): value is PaymentMethod => paymentMethods.some((method) => method.value === value)

// Desktop: linhas com borda e rádio à esquerda (RadioGroup). A primeira opção mostra
// o selo "MetaMask · WalletConnect · Coinbase", como no frame.
export function DesktopMethods({ value, onChange, disabled }: MethodsProps) {
  return (
    <RadioGroup
      name="payment-method"
      value={value}
      disabled={disabled}
      onChange={(next) => { if (isMethod(next)) onChange(next) }}
      className="space-y-4"
      optionClassName="h-11.25 items-center gap-3 border border-border px-3.5 has-checked:border-foreground [&_label]:text-body-15 [&_label]:font-normal [&_label]:tracking-normal"
      options={paymentMethods.map((method) => ({
        value: method.value,
        label: method.value === 'walletconnect' ? '' : method.label,
        icon: method.value === 'walletconnect'
          ? <span className="flex h-6 items-center gap-2 rounded-6 border border-primary/40 bg-surface-dark px-2 text-tiny-9-bold text-text-accent">METAMASK <span>•</span> WALLETCONNECT <span>•</span> COINBASE<span className="sr-only">WalletConnect</span></span>
          : undefined,
      }))}
    />
  )
}

// Mobile: cartões com o selo do método à esquerda e o rádio à direita (WalletSelector).
export function MobileMethods({ value, onChange, disabled }: MethodsProps) {
  return (
    <WalletSelector.Methods aria-label="Carteira e rede" disabled={disabled} className="grid-cols-1 gap-4">
      {paymentMethods.map((method) => (
        <WalletSelector.Method
          key={method.value}
          name="payment-method-mobile"
          value={method.value}
          label={method.label}
          checked={value === method.value}
          onChange={() => onChange(method.value)}
          icon={method.mark || <Icon src="/assets/figma/mcp/svg/iconly-curved-wallet.svg" className="size-4" />}
          className={cn('min-h-16.25 rounded-15 py-0 pr-11 pl-3.5 [&>span:nth-of-type(1)]:size-10 after:absolute after:right-4 after:size-4 after:rounded-full after:border after:border-border-soft', value === method.value && 'shadow-none after:border-primary after:bg-primary after:shadow-[inset_0_0_0_0.1875rem_var(--color-surface-card)]')}
        />
      ))}
    </WalletSelector.Methods>
  )
}
