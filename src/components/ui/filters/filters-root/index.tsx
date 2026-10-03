import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function FiltersRoot({ className, children, ...props }: ComponentProps<'aside'>) {
  return (
    <aside className={cn('w-full rounded-md bg-surface-card p-5 lg:w-[19.375rem]', className)} {...props}>
      {children}
    </aside>
  )
}
