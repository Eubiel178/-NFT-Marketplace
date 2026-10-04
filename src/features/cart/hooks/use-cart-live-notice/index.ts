import { useEffect, useState } from 'react'

import type { CartLine } from '@/contracts'
import { subscribeNftUpdates } from '@/realtime'

// Aviso para o aria-live quando um NFT do carrinho muda pelo nft.updated. O
// realtime já invalida carrinho e cotação; aqui só se escolhe o texto.
export function useCartLiveNotice(lines: readonly CartLine[]) {
  const [notice, setNotice] = useState('')
  const ids = lines.map((line) => line.nftId).join('|')

  useEffect(
    () =>
      subscribeNftUpdates((event) => {
        if (!ids.split('|').includes(event.resourceId)) return
        setNotice(`O preço ou a disponibilidade de ${event.nft.name} mudou. O resumo foi atualizado.`)
      }),
    [ids],
  )

  return notice
}
