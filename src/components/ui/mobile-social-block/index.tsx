import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface MobileSocialBlockProps extends Omit<ComponentProps<'section'>, 'title'> {
  children: ReactNode
  separator?: string
}

export function MobileSocialBlock({ children, className, separator = 'Ou continue com', ...props }: MobileSocialBlockProps) {
  return (
    <section className={cn('grid', className)} aria-label="Login social" {...props}>
      <div className="mt-6 flex items-center gap-3 text-text-secondary max-sm:mt-9">
        <span className="h-px flex-1 bg-border" />
        <small className="whitespace-nowrap">{separator}</small>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-3 flex flex-col gap-3 *:w-full max-sm:gap-4">{children}</div>
    </section>
  )
}
