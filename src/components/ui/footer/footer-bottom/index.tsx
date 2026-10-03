import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function FooterBottom({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('border-t border-border py-6 text-body-14-regular text-text-secondary', className)} {...props}>
      {children}
    </div>
  )
}
