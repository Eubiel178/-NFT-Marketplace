import { expect, placeOrder, test, type Page } from './test'

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('carteira secundária copia a principal e rejeita endereço inválido', async ({ page }) => {
  await signIn(page, '/wallets')
  const secondary = page.getByRole('region', { name: 'Carteira secundária' })
  await secondary.getByLabel('Igual à carteira principal').check()
  await expect(secondary.getByLabel('Endereço da carteira')).toHaveValue('0xA91F…E82C')

  const status = await page.evaluate(async () => {
    const response = await fetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Inválida', alias: '', address: '0xB', network: 'ethereum', label: '', tag: '', ens: '' }),
    })
    return response.status
  })
  expect(status).toBe(422)
})

test('evento de pedido duplicado ou antigo não revalida o pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()

  let orderReads = 0
  page.on('request', (request) => { if (request.url().includes('/api/orders/order-')) orderReads += 1 })
  const orderId = page.url().split('/').at(-1)
  await page.evaluate(async (id) => {
    await fetch(`/api/__mock/orders/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1, status: 'pending' }),
    })
  }, orderId)
  await page.waitForTimeout(250)
  expect(orderReads).toBe(0)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
})

test('pedido pendente é recuperado por REST após a conexão Socket.IO cair', async ({ page }) => {
  await signIn(page, '/checkout')
  await page.evaluate(async () => {
    await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: 'payment-pending' }) })
  })
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  await page.evaluate(async () => { await fetch('/api/__mock/socket/disconnect', { method: 'POST' }) })
  await expect(page.getByRole('alert')).toContainText('conexão em tempo real')
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible({ timeout: 5_000 })
})
