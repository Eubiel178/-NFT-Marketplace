import type { Nft } from '@/contracts'

export interface NftDetailDescriptionProps {
  nft: Nft
}

export function NftDetailDescription({ nft }: NftDetailDescriptionProps) {
  return (
    <section className="nft-detail-description" aria-labelledby="nft-detail-description-title">
      <div className="nft-detail-description-tabs"><h2 id="nft-detail-description-title">Detalhes do NFT</h2><span>Avaliações de colecionadores ({nft.reviews ?? 19})</span></div>
      <p>{nft.name} é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.</p>
      <p>A propriedade inclui arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.</p>
      <dl>
        <div><dt>Rede:</dt><dd>Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.</dd></div>
        <div><dt>Contrato:</dt><dd>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</dd></div>
        <div><dt>Direitos autorais:</dt><dd>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</dd></div>
      </dl>
    </section>
  )
}
