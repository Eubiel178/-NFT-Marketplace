import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import type { Nft } from '@/contracts'

import { Description } from '../description'
import { Gallery } from '../gallery'
import { Summary } from '../summary'

export interface DesktopProps {
  nft: Nft
  related: ReactNode
}

// Ordem do frame: trilha, galeria + resumo, detalhes, mais desta coleção.
export function Desktop({ nft, related }: DesktopProps) {
  return (
    <article className="flex flex-col pt-2">
      <nav aria-label="Trilha de navegação" className="flex gap-2 text-body-15-bold">
        <Link to="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span>Mercado</span>
      </nav>
      <div className="mt-3 flex flex-col gap-8 lg:flex-row lg:gap-8.25">
        <Gallery nft={nft} />
        <Summary nft={nft} />
      </div>
      <div className="mt-23">
        <Description nft={nft} />
      </div>
      <div className="mt-23.25 mb-0.5">{related}</div>
    </article>
  )
}
