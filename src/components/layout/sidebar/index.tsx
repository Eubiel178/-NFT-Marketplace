import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function Sidebar({ className, ...props }: ComponentProps<'aside'>) {
  return <aside className={cn('layout-sidebar', className)} {...props} />
}
