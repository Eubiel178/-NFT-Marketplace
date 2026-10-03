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
    await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: value }) })
  }, scenario)
}

test('detalhe mantém skeleton dimensionado durante carregamento lento', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'slow'))
  await page.goto('/nfts/nft-1')
  await expect(page.getByRole('status', { name: 'Carregando NFT' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
})

test('erro de mutation do carrinho faz rollback e oferece feedback', async ({ page }) => {
  await signIn(page, '/cart')
  const quantity = page.locator('.cart-line').first().getByRole('button', { name: 'Aumentar' })
  await setScenario(page, 'cart-error')
  await quantity.evaluate((element) => (element as HTMLButtonElement).click())
  await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar a quantidade')
})

test('erro ao carregar carrinho oferece retry', async ({ page }) => {
  await signIn(page, '/cart')
  await setScenario(page, 'cart-load-error')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar o carrinho')
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
})

test('remoção de todos os itens exibe o carrinho vazio', async ({ page }) => {
  await signIn(page, '/cart')
  const lines = page.locator('.cart-line')
  await expect(lines.first()).toBeVisible()
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const count = await lines.count()
    if (count === 0) break
    await lines.first().getByRole('button', { name: /Remover/ }).click({ force: true })
    await expect.poll(() => lines.count()).toBeLessThan(count)
  }
  await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible()
})

test('resumo do carrinho comunica a cotação enquanto carrega', async ({ page }) => {
  await signIn(page, '/cart')
  await setScenario(page, 'quote-error')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar o resumo')
  await setScenario(page, 'slow')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.locator('.checkout-status')).toContainText('Calculando resumo...')
  await expect(page.locator('.cart-totals')).toHaveAttribute('aria-busy', 'true')
})

test('erro da cotação permite nova tentativa', async ({ page }) => {
  await signIn(page, '/checkout')
  await setScenario(page, 'quote-error')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a cotação')
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
})

test('falha ao carregar favoritos informa o estado do detalhe', async ({ page }) => {
  await signIn(page, '/nfts/nft-1')
  await setScenario(page, 'favorites-error')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar seus favoritos')
})

test('erro ao carregar perfil e carteiras oferece retry', async ({ page }) => {
  await signIn(page, '/profile')
  await setScenario(page, 'profile-error')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar o perfil')
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()

  await setScenario(page, 'wallets-error')
  await page.goto('/wallets')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar suas carteiras')
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Carteiras', exact: true })).toBeVisible()
})

test('falha transitória do pedido exibe retry sem tratar como 404', async ({ page }) => {
  await signIn(page, '/checkout')
  await page.locator('.checkout-consent input').check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await setScenario(page, 'order-error')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar o pedido' })).toBeVisible()
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
})
