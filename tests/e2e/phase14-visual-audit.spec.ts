import { expect, placeOrder, test, type Page } from './test'

const screenshotRoot = 'C:/Users/dev12/AppData/Local/Temp/opencode'

async function screenshot(page: Page, name: string) {
  const width = page.viewportSize()?.width ?? 0
  await page.screenshot({ animations: 'disabled', fullPage: true, path: `${screenshotRoot}/phase14-${width}-${name}.png` })
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const offenders = Array.from(document.querySelectorAll<HTMLElement>('*'))
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return { className: element.className, left: rect.left, right: rect.right, tagName: element.tagName }
      })
      .filter(({ left, right }) => left < 0 || right > window.innerWidth)
    return {
      clientWidth: document.documentElement.clientWidth,
      offenders: offenders.slice(-5),
      scrollWidth: document.documentElement.scrollWidth,
    }
  })
  expect(dimensions.scrollWidth, JSON.stringify(dimensions.offenders)).toBeLessThanOrEqual(dimensions.clientWidth)
}

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

test('captura as telas de referência da Fase 14', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Marketplace de NFTs' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'home')

  await page.goto('/nfts/nft-1')
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'detail')

  await page.goto('/login?redirect=%2Fcart&expired=false')
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'login')

  await page.goto('/register?redirect=%2Fcart&expired=false')
  await expect(page.getByRole('heading', { name: /Criar perfil|Criar conta/ })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'register')

  await signIn(page, '/cart')
  await expect(page.getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'cart')

  await page.getByRole('button', { name: /Conectar e finalizar/ }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(page.getByRole('heading', { name: 'Pagamento com carteira' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'checkout')

  await placeOrder(page)
  await expect(page).toHaveURL(/\/orders\/order-/)
  await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'confirmation')

  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'profile')

  await page.goto('/wallets')
  await expect(page.getByRole('heading', { name: 'Carteiras', exact: true })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await screenshot(page, 'wallets')
})
