import { expect, test, type Page } from './test'

async function navigateInApp(page: Page, to: string) {
  await page.evaluate((path) => {
    history.pushState(history.state, '', path)
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
  }, to)
}

async function submitLogin(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email)
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

// Conexões Socket.IO abertas, contadas pelo servidor simulado do MSW.
function openSockets(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/__mock/socket/clients')
    return ((await response.json()) as { open: number }).open
  })
}

async function expectSingleSocket(page: Page) {
  await expect.poll(() => openSockets(page)).toBe(1)
  await page.waitForTimeout(300)
  expect(await openSockets(page)).toBe(1)
}

test('uma única conexão Socket.IO atende catálogo, carrinho, checkout e pedido', async ({ page }) => {
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
  await expectSingleSocket(page)

  await navigateInApp(page, '/login?redirect=%2Fcart&expired=false')
  await submitLogin(page, 'ana@example.test', 'kurio-demo')
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ })).toBeVisible()
  await expectSingleSocket(page)

  await navigateInApp(page, '/checkout')
  await expect(page.locator('[data-realtime-connected="true"]')).toBeVisible()
  await expectSingleSocket(page)

  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  await expectSingleSocket(page)
})

test('troca de usuário descarta a assinatura de pedido da sessão anterior', async ({ page }) => {
  await page.goto('/login?redirect=%2Fcheckout&expired=false')
  await submitLogin(page, 'ana@example.test', 'kurio-demo')
  await expect(page).toHaveURL(/\/checkout$/)
  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  const orderId = page.url().split('/').at(-1)

  await navigateInApp(page, '/login?redirect=%2F&expired=false')
  await submitLogin(page, 'bruno@example.test', 'bruno-demo')
  await expect(page).toHaveURL(/:4173\/(\?.*)?$/)
  await expectSingleSocket(page)

  let orderReads = 0
  page.on('request', (request) => { if (request.url().includes(`/api/orders/${orderId}`)) orderReads += 1 })
  const event = await page.evaluate(async (id) => {
    const response = await fetch(`/api/__mock/orders/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 5, status: 'declined' }),
    })
    return response.status
  }, orderId)
  expect(event).toBe(200)
  await page.waitForTimeout(500)
  expect(orderReads).toBe(0)
})
