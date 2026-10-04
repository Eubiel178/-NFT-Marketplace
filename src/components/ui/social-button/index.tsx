import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface SocialButtonProps extends React.ComponentProps<'button'> {
  provider: 'google' | 'facebook'
  icon?: ReactNode
  children: ReactNode
}

export function SocialButton({ provider, icon, className, children, ...props }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={cn('inline-flex min-h-10 items-center justify-center gap-3 rounded-6 border border-border bg-surface-card px-5 text-body-14 font-medium leading-16 tracking-wide text-foreground transition-colors hover:bg-surface-raised', className)}
      data-provider={provider}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
