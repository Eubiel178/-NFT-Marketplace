import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function FooterRoot({ className, children, ...props }: ComponentProps<'footer'>) {
  return (
    <footer className={cn('border-t border-border bg-ink', className)} {...props}>
      {children}
    </footer>
  )
}
