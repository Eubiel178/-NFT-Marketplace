import { z } from 'zod'

import { readUserItem, removeUserItem, writeUserItem } from '@/lib/user-storage'

import type { CheckoutForm } from '../checkout-form'

// Retomada depois que a sessão expira no pagamento: o formulário e a revisão aberta
// são guardados por usuário (o pagamento não tem senha) e lidos uma única vez ao
// reabrir o pagamento depois do login.
export interface CheckoutResume {
  form: CheckoutForm
  reviewing: boolean
}

const resumeSchema = z.object({
  form: z.object({
    displayName: z.string(),
    username: z.string(),
    profileName: z.string(),
    network: z.enum(['ethereum', 'polygon', '']),
    walletAddress: z.string(),
    ens: z.string(),
    walletId: z.string(),
    referralCode: z.string(),
    email: z.string(),
    ensSuffix: z.string(),
    useOtherWallet: z.boolean(),
    note: z.string(),
  }),
  reviewing: z.boolean(),
})

// Estado atual do pagamento aberto; o formulário vive no React, então a tela o registra aqui.
let current: { userId: string; resume: CheckoutResume } | null = null

export function trackCheckoutResume(next: { userId: string; resume: CheckoutResume } | null) {
  current = next
}

// Chamado quando a sessão expira: guarda o que o usuário preencheu, se havia pagamento aberto.
export function persistCheckoutResume() {
  if (current) writeUserItem('checkout-resume', current.userId, JSON.stringify(current.resume))
}

// Leitura sem apagar (o inicializador do React pode rodar duas vezes); a tela chama clear depois de usar.
export function readCheckoutResume(userId: string): CheckoutResume | null {
  const raw = userId ? readUserItem('checkout-resume', userId) : null
  if (!raw) return null
  try {
    const parsed = resumeSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function clearCheckoutResume(userId: string) {
  removeUserItem('checkout-resume', userId)
}
