import type { ReactNode } from 'react'

import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

interface ModalTitleProps {
  children: ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return <DialogPrimitive.Title className={cn('text-title-20 font-bold leading-16', className)}>{children}</DialogPrimitive.Title>
}
