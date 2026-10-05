import { expect, test, type Page } from './test'

// Navega sem recarregar a página; o marcador prova que o documento é o mesmo.
async function markDocument(page: Page) {
  await page.evaluate(() => {
    ;(window as unknown as { __sameDocument: boolean }).__sameDocument = true
  })
}

async function isSameDocument(page: Page) {
  return page.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument === true)
}

async function navigateInApp(page: Page, path: string) {
  await page.evaluate((to) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, path)
}

async function expireSession(page: Page) {
  await page.evaluate(async () => {
    await fetch('/api/__mock/session/expire', { method: 'POST' })
  })
}

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

async function loginAgain(page: Page) {
  await expect(page.getByRole('alert')).toContainText('Sua sessão expirou')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('paginação compõe a URL, cabe na tela e o histórico restaura a página', async ({ page }) => {
  await page.goto('/')
  const pagination = page.getByRole('navigation', { name: 'Paginação' })
  await expect(pagination).toBeVisible()
  const firstName = () => page.getByRole('list', { name: 'NFTs do catálogo' }).getByRole('link').first().innerText()
  const firstOnPage1 = await firstName()

  await pagination.getByRole('button', { name: 'Página 2', exact: true }).click()
  await expect(page).toHaveURL(/page=2/)
  await expect(pagination.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect.poll(firstName).not.toBe(firstOnPage1)

  await page.getByRole('button', { name: 'Próxima página' }).click()
  await expect(page).toHaveURL(/page=3/)

  // Nenhum overflow horizontal com a paginação visível (390 inclusive).
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.goBack()
  await expect(page).toHaveURL(/page=2/)
  await expect(pagination.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.goBack()
  await expect(pagination.getByRole('button', { name: 'Página 1', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect.poll(firstName).toBe(firstOnPage1)

  await page.goto('/?page=3')
  await expect(page.getByRole('navigation', { name: 'Paginação' }).getByRole('button', { name: 'Página 3', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('sessão expira durante a navegação, sem recarregar, e volta ao destino depois do login', async ({ page }) => {
  await signIn(page, '/profile')
  await markDocument(page)
  await expireSession(page)

  await navigateInApp(page, '/wallets')
  await expect(page).toHaveURL(/\/login\?redirect=%2Fwallets&expired=true/)
  expect(await isSameDocument(page)).toBe(true)

  await loginAgain(page)
  await expect(page).toHaveURL(/\/wallets$/)
  await expect(page.getByRole('region', { name: 'Carteira secundária' })).toBeVisible()
  expect(await isSameDocument(page)).toBe(true)
})

test('401 em uma ação da própria página descarta a sessão e leva ao login sem recarregar', async ({ page }) => {
  await signIn(page, '/profile')
  // A tela carrega por rota (chunk próprio): só expira a sessão com o perfil já na tela.
  const form = page.getByRole('form', { name: 'Perfil do colecionador' })
  await expect(form).toBeVisible()
  await markDocument(page)
  await expireSession(page)

  await form.getByLabel('Nome de exibição').fill('Ana Expirada')
  await form.getByRole('button', { name: 'Salvar' }).click()

  await expect(page).toHaveURL(/\/login\?redirect=%2Fprofile&expired=true/)
  expect(await isSameDocument(page)).toBe(true)
  // Nada do usuário anterior fica no cache: o perfil não foi alterado no servidor.
  await loginAgain(page)
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('form', { name: 'Perfil do colecionador' }).getByLabel('Nome de exibição')).not.toHaveValue('Ana Expirada')
})

test('sessão expira ao enviar o pedido: login retoma formulário e revisão sem pedido duplicado', async ({ page }) => {
  await signIn(page, '/checkout')
  await markDocument(page)
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  const hasForm = await referral.isVisible()
  if (hasForm) await referral.fill('KURIO-2026')

  const attempts: Array<{ status: number; key: string | undefined; referral: string | undefined }> = []
  page.on('response', async (response) => {
    const request = response.request()
    if (request.method() !== 'POST' || !request.url().endsWith('/api/orders')) return
    const body = request.postDataJSON() as { collector: { referralCode: string } }
    attempts.push({ status: response.status(), key: request.headers()['idempotency-key'], referral: body.collector.referralCode })
  })

  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  const review = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(review.getByRole('button', { name: 'Enviar pedido' })).toBeEnabled()
  await expireSession(page)
  await review.getByRole('button', { name: 'Enviar pedido' }).click()

  await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout&expired=true/)
  expect(await isSameDocument(page)).toBe(true)

  await loginAgain(page)
  await expect(page).toHaveURL(/\/checkout$/)
  // A revisão volta aberta, com o carrinho intacto (itens e total vêm da cotação revalidada).
  const resumed = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(resumed).toBeVisible()
  await expect(resumed.getByRole('button', { name: 'Enviar pedido' })).toBeEnabled()
  await resumed.getByRole('button', { name: 'Enviar pedido' }).click()
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()

  expect(attempts.map((attempt) => attempt.status)).toEqual([401, 201])
  expect(attempts[1].key).toBe(attempts[0].key)
  expect(attempts[1].referral).toBe(hasForm ? 'KURIO-2026' : attempts[0].referral)
})
