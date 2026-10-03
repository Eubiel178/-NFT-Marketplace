import { test } from './test'

test('Home nos viewports oficiais @visual', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { name: 'Marketplace de NFTs' }).waitFor()
  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `reports/screenshots/home-${page.viewportSize()?.width}.png`,
  })
})
