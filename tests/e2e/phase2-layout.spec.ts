import { expect, test } from './test'

test('main único com skip link e conteúdo em container de 1200px a 1440', async ({ page }) => {
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()

  const main = page.locator('main')
  await expect(main).toHaveCount(1)
  await expect(main).toHaveAttribute('id', 'main')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(main).toBeFocused()

  const content = await main.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    const left = rect.x + Number.parseFloat(style.paddingLeft)
    return { left, width: rect.width - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight) }
  })
  const viewport = page.viewportSize()?.width ?? 0
  if (viewport === 1440) expect(content).toEqual({ left: 120, width: 1200 })
  else expect(content.width).toBeLessThan(1200)
})

test('header mostra sessão e carrinho e encerra a sessão', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 0) < 1024) return

  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: 'Entrar' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Carrinho, 0 itens' })).toBeVisible()

  await header.getByRole('link', { name: 'Entrar' }).click()
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(header.getByRole('link', { name: 'Perfil de Ana Demo' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Carrinho, 17 itens' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Entrar' })).toHaveCount(0)

  await header.getByRole('button', { name: 'Sair' }).click()
  await expect(header.getByRole('link', { name: 'Entrar' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Perfil de Ana Demo' })).toHaveCount(0)
})

test('tab bar segue o staticData das rotas', async ({ page }) => {
  if ((page.viewportSize()?.width ?? 0) >= 1024) return

  const tabBar = page.getByRole('navigation', { name: 'Navegação principal' })
  await expect(tabBar).toBeVisible()
  for (const path of ['/nfts/nft-1', '/cart', '/login']) {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()
    await expect(tabBar).toHaveCount(0)
  }
  await page.goto('/')
  await expect(tabBar).toBeVisible()
})
