import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components'
import type { Nft } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { catalogOptions, nftOptions } from '../api'
import { useNftAnnouncement } from '../hooks/use-nft-announcement'
import { withCatalogDefaults } from '../lib/catalog-search'
import { Desktop } from './desktop'
import { Mobile } from './mobile'
import { Related } from './related'
import { Skeleton } from './skeleton'

const relatedSearch = withCatalogDefaults({})

// Página de detalhe: mobile e desktop têm estrutura diferente no Figma, então só a
// versão da largura atual é renderizada; a lógica fica nos hooks compartilhados.
export function NftDetail({ id }: { id: string }) {
  const isDesktop = useMediaQuery('(width >= 40rem)')
  const nft = useQuery(nftOptions(id))
  const related = useQuery(catalogOptions(relatedSearch))

  if (nft.isPending) return <Skeleton mobile={!isDesktop} />

  if (nft.isError) {
    const notFound = parseHttpError(nft.error).status === 404
    return (
      <section role="alert" className="flex flex-col items-start gap-4 py-12">
        <h1 className="text-heading-28-bold">{notFound ? 'NFT não encontrado' : 'Falha ao carregar NFT'}</h1>
        <p className="text-body-14-regular text-text-secondary">{notFound ? 'O NFT pode ter sido removido ou o endereço está incorreto.' : 'Verifique a conexão e tente de novo.'}</p>
        {notFound ? <Button asChild variant="primarySolid"><Link to="/">Voltar ao catálogo</Link></Button> : <Button onClick={() => void nft.refetch()}>Tentar novamente</Button>}
      </section>
    )
  }

  const relatedSection = (
    <Related
      nfts={related.data?.items.filter((item) => item.id !== nft.data.id).slice(2, 7) ?? []}
      loading={related.isPending}
      error={related.isError}
      onRetry={() => void related.refetch()}
    />
  )

  return (
    <>
      <Announcement nft={nft.data} />
      {isDesktop ? <Desktop key={nft.data.id} nft={nft.data} related={relatedSection} /> : <Mobile key={nft.data.id} nft={nft.data} related={relatedSection} />}
    </>
  )
}

function Announcement({ nft }: { nft: Nft }) {
  const message = useNftAnnouncement(nft)
  return <p role="status" aria-live="polite" className="sr-only">{message}</p>
}
