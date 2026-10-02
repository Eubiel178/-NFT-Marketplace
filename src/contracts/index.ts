import { z } from 'zod'

export const ethSchema = z.string().regex(/^\d+(\.\d{1,18})?$/)
export type Eth = z.infer<typeof ethSchema>
export const nftSchema = z.object({
  id: z.string(), name: z.string(), category: z.enum(['art', 'music', 'photography']),
  price: ethSchema, available: z.number().int().nonnegative(), version: z.number().int().positive(),
})
export type Nft = z.infer<typeof nftSchema>
export const catalogSearchSchema = z.object({
  q: z.string().catch(''), category: z.enum(['all', 'art', 'music', 'photography']).catch('all'),
  sort: z.enum(['name', 'price-asc', 'price-desc']).catch('name'), page: z.coerce.number().int().positive().catch(1),
})
export type CatalogSearch = z.infer<typeof catalogSearchSchema>
export const catalogSchema = z.object({ items: z.array(nftSchema), total: z.number().int(), page: z.number().int(), pageSize: z.number().int() })
export const sessionSchema = z.object({ user: z.object({ id: z.string(), name: z.string(), email: z.string().email() }).nullable() })
export interface ApiError { code: string; message: string; fields?: Record<string, string> }
export interface CartItem { nftId: string; editionId: string; quantity: number }
export interface Quote { id: string; version: number; expiresAt: string; items: CartItem[]; subtotal: Eth; discount: Eth; networkFee: Eth; total: Eth }
export type OrderStatus = 'pending' | 'confirmed' | 'declined'
export interface Order { id: string; userId: string; version: number; status: OrderStatus; quote: Quote; transactionRef: string | null }
export interface Wallet { id: string; userId: string; address: string; network: 'ethereum' | 'polygon'; primary: boolean }
export interface ResourceEvent { eventId: string; resourceId: string; version: number }
export interface NftUpdated extends ResourceEvent { nft: Nft }
export interface OrderUpdated extends ResourceEvent { userId: string; status: OrderStatus }
