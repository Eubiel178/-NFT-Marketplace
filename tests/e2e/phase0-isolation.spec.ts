import { expect, test, type Page } from './test'

// Navegação client-side: mantém o QueryClient em memória, para provar que o
// cache da sessão anterior não atende o próximo usuário.
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

test('carrinho em cache da Ana não aparece para Bruno após troca de usuário sem recarregar', async ({ page }) => {
  await page.goto('/login?redirect=%2Fcart&expired=false')
  await submitLogin(page, 'ana@example.test', 'kurio-demo')
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ })).toBeVisible()
  await page.evaluate(() => { (window as Window & { sameDocument?: boolean }).sameDocument = true })

  await navigateInApp(page, '/login?redirect=%2Fcart&expired=false')
  await submitLogin(page, 'bruno@example.test', 'bruno-demo')
  await expect(page).toHaveURL(/\/cart$/)

  await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ })).toHaveCount(0)
  expect(await page.evaluate(() => (window as Window & { sameDocument?: boolean }).sameDocument)).toBe(true)
})

async function applyAnaCoupon(page: Page) {
  await page.goto('/login?redirect=%2Fcart&expired=false')
  await submitLogin(page, 'ana@example.test', 'kurio-demo')
  await expect(page).toHaveURL(/\/cart$/)
  await page.getByLabel('Código promocional').fill('KURIO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Remover cupom')).toBeVisible()
  // "Remover cupom" aparece assim que o campo tem texto; o cupom só está
  // aplicado quando a cotação traz desconto.
  await expect(page.getByTestId('cart-totals')).not.toContainText('-0 ETH')
}

function storedCheckoutItems(page: Page) {
  return page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('nft-marketplace:checkout-')))
}

test('cupom da Ana fica restrito a ela e é apagado na troca de usuário', async ({ page }) => {
  await applyAnaCoupon(page)
  expect(await storedCheckoutItems(page)).toEqual(['nft-marketplace:checkout-coupon:collector-1'])

  await navigateInApp(page, '/login?redirect=%2Fcart&expired=false')
  await submitLogin(page, 'bruno@example.test', 'bruno-demo')
  await expect(page).toHaveURL(/\/cart$/)
  expect(await storedCheckoutItems(page)).toEqual([])

  await page.evaluate(async () => {
    await fetch('/api/cart/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nftId: 'nft-2', editionId: '1/1', quantity: 1 }) })
  })
  await page.reload()
  await expect(page.getByRole('link', { name: /Sage Nomad #009/ })).toBeVisible()
  await expect(page.getByLabel('Código promocional')).toHaveValue('')
  await expect(page.getByText('Remover cupom')).toHaveCount(0)
})

test('logout apaga cupom e chave de idempotência do usuário', async ({ page }) => {
  await applyAnaCoupon(page)
  await page.goto('/checkout')
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
  expect((await storedCheckoutItems(page)).sort()).toEqual([
    'nft-marketplace:checkout-coupon:collector-1',
    'nft-marketplace:checkout-idempotency:collector-1',
  ])

  await page.goto('/profile')
  await page.getByRole('complementary', { name: 'Navegação da conta' }).getByRole('button', { name: 'Sair' }).click()
  await expect(page).toHaveURL(/\/$/)
  expect(await storedCheckoutItems(page)).toEqual([])
})
