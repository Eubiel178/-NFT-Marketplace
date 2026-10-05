import { z } from 'zod'

import { ethSchema } from '../eth'

export const nftNetworkSchema = z.enum(['ethereum', 'polygon', 'solana'])
export type NftNetwork = z.infer<typeof nftNetworkSchema>
export const nftSchema = z.object({
  id: z.string(), name: z.string(), category: z.enum(['art', 'music', 'photography']),
  collection: z.string(), network: nftNetworkSchema, image: z.string(),
  price: ethSchema, originalPrice: ethSchema.optional(), rare: z.boolean().optional(), available: z.number().int().nonnegative(), version: z.number().int().positive(),
  tokenId: z.string().optional(), description: z.string().optional(), shortDescription: z.string().optional(), editions: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(), reviews: z.number().int().nonnegative().optional(), gallery: z.array(z.string()).optional(),
  soldOutEditions: z.array(z.string()).optional(), rating: z.string().regex(/^\d\.\d$/).optional(),
  details: z.object({ paragraphs: z.array(z.string()), network: z.string(), contract: z.string(), royalties: z.string() }).optional(),
})
export type Nft = z.infer<typeof nftSchema>
export const catalogSearchSchema = z.object({
  q: z.string().catch(''), category: z.enum(['all', 'art', 'music', 'photography']).catch('all'),
  collection: z.string().catch('all'), network: z.enum(['all', 'ethereum', 'polygon', 'solana']).catch('all'),
  sort: z.enum(['recent', 'name', 'price-asc', 'price-desc']).catch('recent'),
  priceMin: z.union([ethSchema, z.number().transform((value) => `${value}`)]).optional().catch(undefined), priceMax: z.union([ethSchema, z.number().transform((value) => `${value}`)]).optional().catch(undefined),
  page: z.coerce.number().int().positive().catch(1),
})
export type CatalogSearch = z.infer<typeof catalogSearchSchema>
export const catalogFacetsSchema = z.object({
  collections: z.array(z.object({ value: z.string(), count: z.number().int().nonnegative() })),
  networks: z.array(z.object({ value: nftNetworkSchema, label: z.string(), count: z.number().int().nonnegative() })),
  price: z.object({ min: ethSchema, max: ethSchema }),
})
export type CatalogFacets = z.infer<typeof catalogFacetsSchema>
export const catalogSchema = z.object({ items: z.array(nftSchema), total: z.number().int(), page: z.number().int(), pageSize: z.number().int(), facets: catalogFacetsSchema })
