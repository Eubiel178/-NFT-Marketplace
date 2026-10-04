import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'

export function ModalClose() {
  return (
    <DialogPrimitive.Close
      className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      aria-label="Fechar"
    >
      <X className="size-5" aria-hidden="true" />
    </DialogPrimitive.Close>
  )
}
