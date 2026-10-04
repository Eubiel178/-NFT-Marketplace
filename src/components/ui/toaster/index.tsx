import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

// Sonner sem estilo próprio: o visual vem dos tokens do tema. O tema é sempre
// escuro (identidade do Figma), por isso não há troca de tema aqui.
export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      icons={{
        success: <CircleCheck className="size-4 text-primary" aria-hidden="true" />,
        info: <Info className="size-4 text-text-secondary" aria-hidden="true" />,
        warning: <TriangleAlert className="size-4 text-text-accent" aria-hidden="true" />,
        error: <OctagonX className="size-4 text-error" aria-hidden="true" />,
        loading: <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'flex w-full items-start gap-3 rounded-6 border border-border bg-surface-card p-4 text-foreground shadow-cart-focus',
          title: 'text-body-14-bold',
          description: 'text-body-14-regular text-text-secondary',
          actionButton: 'rounded-6 bg-primary px-3 py-1 text-body-14-bold text-ink',
          cancelButton: 'rounded-6 border border-border px-3 py-1 text-body-14-bold text-foreground',
          closeButton: 'text-text-secondary hover:text-foreground',
        },
      }}
    />
  )
}
