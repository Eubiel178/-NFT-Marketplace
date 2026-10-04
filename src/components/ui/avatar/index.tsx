import { Image } from '@/components/ui/image'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  editable?: boolean
  disabled?: boolean
  onUpload?: () => void
  onRemove?: () => void
  className?: string
}

export function Avatar({ src, alt, fallback, size = 'md', shape = 'circle', editable = false, disabled = false, onUpload, onRemove, className }: AvatarProps) {

  const sizeStyles = { sm: 'w-[32px] h-[32px] text-caption-12 font-bold leading-16', md: 'w-[40px] h-[40px] text-body-14 font-bold leading-16 tracking-wide', lg: 'w-[48px] h-[48px] text-body-large-16 font-bold leading-16', xl: 'w-[56px] h-[56px] text-body-large-18 font-bold leading-16', '2xl': 'w-[64px] h-[64px] text-heading-24 font-bold leading-auto' }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const initials = fallback ? getInitials(fallback) : '?'

  return (
    <div className={cn('relative inline-flex', className)}>
      <div className={cn('inline-flex items-center justify-center', 'bg-surface-card', 'border border-border', 'overflow-hidden', sizeStyles[size], shape === 'circle' ? 'rounded-full' : 'rounded-10', 'flex-shrink-0')}>
        {src ? <Image src={src} alt={alt ?? fallback ?? ''} className="w-full h-full object-cover" /> : <span className="text-foreground font-medium" aria-hidden="true">{initials}</span>}
      </div>
      {editable && onUpload && (
         <button type="button" onClick={onUpload} disabled={disabled} className="absolute bottom-0 right-0 p-1.5 bg-primary text-ink rounded-full shadow-cart-focus transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50" aria-label="Alterar avatar">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      )}
      {src && onRemove && (
         <button type="button" onClick={onRemove} disabled={disabled} className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2 p-1 bg-error text-ink rounded-full shadow-cart-focus transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50" aria-label="Remover avatar">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
    )
}
