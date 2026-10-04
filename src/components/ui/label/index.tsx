import { forwardRef } from 'react'
import type { ComponentProps, ForwardRefExoticComponent, RefObject } from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends ComponentProps<'label'> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-body-14 font-medium leading-16 tracking-wide text-left mb-2 text-text-secondary', className)}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
    </label>
  )
) as ForwardRefExoticComponent<LabelProps & { ref?: RefObject<HTMLLabelElement> }>

Label.displayName = 'Label'