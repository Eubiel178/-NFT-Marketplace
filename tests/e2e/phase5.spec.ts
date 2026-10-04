import { expect, placeOrder, test } from './test'

async function signIn(page: import('@playwright/test').Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect.replace('/', '\\/')}$`))
}

test('compra autenticada do carrinho à confirmação', async ({ page }) => {
  await signIn(page, '/cart')
  await expect(page.getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
  await expect(page.getByText('Resumo da carteira')).toBeVisible()
  await page.getByRole('button', { name: /Conectar e finalizar/ }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(page.getByRole('heading', { name: 'Pagamento com carteira' })).toBeVisible()
  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Ver no Etherscan/ })).toHaveAttribute('target', '_blank')
})

test('perfil e carteiras carregam e aceitam alterações', async ({ page }) => {
  await signIn(page, '/profile')
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await page.getByLabel('Nome de exibição').fill('Ana Colecionadora')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Alterações salvas' })).toBeVisible()
  await page.goto('/wallets')
  await expect(page.getByRole('heading', { name: 'Carteiras', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Carteira principal', exact: true })).toBeVisible()
})
