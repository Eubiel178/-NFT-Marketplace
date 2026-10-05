import { expect, test, type Page } from './test'

const start = new Date('2026-10-04T12:00:00Z')

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

// Com o relógio pausado nada rodaria sozinho (nem o agendamento de renders do TanStack
// Query, que usa setTimeout): o teste avança o tempo em passos curtos até a tela reagir.
async function advanceUntil(page: Page, step: number, done: () => Promise<boolean>) {
  let elapsed = 0
  while (!(await done())) {
    if (elapsed > 5_000) throw new Error('A tela não reagiu depois de 5 s de relógio simulado')
    await page.clock.runFor(step)
    elapsed += step
    await page.waitForTimeout(30)
  }
  return elapsed
}

// Os timers do mock (confirmação automática em 400 ms) rodam na página: com o relógio
// pausado, o pedido só confirma quando o teste avança o tempo.
test('timeout após criar o pedido: o mesmo pedido fica pendente até o relógio avançar e confirma pelo socket', async ({ page }) => {
  await page.clock.install({ time: start })
  await signIn(page, '/checkout')
  await setScenario(page, 'payment-timeout')
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  if (await referral.isVisible()) await referral.fill('KURIO-2026')

  const orderPosts: number[] = []
  const orderReads: string[] = []
  page.on('response', (response) => {
    const request = response.request()
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) orderPosts.push(response.status())
    if (request.method() === 'GET' && request.url().includes('/api/orders/by-key/')) orderReads.push(request.url())
  })

  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  const review = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(review.getByRole('button', { name: 'Enviar pedido' })).toBeEnabled()

  // Daqui em diante o tempo só passa quando o teste manda.
  await page.clock.pauseAt(new Date(start.getTime() + 60_000))
  await review.getByRole('button', { name: 'Enviar pedido' }).click()

  const pending = page.getByRole('heading', { name: 'Confirmando sua compra' })
  const elapsed = await advanceUntil(page, 20, () => pending.isVisible())
  // O pedido apareceu pendente antes de a confirmação automática (400 ms do mock) vencer.
  expect(elapsed).toBeLessThan(400)
  await expect(page).toHaveURL(/\/orders\/order-/)
  expect(orderPosts).toEqual([504])
  expect(orderReads).toHaveLength(1)

  // Tempo parado: o pedido continua pendente, não há confirmação por polling.
  await page.waitForTimeout(700)
  await expect(pending).toBeVisible()

  const confirmed = page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })
  await advanceUntil(page, 100, () => confirmed.isVisible())
  expect(orderPosts).toEqual([504])
  // A data do recibo vem do relógio controlado.
  await expect(page.getByText('04 Oct, 2026').first()).toBeVisible()
})

test('sessão expirada é tratada na próxima ação, sem depender de timers, com o relógio parado', async ({ page }) => {
  await page.clock.install({ time: start })
  await signIn(page, '/profile')
  const form = page.getByRole('form', { name: 'Perfil do colecionador' })
  await expect(form).toBeVisible()
  await page.clock.pauseAt(new Date(start.getTime() + 3_600_000))
  await page.evaluate(async () => {
    await fetch('/api/__mock/session/expire', { method: 'POST' })
  })

  await form.getByLabel('Nome de exibição').fill('Ana Relógio')
  await form.getByRole('button', { name: 'Salvar' }).click()
  await expect(page).toHaveURL(/\/login\?redirect=%2Fprofile&expired=true/)
  await expect(page.getByRole('alert')).toContainText('Sua sessão expirou')

  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/profile$/)
})
