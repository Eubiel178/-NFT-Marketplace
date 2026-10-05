import { z } from 'zod'

export const favoritesSchema = z.object({ items: z.array(z.string()) })
export type Favorites = z.infer<typeof favoritesSchema>
