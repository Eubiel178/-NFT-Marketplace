import type { Nft } from '@/contracts'

export function TokenInfo({ nft }: { nft: Nft }) {
  return (
    <dl className="flex flex-col gap-2 text-body-15 leading-24 text-text-secondary">
      {nft.tokenId && <div className="flex gap-2"><dt>ID do token:</dt><dd>{nft.tokenId}</dd></div>}
      <div className="flex gap-2"><dt>Coleção:</dt><dd>{nft.collection}</dd></div>
      {nft.attributes && <div className="flex gap-2"><dt>Atributos:</dt><dd>{nft.attributes.join(', ')}</dd></div>}
    </dl>
  )
}
