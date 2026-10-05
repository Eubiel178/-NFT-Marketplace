import { z } from 'zod'

import { quoteSchema } from '../quote'
import { walletSchema } from '../wallets'

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
export type Order = z.infer<typeof orderSchema>
export type OrderStatus = z.infer<typeof orderStatusSchema>
