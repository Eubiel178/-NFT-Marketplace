import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// "skeleton" não tem estilo: é o gancho que o teste de movimento reduzido usa.
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton animate-shimmer rounded-6 bg-surface-card bg-(image:--gradient-shimmer) bg-[length:200%_100%] motion-reduce:animate-none', className)}
      {...props}
    />
  )
}
