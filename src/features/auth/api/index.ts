import { sessionSchema } from '@/contracts'
import { http } from '@/lib/http'

export interface LoginInput { email: string; password: string }
export interface RegisterInput { username: string; email: string; password: string; confirmPassword: string }

export async function login(input: LoginInput) {
  return sessionSchema.parse((await http.post('/auth/login', input)).data)
}

export async function register(input: RegisterInput) {
  return sessionSchema.parse((await http.post('/auth/register', input)).data)
}

export async function logout() {
  await http.post('/auth/logout')
}
