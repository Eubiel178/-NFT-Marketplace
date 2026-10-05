import { z } from 'zod'

import { ethSchema } from '../eth'
import { nftSchema } from '../nfts'

export const cartItemSchema = z.object({
  nftId: z.string(), editionId: z.string(), quantity: z.number().int().positive(), price: ethSchema.optional(),
  name: z.string().optional(), image: z.string().optional(), tokenId: z.string().optional(),
})
export type CartItem = z.infer<typeof cartItemSchema>
export const cartLineSchema = cartItemSchema.extend({ nft: nftSchema })
export const cartSchema = z.object({ items: z.array(cartLineSchema) })
export type CartLine = z.infer<typeof cartLineSchema>
export type Cart = z.infer<typeof cartSchema>
