import { useState } from 'react'

import type { Nft } from '@/contracts'

import { describeNftChange } from '../../lib/nft-detail'

// Quando o nft.updated chega, o REST traz a nova versão; a diferença vira o texto
// do aviso ao vivo. Estado ajustado durante o render, sem efeito.
export function useNftAnnouncement(nft: Nft) {
  const [previous, setPrevious] = useState(nft)
  const [message, setMessage] = useState('')

  if (previous.id !== nft.id || previous.version !== nft.version) {
    setPrevious(nft)
    setMessage(previous.id === nft.id ? describeNftChange(previous, nft) : '')
  }

  return message
}
