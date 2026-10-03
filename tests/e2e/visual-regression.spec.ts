import { expect, test, type Page } from './test'

async function reset(page: Page) {
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Marketplace de NFTs' })).toBeVisible()
}

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('home mantém baseline visual @visual', async ({ page }) => {
  await reset(page)
  await expect(page.getByRole('heading', { name: 'Marketplace de NFTs' })).toBeVisible()
  await expect(page).toHaveScreenshot('home.png', { animations: 'disabled', fullPage: true })
})

test('detalhe mantém baseline visual @visual', async ({ page }) => {
  await reset(page)
  await page.goto('/nfts/nft-1')
  await expect(page).toHaveURL(/\/nfts\/nft-1$/)
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(page).toHaveScreenshot('detail.png', { animations: 'disabled', fullPage: true })
})

test('carrinho mantém baseline visual @visual', async ({ page }) => {
  await reset(page)
  await signIn(page, '/cart')
  await expect(page.getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
  await expect(page).toHaveScreenshot('cart.png', { animations: 'disabled', fullPage: true })
})

test('pagamento mantém baseline visual @visual', async ({ page }) => {
  await reset(page)
  await signIn(page, '/checkout')
  await expect(page.getByRole('heading', { name: 'Pagamento com carteira' })).toBeVisible()
  await expect(page).toHaveScreenshot('checkout.png', { animations: 'disabled', fullPage: true })
})
