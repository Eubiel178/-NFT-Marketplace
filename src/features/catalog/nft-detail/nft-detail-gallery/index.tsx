import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { ArrowLeft, Heart, Search } from 'lucide-react'

import { Image, Modal } from '@/components'

import type { Nft } from '@/contracts'

export interface NftDetailGalleryProps {
  nft: Nft
  favorite: boolean
  selectedImage: number
  onToggleFavorite: () => void
  onImageChange: (index: number) => void
}

export function NftDetailGallery({ nft, favorite, selectedImage, onToggleFavorite, onImageChange }: NftDetailGalleryProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const gallery = nft.gallery?.length ? nft.gallery : [nft.image, nft.image, nft.image, nft.image]

  return (
    <section className="nft-detail-gallery" aria-label="Galeria do NFT">
      <div className="nft-detail-mobile-controls">
        <Link to="/" className="nft-detail-round-button" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /></Link>
         <button type="button" className="nft-detail-round-button" data-favorite-trigger="true" aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={favorite} onClick={onToggleFavorite}><Heart aria-hidden="true" className={favorite ? 'fill-primary' : undefined} /></button>
      </div>
      <div className="nft-detail-gallery-content">
        <div className="nft-detail-thumbnails">
          {gallery.map((image, index) => <button type="button" className={index === selectedImage ? 'nft-detail-thumbnail is-selected' : 'nft-detail-thumbnail'} key={`${image}-${index}`} aria-label={`Selecionar imagem ${index + 1}`} aria-pressed={index === selectedImage} onClick={() => onImageChange(index)}><Image src={image} alt="" width={100} height={100} /></button>)}
        </div>
        <div className="nft-detail-main-image-wrap">
          <Image src={gallery[selectedImage]} alt={nft.name} width={404} height={404} className="nft-detail-main-image" priority />
          <button type="button" className="nft-detail-zoom" aria-label="Ampliar imagem" aria-expanded={isZoomOpen} onClick={() => setIsZoomOpen(true)}><Search aria-hidden="true" /></button>
        </div>
      </div>
      <Modal.Root isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} size="md" className="nft-detail-zoom-dialog">
        <Modal.Header>
          <Modal.Title>{nft.name}</Modal.Title>
          <Modal.Close onClose={() => setIsZoomOpen(false)} />
        </Modal.Header>
        <Modal.Body>
          <Image src={gallery[selectedImage]} alt={nft.name} width={800} height={800} className="nft-detail-zoom-image" />
        </Modal.Body>
      </Modal.Root>
    </section>
  )
}
