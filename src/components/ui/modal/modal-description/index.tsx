import { useContext, useEffect } from 'react'

import { ModalContext } from '../modal-context'

interface ModalDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  const context = useContext(ModalContext)

  useEffect(() => {
    context?.setHasDescription(true)
    return () => context?.setHasDescription(false)
  }, [context])

  return <p id={context?.descriptionId} className={className ?? 'mt-1 text-body-14-regular text-text-secondary'}>{children}</p>
}
