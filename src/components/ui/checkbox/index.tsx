import { forwardRef, useId } from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string
  description?: string
  error?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, id, disabled, required, className, ...rest }, ref) => {
    const generatedId = useId()
    const checkboxId = id || `checkbox-${generatedId}`
    const descId = description ? `${checkboxId}-desc` : undefined

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 w-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            required={required}
            aria-describedby={descId}
            aria-invalid={error}
            className={cn(
              'peer absolute inset-0 z-10 h-5 w-5 cursor-pointer opacity-0',
              'focus-visible:outline-none',
              'disabled:pointer-events-none',
              className,
            )}
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 rounded-4 border-2 border-border bg-surface-card transition-colors',
              'peer-checked:border-primary peer-checked:bg-primary',
              'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
              'peer-disabled:bg-surface-card peer-disabled:opacity-50',
              error && 'border-error',
            )}
          />
          <Check className="pointer-events-none absolute inset-0 z-0 hidden h-5 w-5 p-0.5 text-ink peer-checked:block" aria-hidden="true" />
        </div>
        {(label || description) && (
          <div className="flex flex-col gap-1">
            {label && <label htmlFor={checkboxId} className="cursor-pointer text-body-14-medium text-foreground">{label}</label>}
            {description && <p id={descId} className="text-caption-12-regular text-text-secondary">{description}</p>}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
