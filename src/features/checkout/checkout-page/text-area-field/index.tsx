import { useId, type ComponentProps } from 'react'

import { Label } from '@/components'

export interface TextAreaFieldProps extends Omit<ComponentProps<'textarea'>, 'id'> {
  label: string
  error?: string
}

export function TextAreaField({ label, error, ...props }: TextAreaFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-3 text-body-15 leading-16 font-normal tracking-normal text-foreground">{label}</Label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-38 w-87.5 resize-none border border-border bg-transparent p-3 text-body-14 text-foreground aria-invalid:border-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-sm:w-full"
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-caption-12 text-error">{error}</p>}
    </div>
  )
}
