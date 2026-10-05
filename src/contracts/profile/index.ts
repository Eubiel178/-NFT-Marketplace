import { z } from 'zod'

export const profileSchema = z.object({ userId: z.string(), displayName: z.string(), username: z.string(), email: z.string(), ens: z.string(), walletAlias: z.string(), avatar: z.string().nullable() })
export type Profile = z.infer<typeof profileSchema>
// Mesmas regras no formulário e no MSW (como collectorSchema). O ENS é guardado completo ("ana.kurio.eth").
export const ensSchema = z.string().trim().min(1, { message: 'Informe o nome ENS', abort: true }).regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/i, 'Use só letras, números, hífen e ponto no nome ENS')
export const profileInputSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição'),
  username: z.string().trim().min(3, 'Use pelo menos 3 caracteres no nome de usuário'),
  email: z.string().trim().email('Informe um e-mail válido'),
  ens: ensSchema,
  walletAlias: z.string().trim().min(1, 'Informe o apelido da carteira'),
})
export type ProfileInput = z.infer<typeof profileInputSchema>
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().min(8, 'Use pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((value) => !value.confirmPassword || value.newPassword === value.confirmPassword, { path: ['confirmPassword'], message: 'As senhas não conferem' })
export type PasswordChange = z.infer<typeof passwordChangeSchema>
