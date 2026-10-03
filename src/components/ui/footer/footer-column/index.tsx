import type { ReactNode } from 'react'

export interface FooterColumnProps {
  title: string
  children: ReactNode
  className?: string
}

export function FooterColumn({ title, children, className }: FooterColumnProps) {
  return (
    <section className={className} aria-labelledby={`${title}-footer-heading`}>
      <h2 id={`${title}-footer-heading`} className="text-body-15-bold text-foreground">{title}</h2>
      <div className="mt-4 flex flex-col gap-3 text-body-14-regular text-text-secondary">{children}</div>
    </section>
  )
}
