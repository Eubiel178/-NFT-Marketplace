export type AuthMode = 'login' | 'register'

export interface AuthValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type AuthField = keyof AuthValues
export type AuthErrors = Partial<Record<AuthField, string>>

export const emptyAuthValues: AuthValues = { username: '', email: '', password: '', confirmPassword: '' }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mesmas regras do MSW (loginBodySchema e registerBodySchema), com mensagens por campo.
export function validateAuth(mode: AuthMode, values: AuthValues): AuthErrors {
  const errors: AuthErrors = {}
  if (!emailPattern.test(values.email.trim())) errors.email = 'Informe um email válido'
  if (mode === 'login') {
    if (!values.password) errors.password = 'Informe sua senha'
    return errors
  }
  if (values.username.trim().length < 3) errors.username = 'Use pelo menos 3 caracteres'
  if (values.password.length < 8) errors.password = 'Use pelo menos 8 caracteres'
  if (!values.confirmPassword) errors.confirmPassword = 'Confirme sua senha'
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'As senhas precisam ser iguais'
  return errors
}

// Destino depois do login: só caminhos internos ("/..."), nunca outra origem ("//..." ou URL absoluta).
export function safeRedirect(redirect: string | undefined) {
  return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
}
