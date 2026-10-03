import { useContext, useEffect } from 'react'

import { ModalContext } from '../modal-context'

interface ModalTitleProps {
  children: React.ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  const context = useContext(ModalContext)

  useEffect(() => {
    context?.setHasTitle(true)
    return () => context?.setHasTitle(false)
  }, [context])

  return <h2 id={context?.titleId} className={className ?? 'text-title-20-bold'}>{children}</h2>
}
