import { forwardRef } from 'react'
import type { ComponentProps, ForwardRefExoticComponent, RefObject } from 'react'
import { cn } from '@/lib/utils'

export interface ImageProps extends ComponentProps<'img'> {
  fill?: boolean
  priority?: boolean
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fill, priority, src, alt, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(
        'block',
        fill ? 'absolute inset-0 w-full h-full object-cover' : '',
        className
      )}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ImageProps & { ref?: RefObject<HTMLImageElement> }>

Image.displayName = 'Image'