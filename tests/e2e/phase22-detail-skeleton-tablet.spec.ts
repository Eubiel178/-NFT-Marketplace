import { expect, test, type Page } from './test'

test.use({ viewport: { width: 768, height: 1024 } })

type Box = [x: number, y: number, width: number, height: number]

function boxesOf(locator: ReturnType<Page['locator']>) {
  return locator.evaluateAll((elements) =>
    elements.map((element): [number, number, number, number] => {
      const rect = element.getBoundingClientRect()
      return [Math.round(rect.x), Math.round(rect.y + window.scrollY), Math.round(rect.width), Math.round(rect.height)]
    }),
  )
}

async function slowDetail(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('nft-marketplace:scenario', 'slow')
    const win = window as unknown as { __shift: number }
    win.__shift = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) if (!entry.hadRecentInput) win.__shift += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
}

const horizontalOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test('detalhe em 768px: skeleton com shimmer, sem overflow, com as caixas do conteúdo e sem salto de layout', async ({ page }) => {
  await slowDetail(page)
  // Com movimento permitido o shimmer anima (o padrão do projeto é movimento reduzido).
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/nfts/nft-1')

  const skeleton = page.getByRole('status', { name: 'Carregando NFT' })
  await expect(skeleton).toBeVisible()
  const blocks = skeleton.locator('.skeleton')
  await expect.poll(() => blocks.first().evaluate((element) => getComputedStyle(element).animationName)).toBe('shimmer')
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
  const placeholder = (await boxesOf(blocks)) as Box[]

  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(skeleton).toHaveCount(0)
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)

  // Acima da dobra o conteúdo cai onde o skeleton estava: 1ª miniatura (bloco 1) e título (bloco 6), até 3px.
  const thumbnails = (await boxesOf(page.getByRole('region', { name: 'Galeria do NFT' }).locator('img'))) as Box[]
  const title = (await boxesOf(page.getByRole('heading', { name: 'Emerald Ape #042' }))) as Box[]
  expect(Math.abs(placeholder[1][1] - thumbnails[0][1])).toBeLessThanOrEqual(3)
  expect(Math.abs(placeholder[6][1] - title[0][1])).toBeLessThanOrEqual(3)

  // Nenhum deslocamento de layout na troca do skeleton pelo conteúdo.
  expect(await page.evaluate(() => (window as unknown as { __shift: number }).__shift)).toBeLessThan(0.01)
})

test('detalhe em 768px: com movimento reduzido o skeleton não anima', async ({ page }) => {
  await slowDetail(page)
  await page.goto('/nfts/nft-1')
  const skeleton = page.getByRole('status', { name: 'Carregando NFT' })
  await expect(skeleton).toBeVisible()
  await expect.poll(() => skeleton.locator('.skeleton').first().evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
})
