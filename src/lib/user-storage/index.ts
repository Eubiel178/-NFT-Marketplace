// Preferências de checkout persistidas por usuário, para que outra sessão no
// mesmo navegador nunca reaproveite cupom ou chave de idempotência alheios.
const items = ['checkout-coupon', 'checkout-idempotency'] as const

type UserStorageItem = (typeof items)[number]

function storageKey(item: UserStorageItem, userId: string) {
  return `nft-marketplace:${item}:${userId}`
}

export function readUserItem(item: UserStorageItem, userId: string) {
  return localStorage.getItem(storageKey(item, userId))
}

export function writeUserItem(item: UserStorageItem, userId: string, value: string) {
  localStorage.setItem(storageKey(item, userId), value)
}

export function removeUserItem(item: UserStorageItem, userId: string) {
  localStorage.removeItem(storageKey(item, userId))
}

export function clearUserItems(userId: string) {
  for (const item of items) removeUserItem(item, userId)
}
