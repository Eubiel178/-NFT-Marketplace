import { expect, test, type Page } from './test'

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
  await expect(page.locator('.nft-detail-summary h1')).toBeVisible()
  const desktopButton = page.getByRole('button', { name: 'COMPRAR', exact: true })
  if (await desktopButton.isVisible()) {
    await desktopButton.click()
    return
  }
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
}

test('carrinho altera, remove e persiste cupom pela interface', async ({ page }) => {
  await signIn(page, '/cart')

  await expect(page.locator('.cart-line').first()).toBeVisible()
  const initialLineCount = await page.locator('.cart-line').count()
  const firstLine = page.locator('.cart-line').first()
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
  await expect(page.locator('.cart-line')).toHaveCount(initialLineCount - 1)

  const coupon = page.getByLabel('Código promocional')
  await coupon.fill('KURIO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Remover cupom')).toBeVisible()
  await expect(page.locator('.cart-totals')).not.toContainText('-0 ETH')

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

  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  await expect(page.getByText('ID da transação')).toBeVisible()
  await expect(page.getByText('Taxa de rede')).toBeVisible()

  const receiptTotal = await page.locator('.order-totals dd').last().innerText()
  const receiptLine = page.locator('.order-line').first()
  const receiptName = await receiptLine.locator('div > span').innerText()
  const receiptQuantity = await receiptLine.locator(':scope > span').innerText()
  const receiptItemTotal = await receiptLine.locator(':scope > strong').innerText()
  await page.evaluate(async () => {
    await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' })
  })
  await page.reload()

  await expect(page.locator('.order-totals dd').last()).toHaveText(receiptTotal)
  const reloadedReceiptLine = page.locator('.order-line').first()
  await expect(reloadedReceiptLine.locator('div > span')).toHaveText(receiptName)
  await expect(reloadedReceiptLine.locator(':scope > span')).toHaveText(receiptQuantity)
  await expect(reloadedReceiptLine.locator(':scope > strong')).toHaveText(receiptItemTotal)
})

test('clique repetido no checkout cria apenas um pedido', async ({ page }) => {
  await signIn(page, '/checkout')
  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()

  let orderRequests = 0
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) orderRequests += 1
  })

  const confirm = page.getByRole('button', { name: 'Confirmar compra' })
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
  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(page).toHaveURL(/\/orders\/order-/)
  const orderUrl = page.url()
  await expect(page.getByRole('heading', { name: 'Confirmando sua compra' })).toBeVisible()
  await page.reload()
  await expect(page).toHaveURL(orderUrl)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible({ timeout: 10_000 })
})

test('carteira inválida exibe erro e edição persiste pela interface', async ({ page }) => {
  await signIn(page, '/wallets')
  const primary = page.locator('.wallet-section')
  const walletSelect = primary.getByRole('combobox', { name: 'Carteira' })

  await walletSelect.press('Enter')
  await page.getByRole('option', { name: 'Principal' }).press('Enter')
  await primary.getByLabel('Endereço 0x da carteira').fill('0xB')
  await primary.getByRole('button', { name: 'Salvar carteira' }).click()
  await expect(page.getByRole('alert')).toContainText('Confira os dados da carteira')

  await primary.getByLabel('Endereço 0x da carteira').fill('0xA91F...E82C')
  await primary.getByLabel('Apelido').fill('Principal atualizada')
  const saveResponse = page.waitForResponse((response) => response.url().endsWith('/api/wallets/wallet-1') && response.request().method() === 'PATCH' && response.status() === 200)
  await primary.getByRole('button', { name: 'Salvar carteira' }).click()
  await saveResponse
  await expect(primary.getByLabel('Apelido')).toHaveValue('Principal atualizada')

  await page.reload()
  const reloadedPrimary = page.locator('.wallet-section')
  const reloadedWalletSelect = reloadedPrimary.getByRole('combobox', { name: 'Carteira' })
  await expect(reloadedWalletSelect).toBeVisible()
  await expect(reloadedWalletSelect).toHaveText('Selecione uma carteira')
  await reloadedWalletSelect.press('Enter')
  await page.getByRole('option', { name: 'Principal' }).press('Enter')
  await expect(reloadedWalletSelect).toHaveText('Principal')
  await expect(reloadedPrimary.getByLabel('Apelido')).toHaveValue('Principal atualizada')
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
  await page.getByRole('checkbox', { name: /Confirmo que os dados/ }).check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
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
