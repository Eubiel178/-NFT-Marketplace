import { favoritesSchema } from '@/contracts'
import { http } from '@/lib/http'

export async function getFavorites(signal?: AbortSignal) {
  return favoritesSchema.parse((await http.get('/favorites', { signal })).data)
}

export async function addFavorite(nftId: string) {
  return favoritesSchema.parse((await http.put(`/favorites/${encodeURIComponent(nftId)}`)).data)
}

export async function removeFavorite(nftId: string) {
  return favoritesSchema.parse((await http.delete(`/favorites/${encodeURIComponent(nftId)}`)).data)
}
