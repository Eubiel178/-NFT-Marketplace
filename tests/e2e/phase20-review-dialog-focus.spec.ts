import { expect, test, type Page } from './test'

async function openReview(page: Page) {
  await page.goto('/login?redirect=%2Fcheckout&expired=false')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await page.getByText(/conectada$/).first().waitFor()
  const referral = page.getByLabel('Código de indicação')
  if (await referral.isVisible()) await referral.fill('KURIO-2026')
  const trigger = page.getByRole('button', { name: 'Confirmar compra' })
  await trigger.focus()
  await trigger.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Revise sua compra' })
  await expect(dialog.getByRole('button', { name: 'Enviar pedido' })).toBeEnabled()
  return { trigger, dialog }
}

const focusInside = (page: Page) => page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))

test('diálogo de revisão: o foco entra, fica preso, Esc fecha e o foco volta ao botão de origem', async ({ page }) => {
  const { trigger, dialog } = await openReview(page)

  // Foco entra no diálogo ao abrir.
  expect(await focusInside(page)).toBe(true)

  // Fica preso: Tab e Shift+Tab em volta completa nunca saem do diálogo.
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press('Tab')
    expect(await focusInside(page)).toBe(true)
  }
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press('Shift+Tab')
    expect(await focusInside(page)).toBe(true)
  }

  // O resto da página fica inerte para a árvore de acessibilidade.
  await expect(page.getByRole('heading', { name: /Pagamento|Perfil do colecionador/ })).toHaveCount(0)

  // Esc fecha e devolve o foco ao botão que abriu.
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('diálogo de revisão: o botão Fechar também devolve o foco ao botão de origem', async ({ page }) => {
  const { trigger, dialog } = await openReview(page)
  await dialog.getByRole('button', { name: /Fechar/ }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()

  // Reabrir pelo teclado repete o ciclo.
  await trigger.press('Enter')
  await expect(dialog).toBeVisible()
  expect(await focusInside(page)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
