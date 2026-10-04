import { useEffect, useRef, useState } from 'react'

import type { CartLine } from '@/contracts'
import { subscribeNftUpdates } from '@/realtime'

// nft.updated de um item da compra: aviso ao vivo e callback para revalidar a revisão.
export function useCheckoutLive(lines: readonly CartLine[], onChange: () => void) {
  const [notice, setNotice] = useState('')
  const ids = lines.map((line) => line.nftId).join('|')
  const latest = useRef(onChange)

  useEffect(() => {
    latest.current = onChange
  })

  useEffect(
    () =>
      subscribeNftUpdates((event) => {
        if (!ids.split('|').includes(event.resourceId)) return
        setNotice(`O preço ou a disponibilidade de ${event.nft.name} mudou. Revise a cotação antes de confirmar.`)
        latest.current()
      }),
    [ids],
  )

  return notice
}
