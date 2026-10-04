import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function HeaderRoot({ className, children, ...props }: ComponentProps<'header'>) {
  return (
    <header className={cn('border-b border-border bg-ink', className)} {...props}>
      <div className="container-content flex min-h-20 items-center justify-between gap-6">
        {children}
      </div>
    </header>
  )
}
