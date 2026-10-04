import type { Locator } from '@playwright/test'

import { expect, test, type Page } from './test'

async function signIn(page: Page, redirect: string, email = 'ana@example.test', password = 'kurio-demo') {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill(email)
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

async function setScenario(page: Page, scenario: string) {
  await page.evaluate(async (value) => {
    await fetch('/api/__mock/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: value }),
    })
  }, scenario)
}

// O erro precisa estar ligado ao campo por aria-describedby e visível.
async function expectFieldError(page: Page, field: Locator, message: string) {
  await expect(field).toHaveAttribute('aria-invalid', 'true')
  const id = await field.getAttribute('aria-describedby')
  expect(id).toBeTruthy()
  await expect(page.locator(`[id="${id}"]`)).toHaveText(message)
}

// Navega sem recarregar a página, para o cache do TanStack Query continuar valendo.
async function navigateInApp(page: Page, path: string) {
  await page.evaluate((to) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, path)
}

test.describe('perfil', () => {
  test('rota privada: sem sessão vai ao login e volta ao perfil depois de entrar', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fprofile/)
    await page.getByLabel('Email').fill('ana@example.test')
    await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  })

  test('erros de validação ficam associados aos campos', async ({ page }) => {
    await signIn(page, '/profile')
    const form = page.getByRole('form', { name: 'Perfil do colecionador' })
    await form.getByLabel('Nome de exibição').fill('')
    await form.getByLabel('E-mail').fill('invalido')
    await form.getByLabel('Nome ENS').fill('')
    await form.getByLabel('Nova senha', { exact: true }).fill('curta')
    await form.getByRole('button', { name: 'Salvar' }).click()

    await expectFieldError(page, form.getByLabel('Nome de exibição'), 'Informe o nome de exibição')
    await expectFieldError(page, form.getByLabel('E-mail'), 'Informe um e-mail válido')
    await expectFieldError(page, form.getByLabel('Nome ENS'), 'Informe o nome ENS')
    await expectFieldError(page, form.getByLabel('Senha atual'), 'Informe a senha atual')
    await expectFieldError(page, form.getByLabel('Nova senha', { exact: true }), 'Use pelo menos 8 caracteres')
    await expectFieldError(page, form.getByLabel('Confirmar nova senha'), 'Confirme a nova senha')
  })

  test('erros devolvidos pela API (MSW) aparecem no campo de origem', async ({ page }) => {
    await signIn(page, '/profile')
    const form = page.getByRole('form', { name: 'Perfil do colecionador' })

    await form.getByLabel('Nome de usuário').fill('bruno-kurio')
    await form.getByRole('button', { name: 'Salvar' }).click()
    await expectFieldError(page, form.getByLabel('Nome de usuário'), 'Este nome de usuário já está em uso')

    await form.getByLabel('Nome de usuário').fill('ana-nova')
    await form.getByLabel('E-mail').fill('bruno@example.test')
    await form.getByRole('button', { name: 'Salvar' }).click()
    await expectFieldError(page, form.getByLabel('E-mail'), 'Este e-mail já está em uso')

    await form.getByLabel('E-mail').fill('ana@example.test')
    await form.getByLabel('Senha atual').fill('senha-errada')
    await form.getByLabel('Nova senha', { exact: true }).fill('nova-senha-1')
    await form.getByLabel('Confirmar nova senha').fill('nova-senha-1')
    await form.getByRole('button', { name: 'Salvar' }).click()
    await expectFieldError(page, form.getByLabel('Senha atual'), 'A senha atual está incorreta')
  })

  test('alterações confirmadas persistem após refresh e a senha nunca fica no navegador', async ({ page }) => {
    await signIn(page, '/profile')
    const form = page.getByRole('form', { name: 'Perfil do colecionador' })
    await form.getByLabel('Nome de exibição').fill('Ana Colecionadora')
    await form.getByLabel('Nome ENS').fill('ana.nova')
    await form.getByLabel('Apelido da carteira').fill('Minha carteira')
    await form.getByLabel('Senha atual').fill('kurio-demo')
    await form.getByLabel('Nova senha', { exact: true }).fill('kurio-demo-9')
    await form.getByLabel('Confirmar nova senha').fill('kurio-demo-9')
    await form.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Alterações salvas' })).toBeVisible()
    // Depois de salvar, os campos de senha são limpos.
    await expect(form.getByLabel('Senha atual')).toHaveValue('')

    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))
    expect(stored).not.toContain('kurio-demo-9')
    expect(stored).not.toContain('"kurio-demo"')

    await page.reload()
    const reloaded = page.getByRole('form', { name: 'Perfil do colecionador' })
    await expect(reloaded.getByLabel('Nome de exibição')).toHaveValue('Ana Colecionadora')
    await expect(reloaded.getByLabel('Nome ENS')).toHaveValue('ana.nova')
    await expect(reloaded.getByLabel('Apelido da carteira')).toHaveValue('Minha carteira')

    // A nova senha vale no próximo login.
    await page.getByRole('complementary', { name: 'Navegação da conta' }).getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/$/)
    await signIn(page, '/profile', 'ana@example.test', 'kurio-demo-9')
  })

  test('avatar: carregando, erro da API e sucesso', async ({ page }) => {
    await signIn(page, '/profile')
    const input = page.locator('input[aria-label="Selecionar avatar"]')
    const change = page.getByRole('button', { name: 'Alterar', exact: true })

    await input.setInputFiles({ name: 'nota.txt', mimeType: 'text/plain', buffer: Buffer.from('não é imagem') })
    const error = page.getByRole('alert').filter({ hasText: 'Use um arquivo de imagem' })
    await expect(error).toBeVisible()
    const describedBy = await change.getAttribute('aria-describedby')
    await expect(page.locator(`[id="${describedBy}"]`)).toContainText('Use um arquivo de imagem')

    await input.setInputFiles({ name: 'grande.png', mimeType: 'image/png', buffer: Buffer.alloc(600 * 1024) })
    await expect(page.getByRole('alert').filter({ hasText: 'até 512 KB' })).toBeVisible()

    await input.setInputFiles({
      name: 'avatar.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#D28A4C"/></svg>'),
    })
    await expect(change).toHaveAttribute('aria-busy', 'true')
    await expect(page.getByRole('img', { name: 'Avatar do perfil' })).toBeVisible()
    await expect(page.getByRole('alert').filter({ hasText: 'até 512 KB' })).toHaveCount(0)

    await page.reload()
    await expect(page.getByRole('img', { name: 'Avatar do perfil' })).toBeVisible()
    await page.getByRole('button', { name: 'Remover' }).click()
    await expect(page.getByRole('img', { name: 'Avatar do perfil' })).toHaveCount(0)
  })

  test('skeleton mantém as dimensões e respeita movimento reduzido', async ({ page }) => {
    await signIn(page, '/profile')
    const form = page.getByRole('form', { name: 'Perfil do colecionador' })
    const loadedHeight = (await form.boundingBox())?.height ?? 0

    await setScenario(page, 'slow')
    await page.reload()
    const skeleton = page.getByRole('status', { name: 'Carregando perfil' })
    await expect(skeleton).toBeVisible()
    // Medido de uma vez só: o cenário slow dura 2 s e o skeleton some quando o perfil chega.
    const measured = await skeleton.evaluate((element) => {
      const shimmer = element.querySelector('.skeleton')
      return { height: element.getBoundingClientRect().height, animation: shimmer ? getComputedStyle(shimmer).animationName : '' }
    })
    expect(Math.abs(measured.height - loadedHeight)).toBeLessThanOrEqual(24)
    // A configuração do Playwright usa reducedMotion: 'reduce'.
    expect(measured.animation).toBe('none')
    await setScenario(page, 'default')
  })
})

test.describe('carteiras', () => {
  test('erros de validação e da API ficam nos campos do formulário', async ({ page }) => {
    await signIn(page, '/wallets')
    await page.getByRole('region', { name: 'Carteira secundária' }).getByRole('button', { name: 'Adicionar' }).click()
    const form = page.getByRole('form', { name: 'Carteira secundária' })
    await form.getByRole('button', { name: 'Salvar carteira' }).click()

    await expectFieldError(page, form.getByLabel('Nome de exibição'), 'Informe o nome de exibição')
    await expectFieldError(page, form.getByLabel('Endereço da carteira'), 'Informe um endereço 0x válido')
    await expectFieldError(page, form.getByLabel('Código de indicação'), 'Informe o código de indicação')
    await expectFieldError(page, form.getByLabel('E-mail'), 'Informe um e-mail válido')
    await expectFieldError(page, form.getByLabel('Nome ENS'), 'Informe o nome ENS')
    await expect(form.getByRole('combobox', { name: 'Rede' })).toHaveAttribute('aria-invalid', 'true')

    await form.getByLabel('Nome de exibição').fill('Nova reserva')
    await form.getByLabel('Apelido da carteira').fill('Reserva 2')
    await form.getByRole('combobox', { name: 'Rede' }).press('Enter')
    await page.getByRole('option', { name: 'Polygon' }).press('Enter')
    await form.getByLabel('Nome do perfil').fill('Ana')
    await form.getByLabel('Endereço da carteira').fill('0xA91F...E82C')
    await form.getByRole('combobox', { name: 'Tipo de carteira' }).press('Enter')
    await page.getByRole('option', { name: 'Cold wallet' }).press('Enter')
    await form.getByLabel('Código de indicação').fill('NAO-EXISTE')
    await form.getByLabel('E-mail').fill('ana@example.test')
    await form.getByLabel('Nome ENS').fill('reserva2')
    await form.getByRole('button', { name: 'Salvar carteira' }).click()
    // Esta regra só a API conhece (código de indicação inexistente).
    await expectFieldError(page, form.getByLabel('Código de indicação'), 'Código de indicação não encontrado')

    await form.getByLabel('Código de indicação').fill('KURIO-2026')
    await form.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(page.getByRole('list', { name: 'Carteiras secundárias' }).getByText('Nova reserva')).toBeVisible()
    await page.reload()
    await expect(page.getByRole('list', { name: 'Carteiras secundárias' }).getByText('Nova reserva')).toBeVisible()
  })

  test('trocar a principal atualiza as duas carteiras e mantém uma só principal', async ({ page }) => {
    await signIn(page, '/wallets')
    const primary = page.getByRole('form', { name: 'Carteira principal' })
    await expect(primary.getByLabel('Nome de exibição')).toHaveValue('Principal')

    const saved = page.waitForResponse((response) => response.url().endsWith('/api/wallets/wallet-2/primary') && response.status() === 200)
    await page.getByRole('button', { name: 'Tornar Reserva a carteira principal' }).click()
    // Atualização otimista: a tela muda antes da resposta (o MSW demora 300 ms).
    await expect(primary.getByLabel('Nome de exibição')).toHaveValue('Reserva')
    const secondary = page.getByRole('list', { name: 'Carteiras secundárias' })
    await expect(secondary.getByRole('listitem').filter({ hasText: 'Principal' })).toBeVisible()
    await expect(secondary.getByRole('listitem').filter({ hasText: 'Reserva' })).toHaveCount(0)

    await saved
    await page.reload()
    await expect(page.getByRole('form', { name: 'Carteira principal' }).getByLabel('Nome de exibição')).toHaveValue('Reserva')
    const primaries = await page.evaluate(async () => {
      const response = await fetch('/api/wallets')
      const body = (await response.json()) as { items: Array<{ id: string; primary: boolean }> }
      return body.items.filter((wallet) => wallet.primary).map((wallet) => wallet.id)
    })
    expect(primaries).toEqual(['wallet-2'])
  })

  test('troca otimista volta ao estado anterior quando a API recusa', async ({ page }) => {
    await signIn(page, '/wallets')
    const primary = page.getByRole('form', { name: 'Carteira principal' })
    await expect(primary.getByLabel('Nome de exibição')).toHaveValue('Principal')

    await setScenario(page, 'wallets-error')
    await page.getByRole('button', { name: 'Tornar Reserva a carteira principal' }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'Não foi possível trocar a carteira principal' })).toBeVisible()
    await expect(primary.getByLabel('Nome de exibição')).toHaveValue('Principal')
    await expect(page.getByRole('list', { name: 'Carteiras secundárias' }).getByRole('listitem').filter({ hasText: 'Reserva' })).toBeVisible()
    await setScenario(page, 'default')
  })

  test('o pagamento reflete a carteira editada sem recarregar a página', async ({ page }) => {
    await signIn(page, '/checkout')
    await page.getByText(/conectada$/).first().waitFor()
    await navigateInApp(page, '/wallets')

    await page.getByRole('button', { name: 'Editar Reserva' }).click()
    const form = page.getByRole('form', { name: 'Carteira secundária' })
    await form.getByLabel('Nome de exibição').fill('Reserva Atualizada')
    await form.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(page.getByRole('list', { name: 'Carteiras secundárias' }).getByText('Reserva Atualizada')).toBeVisible()

    await navigateInApp(page, '/checkout')
    await expect(page.getByText('Reserva Atualizada').locator('visible=true').first()).toBeVisible()
  })
})
