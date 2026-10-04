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
  await expect(page.getByTestId('cart-totals')).toContainText('-2.683 ETH')
  await page.getByText('Remover cupom').click()
  await expect(page.getByTestId('cart-totals')).toContainText('-0 ETH')
})

test('evento de NFT atualiza o item do carrinho via Socket.IO', async ({ page }) => {
  await signIn(page, '/cart')
  await expect(page.getByTestId('cart-line-price').first()).toHaveText('1.19 ETH')
  await page.evaluate(async () => { await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' }) })
  await expect(page.getByTestId('cart-line-price').first()).toHaveText('0.125 ETH')
  await expect(page.getByRole('status').filter({ hasText: 'O preço ou a disponibilidade' })).toContainText('O preço ou a disponibilidade')
})

test('mudança de preço exige nova confirmação no checkout', async ({ page }) => {
  await signIn(page, '/checkout')
  await expect(page.getByTestId('checkout')).toHaveAttribute('data-realtime-connected', 'true')
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  if (await referral.isVisible()) await referral.fill('KURIO-2026')
  // Revisão aberta com a cotação vista; a mudança de preço chega pelo nft.updated.
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  const review = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(review.getByText('Total', { exact: true })).toBeVisible()
  await page.evaluate(async () => { await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' }) })
  await expect(page.getByRole('alert').filter({ hasText: 'Revise a cotação' })).toBeVisible()
  // A mudança aparece na revisão e o pedido só sai com uma nova confirmação.
  await expect(review.getByRole('alert')).toContainText('A cotação mudou')
  await expect(page).toHaveURL(/\/checkout$/)
  await review.getByRole('button', { name: 'Enviar pedido' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
})

test('conflito de cotação preserva o checkout e permite revisão', async ({ page }) => {
  await signIn(page, '/checkout')
  await setScenario(page, 'stale-quote')
  await placeOrder(page)
  const review = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(review.getByRole('alert').last()).toContainText('cotação mudou')
  // O checkout é preservado: nenhum pedido foi criado e a revisão segue aberta para nova confirmação.
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(review.getByRole('button', { name: 'Enviar pedido' })).toBeVisible()
})
