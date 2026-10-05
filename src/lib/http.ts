import axios from 'axios'

import { apiErrorSchema, type ApiError } from '@/contracts'

import { env } from './env'

export const http = axios.create({ baseURL: env.apiUrl, timeout: 8_000, withCredentials: true })

// Resposta 401 de qualquer chamada (menos as de autenticação, onde 401 é credencial inválida):
// quem instala o handler decide o que fazer com a sessão. O cliente HTTP só avisa.
const authPaths = ['/auth/login', '/auth/register', '/auth/logout']
let unauthorizedHandler: (() => void) | undefined

export function setUnauthorizedHandler(handler: (() => void) | undefined) {
  unauthorizedHandler = handler
}

http.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && !authPaths.includes(error.config?.url ?? '')) unauthorizedHandler?.()
  return Promise.reject(error)
})

export interface HttpErrorDetails {
  status: number | undefined
  code: ApiError['code'] | undefined
  message: ApiError['message'] | undefined
  fields: ApiError['fields'] | undefined
}

export function parseHttpError(error: unknown): HttpErrorDetails {
  const response = axios.isAxiosError(error) ? error.response : undefined
  const payload = apiErrorSchema.safeParse(response?.data)

  if (!payload.success) {
    return { status: response?.status, code: undefined, message: undefined, fields: undefined }
  }

  return { status: response?.status, code: payload.data.code, message: payload.data.message, fields: payload.data.fields }
}

export function isAxiosTimeout(error: unknown) {
  return axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
}
