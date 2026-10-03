import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function WalletSelectorMethods({ className, children, ...props }: ComponentProps<'fieldset'>) {
  return (
    <fieldset className={cn('wallet-selector-methods', className)} {...props}>
      {children}
    </fieldset>
  )
}
