import { expect, test, type Page } from './test'

async function setScenario(page: Page, scenario: string) {
  await page.evaluate(async (value) => {
    await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: value }) })
  }, scenario)
}

async function navigateInApp(page: Page, path: string) {
  await page.evaluate((to) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, path)
}

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('unauthorized: visitante recebe 401 no catálogo sem ser tratado como sessão expirada e se recupera', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()

  await setScenario(page, 'unauthorized')
  await navigateInApp(page, '/?q=Golden')
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a Home')
  await expect(page).not.toHaveURL(/\/login/)

  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('link', { name: /Golden Signal #160/ }).first()).toBeVisible()
})

test('unauthorized: com usuário na sessão, o 401 descarta a sessão e o login devolve ao destino', async ({ page }) => {
  await signIn(page, '/profile')
  await navigateInApp(page, '/')
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
  await page.evaluate(() => {
    ;(window as unknown as { __sameDocument: boolean }).__sameDocument = true
  })

  await setScenario(page, 'unauthorized')
  await navigateInApp(page, '/?sort=name')
  await expect(page).toHaveURL(/\/login\?redirect=.*sort%3Dname.*&expired=true|\/login\?redirect=.*sort=name.*&expired=true/)
  await expect(page.getByRole('alert')).toContainText('Sua sessão expirou')
  expect(await page.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument === true)).toBe(true)

  await setScenario(page, 'default')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/sort=name/)
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' }).getByRole('link').first()).toBeVisible()
})

test('wallet-rejected: a carteira recusa a conexão, a compra fica bloqueada e a nova tentativa conecta', async ({ page }) => {
  await signIn(page, '/checkout')
  await expect(page.getByText(/conectada$/).first()).toBeVisible()

  await page.getByRole('button', { name: 'Desconectar' }).click()
  await expect(page.getByText('Carteira desconectada')).toBeVisible()

  await setScenario(page, 'wallet-rejected')
  await page.getByRole('button', { name: 'Conectar', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'A conexão foi recusada' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled()

  await setScenario(page, 'default')
  await page.getByRole('button', { name: 'Tentar de novo' }).click()
  await expect(page.getByText(/conectada$/).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled()
})
