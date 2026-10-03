import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StepperSize = 'sm' | 'md' | 'lg'

export interface StepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  ariaLabel?: string
  className?: string
  size?: StepperSize
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
  ariaLabel = 'Quantidade',
  className,
  size = 'md',
}: StepperProps) {
  const handleIncrement = () => {
    if (!disabled) onChange(Math.min(value + step, max))
  }

  const handleDecrement = () => {
    if (!disabled) onChange(Math.max(value - step, min))
  }

  const sizeStyles: Record<StepperSize, string> = {
    sm: 'h-10 gap-1',
    md: 'h-12 gap-2',
    lg: 'h-14 gap-2',
  }
  const buttonSize: Record<StepperSize, 'icon' | 'iconLg'> = {
    sm: 'icon',
    md: 'icon',
    lg: 'iconLg',
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center overflow-hidden rounded-md border border-border bg-surface-card',
        'disabled:opacity-50',
        sizeStyles[size],
        className,
      )}
    >
      <Button
        variant="secondary"
        size={buttonSize[size]}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Diminuir"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </Button>
      <output className="w-15 select-none text-center text-body-large-16-bold" aria-live="polite">
        {value}
      </output>
      <Button
        variant="secondary"
        size={buttonSize[size]}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Aumentar"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
    </div>
  )
}
