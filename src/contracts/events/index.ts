import { z } from 'zod'

import type { Nft } from '../nfts'
import { orderStatusSchema } from '../orders'

export interface ResourceEvent { eventId: string; resourceId: string; version: number }
export interface NftUpdated extends ResourceEvent { nft: Nft }
export const orderUpdatedSchema = z.object({ eventId: z.string(), resourceId: z.string(), version: z.number().int().positive(), userId: z.string(), status: orderStatusSchema })
export type OrderUpdated = z.infer<typeof orderUpdatedSchema>
