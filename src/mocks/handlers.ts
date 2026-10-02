import { delay, http, HttpResponse } from 'msw'
import { catalogSearchSchema } from '@/contracts'
import { toWei } from '@/lib/eth'
import { db, resetDb, saveDb } from './db'
import { getScenario, scenarios, setScenario } from './scenarios'
import { broadcastNft } from './socket'

const error = (status: number, code: string, message: string) => HttpResponse.json({ code, message }, { status })
async function conditions(request: Request) {
  const scenario = getScenario()
  const page = Number(new URL(request.url).searchParams.get('page') || 1)
  await delay(scenario === 'slow' ? 2_000 : scenario === 'variable-latency' ? (page % 2 ? 900 : 100) : 80)
  if (scenario === 'network-error') return HttpResponse.error()
  if (scenario === 'http-500') return error(503, 'TRANSIENT_FAILURE', 'Serviço temporariamente indisponível')
  if (scenario === 'unauthorized') return error(401, 'SESSION_EXPIRED', 'Sessão expirada')
}
export const handlers = [
  http.get('/api/session', () => HttpResponse.json({ user: null })),
  http.get('/api/nfts', async ({ request }) => {
    const failure = await conditions(request)
    if (failure) return failure
    const search = catalogSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams))
    const items = getScenario() === 'empty' ? [] : db.nfts.filter((nft) =>
      nft.name.toLowerCase().includes(search.q.toLowerCase()) && (search.category === 'all' || nft.category === search.category),
    ).sort((a, b) => {
      if (search.sort === 'name') return a.name.localeCompare(b.name)
      const delta = toWei(a.price) - toWei(b.price)
      const order = delta < 0n ? -1 : delta > 0n ? 1 : 0
      return search.sort === 'price-asc' ? order : -order
    })
    return HttpResponse.json({ items: items.slice((search.page - 1) * 6, search.page * 6), total: items.length, page: search.page, pageSize: 6 })
  }),
  http.get('/api/nfts/:id', async ({ request, params }) => {
    const failure = await conditions(request)
    if (failure) return failure
    const nft = db.nfts.find((item) => item.id === params.id)
    return nft ? HttpResponse.json(nft) : error(404, 'NOT_FOUND', 'NFT não encontrado')
  }),
  http.post('/api/__mock/reset', () => { resetDb(); setScenario('default'); return new HttpResponse(null, { status: 204 }) }),
  http.post('/api/__mock/scenario', async ({ request }) => {
    const body = await request.json() as { scenario?: string }
    const scenario = scenarios.find((item) => item === body.scenario)
    if (!scenario) return error(422, 'VALIDATION_ERROR', 'Cenário desconhecido')
    setScenario(scenario)
    return HttpResponse.json({ scenario })
  }),
  http.post('/api/__mock/nfts/:id/update', ({ params }) => {
    const nft = db.nfts.find((item) => item.id === params.id)
    if (!nft) return error(404, 'NOT_FOUND', 'NFT não encontrado')
    nft.version += 1
    nft.price = '0.125'
    saveDb()
    broadcastNft({ eventId: `${nft.id}:${nft.version}`, resourceId: nft.id, version: nft.version, nft })
    return HttpResponse.json(nft)
  }),
]
