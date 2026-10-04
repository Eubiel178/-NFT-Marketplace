import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'default' | 'rare' | 'featured' | 'limited'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-caption-12 font-normal leading-16 px-2 py-0.5 rounded-4',
    md: 'text-caption-13 font-medium leading-16 px-2.5 py-1 rounded-6',
    lg: 'text-body-14 font-medium leading-16 tracking-wide px-3 py-1.5 rounded-8',
  }

  const variantStyles = {
    default: 'bg-surface-card text-foreground border border-border',
    rare: 'bg-primary/20 text-primary border border-primary/30',
    featured: 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30',
    limited: 'bg-error/20 text-error border border-error/30',
  }

  const rareStyles = variant === 'rare' && size === 'sm' ? 'h-8 min-w-17 justify-center rounded-32 bg-primary text-ink border-0 text-caption-13 font-medium leading-16' : undefined
  const borderClass = rareStyles ? 'border-0' : 'border'

  return (
    <span className={cn('inline-flex items-center font-medium', sizeStyles[size], variantStyles[variant], rareStyles, borderClass, className)} {...props}>
      {children}
    </span>
  )
}
