import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-cta-checkout text-primary-foreground hover:opacity-90 shadow-cart-focus',
        primarySolid: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'border border-border bg-background hover:bg-muted',
        ghost: 'hover:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline',
        filter: 'bg-gradient-filter-btn text-primary-foreground hover:opacity-90',
        apply: 'bg-gradient-apply-coupon text-primary-foreground hover:opacity-90',
      },
      size: {
        sm: 'min-h-[40px] px-3 py-1.5 text-body-14-medium gap-1.5 rounded-md',
        md: 'min-h-[48px] px-4 py-2 text-body-14-medium gap-2 rounded-md',
        lg: 'min-h-[56px] px-6 py-3 text-body-large-16-medium gap-2 rounded-lg',
        pill: 'min-h-[48px] px-8 py-2 text-body-14-medium gap-2 rounded-pill',
        pillLg: 'min-h-[60px] px-10 py-3 text-body-large-16-medium gap-2 rounded-pill',
        icon: 'min-h-[40px] w-[40px] rounded-md',
        iconLg: 'min-h-[48px] w-[48px] rounded-lg',
        iconPill: 'min-h-[40px] w-[40px] rounded-pill',
        iconPillLg: 'min-h-[48px] w-[48px] rounded-pill',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export type ButtonVariant = 'primary' | 'primarySolid' | 'secondary' | 'ghost' | 'link' | 'filter' | 'apply'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'pill' | 'pillLg' | 'icon' | 'iconLg' | 'iconPill' | 'iconPillLg'

export interface ButtonProps
  extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'primarySolid' | 'secondary' | 'ghost' | 'link' | 'filter' | 'apply'
  size?: 'sm' | 'md' | 'lg' | 'pill' | 'pillLg' | 'icon' | 'iconLg' | 'iconPill' | 'iconPillLg'
  asChild?: boolean
  loading?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  onClick,
  tabIndex,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }), isDisabled && 'pointer-events-none opacity-50')}
        aria-busy={loading}
        aria-disabled={isDisabled || undefined}
        data-disabled={isDisabled || undefined}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault()
            event.stopPropagation()
            return
          }
          onClick?.(event as React.MouseEvent<HTMLButtonElement>)
        }}
        tabIndex={isDisabled ? -1 : tabIndex}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
      onClick={onClick}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
