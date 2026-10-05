import { z } from 'zod'

import { ensSchema } from '../profile'

export const walletTypes = ['Hot wallet', 'Cold wallet'] as const
export const walletSchema = z.object({ id: z.string(), userId: z.string(), name: z.string(), alias: z.string(), address: z.string(), network: z.enum(['ethereum', 'polygon']), label: z.string(), tag: z.string(), ens: z.string(), profileName: z.string(), referralCode: z.string(), email: z.string(), primary: z.boolean() })
export type Wallet = z.infer<typeof walletSchema>
// Endereço completo (40 hex) ou abreviado como as carteiras cadastradas (0xA91F…E82C).
export const walletRegistrationAddressPattern = /^0x(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{4}(?:\.\.\.|…)[0-9a-fA-F]{4})$/
export const walletInputSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome de exibição'),
  alias: z.string().trim().min(1, 'Informe o apelido da carteira'),
  network: z.enum(['ethereum', 'polygon'], { message: 'Selecione uma rede' }),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil'),
  address: z.string().trim().regex(walletRegistrationAddressPattern, 'Informe um endereço 0x válido'),
  label: z.string().trim().max(60, 'Use no máximo 60 caracteres'),
  tag: z.enum(walletTypes, { message: 'Selecione o tipo de carteira' }),
  referralCode: z.string().trim().min(1, { message: 'Informe o código de indicação', abort: true }).regex(/^[A-Za-z0-9-]{4,20}$/, 'Use de 4 a 20 letras, números ou hífen'),
  email: z.string().trim().email('Informe um e-mail válido'),
  ens: ensSchema,
})
export type WalletInput = z.infer<typeof walletInputSchema>
