import type { ChangeEventHandler, ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface WalletSelectorMethodProps extends Omit<ComponentProps<'label'>, 'children' | 'onChange'> {
  label: string
  name: string
  value: string
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  icon?: ReactNode
}

export function WalletSelectorMethod({ checked = false, className, icon, label, name, onChange, value, ...props }: WalletSelectorMethodProps) {
  return (
    <label className={cn('wallet-selector-method', checked && 'is-selected', className)} {...props}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span className="wallet-selector-method-icon" aria-hidden="true">{icon ?? label.slice(0, 1)}</span>
      <span>{label}</span>
    </label>
  )
}
