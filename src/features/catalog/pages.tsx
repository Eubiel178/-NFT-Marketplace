import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import axios from 'axios'
import { Button, Skeleton } from '@/components'
import { catalogOptions, nftOptions } from './api'

export function CatalogPage() {
  const search = useSearch({ from: '/' })
  const result = useQuery(catalogOptions(search))
  return <section aria-labelledby="catalog-title">
    <h1 id="catalog-title" className="text-3xl font-bold">Catálogo — integração inicial</h1>
    <p className="my-4">Dados via Axios, TanStack Query e MSW. Layout e fluxos do desafio ainda em implementação.</p>
    {result.isPending ? <div role="status" aria-label="Carregando catálogo"><div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-40" />)}</div></div>
      : result.isError ? <div role="alert"><p>Não foi possível carregar o catálogo.</p><Button onClick={() => void result.refetch()}>Tentar novamente</Button></div>
      : <><p role="status" className="my-4">{result.isFetching ? 'Atualizando catálogo…' : `${result.data.total} NFTs encontrados`}</p>
        {result.data.items.length === 0 ? <p>Nenhum NFT encontrado.</p> : <ul className="grid gap-4 md:grid-cols-3">{result.data.items.map((nft) => <li key={nft.id} className="min-h-40 rounded-lg border border-border p-4">
          <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="text-xl underline">{nft.name}</Link>
          <p className="mt-4">{nft.price} ETH</p><p>{nft.available} disponíveis</p>
        </li>)}</ul>}
      </>}
  </section>
}

export function NftPage({ id }: { id: string }) {
  const result = useQuery(nftOptions(id))
  if (result.isPending) return <div role="status" aria-label="Carregando NFT"><Skeleton className="h-64" /></div>
  if (result.isError) return <section role="alert"><h1>{axios.isAxiosError(result.error) && result.error.response?.status === 404 ? 'NFT não encontrado' : 'Falha ao carregar NFT'}</h1><Button onClick={() => void result.refetch()}>Tentar novamente</Button></section>
  return <section><h1 className="text-3xl font-bold">{result.data.name}</h1><p className="mt-4">{result.data.price} ETH</p><p>{result.data.available} disponíveis</p><p className="mt-4">Galeria, edições, favoritos e compra ainda não implementados.</p></section>
}
