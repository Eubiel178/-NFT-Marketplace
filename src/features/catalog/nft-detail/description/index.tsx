import type { Nft } from '@/contracts'

export function Description({ nft }: { nft: Nft }) {
  return (
    <section aria-labelledby="nft-description-title">
      <div className="flex items-end gap-8 overflow-hidden border-b border-border whitespace-nowrap max-sm:gap-4">
        <h2 id="nft-description-title" className="border-b-2 border-primary pb-1 text-body-large-17-bold leading-24 text-text-accent max-sm:text-body-15-bold">Detalhes do NFT</h2>
        <p className="pb-1.5 text-body-large-17 leading-24 max-sm:text-body-15">Avaliações de colecionadores ({nft.reviews ?? 0})</p>
      </div>
      {nft.details && (
        <div className="mt-3 text-body-14-regular text-text-secondary">
          <div className="flex flex-col gap-6">{nft.details.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <dl className="mt-3 flex flex-col gap-3">
            <div><dt className="font-bold text-foreground">Rede:</dt><dd>{nft.details.network}</dd></div>
            <div><dt className="font-bold text-foreground">Contrato:</dt><dd>{nft.details.contract}</dd></div>
            <div><dt className="font-bold text-foreground">Direitos autorais:</dt><dd>{nft.details.royalties}</dd></div>
          </dl>
        </div>
      )}
    </section>
  )
}
