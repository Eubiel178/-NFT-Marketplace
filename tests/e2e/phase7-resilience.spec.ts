import { expect, test } from './test'

async function signIn(page: import('@playwright/test').Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect.replace('/', '\\/')}$`))
}

async function setScenario(page: import('@playwright/test').Page, scenario: string) {
  await page.evaluate(async (value) => {
    await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: value }) })
  }, scenario)
}

test('favorito persiste e faz rollback quando a API falha', async ({ page }) => {
  await signIn(page, '/nfts/nft-1')
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await page.screenshot({ animations: 'disabled', fullPage: true, path: `reports/screenshots/phase7-detail-favorite-${page.viewportSize()?.width}.png` })
  const favoriteButton = page.locator('[data-favorite-trigger="true"]:visible')
  await favoriteButton.click()
  await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.locator('[data-favorite-trigger="true"]:visible')).toHaveAttribute('aria-pressed', 'true')

  await setScenario(page, 'favorites-error')
  await page.locator('[data-favorite-trigger="true"]:visible').click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar os favoritos')
  await expect(page.locator('[data-favorite-trigger="true"]:visible')).toHaveAttribute('aria-pressed', 'true')
})

test('merge preserva o item adicionado pelo visitante ao autenticar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
  const visitorCart = await page.evaluate(async () => {
    const response = await fetch('/api/cart/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nftId: 'nft-2', editionId: '1/1', quantity: 1 }) })
    const text = await response.text()
    return { status: response.status, body: text ? JSON.parse(text) as { items: Array<{ nftId: string }> } : null }
  })
  expect(visitorCart.status).toBe(201)
  expect(visitorCart.body?.items.some((item) => item.nftId === 'nft-2')).toBe(true)
  await signIn(page, '/cart')
  await expect(page.getByRole('link', { name: /Sage Nomad #009/ })).toBeVisible()
})

test('pagamento recusado preserva o carrinho', async ({ page }) => {
  await signIn(page, '/checkout')
  await setScenario(page, 'payment-declined')
  const walletAddress = page.getByLabel('Endereço da carteira')
  if (await walletAddress.isVisible()) await walletAddress.fill('0xA91F...E82C')
  await page.locator('.checkout-consent input').check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByRole('heading', { name: 'Pagamento recusado' })).toBeVisible()
  await page.getByRole('link', { name: 'Voltar ao carrinho' }).click()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ })).toBeVisible()
})

test('timeout recupera o mesmo pedido e a confirmação chega pelo fluxo Socket.IO', async ({ page }) => {
  await signIn(page, '/checkout')
  await setScenario(page, 'payment-timeout')
  const walletAddress = page.getByLabel('Endereço da carteira')
  if (await walletAddress.isVisible()) await walletAddress.fill('0xA91F...E82C')
  await page.locator('.checkout-consent input').check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible({ timeout: 5000 })
})

test('chave de idempotência recupera o pedido e rejeita payload diferente', async ({ page }) => {
  await signIn(page, '/checkout')
  const result = await page.evaluate(async () => {
    const quoteResponse = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ nftId: 'nft-1', editionId: '1/1', quantity: 1 }] }) })
    const quote = await quoteResponse.json() as { id: string; version: number }
    const headers = { 'Content-Type': 'application/json', 'Idempotency-Key': 'phase7-idempotency' }
    const body = JSON.stringify({ quoteId: quote.id, quoteVersion: quote.version, walletId: 'wallet-1', network: 'ethereum' })
    const first = await fetch('/api/orders', { method: 'POST', headers, body })
    const firstBody = await first.json() as { id: string }
    const second = await fetch('/api/orders', { method: 'POST', headers, body })
    const conflict = await fetch('/api/orders', { method: 'POST', headers, body: JSON.stringify({ quoteId: quote.id, quoteVersion: quote.version, walletId: 'wallet-2', network: 'polygon' }) })
    return { firstStatus: first.status, secondStatus: second.status, sameId: firstBody.id === (await second.json() as { id: string }).id, conflictStatus: conflict.status }
  })
  expect(result).toEqual({ firstStatus: 201, secondStatus: 200, sameId: true, conflictStatus: 409 })
})

test('cadastro associa erro de confirmação de senha ao campo', async ({ page }) => {
  await page.goto('/register')
  await page.getByLabel('Nome de usuário').fill('Validação')
  await page.getByLabel('Email').fill('validacao@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('senha-valida')
  await page.getByRole('textbox', { name: 'Confirmar senha' }).fill('senha-diferente')
  await page.getByRole('button', { name: 'Criar perfil' }).click()
  await expect(page.getByText('As senhas precisam ser iguais', { exact: true })).toBeVisible()
})

test('handler privado diferencia falta de permissão com 403', async ({ page }) => {
  await signIn(page, '/profile')
  const status = await page.evaluate(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'bruno@example.test', password: 'bruno-demo' }) })
    const response = await fetch('/api/wallets/wallet-1', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Invasão', alias: '', address: '0xB', network: 'ethereum', label: '', tag: '', ens: '' }) })
    return response.status
  })
  expect(status).toBe(403)
})
