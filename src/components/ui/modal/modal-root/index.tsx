import type { ReactNode } from 'react'

import { cva } from 'class-variance-authority'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'
import { useRestoreFocus } from '@/shared/hooks/use-restore-focus'

const modalContent = cva(
  'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-8 bg-surface-card outline-none',
  {
    variants: {
      size: { sm: 'max-w-125', md: 'max-w-144.5' },
    },
    defaultVariants: { size: 'sm' },
  },
)

interface ModalRootProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

// Radix Dialog: foco preso no conteúdo, Escape e clique fora fecham, e o foco
// volta para o elemento que abriu o modal.
export function ModalRoot({ isOpen, onClose, children, size, className }: ModalRootProps) {
  const restoreFocus = useRestoreFocus()

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm" />
        <DialogPrimitive.Content {...restoreFocus} aria-describedby={undefined} className={cn(modalContent({ size }), className)}>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
