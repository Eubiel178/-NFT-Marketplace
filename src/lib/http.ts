import axios from 'axios'

import { apiErrorSchema, type ApiError } from '@/contracts'

import { env } from './env'

export const http = axios.create({ baseURL: env.apiUrl, timeout: 8_000, withCredentials: true })

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
