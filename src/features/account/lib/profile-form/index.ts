import { passwordChangeSchema, profileInputSchema, type PasswordChange, type Profile, type ProfileInput } from '@/contracts'

import { formField, joinEns, splitEns } from '../ens'

export interface ProfileForm {
  displayName: string
  username: string
  email: string
  ensName: string
  walletAlias: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ProfileField = keyof ProfileForm
export type ProfileErrors = Partial<Record<ProfileField, string>>

export type ProfileValidation =
  | { ok: true; input: ProfileInput; password: PasswordChange | null }
  | { ok: false; errors: ProfileErrors }

export function toProfileForm(profile: Profile): ProfileForm {
  return {
    displayName: profile.displayName,
    username: profile.username,
    email: profile.email,
    ensName: splitEns(profile.ens),
    walletAlias: profile.walletAlias,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

// A senha só é enviada se algum dos três campos foi preenchido.
export function wantsPasswordChange(form: ProfileForm) {
  return Boolean(form.currentPassword || form.newPassword || form.confirmPassword)
}

export function clearPasswords(form: ProfileForm): ProfileForm {
  return { ...form, currentPassword: '', newPassword: '', confirmPassword: '' }
}

// Mesmas regras do MSW (profileInputSchema e passwordChangeSchema).
export function validateProfile(form: ProfileForm): ProfileValidation {
  const errors: ProfileErrors = {}
  const profile = profileInputSchema.safeParse({
    displayName: form.displayName,
    username: form.username,
    email: form.email,
    ens: joinEns(form.ensName),
    walletAlias: form.walletAlias,
  })
  if (!profile.success)
    for (const issue of profile.error.issues) errors[formField(String(issue.path[0])) as ProfileField] ??= issue.message
  const password = wantsPasswordChange(form)
    ? passwordChangeSchema.safeParse({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword })
    : null
  if (password && !password.success)
    for (const issue of password.error.issues) errors[String(issue.path[0]) as ProfileField] ??= issue.message
  if (!profile.success || (password && !password.success)) return { ok: false, errors }
  return { ok: true, input: profile.data, password: password?.data ?? null }
}
