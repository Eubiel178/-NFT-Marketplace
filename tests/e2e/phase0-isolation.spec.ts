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
