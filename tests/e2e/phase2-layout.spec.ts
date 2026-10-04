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
