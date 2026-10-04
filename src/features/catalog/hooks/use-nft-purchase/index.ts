import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import type { Nft } from '@/contracts'
import { addCartItem } from '@/features/cart'
import { keys } from '@/lib/query'
import { sessionOptions } from '@/shared/api/session'

import { clampQuantity, initialEdition, isEditionSoldOut } from '../../lib/nft-detail'

// Edição, quantidade e envio ao carrinho. O estoque vem do NFT atual, então um
// nft.updated que reduza o estoque reduz também a quantidade escolhida.
export function useNftPurchase(nft: Nft) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useQuery(sessionOptions)
  const [edition, setEdition] = useState(() => initialEdition(nft))
  const [requested, setRequested] = useState(1)

  const quantity = clampQuantity(requested, nft.available)
  const soldOut = nft.available <= 0 || !edition || isEditionSoldOut(nft, edition)

  const mutation = useMutation({
    mutationFn: () => addCartItem({ nftId: nft.id, editionId: edition ?? '', quantity }),
    onSuccess: (cart) => queryClient.setQueryData(keys.cart(session.data?.user?.id ?? null), cart),
  })

  const addToCart = (to: '/cart' | '/checkout') => {
    mutation.mutate(undefined, { onSuccess: () => { void navigate({ to }) } })
  }

  const selectEdition = (next: string) => {
    if (!isEditionSoldOut(nft, next)) setEdition(next)
  }

  return {
    edition,
    selectEdition,
    quantity,
    canDecrease: !soldOut && quantity > 1,
    canIncrease: !soldOut && quantity < nft.available,
    decrease: () => setRequested(quantity - 1),
    increase: () => setRequested(quantity + 1),
    soldOut,
    addToCart,
    isAdding: mutation.isPending,
    addError: mutation.isError,
  }
}
