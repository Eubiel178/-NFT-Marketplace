import { expect, test, type Page } from './test'

async function setScenario(page: Page, scenario: string) {
  await page.evaluate(async (value) => {
    await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: value }) })
  }, scenario)
}

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('timeout no catálogo: a conexão não responde, a tela mostra o erro e "Tentar novamente" recupera', async ({ page }) => {
  // 8 s do Axios + 1 retry automático (query.ts) antes de o erro aparecer.
  test.setTimeout(90_000)
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'timeout'))
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a Home', { timeout: 40_000 })
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
})

test('conexão indisponível no catálogo: erro, "Tentar novamente" e recuperação', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'network-error'))
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a Home')
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
})

test('as condições de rede também valem para o detalhe, o carrinho e o perfil', async ({ page }) => {
  await signIn(page, '/cart')
  await setScenario(page, 'http-500')
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar o carrinho')
  await page.goto('/profile')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar o perfil')
  await page.goto('/nfts/nft-1')
  await expect(page.getByRole('alert')).toBeVisible()
  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
})
