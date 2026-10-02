import { z } from 'zod'
import { nftSchema } from '@/contracts'
import { createNfts } from './fixtures'

const key = 'nft-marketplace:mock-db:v1'
const schema = z.object({ nfts: z.array(nftSchema) })
function read() {
  try { return schema.parse(JSON.parse(localStorage.getItem(key) || 'null')) }
  catch { return { nfts: createNfts() } }
}
export const db = read()
export function saveDb() { localStorage.setItem(key, JSON.stringify(db)) }
export function resetDb() { db.nfts = createNfts(); saveDb() }
