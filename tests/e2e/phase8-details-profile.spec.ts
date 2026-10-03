import { expect, test, type Page } from './test'

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect.replace('/', '\\/')}$`))
}

test('detalhe direto permite galeria, limite de quantidade e carrinho', async ({ page }) => {
  await page.goto('/nfts/nft-1')
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(page.getByText('Mais desta coleção')).toBeVisible()
  await page.screenshot({ path: `reports/screenshots/phase8-detail-${test.info().project.name}.png`, fullPage: true })

  const thumbnails = page.getByRole('button', { name: 'Selecionar imagem 2' })
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    await thumbnails.click()
    await expect(thumbnails).toHaveClass(/is-selected/)
  }

  const increase = page.locator('button[aria-label="Aumentar quantidade"]:visible')
  await increase.click()
  await increase.click()
  await increase.click()
  await expect(increase).toBeDisabled()
  const visibleQuantity = (page.viewportSize()?.width ?? 0) < 640 ? page.locator('.nft-detail-buybar-quantity strong:visible') : page.locator('.nft-detail-stepper:visible span')
  await expect(visibleQuantity).toHaveText('4')

  if ((page.viewportSize()?.width ?? 0) >= 640) await page.getByRole('button', { name: 'COMPRAR' }).click()
  else await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('heading', { name: 'Carrinho de NFTs' })).toBeVisible()
  await expect(page.getByText('Emerald Ape #042')).toBeVisible()
})

test('favorito exige autenticação e persiste após o login', async ({ page }) => {
  await page.goto('/nfts/nft-1')
  const initialFavorite = (page.viewportSize()?.width ?? 0) < 640 ? page.getByRole('button', { name: 'Adicionar aos favoritos' }).first() : page.getByRole('button', { name: 'Favoritar', exact: true })
  await initialFavorite.click()
  await expect(page).toHaveURL(/\/login\?redirect=/)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/nfts\/nft-1$/)
  const authenticatedFavorite = (page.viewportSize()?.width ?? 0) < 640 ? page.getByRole('button', { name: 'Adicionar aos favoritos' }).first() : page.getByRole('button', { name: 'Favoritar', exact: true })
  await authenticatedFavorite.click()
  const activeFavorite = (page.viewportSize()?.width ?? 0) < 640 ? page.getByRole('button', { name: 'Remover dos favoritos' }).first() : page.getByRole('button', { name: 'Favoritado', exact: true })
  await expect(activeFavorite).toBeVisible()
  await page.reload()
  await expect(activeFavorite).toBeVisible()
})

test('perfil atualiza dados e avatar com persistência', async ({ page }) => {
  await signIn(page, '/profile')
  await page.screenshot({ path: `reports/screenshots/phase8-profile-${test.info().project.name}.png`, fullPage: true })
  await page.getByLabel('Nome de exibição').fill('Ana Colecionadora')
  await page.getByLabel('Senha atual').fill('kurio-demo')
  await page.getByRole('textbox', { name: 'Nova senha', exact: true }).fill('kurio-demo-8')
  await page.getByLabel('Confirmar nova senha').fill('kurio-demo-8')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Alterações salvas' })).toBeVisible()

  await page.locator('input[aria-label="Selecionar avatar"]').setInputFiles({
    name: 'avatar.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#D28A4C"/></svg>'),
  })
  await expect(page.locator('.avatar-image')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Nome de exibição')).toHaveValue('Ana Colecionadora')
  await expect(page.locator('.avatar-image')).toBeVisible()
})
