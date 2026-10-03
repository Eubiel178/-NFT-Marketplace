import { createContext } from 'react'

export interface ModalContextValue {
  titleId: string
  descriptionId: string
  setHasTitle: (hasTitle: boolean) => void
  setHasDescription: (hasDescription: boolean) => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)
