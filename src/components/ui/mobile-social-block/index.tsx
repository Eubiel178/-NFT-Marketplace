import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface MobileSocialBlockProps extends Omit<ComponentProps<'section'>, 'title'> {
  children: ReactNode
  separator?: string
  // Espaçamentos e largura da linha variam por tela: ficam com quem usa.
  separatorClassName?: string
  listClassName?: string
}

export function MobileSocialBlock({ children, className, separator = 'Ou continue com', separatorClassName, listClassName, ...props }: MobileSocialBlockProps) {
  return (
    <section className={cn('grid', className)} aria-label="Login social" {...props}>
      <div className={cn('flex items-center gap-3', separatorClassName)}>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <small className="whitespace-nowrap text-caption-13 leading-16 text-foreground">{separator}</small>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <div className={cn('flex flex-col *:w-full', listClassName)}>{children}</div>
    </section>
  )
}
