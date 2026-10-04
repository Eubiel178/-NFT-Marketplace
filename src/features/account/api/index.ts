import { profileSchema, walletSchema, type PasswordChange, type ProfileInput, type Wallet, type WalletInput } from '@/contracts'
import { http } from '@/lib/http'

export async function getProfile(signal?: AbortSignal) {
  return profileSchema.parse((await http.get('/profile', { signal })).data)
}

export async function updateProfile(input: ProfileInput) {
  return profileSchema.parse((await http.patch('/profile', input)).data)
}

// Upload simulado pelo MSW: o arquivo vai como multipart e a API devolve o perfil atualizado.
export async function uploadAvatar(file: File) {
  const body = new FormData()
  body.append('avatar', file)
  return profileSchema.parse((await http.post('/profile/avatar', body)).data)
}

export async function removeAvatar() {
  return profileSchema.parse((await http.delete('/profile/avatar')).data)
}

export async function updatePassword(input: PasswordChange) {
  await http.patch('/profile/password', input)
}

export interface WalletList {
  items: Wallet[]
}

export async function getWallets(signal?: AbortSignal): Promise<WalletList> {
  const data = (await http.get('/wallets', { signal })).data as { items: unknown }
  return { items: walletSchema.array().parse(data.items) }
}

export interface SaveWalletInput {
  id?: string
  input: WalletInput
  // Só no cadastro: a nova carteira assume a principal e a anterior passa a secundária.
  primary?: boolean
}

export async function saveWallet({ id, input, primary }: SaveWalletInput) {
  const response = id ? await http.patch(`/wallets/${encodeURIComponent(id)}`, input) : await http.post('/wallets', { ...input, primary })
  return walletSchema.parse(response.data)
}

export async function setPrimaryWallet(id: string): Promise<WalletList> {
  const data = (await http.patch(`/wallets/${encodeURIComponent(id)}/primary`)).data as { items: unknown }
  return { items: walletSchema.array().parse(data.items) }
}
