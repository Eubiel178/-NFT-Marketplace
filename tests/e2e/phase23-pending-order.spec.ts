import { expect, placeOrder, test, type Page } from './test'

async function navigateInApp(page: Page, to: string) {
  await page.evaluate((path) => {
    history.pushState(history.state, '', path)
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
  }, to)
}

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

// Pedidos criados pela interface, contados na rede (o MSW responde cada um).
function trackOrderPosts(page: Page) {
  const statuses: number[] = []
  page.on('response', (response) => {
    const request = response.request()
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) statuses.push(response.status())
  })
  return statuses
}

async function pendingOrderIds(page: Page) {
  return page.evaluate(async () => ((await (await fetch('/api/orders?status=pending')).json()) as { items: Array<{ id: string }> }).items.map((item) => item.id))
}

async function holdOrder(page: Page) {
  await post(page, '/api/__mock/scenario', { scenario: 'payment-held' })
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  return page.url().split('/').at(-1) as string
}

test('com pedido pendente, voltar ao /checkout leva ao pedido e não cria outro POST /api/orders', async ({ page }) => {
  await signIn(page, '/checkout')
  const posts = trackOrderPosts(page)
  const orderId = await holdOrder(page)
  expect(posts).toEqual([201])

  await navigateInApp(page, '/checkout')
  await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`))
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  expect(posts).toEqual([201])

  // O pendente vem da API (MSW), não do navegador: aparece na listagem do usuário.
  expect(await pendingOrderIds(page)).toEqual([orderId])
})

test('refresh em /checkout com pedido pendente redireciona para o pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  const orderId = await holdOrder(page)

  await page.goto('/checkout')
  await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`))
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
})

test('o servidor recusa um segundo pedido enquanto há um pendente, mesmo com outra chave de idempotência', async ({ page }) => {
  await signIn(page, '/checkout')
  const orderId = await holdOrder(page)

  const result = await page.evaluate(async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'outra-chave' },
      body: JSON.stringify({
        quoteId: 'cotacao',
        quoteVersion: 1,
        walletId: 'wallet-2',
        network: 'polygon',
        collector: { displayName: 'Ana', username: 'ana', profileName: 'Ana', email: 'ana@example.test', walletAddress: '0xA91F…E82C', ens: '', referralCode: '', note: '' },
      }),
    })
    return { status: response.status, body: (await response.json()) as { code: string; fields?: { orderId: string } } }
  })
  expect(result.status).toBe(409)
  expect(result.body.code).toBe('ORDER_PENDING')
  expect(result.body.fields?.orderId).toBe(orderId)
  expect(await pendingOrderIds(page)).toEqual([orderId])
})

test('depois de confirmado, o pedido é terminal e o /checkout permite uma nova compra', async ({ page }) => {
  await signIn(page, '/checkout')
  const posts = trackOrderPosts(page)
  const orderId = await holdOrder(page)

  await post(page, '/api/__mock/scenario', { scenario: 'default' })
  await post(page, `/api/__mock/orders/${orderId}/confirm`)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  expect(await pendingOrderIds(page)).toEqual([])

  // A confirmação tirou os itens do carrinho: adiciona outro NFT e volta ao pagamento.
  expect(await post(page, '/api/cart/items', { nftId: 'nft-2', editionId: '1/1', quantity: 1 })).toBe(201)
  await navigateInApp(page, '/checkout')
  await expect(page).toHaveURL(/\/checkout$/)
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  expect(page.url().split('/').at(-1)).not.toBe(orderId)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  expect(posts).toEqual([201, 201])
})

test('depois de recusado, o pedido é terminal e o /checkout permite uma nova compra com os itens preservados', async ({ page }) => {
  await signIn(page, '/checkout')
  const posts = trackOrderPosts(page)
  const orderId = await holdOrder(page)

  await post(page, '/api/__mock/scenario', { scenario: 'default' })
  await post(page, `/api/__mock/orders/${orderId}/decline`)
  await expect(page.getByRole('heading', { name: 'Pagamento recusado' })).toBeVisible()
  expect(await pendingOrderIds(page)).toEqual([])

  await navigateInApp(page, '/checkout')
  await expect(page).toHaveURL(/\/checkout$/)
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  expect(page.url().split('/').at(-1)).not.toBe(orderId)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  expect(posts).toEqual([201, 201])
})

test('o pedido pendente de um usuário não afeta outro e volta a valer para o dono', async ({ page }) => {
  await signIn(page, '/checkout')
  const orderId = await holdOrder(page)

  // Bruno entra no mesmo navegador: o pendente da Ana não o redireciona nem aparece para ele.
  await page.goto('/login?redirect=%2Fcheckout&expired=false')
  await page.getByLabel('Email').fill('bruno@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('bruno-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(page.getByRole('heading', { name: /Seu carrinho está vazio|Pagamento com carteira/ })).toBeVisible()
  expect(await pendingOrderIds(page)).toEqual([])
  expect(await page.evaluate(async (id) => (await fetch(`/api/orders/${id}`)).status, orderId)).toBe(403)
  await expect(page).toHaveURL(/\/checkout$/)

  // A Ana volta e continua sendo levada ao pedido dela.
  await page.goto('/login?redirect=%2Fcheckout&expired=false')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`))
})
