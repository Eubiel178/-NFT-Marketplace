import type { Eth } from '@/contracts'

// "12.3" → "12,30": vírgula decimal e ao menos duas casas, sem passar por float.
export function formatEthLabel(value: Eth) {
  const [whole, fraction = ''] = value.split('.')
  return `${whole},${fraction.padEnd(2, '0')}`
}
