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

test('cupom válido, inválido e remoção atualizam a cotação', async ({ page }) => {
  await signIn(page, '/cart')
  const coupon = page.getByLabel('Código promocional')
  await coupon.fill('INVALIDO')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByRole('alert')).toContainText('Cupom inválido')
  await coupon.fill('KURIO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Remover cupom')).toBeVisible()
  await expect(page.locator('.cart-totals')).toContainText('-2.683 ETH')
  await page.getByText('Remover cupom').click()
  await expect(page.locator('.cart-totals')).toContainText('-0 ETH')
})

test('evento de NFT atualiza o item do carrinho via Socket.IO', async ({ page }) => {
  await signIn(page, '/cart')
  await expect(page.locator('.cart-line-price').first()).toHaveText('1.19 ETH')
  await page.evaluate(async () => { await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' }) })
  await expect(page.locator('.cart-line-price').first()).toHaveText('0.125 ETH')
  await expect(page.locator('.cart-notice')).toContainText('O preço ou a disponibilidade')
})

test('mudança de preço exige nova confirmação no checkout', async ({ page }) => {
  await signIn(page, '/checkout')
  await expect(page.locator('.checkout-page')).toHaveAttribute('data-realtime-connected', 'true')
  const walletAddress = page.getByLabel('Endereço da carteira')
  if (await walletAddress.isVisible()) await walletAddress.fill('0xA91F...E82C')
  await page.evaluate(async () => { await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' }) })
  await expect(page.getByRole('alert')).toContainText('Revise a cotação')
  const confirm = page.getByRole('button', { name: 'Confirmar compra' })
  await expect(confirm).toBeDisabled()
  await page.locator('.checkout-consent input').check()
  await expect(confirm).toBeEnabled()
})

test('conflito de cotação preserva o checkout e permite revisão', async ({ page }) => {
  await signIn(page, '/checkout')
  const walletAddress = page.getByLabel('Endereço da carteira')
  if (await walletAddress.isVisible()) await walletAddress.fill('0xA91F...E82C')
  await setScenario(page, 'stale-quote')
  await page.locator('.checkout-consent input').check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.locator('.checkout-error').first()).toContainText('cotação mudou')
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled()
})
