import { useState } from 'react'

import { Icon, Image, Modal } from '@/components'
import type { Nft } from '@/contracts'
import { cn } from '@/lib/utils'

// Miniaturas à esquerda, imagem principal em moldura de 444px e lupa para ampliar.
export function Gallery({ nft }: { nft: Nft }) {
  const images = nft.gallery ?? [nft.image]
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const current = images[selected] ?? nft.image

  return (
    <section aria-label="Galeria do NFT" className="flex shrink-0 items-start gap-7">
      <div className="flex w-25 flex-col gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Selecionar imagem ${index + 1}`}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className={cn('size-25 overflow-hidden rounded-8 border border-transparent', index === selected && 'border-primary')}
          >
            <Image src={image} alt="" width={100} height={100} className="size-full object-cover" />
          </button>
        ))}
      </div>
      <div className="relative mt-0.5 size-111 rounded-6 bg-surface-card p-5">
        <Image src={current} alt={nft.name} width={404} height={404} priority className="size-full rounded-24 object-cover" />
        <button
          type="button"
          aria-label="Ampliar imagem"
          aria-expanded={zoomOpen}
          onClick={() => setZoomOpen(true)}
          className="absolute top-3 right-3 grid size-7.5 place-items-center rounded-full border border-border bg-surface-raised text-foreground"
        >
          <Icon src="/assets/figma/mcp/svg/search.svg" className="size-4.5" />
        </button>
      </div>
      <Modal.Root isOpen={zoomOpen} onClose={() => setZoomOpen(false)} size="md" className="max-w-2xl">
        <Modal.Header>
          <Modal.Title>{nft.name}</Modal.Title>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          <Image src={current} alt={nft.name} width={800} height={800} className="h-auto w-full rounded-24 object-contain" />
        </Modal.Body>
      </Modal.Root>
    </section>
  )
}
