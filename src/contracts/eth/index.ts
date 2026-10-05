import { z } from 'zod'

export const ethSchema = z.string().regex(/^\d+(\.\d{1,18})?$/)
export type Eth = z.infer<typeof ethSchema>
export type Network = 'ethereum' | 'polygon'
