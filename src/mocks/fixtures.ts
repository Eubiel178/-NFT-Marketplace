import type { Nft } from '@/contracts'

export const users = [
  { id: 'collector-1', name: 'Ana Demo', email: 'ana@example.test' },
  { id: 'collector-2', name: 'Bruno Demo', email: 'bruno@example.test' },
]
export const createNfts = (): Nft[] => Array.from({ length: 24 }, (_, index) => ({
  id: `nft-${index + 1}`, name: `Coleção ${String(index + 1).padStart(2, '0')}`,
  category: (['art', 'music', 'photography'] as const)[index % 3],
  price: `0.${String(index + 1).padStart(3, '0')}`, available: index % 7, version: 1,
}))
