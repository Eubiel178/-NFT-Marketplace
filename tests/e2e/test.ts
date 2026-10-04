import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await page.evaluate(async () => {
      await fetch('/api/__mock/reset', { method: 'POST' })
    })
    await use(page)
  },
})

// Fluxo de pagamento: espera a carteira conectar, preenche o código de indicação
// (campo obrigatório no desktop), abre a revisão e envia o pedido.
export async function placeOrder(page: Page) {
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  if (await referral.isVisible()) await referral.fill('KURIO-2026')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await page.getByRole('dialog', { name: 'Revise sua compra' }).getByRole('button', { name: 'Enviar pedido' }).click()
}

export { expect }
export type { Page }
