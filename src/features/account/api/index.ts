import { profileSchema, walletSchema, type Profile, type Wallet } from '@/contracts'
import { http } from '@/lib/http'

export async function getProfile(signal?: AbortSignal) {
  return profileSchema.parse((await http.get('/profile', { signal })).data)
}

export async function updateProfile(input: Omit<Profile, 'userId' | 'avatar'>) {
  return profileSchema.parse((await http.patch('/profile', input)).data)
}

export async function updateAvatar(avatar: string | null) {
  return profileSchema.parse((await http.patch('/profile/avatar', { avatar })).data)
}

export async function updatePassword(input: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  await http.patch('/profile/password', input)
}

export async function getWallets(signal?: AbortSignal) {
  const data = (await http.get('/wallets', { signal })).data as { items: unknown }
  return { items: walletSchema.array().parse(data.items) }
}

export async function saveWallet(input: Omit<Wallet, 'id' | 'userId' | 'primary'> & { id?: string }) {
  const response = input.id ? await http.patch(`/wallets/${encodeURIComponent(input.id)}`, input) : await http.post('/wallets', input)
  return walletSchema.parse(response.data)
}
