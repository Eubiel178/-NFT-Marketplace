import { expect, placeOrder, test } from './test'

async function screenshot(page: import('@playwright/test').Page, name: string) {
  await page.screenshot({ animations: 'disabled', fullPage: true, path: `reports/screenshots/phase5-${name}-${page.viewportSize()?.width}.png` })
}

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0))
}

async function waitForAuthBackground(page: import('@playwright/test').Page) {
  if ((page.viewportSize()?.width ?? 0) >= 640) await expect(page.getByTestId('auth-background').locator('#home-hero-title')).toBeVisible()
}

test('telas restantes nos viewports oficiais @visual', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await waitForAuthBackground(page)
  await screenshot(page, 'login')
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: 'Criar perfil de colecionador' })).toBeVisible()
  await waitForAuthBackground(page)
  await screenshot(page, 'register')
  await page.goto('/login?redirect=%2Fcart')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('img')).toHaveCount(3)
  // A seção não existe no frame mobile do carrinho: a contagem vale só a partir de 640px.
  if ((page.viewportSize()?.width ?? 0) >= 640) await expect(page.getByRole('region', { name: 'Colecionadores também viram' }).getByRole('link')).toHaveCount(5)
  await waitForImages(page)
  await screenshot(page, 'cart')
  await page.getByRole('button', { name: /Conectar e finalizar/ }).click()
  await page.getByText(/conectada$/).first().waitFor()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled()
  await screenshot(page, 'checkout')
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await waitForImages(page)
  await screenshot(page, 'order-confirmation')
  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await screenshot(page, 'profile')
  await page.goto('/wallets')
  await expect(page.getByRole('heading', { name: 'Carteiras', exact: true })).toBeVisible()
  await screenshot(page, 'wallets')
})
