import { ethSchema, type Eth } from '@/contracts'

export function toWei(value: Eth): bigint {
  const [whole, fraction = ''] = ethSchema.parse(value).split('.')
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'))
}

export function fromWei(value: bigint): Eth {
  if (value < 0n) throw new Error('ETH não pode ser negativo')
  const fraction = (value % 10n ** 18n).toString().padStart(18, '0').replace(/0+$/, '')
  return `${value / 10n ** 18n}${fraction ? `.${fraction}` : ''}`
}
