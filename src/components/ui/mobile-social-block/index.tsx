import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface MobileSocialBlockProps extends Omit<ComponentProps<'section'>, 'title'> {
  children: ReactNode
  separator?: string
}

export function MobileSocialBlock({ children, className, separator = 'Ou continue com', ...props }: MobileSocialBlockProps) {
  return (
    <section className={cn('mobile-social-block', className)} aria-label="Login social" {...props}>
      <div className="auth-social-divider">
        <span />
        <small>{separator}</small>
        <span />
      </div>
      <div className="auth-social-buttons">{children}</div>
    </section>
  )
}
