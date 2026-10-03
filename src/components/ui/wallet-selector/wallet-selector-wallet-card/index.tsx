import type { ChangeEventHandler, ComponentProps, ReactNode } from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface WalletSelectorWalletCardProps extends Omit<ComponentProps<'label'>, 'children' | 'onChange'> {
  children: ReactNode
  name: string
  value: string
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  icon?: ReactNode
}

export function WalletSelectorWalletCard({ checked = false, children, className, icon, name, onChange, value, ...props }: WalletSelectorWalletCardProps) {
  return (
    <label className={cn('wallet-selector-wallet-card', checked && 'is-selected', className)} {...props}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span className="wallet-selector-wallet-indicator" aria-hidden="true">
        {icon ?? (checked ? <Check /> : null)}
      </span>
      <span className="wallet-selector-wallet-content">{children}</span>
    </label>
  )
}
