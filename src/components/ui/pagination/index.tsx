import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  className?: string
  'aria-label'?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, showFirstLast = true, showPrevNext = true, maxVisiblePages = 5, className, 'aria-label': ariaLabel = 'Paginação' }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages, maxVisiblePages)
  const controlClassName = 'rounded-4 p-1 transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50'

  return (
    <nav aria-label={ariaLabel} className={cn('flex items-center justify-center gap-2', className)}>
      <ul className="flex items-center gap-2" role="list">
        {showFirstLast && (
          <li>
            <button type="button" className={controlClassName} onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="Primeira página">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
          </li>
        )}
        {showPrevNext && (
          <li>
            <button type="button" className={controlClassName} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </li>
        )}
        {pages.map((page, index) => page === 'ellipsis' ? (
          <li key={`ellipsis-${index}`}><span className="px-2 text-text-secondary" aria-hidden="true">…</span></li>
        ) : (
          <li key={page}>
            <button
              type="button"
              className={cn('grid size-8.75 place-items-center rounded-4 border border-border text-body-14 font-medium leading-16 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', page === currentPage ? 'border-primary bg-primary text-ink' : 'hover:bg-surface-card')}
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        {showPrevNext && (
          <li>
            <button type="button" className={controlClassName} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Próxima página">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </li>
        )}
        {showFirstLast && (
          <li>
            <button type="button" className={controlClassName} onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Última página">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

function getVisiblePages(current: number, total: number, maxVisible: number): (number | 'ellipsis')[] {
  if (total <= maxVisible) return Array.from({ length: total }, (_, index) => index + 1)
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
  const pages: (number | 'ellipsis')[] = []
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('ellipsis')
  }
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < total) {
    if (end < total - 1) pages.push('ellipsis')
    pages.push(total)
  }
  return pages
}
