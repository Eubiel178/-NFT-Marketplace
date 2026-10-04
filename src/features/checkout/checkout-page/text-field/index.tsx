import { useId, type ComponentProps } from 'react'

import { Label } from '@/components'
import { cn } from '@/lib/utils'

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label?: string
  error?: string
}

// Campo do formulário do frame: borda fina, fundo transparente e 40px de altura.
// Sem rótulo visível, o placeholder vira o nome acessível e o espaço do rótulo é mantido.
export function TextField({ label, error, required, className, placeholder, ...props }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={cn('flex flex-col', className)}>
      {label ? (
        <Label htmlFor={id} required={required} className="mb-1.75 text-body-15 leading-16 font-normal tracking-normal text-foreground">{label}</Label>
      ) : (
        <span aria-hidden="true" className="mb-1.75 h-4" />
      )}
      <input
        id={id}
        required={required}
        placeholder={placeholder}
        aria-label={label ? undefined : placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-10 w-full border border-border bg-transparent px-5.5 text-body-14 text-foreground placeholder:text-text-secondary aria-invalid:border-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-caption-12 text-error">{error}</p>}
    </div>
  )
}
