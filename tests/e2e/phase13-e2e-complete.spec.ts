import { expect, placeOrder, test, type Page } from './test'

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

async function setScenario(page: Page, scenario: string) {
  await page.evaluate(async (value) => {
    await fetch('/api/__mock/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: value }),
    })
  }, scenario)
}

async function addCurrentNftToCart(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const desktopButton = page.getByRole('button', { name: 'COMPRAR', exact: true })
  if (await desktopButton.isVisible()) {
    await desktopButton.click()
    return
  }
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
}

test('carrinho altera, remove e persiste cupom pela interface', async ({ page }) => {
  await signIn(page, '/cart')

  await expect(page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('listitem').first()).toBeVisible()
  const initialLineCount = await page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('listitem').count()
  const firstLine = page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('listitem').first()
  const firstName = await firstLine.locator('strong').first().innerText()
  const increase = firstLine.getByRole('button', { name: 'Aumentar' })

  await increase.focus()
  const updateResponse = page.waitForResponse((response) => response.url().endsWith('/api/cart/items/nft-1') && response.request().method() === 'PATCH' && response.status() === 200)
  await increase.press('Enter')
  await expect(firstLine.locator('output')).toHaveText('3')
  await updateResponse

  const remove = firstLine.getByRole('button', { name: new RegExp(`Remover ${firstName}`) })
  await remove.focus()
  await remove.press('Enter')
  await expect(page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('listitem')).toHaveCount(initialLineCount - 1)

  const coupon = page.getByLabel('Código promocional')
  await coupon.fill('KURIO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Remover cupom')).toBeVisible()
  await expect(page.getByTestId('cart-totals')).not.toContainText('-0 ETH')

  await page.reload()
  await expect(coupon).toHaveValue('KURIO10')
  await expect(page.getByText('Remover cupom')).toBeVisible()
})

test('carrinho de visitante é preservado ao autenticar pela interface', async ({ page }) => {
  await page.goto('/nfts/nft-2')
  await expect(page.getByRole('heading', { name: 'Sage Nomad #009' })).toBeVisible()
  await addCurrentNftToCart(page)
  await expect(page).toHaveURL(/\/cart$/)

  await signIn(page, '/cart')
  await expect(page.getByRole('link', { name: /Sage Nomad #009/ })).toBeVisible()
})

test('compra começa no detalhe e exibe recibo com snapshot após atualização do catálogo', async ({ page }) => {
  await page.goto('/nfts/nft-1')
  await addCurrentNftToCart(page)
  await expect(page).toHaveURL(/\/cart$/)

  await page.goto('/login?redirect=%2Fcheckout&expired=false')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/checkout$/)

  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  await expect(page.getByText('ID da transação')).toBeVisible()
  await expect(page.getByText('Taxa de rede')).toBeVisible()

  const receiptTotal = await page.getByTestId('order-total').innerText()
  const receiptLine = page.getByRole('list', { name: 'NFTs comprados' }).getByRole('listitem').first()
  const receiptName = await receiptLine.getByTestId('receipt-name').innerText()
  const receiptQuantity = await receiptLine.getByTestId('receipt-quantity').innerText()
  const receiptItemTotal = await receiptLine.getByTestId('receipt-total').innerText()
  await page.evaluate(async () => {
    await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' })
  })
  await page.reload()

  await expect(page.getByTestId('order-total')).toHaveText(receiptTotal)
  const reloadedReceiptLine = page.getByRole('list', { name: 'NFTs comprados' }).getByRole('listitem').first()
  await expect(reloadedReceiptLine.getByTestId('receipt-name')).toHaveText(receiptName)
  await expect(reloadedReceiptLine.getByTestId('receipt-quantity')).toHaveText(receiptQuantity)
  await expect(reloadedReceiptLine.getByTestId('receipt-total')).toHaveText(receiptItemTotal)
})

test('clique repetido no checkout cria apenas um pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  if (await referral.isVisible()) await referral.fill('KURIO-2026')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  let orderRequests = 0
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) orderRequests += 1
  })

  const confirm = page.getByRole('dialog', { name: 'Revise sua compra' }).getByRole('button', { name: 'Enviar pedido' })
  await Promise.all([
    page.waitForURL(/\/orders\/order-/),
    confirm.dblclick(),
  ])

  expect(orderRequests).toBe(1)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
})

test('timeout recarrega e recupera o mesmo pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  await setScenario(page, 'payment-timeout')
  await placeOrder(page)

  await expect(page).toHaveURL(/\/orders\/order-/)
  const orderUrl = page.url()
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  await page.reload()
  await expect(page).toHaveURL(orderUrl)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible({ timeout: 10_000 })
})

test('carteira inválida exibe erro e edição persiste pela interface', async ({ page }) => {
  await signIn(page, '/wallets')
  const primary = page.getByRole('form', { name: 'Carteira principal' })

  await primary.getByLabel('Endereço da carteira').fill('0xB')
  await primary.getByRole('button', { name: 'Salvar carteira' }).click()
  await expect(primary.getByText('Informe um endereço 0x válido')).toBeVisible()

  await primary.getByLabel('Endereço da carteira').fill('0xA91F...E82C')
  await primary.getByLabel('Apelido da carteira').fill('Principal atualizada')
  const saveResponse = page.waitForResponse((response) => response.url().endsWith('/api/wallets/wallet-1') && response.request().method() === 'PATCH' && response.status() === 200)
  await primary.getByRole('button', { name: 'Salvar carteira' }).click()
  await saveResponse
  await expect(primary.getByLabel('Apelido da carteira')).toHaveValue('Principal atualizada')

  await page.reload()
  await expect(page.getByRole('form', { name: 'Carteira principal' }).getByLabel('Apelido da carteira')).toHaveValue('Principal atualizada')
})

test('falha de rede no catálogo oferece recuperação por retry', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'network-error'))
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a Home')
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
})

test('evento novo seguido de evento antigo não regride o recibo', async ({ page }) => {
  await signIn(page, '/checkout')
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()

  const orderId = page.url().split('/').at(-1)
  const refetch = page.waitForResponse((response) => response.url().includes(`/api/orders/${orderId}`))
  await page.evaluate(async (id) => {
    await fetch(`/api/__mock/orders/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 2, status: 'pending' }),
    })
  }, orderId)
  await refetch

  await page.evaluate(async (id) => {
    await fetch(`/api/__mock/orders/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1, status: 'declined' }),
    })
  }, orderId)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
})
