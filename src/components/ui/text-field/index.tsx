import { useId, type ComponentProps, type ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id' | 'prefix'> {
  label?: string
  error?: string
  // Classes extras do rótulo (e do espaço que o substitui): cada frame usa uma distância até o campo.
  labelClassName?: string
  inputClassName?: string
  // Elemento ao lado do campo (ex.: seletor ".eth"); o erro continua abaixo da linha toda.
  prefix?: ReactNode
}

// Campo do formulário do frame: borda fina, fundo transparente e 40px de altura.
// Sem rótulo visível, o placeholder vira o nome acessível e o espaço do rótulo é mantido.
export function TextField({ label, error, required, className, placeholder, labelClassName, inputClassName, prefix, ...props }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const input = (
    <input
      id={id}
      required={required}
      placeholder={placeholder}
      aria-label={label ? undefined : placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : undefined}
      className={cn('h-10 w-full min-w-0 border border-border bg-transparent px-5.5 text-body-14 text-foreground placeholder:text-text-secondary aria-invalid:border-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary', inputClassName)}
      {...props}
    />
  )
  return (
    <div className={cn('flex flex-col', className)}>
      {label ? (
        <Label htmlFor={id} required={required} className={cn('mb-1.75 text-body-15 leading-16 font-normal tracking-normal text-foreground', labelClassName)}>{label}</Label>
      ) : (
        <span aria-hidden="true" className={cn('mb-1.75 hidden h-4 sm:block', labelClassName)} />
      )}
      {prefix ? <div className="flex gap-2.5">{prefix}{input}</div> : input}
      {error && <p id={errorId} className="mt-1 text-caption-12 text-error">{error}</p>}
    </div>
  )
}
