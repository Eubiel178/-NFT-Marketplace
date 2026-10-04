import { expect, test } from './test'

async function signIn(page: import('@playwright/test').Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('painel de filtros mantém nome acessível, foco e fechamento por teclado', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 0) >= 1024) return

  await page.goto('/')
  const trigger = page.locator('button[aria-label="Abrir filtros"]:visible')
  await trigger.focus()
  await trigger.click()

  const sheet = page.getByRole('dialog', { name: 'Filtros' })
  await expect(sheet).toBeVisible()
  await expect(sheet).toHaveAttribute('aria-labelledby', 'sheet-title')
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('zoom da galeria prende o foco e o devolve ao botão ao fechar', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 0) < 640) return

  await page.goto('/nfts/nft-1')
  const zoom = page.getByRole('button', { name: 'Ampliar imagem' })
  await zoom.click()
  const dialog = page.getByRole('dialog', { name: 'Emerald Ape #042' })
  await expect(dialog).toBeVisible()
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(zoom).toBeFocused()

  await zoom.click()
  await dialog.getByRole('button', { name: 'Fechar' }).click()
  await expect(dialog).toBeHidden()
  await expect(zoom).toBeFocused()
})

test('select customizado funciona com teclado e expõe a opção ativa', async ({ page }) => {
  await signIn(page, '/wallets')

  const network = page.getByRole('combobox', { name: 'Rede' }).first()
  await network.press('Enter')
  // Radix Select: com a lista aberta o foco fica na opção ativa e o combobox
  // fica aria-hidden; ao escolher, o foco volta para o combobox.
  const listbox = page.getByRole('listbox')
  await expect(listbox).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await expect(listbox.getByRole('option', { name: 'Polygon' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(listbox).toBeHidden()
  await expect(network).toHaveText('Polygon')
  await expect(network).toHaveAttribute('aria-expanded', 'false')
  await expect(network).toBeFocused()
})

test('skeletons não animam quando movimento reduzido é solicitado', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'slow'))
  await page.goto('/')
  const skeleton = page.locator('.skeleton').first()
  await expect(skeleton).toBeVisible()
  await expect.poll(() => skeleton.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
})
