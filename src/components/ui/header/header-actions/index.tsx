import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function HeaderActions({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props}>
      {children}
    </div>
  )
}
