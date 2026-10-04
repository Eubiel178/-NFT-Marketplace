import { z } from 'zod'

export const ethSchema = z.string().regex(/^\d+(\.\d{1,18})?$/)
export type Eth = z.infer<typeof ethSchema>
export type Network = 'ethereum' | 'polygon'
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
export const sessionSchema = z.object({ user: z.object({ id: z.string(), name: z.string(), email: z.string().email() }).nullable() })
export type Session = z.infer<typeof sessionSchema>
export const apiErrorSchema = z.object({ code: z.string(), message: z.string(), fields: z.record(z.string(), z.string()).optional() })
export const cartItemSchema = z.object({
  nftId: z.string(), editionId: z.string(), quantity: z.number().int().positive(), price: ethSchema.optional(),
  name: z.string().optional(), image: z.string().optional(), tokenId: z.string().optional(),
})
export const cartLineSchema = cartItemSchema.extend({ nft: nftSchema })
export const cartSchema = z.object({ items: z.array(cartLineSchema) })
export const favoritesSchema = z.object({ items: z.array(z.string()) })
export const quoteSchema = z.object({ id: z.string(), version: z.number().int().positive(), expiresAt: z.string(), items: z.array(cartItemSchema), subtotal: ethSchema, discount: ethSchema, networkFee: ethSchema, total: ethSchema })
export const walletSchema = z.object({ id: z.string(), userId: z.string(), name: z.string(), alias: z.string(), address: z.string(), network: z.enum(['ethereum', 'polygon']), label: z.string(), tag: z.string(), ens: z.string(), primary: z.boolean() })
export const profileSchema = z.object({ userId: z.string(), displayName: z.string(), username: z.string(), bio: z.string(), ens: z.string(), website: z.string(), avatar: z.string().nullable() })
export const orderStatusSchema = z.enum(['pending', 'confirmed', 'declined'])
export const paymentMethodSchema = z.enum(['walletconnect', 'metamask', 'coinbase'])
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export const walletConnectionSchema = z.object({ walletId: z.string(), method: paymentMethodSchema })
export type WalletConnection = z.infer<typeof walletConnectionSchema>
// Endereço completo (0x + hex) ou abreviado como as carteiras cadastradas (0xA91F…E82C).
export const walletAddressPattern = /^0x[0-9a-fA-F]{4,}((…|\.{3})[0-9a-fA-F]{4,})?$/
// Dados do colecionador enviados com o pedido. A mesma regra valida o formulário e o MSW.
export const collectorSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição'),
  username: z.string().trim().min(1, 'Informe o nome de usuário'),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil'),
  email: z.string().trim().email('Informe um e-mail válido'),
  walletAddress: z.string().trim().regex(walletAddressPattern, 'Informe um endereço 0x válido'),
  ens: z.string(),
  referralCode: z.string().trim().regex(/^([A-Za-z0-9-]{4,20})?$/, 'Use de 4 a 20 letras, números ou hífen'),
  note: z.string().max(500, 'Use no máximo 500 caracteres'),
})
export type Collector = z.infer<typeof collectorSchema>
export const orderSchema = z.object({ id: z.string(), userId: z.string(), version: z.number().int().positive(), status: orderStatusSchema, createdAt: z.string().datetime(), quote: quoteSchema, transactionRef: z.string().nullable(), wallet: walletSchema.pick({ address: true, network: true, name: true }).extend({ method: paymentMethodSchema }) })
export type ApiError = z.infer<typeof apiErrorSchema>
export interface CartItem { nftId: string; editionId: string; quantity: number; price?: Eth; name?: string; image?: string; tokenId?: string }
export interface Quote { id: string; version: number; expiresAt: string; items: CartItem[]; subtotal: Eth; discount: Eth; networkFee: Eth; total: Eth }
export type OrderStatus = 'pending' | 'confirmed' | 'declined'
export interface Order { id: string; userId: string; version: number; status: OrderStatus; createdAt: string; quote: Quote; transactionRef: string | null; wallet: { address: string; network: 'ethereum' | 'polygon'; name: string; method: PaymentMethod } }
export interface Wallet { id: string; userId: string; name: string; alias: string; address: string; network: 'ethereum' | 'polygon'; label: string; tag: string; ens: string; primary: boolean }
export type CartLine = z.infer<typeof cartLineSchema>
export type Cart = z.infer<typeof cartSchema>
export type Favorites = z.infer<typeof favoritesSchema>
export type Profile = z.infer<typeof profileSchema>
export interface ResourceEvent { eventId: string; resourceId: string; version: number }
export interface NftUpdated extends ResourceEvent { nft: Nft }
export const orderUpdatedSchema = z.object({ eventId: z.string(), resourceId: z.string(), version: z.number().int().positive(), userId: z.string(), status: orderStatusSchema })
export type OrderUpdated = z.infer<typeof orderUpdatedSchema>
