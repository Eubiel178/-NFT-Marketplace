import type { ReactNode } from 'react'

import { X } from 'lucide-react'
import { Dialog as SheetPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'
import { useRestoreFocus } from '@/shared/hooks/use-restore-focus'

export interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

const titleId = 'sheet-title'
const descriptionId = 'sheet-description'

// Painel inferior (drawer) sobre o Radix Dialog: foco preso, Escape e clique
// fora fecham, e o foco volta para o botão que abriu o painel.
export function Sheet({ isOpen, onClose, title, description, children, className }: SheetProps) {
  const restoreFocus = useRestoreFocus()

  return (
    <SheetPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm" />
        <SheetPrimitive.Content
          {...restoreFocus}
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 max-h-[80vh] w-full overflow-y-auto rounded-t-40 bg-surface-card shadow-buy-bar outline-none',
            className,
          )}
        >
          <header className="flex items-center justify-between border-b border-border p-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border-soft" aria-hidden="true" />
              <div className="flex-1">
                <SheetPrimitive.Title id={titleId} className="text-title-20-bold">{title}</SheetPrimitive.Title>
                {description && (
                  <SheetPrimitive.Description id={descriptionId} className="mt-1 text-body-14-regular text-text-secondary">
                    {description}
                  </SheetPrimitive.Description>
                )}
              </div>
            </div>
            <SheetPrimitive.Close
              className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden="true" />
            </SheetPrimitive.Close>
          </header>
          <section className="p-6 pb-safe-bottom">{children}</section>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  )
}
