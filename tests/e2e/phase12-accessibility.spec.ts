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

test('select customizado funciona com teclado e expõe a opção ativa', async ({ page }) => {
  await signIn(page, '/wallets')

  const network = page.getByRole('combobox', { name: 'Rede' }).first()
  await network.press('Enter')
  await expect(network).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(network).toHaveAttribute('aria-activedescendant', /option-1$/)
  await page.keyboard.press('Enter')
  await expect(network).toHaveText('Polygon')
  await expect(network).toHaveAttribute('aria-expanded', 'false')
})

test('skeletons não animam quando movimento reduzido é solicitado', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'slow'))
  await page.goto('/')
  const skeleton = page.locator('.skeleton').first()
  await expect(skeleton).toBeVisible()
  await expect.poll(() => skeleton.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
})
