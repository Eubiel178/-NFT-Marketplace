import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'default' | 'rare' | 'featured' | 'limited'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-caption-12-regular px-2 py-0.5 rounded-[4px]',
    md: 'text-caption-13-medium px-2.5 py-1 rounded-[6px]',
    lg: 'text-body-14-medium px-3 py-1.5 rounded-[8px]',
  }

  const variantStyles = {
    default: 'bg-muted text-text border border-border',
    rare: 'bg-primary/20 text-primary border border-primary/30',
    featured: 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30',
    limited: 'bg-text-coral/20 text-text-coral border border-text-coral/30',
  }

  const rareStyles = variant === 'rare' && size === 'sm' ? 'h-8 min-w-[68px] justify-center rounded-32 bg-primary text-primary-foreground border-0 text-caption-13-medium' : undefined
  const borderClass = rareStyles ? 'border-0' : 'border'

  return (
    <span className={cn('inline-flex items-center font-medium', sizeStyles[size], variantStyles[variant], rareStyles, borderClass, className)} {...props}>
      {children}
    </span>
  )
}
