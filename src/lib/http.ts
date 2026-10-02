import axios from 'axios'
import { env } from './env'

export const http = axios.create({ baseURL: env.apiUrl, timeout: 8_000, withCredentials: true })
