import { expect, placeOrder, test, type Page } from './test'

// Todos os eventos saem do servidor Socket.IO simulado (MSW) e chegam ao socket.io-client
// da aplicação; nenhum teste escreve em cache, setter ou callback.
async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

async function post(page: Page, path: string, body?: object) {
  return page.evaluate(
    async ({ path: url, body: payload }) => {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload ?? {}) })
      return response.status
    },
    { path, body },
  )
}

async function nftVersion(page: Page, id: string) {
  return page.evaluate(async (nftId) => ((await (await fetch(`/api/nfts/${nftId}`)).json()) as { version: number }).version, id)
}

test('nft.updated duplicado ou antigo não reaplica nem regride o preço; o payload nunca é aplicado', async ({ page }) => {
  await page.goto('/nfts/nft-1')
  const price = page.getByTestId('nft-price')
  await expect(price).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'preço atualizado' })).toHaveCount(0)

  // Evento real: muda o preço no banco, sobe a versão e chega pelo socket.
  await post(page, '/api/__mock/nfts/nft-1/update')
  await expect(price).toHaveText('0.125 ETH')
  await expect(page.getByRole('status').filter({ hasText: 'preço atualizado para 0.125 ETH' })).toBeVisible()
  const accepted = await nftVersion(page, 'nft-1')

  let detailReads = 0
  page.on('request', (request) => {
    if (request.method() === 'GET' && /\/api\/nfts\/nft-1$/.test(request.url())) detailReads += 1
  })

  // Duplicata da versão já aplicada, com um preço diferente no payload.
  expect(await post(page, '/api/__mock/nfts/nft-1/event', { version: accepted, price: '9.9' })).toBe(200)
  // Versão antiga, também com preço diferente no payload.
  expect(await post(page, '/api/__mock/nfts/nft-1/event', { version: 1, price: '7.7' })).toBe(200)
  await page.waitForTimeout(500)
  expect(detailReads).toBe(0)
  await expect(price).toHaveText('0.125 ETH')

  // Um evento mais novo é aceito: o cliente relê o REST, que continua sendo a fonte do preço.
  expect(await post(page, '/api/__mock/nfts/nft-1/event', { version: accepted + 1, price: '9.9' })).toBe(200)
  await expect.poll(() => detailReads).toBeGreaterThan(0)
  await expect(price).toHaveText('0.125 ETH')
})

test('order.updated: duplicata do evento aplicado e versão antiga não revalidam nem regridem o pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  await post(page, '/api/__mock/scenario', { scenario: 'payment-held' })
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  const pending = page.getByRole('heading', { name: 'Confirmando sua compra' })
  await expect(pending).toBeVisible()
  const orderId = page.url().split('/').at(-1)

  let orderReads = 0
  page.on('request', (request) => {
    if (request.method() === 'GET' && request.url().endsWith(`/api/orders/${orderId}`)) orderReads += 1
  })

  // Versão antiga enquanto pendente (v1 já foi vista): ignorada.
  await post(page, `/api/__mock/orders/${orderId}/event`, { version: 1, status: 'declined' })
  await page.waitForTimeout(400)
  expect(orderReads).toBe(0)
  await expect(pending).toBeVisible()

  // Transição real para confirmado (v2): relê o pedido uma vez e mostra o recibo.
  await post(page, `/api/__mock/orders/${orderId}/confirm`)
  const receipt = page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })
  await expect(receipt).toBeVisible()
  await expect.poll(() => orderReads).toBeGreaterThan(0)
  const readsAfterConfirm = orderReads

  // Duplicata da v2 e uma v1 recusada tardia: nada é relido e o estado terminal permanece.
  await post(page, `/api/__mock/orders/${orderId}/event`, { version: 2, status: 'confirmed' })
  await post(page, `/api/__mock/orders/${orderId}/event`, { version: 1, status: 'declined' })
  await page.waitForTimeout(500)
  expect(orderReads).toBe(readsAfterConfirm)
  await expect(receipt).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Pagamento recusado' })).toHaveCount(0)
})

test('queda do socket com pedido pendente: ao reconectar o pedido é recuperado, sem nova compra', async ({ page }) => {
  await signIn(page, '/checkout')
  await post(page, '/api/__mock/scenario', { scenario: 'payment-held' })

  const created: string[] = []
  page.on('response', (response) => {
    const request = response.request()
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) created.push(String(response.status()))
  })

  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  const orderUrl = page.url()
  const orderId = orderUrl.split('/').at(-1)

  // O servidor derruba a conexão e confirma o pedido enquanto o cliente está fora: o evento se perde.
  await post(page, '/api/__mock/socket/disconnect')
  await expect(page.getByRole('alert')).toContainText('conexão em tempo real')
  await post(page, `/api/__mock/orders/${orderId}/confirm`)

  // O socket.io-client reconecta sozinho e a reconciliação por REST traz o estado confirmado.
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible({ timeout: 10_000 })
  await page.reload()
  await expect(page).toHaveURL(orderUrl)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  expect(created).toEqual(['201'])
})
