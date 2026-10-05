import { z } from 'zod'

import { cartItemSchema } from '../cart'
import { ethSchema } from '../eth'

export const quoteSchema = z.object({ id: z.string(), version: z.number().int().positive(), expiresAt: z.string(), items: z.array(cartItemSchema), subtotal: ethSchema, discount: ethSchema, networkFee: ethSchema, total: ethSchema })
export type Quote = z.infer<typeof quoteSchema>
