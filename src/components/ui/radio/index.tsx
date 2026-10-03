import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface RadioProps {
  label?: string
  description?: string
  icon?: React.ReactNode
  error?: boolean
  name: string
  value: string
  onValueChange: (value: string) => void
  checked?: boolean
  disabled?: boolean
  required?: boolean
  id?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, icon, error, name, value, onValueChange, checked, disabled, required, id }, ref) => {
    const radioId = id || `radio-${name}-${value}`
    const descriptionId = description ? `${radioId}-description` : undefined

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 w-5 items-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            required={required}
            aria-describedby={descriptionId}
            aria-invalid={error}
            onChange={() => onValueChange(value)}
            className="peer absolute inset-0 z-10 h-5 w-5 cursor-pointer opacity-0 focus-visible:outline-none disabled:pointer-events-none"
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full border-2 border-border bg-surface-card transition-colors',
              'peer-checked:border-primary',
              'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
              'peer-disabled:bg-muted peer-disabled:opacity-50',
              error && 'border-error',
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 scale-0 rounded-full bg-primary transition-transform peer-checked:scale-100"
          />
        </div>
        {(icon || label || description) && (
          <div className="flex flex-col gap-1">
            {icon && <span aria-hidden="true">{icon}</span>}
            {label && <label htmlFor={radioId} className="cursor-pointer text-body-14-medium text-text">{label}</label>}
            {description && <p id={descriptionId} className="text-caption-12-regular text-text-secondary">{description}</p>}
          </div>
        )}
      </div>
    )
  },
)

Radio.displayName = 'Radio'

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  error,
  disabled = false,
  required = false,
}: RadioGroupProps) {
  return (
    <div className="w-full">
      <fieldset
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        disabled={disabled}
        className="space-y-3"
      >
        {label && <legend id={`${name}-label`} className="mb-2 block text-left text-body-14-medium text-text-secondary">{label}{required && <span className="ml-1 text-error" aria-hidden="true">*</span>}</legend>}
        {options.map((option) => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            onValueChange={onChange}
            checked={value === option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            disabled={disabled || option.disabled}
            error={Boolean(error)}
            required={required}
          />
        ))}
      </fieldset>
      {error && <p id={`${name}-error`} className="mt-1.5 text-caption-12-regular text-error" role="alert">{error}</p>}
    </div>
  )
}

export { Radio }
